import SeedRandom from "seedrandom";

let rng = new SeedRandom("test");

function random() {
  return rng();
}

function setSeed(seed) {
  rng = new SeedRandom(seed);
}

export default { random, setSeed };
