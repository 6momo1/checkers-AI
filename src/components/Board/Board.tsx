import React, { useEffect, useRef, useState } from "react";
import "./Board.css";
import Tile from "../Tile/Tile"
import {
  GRID_SIZE
} from "../../Constants"
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];


interface Piece {
  color: number;
  x: number;
  y: number;
}


const initialBoardState: Piece[] = [];
// initialize blue pieces
for (let i = 0; i < 8; i++) {
  if (i % 2 === 1) {
    initialBoardState.push({ color: 1, x: i, y: 7 });
  }
}
for (let i = 0; i < 8; i++) {
  if (i % 2 === 0) {
    initialBoardState.push({ color: 1, x: i, y: 6 });
  }
}
for (let i = 0; i < 8; i++) {
  if (i % 2 === 1) {
    initialBoardState.push({ color: 1, x: i, y: 5 });
  }
}

// initialize red pieces
for (let i = 0; i < 8; i++) {
  if (i % 2 === 0)
  initialBoardState.push({ color: 2, x: i, y: 0 });
}
for (let i = 0; i < 8; i++) {
  if (i % 2 === 1)
  initialBoardState.push({ color: 2, x: i, y: 1 });
}
for (let i = 0; i < 8; i++) {
  if (i % 2 === 0)
  initialBoardState.push({ color: 2, x: i, y: 2 });
}


export default function Board() {
  
  const boardRef = useRef<HTMLElement>(null);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);

  function grabPiece(e: React.MouseEvent) {

    const element = e.target as HTMLElement;
    const board = boardRef.current;
    if (element.classList.contains("chess-piece") && board) {
      setGridX(Math.floor((e.clientX - board.offsetLeft) / GRID_SIZE));
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element)
    }
  }

  function movePiece(e: React.MouseEvent) {

    const board = boardRef.current;
    if (activePiece && board) {

      const minX = board.offsetLeft;
      const minY = board.offsetTop;
      const maxX = board.offsetLeft + board.clientWidth - 100;
      const maxY = board.offsetTop + board.clientHeight - 75;

      const x = e.clientX - 50;
      const y = e.clientY - 50;

      activePiece.style.position = "absolute";
      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;

      //If x is smaller than minimum amount
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      }
      //If x is bigger than maximum amount
      else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      }
      //If x is in the constraints
      else {
        activePiece.style.left = `${x}px`;
      }
      //If y is smaller than minimum amount
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      }
      //If y is bigger than maximum amount
      else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      }
      //If y is in the constraints
      else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function dropPiece(e: React.MouseEvent) {

    const chessboard = boardRef.current;
    if (activePiece && chessboard) {

      // floor the coordinates
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      console.log(x, y);
      
      setPieces( value => {
        const pieces = value.map( p => {
          if (p.x === gridX && p.y === gridY ) {
            p.x = x;
            p.y = y;
          }
          return p;
        })
        return pieces;
      })

      // const currentPiece = pieces.find((p) =>
      //   p.samePosition(grabPosition)
      // );

    //   if (currentPiece) {
    //     var succes = playMove(currentPiece.clone(), new Position(x, y));

    //     if(!succes) {
    //       //RESETS THE PIECE POSITION
    //       activePiece.style.position = "relative";
    //       activePiece.style.removeProperty("top");
    //       activePiece.style.removeProperty("left");
    //     }
    //   }
      setActivePiece(null);
    }
  }

  let board = [];
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {

      let color = 0;
      pieces.forEach((p) => {
        if (p.x === i && p.y === j) {
          color = p.color;
        }
      })
      board.push(<Tile key={`${j},${i}`} piece={color} number={j + i + 2} />);
    }
  }
  return (
    <div
      onMouseMove={e => movePiece(e)}
      onMouseDown={e => grabPiece(e)}
      onMouseUp={e => dropPiece(e)}
      id="chessboard"
      ref={boardRef as React.RefObject<HTMLDivElement>}
    >
      {board}
    </div>
  )
}
