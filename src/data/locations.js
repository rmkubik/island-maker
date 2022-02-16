import combineEntriesWithKeys from "../utils/combineEntriesWithKeys";

import * as locationImages from "../../assets/Locations 134x134/*.png";
import * as iconImages from "../../assets/Icons 134x134/*.png";
import * as resourceImages from "../../assets/resources/*.png";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import { tilePaths } from "./tiles";

const objects = combineEntriesWithKeys(
  Object.entries({
    question: {
      image: iconImages["icons_colored_0"],
    },
    x: {
      image: iconImages["icons_colored_3"],
    },
    tracks: {
      image: iconImages["icons_colored_11"],
    },
    fish1: {
      image: resourceImages["fish_1"],
    },
    fish2: {
      image: resourceImages["fish_2"],
    },
    fish3: {
      image: resourceImages["fish_3"],
    },
    turnip1: {
      image: resourceImages["turnip_1"],
    },
    turnip2: {
      image: resourceImages["turnip_2"],
    },
    turnip3: {
      image: resourceImages["turnip_3"],
    },
    plant: {
      image: iconImages["icons_colored_12"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.forest;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        hex.tileType = "forest";
        hex.tileImage = tileImage;
        hex.objectImage = undefined;
        hex.objectType = undefined;

        grid.set(hex, hex);
      },
    },
    camp: {
      image: locationImages["locations_colored_8"],
      validTileTypes: ["forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["plant", "mill"];

        const tracks = neighbors.filter(
          (neighbor) => neighbor.objectType === "tracks"
        );

        tracks.forEach((track) => {
          track.objectType = undefined;
          track.objectImage = undefined;

          grid.set(track, track);
        });

        return [
          pickRandomlyFromArray(options),
          ...new Array(tracks.length).fill("nest"),
        ];
      },
    },
    farm: {
      image: locationImages["locations_colored_5"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const turnips = neighbors.filter((neighbor) =>
          neighbor.objectType?.includes("turnip")
        );

        turnips.forEach((turnip) => {
          let turnipLevel = parseInt(
            turnip.objectType[turnip.objectType.length - 1]
          );

          turnipLevel -= 1;

          switch (turnipLevel) {
            case 2:
              turnip.objectType = objects.turnip2.key;
              turnip.objectImage = objects.turnip2.image;
              break;
            case 1:
              turnip.objectType = objects.turnip1.key;
              turnip.objectImage = objects.turnip1.image;
              break;
            case 0:
            default:
              turnip.objectType = undefined;
              turnip.objectImage = undefined;
              break;
          }

          grid.set(turnip, turnip);
        });

        return new Array(turnips.length).fill("house");
      },
    },
    mine: {
      image: locationImages["locations_colored_19"],
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["quarry", "lighthouse"];

        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );

        const newObjects = new Array(mountains.length)
          .fill("farm")
          .map(() => pickRandomlyFromArray(options));

        return newObjects;
      },
    },
    house: {
      image: locationImages["locations_colored_0"],
      validTileTypes: ["grassland"],
    },
    town: {
      image: locationImages["locations_colored_1"],
    },
    mill: {
      image: locationImages["locations_colored_6"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const farms = neighbors.filter(
          (neighbor) => neighbor.objectType === "farm"
        );

        return new Array(farms.length).fill("farm");
      },
    },
    inn: {
      image: locationImages["locations_colored_12"],
    },
    church: {
      image: locationImages["locations_colored_16"],
    },
    nest: {
      image: locationImages["locations_colored_20"],
      validTileTypes: ["grassland", "forest"],
    },
    quarry: {
      image: locationImages["locations_colored_4"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {},
    },
    lighthouse: {
      image: locationImages["locations_colored_13"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {},
    },
    ship: {
      image: locationImages["locations_colored_28"],
      validTileTypes: ["ocean", "oceanWave"],
    },
    shipwreck: {
      image: locationImages["locations_colored_29"],
      validTileTypes: ["ocean", "oceanWave"],
    },
  })
);

export { objects };
