import combineEntriesWithKeys from "../utils/combineEntriesWithKeys";

import * as locationImages from "../../assets/Locations 134x134/*.png";
import * as iconImages from "../../assets/Icons 134x134/*.png";

const locations = combineEntriesWithKeys(
  Object.entries({
    camp: {
      image: locationImages["locations_colored_8"],
    },
    farm: {
      image: locationImages["locations_colored_5"],
    },
    mine: {
      image: locationImages["locations_colored_19"],
    },
    house: {
      image: locationImages["locations_colored_0"],
    },
    town: {
      image: locationImages["locations_colored_1"],
    },
    windmill: {
      image: locationImages["locations_colored_6"],
    },
    inn: {
      image: locationImages["locations_colored_12"],
    },
    church: {
      image: locationImages["locations_colored_16"],
    },
  })
);

const icons = combineEntriesWithKeys(
  Object.entries({
    question: {
      image: iconImages["icons_colored_0"],
    },
    x: {
      image: iconImages["icons_colored_3"],
    },
  })
);

export { locations, icons };
