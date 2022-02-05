import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Dustbin from "./Dustbin";
import Box from "./Box";
import Grid from "./Grid";

import "../style.css";

function App() {
  return (
    <div>
      {/* <DndProvider backend={HTML5Backend}>
        <div style={{ overflow: "hidden", clear: "both" }}>
          <Dustbin />
        </div>
        <div style={{ overflow: "hidden", clear: "both" }}>
          <Box name="Glass" />
          <Box name="Banana" />
          <Box name="Paper" /> */}
      {/* </div> */}
      <Grid />
      {/* </DndProvider> */}
    </div>
  );
}

export default App;
