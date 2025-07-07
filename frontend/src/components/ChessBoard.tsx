import { Chessboard } from "react-chessboard";
import { customPieces } from "../lib/pieceMap";

type Props = {
  fen: string;
  orientation: "white" | "black";
  onDrop: (src: string, dst: string) => void;
};

export default function ChessBoard({ fen, orientation, onDrop }: Props) {
  return (
    <Chessboard
      position={fen}
      boardOrientation={orientation}
      onPieceDrop={(s, t) => {
        onDrop(s, t);
        return true;
      }}
      customPieces={customPieces}
      boardWidth={450}
    />
  );
}
