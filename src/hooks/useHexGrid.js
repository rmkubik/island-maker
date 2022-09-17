import { defineGrid, extendHex } from "honeycomb-grid";
import { useEffect, useRef, useState } from "react";
import { dimensions, TILE_HEIGHT, TILE_WIDTH } from "../data/config";

const useHexGrid = ({
  initializeGrid = () => {},
  initializeHex = () => {},
  initialState = {},
  premadeGrid,
}) => {
  const GridDataRef = useRef();
  const [grid, setGrid] = useState();

  useEffect(() => {
    const Hex = extendHex({
      orientation: "flat",
      size: { width: TILE_WIDTH, height: TILE_HEIGHT },
      tileType: undefined,
      tileImage: undefined,
      objetType: undefined,
      objectImage: undefined,
    });

    GridDataRef.current = defineGrid(Hex);

    let state = { ...initialState };
    let initialGrid;

    if (premadeGrid) {
      initialGrid = GridDataRef.current(premadeGrid);
    } else {
      initialGrid = GridDataRef.current.rectangle(dimensions);
    }

    initializeGrid(initialGrid, state);

    initialGrid.forEach((hex) => initializeHex(hex, state));

    setGrid(initialGrid);
  }, []);

  return { GridDataRef, grid, setGrid };
};

export default useHexGrid;
