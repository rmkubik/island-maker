import SeedRandom from "seedrandom";
import createRandomStringInternal from "./createRandomStringInternal";
import { SEED_LENGTH } from "../data/config";

let seed = createRandomStringInternal(Math.random)(SEED_LENGTH);
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
