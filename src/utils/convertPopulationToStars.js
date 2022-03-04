import clamp from "./clamp";

function convertPopulationToStars(population) {
  if (population === 0) {
    // Only 0 population should give 0 stars
    return 0;
  }

  const starValue = Math.ceil(population / 5);

  return clamp(starValue, 0, 10);
}

export default convertPopulationToStars;
