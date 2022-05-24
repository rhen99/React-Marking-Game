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
  const [turn, setTurn] = useState(1);
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(false);

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
  const playerMove = (selectedTile) => {
    if (selectedTile.near_spot) {
      setTiles((prevTiles) =>
        prevTiles.map((row) =>
          row.map((tile) =>
            tile.position === selectedTile.position
              ? { ...tile, marked: true, team: turn, near_spot: false }
              : { ...tile, selected: false, near_spot: false, far_spot: false }
          )
        )
      );
    }

    if (selectedTile.far_spot) {
      setTiles((prevTiles) =>
        prevTiles.map((row) =>
          row.map((tile) =>
            tile.position === selectedTile.position
              ? { ...tile, marked: true, team: turn }
              : tile
          )
        )
      );
      setTiles((prevTiles) =>
        prevTiles.map((row) =>
          row.map((tile) =>
            tile.selected
              ? {
                  ...tile,
                  marked: false,
                  selected: false,
                  team: null,
                }
              : { ...tile, near_spot: false, far_spot: false }
          )
        )
      );
    }
    const surroundingTiles = findNeighboringTiles(selectedTile, nearTiles);

    surroundingTiles.forEach((spot) => {
      setTiles((prevTiles) =>
        prevTiles.map((row) =>
          row.map((tile) =>
            tile.position === spot && tile.marked && tile.team !== turn
              ? {
                  ...tile,
                  team: turn,
                }
              : tile
          )
        )
      );
    });

    setTurn((turn) => (turn === 1 ? (turn += 1) : (turn -= 1)));
  };

  const openSpots = () => {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        if (tiles[i][j].selected) {
          const nearSpots = findNeighboringTiles(tiles[i][j], nearTiles);
          const farSpots = findNeighboringTiles(tiles[i][j], farTiles);

          nearSpots.forEach((spot) => {
            openNearSpots(spot);
          });

          farSpots.forEach((spot) => {
            openFarSpots(spot);
          });
        }
      }
    }
  };

  const checkIfGameOver = () => {
    const marks = [];
    let marksSurroundungs = [];
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        if (tiles[i][j].team === turn) {
          marks.push(tiles[i][j]);
        }
      }
    }
    for (let i = 0; i < marks.length; i++) {
      marksSurroundungs.push(findNeighboringTiles(marks[i], nearTiles));
    }
    for (let i = 0; i < marks.length; i++) {
      marksSurroundungs.push(findNeighboringTiles(marks[i], farTiles));
    }
    const possibleMoves = [];

    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        marksSurroundungs.flat().forEach((mark) => {
          if (tiles[i][j].position === mark && !tiles[i][j].marked) {
            possibleMoves.push(tiles[i][j]);
          }
        });
      }
    }
    if (possibleMoves.length > 0) {
      return false;
    } else {
      // Game Over
      return true;
    }
  };

  useEffect(() => {
    if (tiles.length < 1) {
      setTiles(createBoard(tileCount));
    } else {
      setRedScore(getScore(tiles, 1));
      setBlueScore(getScore(tiles, 2));
      setGameStatus(checkIfGameOver());
    }
  }, [tiles]);

  useEffect(() => {
    if (isSelected) {
      openSpots();
      setIsSelected(false);
    }
  }, [isSelected]);
  return (
    <div className="wrapper">
      <h2 className="game_status">
        {gameStatus
          ? redScore > blueScore
            ? "Red Wins!!!"
            : "Blue Wins!!!"
          : null}
      </h2>
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
      <div className="scorebox">
        <div className="blue-score">
          <h3>
            <span>Blue</span> - {blueScore}
          </h3>
        </div>
        <div className="red-score">
          <h3>
            <span>Red</span> - {redScore}
          </h3>
        </div>
      </div>
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

function findNeighboringTiles(currentTile, tilesToCheck) {
  const foundTiles = [];

  const currentPosition = currentTile.position.split("-");

  tilesToCheck.forEach(([x, y]) => {
    foundTiles.push(
      `${parseInt(currentPosition[0]) + x}-${parseInt(currentPosition[1]) + y}`
    );
  });
  return foundTiles;
}

function getScore(tilesArr, team) {
  const marks = [];
  for (let i = 0; i < tilesArr.length; i++) {
    for (let j = 0; j < tilesArr[i].length; j++) {
      if (tilesArr[i][j].team === team) {
        marks.push(tilesArr[i][j]);
      }
    }
  }
  return marks.length;
}

export default Board;
