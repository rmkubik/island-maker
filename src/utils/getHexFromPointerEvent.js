import { TILE_HEIGHT, VISUAL_Y_OFFSET } from "../data/config";

const getHexFromPointerEvent = (GridData, scale) => (event) => {
  const hex = GridData.pointToHex(
    event.clientX / scale,
    (event.clientY - VISUAL_Y_OFFSET) / scale - TILE_HEIGHT
  );

  return hex;
};

export default getHexFromPointerEvent;
