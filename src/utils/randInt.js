import rng from "./rng";

function randInt(low, high) {
  return Math.floor(rng.random() * (high - low + 1)) + low;
}

export default randInt;
