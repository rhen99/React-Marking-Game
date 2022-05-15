import { useState } from "react";
import Board from "./components/Board";
function App() {
  const [tileCount] = useState(8);
  return (
    <>
      <Board tileCount={tileCount} />
    </>
  );
}

export default App;
