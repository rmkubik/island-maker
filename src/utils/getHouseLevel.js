const houseTypes = ["house1", "house2", "house3", "house4"];

function getHouseLevel(hex) {
  if (houseTypes.includes(hex.objectType)) {
    return parseInt(hex.objectType[hex.objectType.length - 1]);
  }

  return 0;
}

export default getHouseLevel;
