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
  const stateRef = useRef();
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

    stateRef.current = { ...initialState };
    let initialGrid;

    if (premadeGrid) {
      initialGrid = GridDataRef.current(premadeGrid);
    } else {
      initialGrid = GridDataRef.current.rectangle(dimensions);
    }

    initializeGrid(initialGrid, stateRef.current);

    initialGrid.forEach((hex) => initializeHex(hex, stateRef.current));

    setGrid(initialGrid);
  }, []);

  return { GridDataRef, grid, setGrid };
};

export default useHexGrid;
