import getHouseLevel from "./getHouseLevel";

function countPopulation(grid) {
  let count = 0;

  grid.forEach((hex) => {
    count += getHouseLevel(hex);
  });

  return count;
}

export default countPopulation;
