import * as locationImages from "../../assets/Locations 134x134/*.png";
import * as iconImages from "../../assets/Icons 134x134/*.png";

const locations = {
  house: {
    image: locationImages["locations_colored_0"],
  },
  town: {
    image: locationImages["locations_colored_1"],
  },
  farm: {
    image: locationImages["locations_colored_5"],
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
};

const icons = {
  question: {
    image: iconImages["icons_colored_0"],
  },
  x: {
    image: iconImages["icons_colored_3"],
  },
};

export { locations, icons };
