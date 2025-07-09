import { Chessboard } from "react-chessboard";
import { customPieces } from "../lib/pieceMap";

type Props = {
  fen: string;
  orientation: "white" | "black";
  onDrop: (src: string, dst: string) => void;
  onPromote: (src: string, dst: string, piece: string) => void;
};

export default function ChessBoard({ fen, orientation, onDrop, onPromote }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <Chessboard
        position={fen}
        boardOrientation={orientation}
        onPieceDrop={(s, t) => {
          onDrop(s, t);
          return true;
        }}
        onPromotionPieceSelect={(piece, from, to) => {
          if (!piece || !from || !to) return false;
          onPromote(from, to, piece[1].toLowerCase()); // like "wQ" → "q"
          return true; // tells chessboard the move succeeded
        }}
        customPieces={customPieces}
        boardWidth={600}
        customDarkSquareStyle={{ backgroundColor: "#e3f8ff" }}
        customLightSquareStyle={{ backgroundColor: "#fa6666" }}
      />
    </div>
  );
}
