import React from "react";

export const customPieces: Record<
  string,
  React.FC<{ squareWidth: number }>
> = {
  wK: ({ squareWidth }) => (
    <img
      src="/assets/pieces/king_white.png"
      alt="White King"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  wQ: ({ squareWidth }) => (
    <img
      src="/assets/pieces/queen_white.png"
      alt="White Queen"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  wR: ({ squareWidth }) => (
    <img
      src="/assets/pieces/rook_white.png"
      alt="White Rook"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  wB: ({ squareWidth }) => (
    <img
      src="/assets/pieces/bishop_white.png"
      alt="White Bishop"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  wN: ({ squareWidth }) => (
    <img
      src="/assets/pieces/knight_white.png"
      alt="White Knight"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  wP: ({ squareWidth }) => (
    <img
      src="/assets/pieces/pawn_white.png"
      alt="White Pawn"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  bK: ({ squareWidth }) => (
    <img
      src="/assets/pieces/king_black.png"
      alt="Black King"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  bQ: ({ squareWidth }) => (
    <img
      src="/assets/pieces/queen_black.png"
      alt="Black Queen"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  bR: ({ squareWidth }) => (
    <img
      src="/assets/pieces/rook_black.png"
      alt="Black Rook"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  bB: ({ squareWidth }) => (
    <img
      src="/assets/pieces/bishop_black.png"
      alt="Black Bishop"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  bN: ({ squareWidth }) => (
    <img
      src="/assets/pieces/knight_black.png"
      alt="Black Knight"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
  bP: ({ squareWidth }) => (
    <img
      src="/assets/pieces/pawn_black.png"
      alt="Black Pawn"
      width={squareWidth}
      height={squareWidth}
      draggable={false}
    />
  ),
};
