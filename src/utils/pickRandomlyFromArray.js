import rng from "./rng";
import pickRandomlyFromArrayInternal from "./pickRandomlyFromArrayInternal";

const pickRandomlyFromArrayWithSeededRng = pickRandomlyFromArrayInternal(
  rng.random
);

export default pickRandomlyFromArrayWithSeededRng;
