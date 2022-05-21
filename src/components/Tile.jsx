function Tile({ selectTile, tile }) {
  return (
    <div
      className={`tile ${tile.selected ? "selected" : ""} ${
        tile.near_spot || tile.far_spot ? "open-spot" : ""
      }`}
      onClick={() => selectTile(tile.position)}
    ></div>
  );
}

export default Tile;
