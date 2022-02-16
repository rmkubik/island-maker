import { icons } from "../data/locations";
import randInt from "../utils/randInt";

const getResource = (tileType) => {
  const turnipChance = 8;
  const fishChance = 6;
  const tracksChance = 3;

  switch (tileType) {
    case "grassland":
      if (randInt(1, 100) <= turnipChance) {
        return icons.turnip3;
      }
      break;
    case "forest":
      if (randInt(1, 100) <= tracksChance) {
        return icons.tracks;
      }
      break;
    case "ocean":
      if (randInt(1, 100) <= fishChance) {
        return icons.fish3;
      }
      break;
    default:
      break;
  }

  return undefined;
};

export default getResource;
