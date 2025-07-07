import asyncio, secrets, string
from typing import Dict, Optional

import chess
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

ALPHABET = string.ascii_uppercase + string.digits
PIN_LEN = 6
def new_pin() -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(PIN_LEN))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

class Game:
    def __init__(self):
        self.board = chess.Board()
        self.white: Optional[WebSocket] = None
        self.black: Optional[WebSocket] = None
        self.lock = asyncio.Lock()

    async def broadcast(self, msg: dict):
        for ws in (self.white, self.black):
            if ws:
                await ws.send_json(msg)

games: Dict[str, Game] = {}

# --- REST ­------------------------------------------------------------
@app.post("/create")
async def create():
    pin = new_pin()
    games[pin] = Game()
    return {"pin": pin}

# --- WebSocket ­-------------------------------------------------------
@app.websocket("/ws/{pin}")
async def socket(ws: WebSocket, pin: str):
    await ws.accept()
    game = games.get(pin)
    if not game:
        await ws.close(code=4000); return

    side = "white" if game.white is None else "black" if game.black is None else None
    if not side:
        await ws.close(code=4001); return
    setattr(game, side, ws)
    await game.broadcast({"type": "join", "side": side})

    try:
        while True:
            data = await ws.receive_json()          # {"uci":"e2e4"}
            move = chess.Move.from_uci(data["uci"])

            async with game.lock:
                if move in game.board.legal_moves:
                    game.board.push(move)

                    # ---------- outcome detection ----------
                    winner: str | None = None
                    if game.board.is_game_over():
                        outcome = game.board.outcome()
                        if outcome and outcome.winner is not None:
                            winner = "white" if outcome.winner else "black"
                        else:
                            winner = "draw"
                    # ---------------------------------------

                    await game.broadcast(
                        {
                            "type": "move",
                            "uci": data["uci"],
                            "fen": game.board.fen(),
                            "gameOver": game.board.is_game_over(),
                            "winner": winner,
                        }
                    )
                else:
                    await ws.send_json({"type": "illegal"})
    except WebSocketDisconnect:
        setattr(game, side, None)
        await game.broadcast({"type": "left", "side": side})
        if not game.white and not game.black:
            games.pop(pin, None)
