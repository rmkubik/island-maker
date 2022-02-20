import getHouseLevel from "./getHouseLevel";

function countPopulation(grid) {
  let count = 0;

  grid.forEach((hex) => {
    count += getHouseLevel(hex);

    if (hex.objectType === "witchHut") {
      count += 1;
    }
  });

  return count;
}

export default countPopulation;
