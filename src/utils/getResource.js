import { objects } from "../data/locations";
import randInt from "../utils/randInt";

const getResource = (tileType, chances) => {
  switch (tileType) {
    case "grassland":
      if (randInt(1, 100) <= chances.turnip) {
        return objects.turnip3;
      }
      if (randInt(1, 100) <= chances.ruins) {
        return objects.ruins;
      }
      if (randInt(1, 100) <= chances.xMark) {
        return objects.x;
      }
      break;
    case "forest":
      if (randInt(1, 100) <= chances.tracks) {
        return objects.tracks;
      }
      if (randInt(1, 100) <= chances.ruins) {
        return objects.ruin;
      }
      break;
    case "ocean":
      if (randInt(1, 100) <= chances.fish) {
        return objects.fish3;
      }
      break;
    default:
      break;
  }

  return undefined;
};

export default getResource;
