import createRandomString from "./createRandomString";
import rng from "./rng";
import getTodayString from "./getTodayString";

function getDailySeed() {
  const prevSeed = rng.getSeed();

  const todayString = getTodayString();
  rng.setSeed(todayString);

  const dailySeed = createRandomString(8);

  rng.setSeed(prevSeed);

  return dailySeed;
}

export default getDailySeed;
