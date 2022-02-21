import { TILE_HEIGHT, VISUAL_Y_OFFSET } from "../data/config";

const getHexFromPointerEvent = (GridData, scale) => (event) => {
  const hex = GridData.pointToHex(
    event.clientX / scale,
    event.clientY / scale - TILE_HEIGHT - VISUAL_Y_OFFSET
  );

  return hex;
};

export default getHexFromPointerEvent;
