import createRandomString from "./createRandomString";
import rng from "./rng";
import getTodayString from "./getTodayString";
import { SEED_LENGTH } from "../data/config";

function getDailySeed() {
  const prevSeed = rng.getSeed();

  const todayString = getTodayString();
  rng.setSeed(todayString);

  const dailySeed = createRandomString(SEED_LENGTH);

  rng.setSeed(prevSeed);

  return dailySeed;
}

export default getDailySeed;
