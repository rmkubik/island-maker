import SeedRandom from "seedrandom";
import createRandomStringInternal from "./createRandomStringInternal";

let seed = createRandomStringInternal(Math.random)(8);
let rng = new SeedRandom(seed);

function random() {
  return rng();
}

function setSeed(newSeed) {
  seed = newSeed;
  rng = new SeedRandom(newSeed);
}

function getSeed() {
  return seed;
}

function resetCurrentSeed() {
  setSeed(getSeed());
}

export default { random, setSeed, getSeed, resetCurrentSeed };
