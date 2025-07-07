import { useRef, useState } from "react";
import ChessBoard from "./components/ChessBoard";
import { connectWS } from "./lib/socket";

type MsgMove = {
  type: "move";
  uci: string;
  fen: string;
  gameOver: boolean;
  winner: "white" | "black" | "draw" | null;
};

export default function App() {
  const [pin, setPin] = useState("");
  const [input, setInput] = useState("");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [fen, setFen] = useState("start");
  const [banner, setBanner] = useState<string | null>(null);
  const ws = useRef<WebSocket>();

  /* --- piece drop --- */
  const onPieceDrop = (src: string, dst: string) => {
    if (!banner) ws.current?.send(JSON.stringify({ uci: src + dst }));
  };

  /* --- connect socket --- */
  const openWS = (p: string) => {
    ws.current = connectWS(p);
    ws.current.onmessage = (ev) => {
      const m = JSON.parse(ev.data) as MsgMove;
      if (m.type === "move") {
        setFen(m.fen);
        if (m.gameOver)
          setBanner(
            m.winner === "draw"
              ? "Draw!"
              : `${m.winner === "white" ? "White" : "Black"} wins!`
          );
      }
    };
    ws.current.onclose = () => {
      setPin(""); setFen("start"); setBanner(null);
    };
  };

  /* --- lobby actions --- */
  const createGame = async () => {
    const res = await fetch("/create", { method: "POST" });
    const { pin } = await res.json();
    setPin(pin); openWS(pin);
  };
  const joinGame = () => { setPin(input.toUpperCase()); openWS(input.toUpperCase()); };

  /* --- UI --- */
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      {!pin ? (
        <>
          <button onClick={createGame} style={{ marginRight: 10 }}>
            Create Game
          </button>
          <input
            placeholder="Enter PIN"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
          />
          <button onClick={joinGame} style={{ marginLeft: 10 }}>
            Join Game
          </button>
        </>
      ) : (
        <>
          <h2>Game PIN: {pin}</h2>

          {/* orientation toggle */}
          <button
            style={{ marginBottom: 8 }}
            onClick={() =>
              setOrientation((o) => (o === "white" ? "black" : "white"))
            }
          >
            View as {orientation === "white" ? "Black" : "White"}
          </button>

          {/* game‑over banner */}
          {banner && (
            <div
              style={{
                margin: "8px 0",
                padding: "6px 12px",
                background: "#ffd700",
                borderRadius: 8,
              }}
            >
              {banner}
            </div>
          )}

          <ChessBoard
            fen={fen}
            orientation={orientation}
            onDrop={onPieceDrop}
          />
        </>
      )}
    </div>
  );
}
