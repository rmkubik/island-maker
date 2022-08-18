import getFishLevel from "./getFishLevel";
import getHouseLevel from "./getHouseLevel";

function countPopulation(grid) {
  let count = 0;

  const doesFishRelicExist = grid.some((hex) => hex.objectType === "fishRelic");

  grid.forEach((hex) => {
    count += getHouseLevel(hex);

    if (hex.objectType === "witchHut") {
      count += 1;
    }

    if (doesFishRelicExist && hex.objectType) {
      count += getFishLevel(hex);
    }
  });

  return count;
}

export default countPopulation;
