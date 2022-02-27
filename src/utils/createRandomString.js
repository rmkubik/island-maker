import rng from "./rng";
import createRandomStringInternal from "./createRandomStringInternal";

const createRandomStringWithSeededRng = createRandomStringInternal(rng.random);

export default createRandomStringWithSeededRng;
