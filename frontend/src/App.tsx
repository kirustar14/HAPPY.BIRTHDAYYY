import { useRef, useState, useEffect } from "react";
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

  useEffect(() => {
    document.title = "Happy Bday :)";
  }, []);

  const onPieceDrop = (src: string, dst: string) => {
    if (!banner) ws.current?.send(JSON.stringify({ uci: src + dst }));
  };

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
      setPin("");
      setFen("start");
      setBanner(null);
    };
  };

  const createGame = async () => {
    const res = await fetch("https://happy-birthdayyy-backend.onrender.com/create", {method: "POST",});
    const { pin } = await res.json();
    setPin(pin);
    openWS(pin);
  };

  const joinGame = () => {
    setPin(input.toUpperCase());
    openWS(input.toUpperCase());
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1a2a, #001f3f, #000814)",
        padding: 24,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#e0e7ff",
        textShadow: "0 0 8px rgba(0, 102, 204, 0.7)",
      }}
    >
      {!pin ? (
        <div
          style={{
            padding: 40,
            background: "rgba(0, 20, 50, 0.75)",
            borderRadius: 20,
            boxShadow: "0 0 25px rgba(0, 122, 255, 0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            width: "90%",
            maxWidth: 400,
          }}
        >
          <h1
            style={{
              color: "#a3c9ff",
              fontWeight: 900,
              fontSize: "2.5rem",
              width: "100%",
              textAlign: "center",
              marginBottom: 0,
            }}
          >
            WELCOME TO BIRTHDAY CHESS!!!
          </h1>

          <button
            onClick={createGame}
            style={{
              background: "linear-gradient(90deg, #004a99, #0077ff)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 28px",
              fontSize: "1.15rem",
              fontWeight: "700",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 0 15px #0077ff",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 25px #00aaff";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 15px #0077ff";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Create Game
          </button>

          <div style={{ display: "flex", gap: 12, width: "100%" }}>
            <input
              placeholder="Enter PIN"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1.5px solid #0055aa",
                backgroundColor: "#001a33",
                color: "#cfe3ff",
                fontSize: "1rem",
                flexGrow: 1,
                outline: "none",
                boxShadow: "inset 0 0 8px #003366",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#00aaff";
                e.currentTarget.style.boxShadow = "0 0 12px #00aaff inset";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#0055aa";
                e.currentTarget.style.boxShadow = "inset 0 0 8px #003366";
              }}
            />
            <button
              onClick={joinGame}
              style={{
                background: "linear-gradient(90deg, #004a99, #0077ff)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 0 15px #0077ff",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 25px #00aaff";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 15px #0077ff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Join Game
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2
            style={{
              color: "#a3c9ff",
              marginBottom: 16,
              fontWeight: "700",
              textShadow: "0 0 12px #0077ff",
            }}
          >
            Game PIN: {pin}
          </h2>

          <button
            onClick={() =>
              setOrientation((o) => (o === "white" ? "black" : "white"))
            }
            style={{
              marginBottom: 20,
              background: "#001a33",
              color: "#00aaff",
              border: "2px solid #00aaff",
              borderRadius: 10,
              padding: "10px 20px",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 0 10px #00aaff",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#004080";
              e.currentTarget.style.boxShadow = "0 0 20px #00ccff";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#001a33";
              e.currentTarget.style.boxShadow = "0 0 10px #00aaff";
              e.currentTarget.style.color = "#00aaff";
            }}
          >
            {orientation === "white" ? "White" : "Black"}
          </button>

          {banner && (
            <div
              style={{
                marginBottom: 20,
                padding: "14px 28px",
                background: "rgba(0, 0, 0, 0.7)",
                border: "2px solid #00aaff",
                borderRadius: 14,
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "#cceeff",
                boxShadow: "0 0 20px #00aaff",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              ✨ {banner}
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
