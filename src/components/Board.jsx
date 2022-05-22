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
const farTiles = [
  [-2, -2],
  [-2, -1],
  [-2, 0],
  [-2, 1],
  [-2, 2],
  [-1, -2],
  [-1, 2],
  [0, -2],
  [0, 2],
  [1, -2],
  [1, 2],
  [2, -2],
  [2, -1],
  [2, 0],
  [2, 1],
  [2, 2],
];
function Board({ tileCount }) {
  const [tiles, setTiles] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [turn] = useState(1);

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
          tile.position === position && !tile.marked
            ? { ...tile, near_spot: true }
            : tile
        )
      )
    );
  };
  const openFarSpots = (position) => {
    setTiles((prevTiles) =>
      prevTiles.map((row) =>
        row.map((tile) =>
          tile.position === position && !tile.marked
            ? { ...tile, far_spot: true }
            : tile
        )
      )
    );
  };
  const playerMove = ({ near_spot, far_spot }) => {
    if (near_spot) {
      setTiles((prevTiles) =>
        prevTiles.map((row) =>
          row.map((tile) => {
            return { ...tile, marked: true, team: turn };
          })
        )
      );
    }

    if (far_spot) {
      console.log("move");
    }
    setTiles(
      tiles.map((row) =>
        row.map((tile) => {
          return {
            ...tile,
            near_spot: false,
            far_spot: false,
            selected: false,
          };
        })
      )
    );
  };

  const openSpots = () => {
    const nearSpots = findNeighboringTiles(tiles, nearTiles);
    const farSpots = findNeighboringTiles(tiles, farTiles);

    nearSpots.forEach((spot) => {
      openNearSpots(spot);
    });

    farSpots.forEach((spot) => {
      openFarSpots(spot);
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
          <Tile
            key={`${i}-${j}`}
            tile={col}
            selectTile={selectTile}
            playerMove={playerMove}
            turn={turn}
          />
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
        if (
          (i === 0 && index === 0) ||
          (i === 0 && index === 1) ||
          (i === 0 && index === size - 2) ||
          (i === 0 && index === size - 1)
        ) {
          return {
            selected: false,
            team: 2,
            marked: true,
            position: `${i}-${index}`,
            near_spot: false,
            far_spot: false,
          };
        } else if (
          (i === size - 1 && index === 0) ||
          (i === size - 1 && index === 1) ||
          (i === size - 1 && index === size - 2) ||
          (i === size - 1 && index === size - 1)
        ) {
          return {
            selected: false,
            team: 1,
            marked: true,
            position: `${i}-${index}`,
            near_spot: false,
            far_spot: false,
          };
        } else {
          return {
            selected: false,
            team: null,
            marked: false,
            position: `${i}-${index}`,
            near_spot: false,
            far_spot: false,
          };
        }
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
