import { useState, useEffect } from "react";
import Tile from "./Tile";
function Board({ tileCount }) {
  const [tiles, setTiles] = useState([]);
  useEffect(() => {
    setTiles(setBoard(tileCount));
  }, []);
  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${tileCount}, 1fr)`,
      }}
    >
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </div>
  );
}

function setBoard(size) {
  const tileArr = [];
  let rowCount = 1;
  let colCount = 1;
  let tileObJ = {};

  for (let i = 1; i <= size * size; i++) {
    tileObJ = {
      id: Math.floor(Math.random() * 1000000),
      row: rowCount,
      column: colCount,
      marked: false,
      selected: false,
      team: null,
    };
    tileArr.push(tileObJ);

    colCount++;
    if (colCount > size) {
      colCount = 1;
      rowCount++;
    }
  }
  return tileArr;
}

export default Board;
