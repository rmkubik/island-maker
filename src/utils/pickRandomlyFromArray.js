import rng from "./rng";

function pickRandomlyFromArray(array) {
  return array[Math.floor(rng.random() * array.length)];
}

export default pickRandomlyFromArray;
