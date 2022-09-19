const fishTypes = ["fish1", "fish2", "fish3"];

function getFishLevel(hex) {
  if (fishTypes.includes(hex.objectType)) {
    return parseInt(hex.objectType[hex.objectType.length - 1]);
  }

  return 0;
}

export default getFishLevel;
