import { useState, useEffect } from "react";
import Tile from "./Tile";

const nearTiles = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
function Board({ tileCount }) {
  const [tiles, setTiles] = useState([]);
  const [isSelected, setIsSelected] = useState(false);

  const selectTile = (position) => {
    setTiles(
      tiles.map((row) =>
        row.map((tile) =>
          tile.position === position
            ? { ...tile, near_spot: false, far_spot: false, selected: true }
            : { ...tile, near_spot: false, far_spot: false, selected: false }
        )
      )
    );
    setIsSelected(true);
  };
  const openNearSpots = (position) => {
    setTiles((prevTiles) =>
      prevTiles.map((row) =>
        row.map((tile) =>
          tile.position === position ? { ...tile, near_spot: true } : tile
        )
      )
    );
  };

  const openSpots = () => {
    const nearSpots = findNeighboringTiles(tiles, nearTiles);

    nearSpots.forEach((spot) => {
      openNearSpots(spot);
    });
  };

  useEffect(() => {
    setTiles(createBoard(tileCount));
  }, []);

  useEffect(() => {
    if (isSelected) {
      openSpots();
      setIsSelected(false);
    }
  }, [isSelected]);
  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${tileCount}, 1fr)`,
      }}
    >
      {tiles.map((row, i) =>
        row.map((col, j) => (
          <Tile key={`${i}-${j}`} tile={col} selectTile={selectTile} />
        ))
      )}
    </div>
  );
}

function createBoard(size) {
  const rows = [];
  for (let i = 0; i < size; i++) {
    rows.push(
      Array.from(Array(size), (_, index) => {
        return {
          selected: false,
          team: null,
          marked: false,
          position: `${i}-${index}`,
          near_spot: false,
          far_spot: false,
        };
      })
    );
  }
  return rows;
}

function findNeighboringTiles(tilesArr, tilesToCheck) {
  const foundTiles = [];

  for (let i = 0; i < tilesArr.length; i++) {
    for (let j = 0; j < tilesArr[i].length; j++) {
      if (tilesArr[i][j].selected) {
        tilesToCheck.forEach(([x, y]) => {
          foundTiles.push(`${i + x}-${j + y}`);
        });
      }
    }
  }
  return foundTiles;
}

export default Board;
