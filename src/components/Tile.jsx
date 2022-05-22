function Tile({ selectTile, tile, turn, playerMove }) {
  return (
    <div
      className={`tile ${tile.selected ? "selected" : ""} ${
        tile.near_spot ? "near" : ""
      } ${tile.far_spot ? "far" : ""}`}
      onClick={
        tile.marked && turn === tile.team
          ? () => selectTile(tile.position)
          : tile.near_spot || tile.far_spot
          ? () => playerMove(tile)
          : null
      }
    >
      {tile.marked ? (
        <div className={`mark ${tile.team < 2 ? "team-1" : "team-2"}`}></div>
      ) : null}
    </div>
  );
}

export default Tile;
