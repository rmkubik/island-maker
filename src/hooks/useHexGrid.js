import { defineGrid, extendHex } from "honeycomb-grid";
import { useEffect, useRef, useState } from "react";
import { dimensions, TILE_HEIGHT, TILE_WIDTH } from "../data/config";

const useHexGrid = ({ initializeHex }) => {
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

    const initialGrid = GridDataRef.current.rectangle(dimensions);

    initialGrid.forEach(initializeHex);

    setGrid(initialGrid);
  }, []);

  return { GridDataRef, grid, setGrid };
};

export default useHexGrid;
