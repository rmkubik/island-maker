import { TILE_HEIGHT } from "../data/config";

const getHexFromPointerEvent = (GridData, scale) => (event) => {
  const hex = GridData.pointToHex(
    event.clientX / scale,
    event.clientY / scale - TILE_HEIGHT
  );

  return hex;
};

export default getHexFromPointerEvent;
