import combineEntriesWithKeys from "../utils/combineEntriesWithKeys";

import * as locationImages from "../../assets/Locations 134x134/*.png";
import * as iconImages from "../../assets/Icons 134x134/*.png";
import * as resourceImages from "../../assets/resources/*.png";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import constructArray from "../utils/constructArray";
import { tilePaths } from "./tiles";
import getHouseLevel from "../utils/getHouseLevel";

const HOUSE_3_OPTIONS = ["inn", "church"];

const objects = combineEntriesWithKeys(
  Object.entries({
    circle: {
      image: iconImages["icons_colored_0"],
    },
    question: {
      image: iconImages["icons_colored_1"],
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
      validTileTypes: ["grassland"],
    },
    plant: {
      image: iconImages["icons_colored_12"],
      validObjectOverrides: ["house1"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.forest;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        hex.tileType = "forest";
        hex.tileImage = tileImage;

        switch (hex.objectType) {
          case "house1":
            hex.objectImage = objects.witchHut.image;
            hex.objectType = "witchHut";
            break;
          default:
            hex.objectImage = undefined;
            hex.objectType = undefined;
            break;
        }

        grid.set(hex, hex);
      },
    },
    camp: {
      image: locationImages["locations_colored_8"],
      validTileTypes: ["forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["turnip3", "mill"];

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

        return new Array(turnips.length).fill("house1");
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
    house1: {
      image: resourceImages["house_1"],
      validTileTypes: ["grassland"],
      validObjectOverrides: ["house1", "house2"],
      onOverride: ({ hex, neighbors, grid }) => {
        let houseLevel = parseInt(hex.objectType[hex.objectType.length - 1]);

        houseLevel += 1;

        switch (houseLevel) {
          case 3:
            hex.objectType = objects.house3.key;
            hex.objectImage = objects.house3.image;
            break;
          case 2:
            hex.objectType = objects.house2.key;
            hex.objectImage = objects.house2.image;
            break;
          default:
            break;
        }

        grid.set(hex, hex);
      },
      onPlace: ({ hex, neighbors, grid }) => {
        const houseLevel = parseInt(hex.objectType[hex.objectType.length - 1]);

        if (houseLevel === 3) {
          return [pickRandomlyFromArray(HOUSE_3_OPTIONS)];
        }
      },
    },
    house2: {
      image: resourceImages["house_2"],
      validTileTypes: ["grassland"],
    },
    house3: {
      image: resourceImages["house_3"],
      validTileTypes: ["grassland"],
    },
    house4: {
      image: resourceImages["house_4"],
      validTileTypes: ["grassland"],
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
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const houses = neighbors.filter(
          (neighbor) => getHouseLevel(neighbor) > 0
        );

        return new Array(houses.length).fill("house1");
      },
    },
    church: {
      image: locationImages["locations_colored_16"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const houses = neighbors.filter(
          (neighbor) => getHouseLevel(neighbor) > 0
        );

        let newCards = [];

        houses.forEach((house) => {
          let houseLevel = getHouseLevel(house);

          houseLevel += 1;

          switch (houseLevel) {
            default:
            case 4:
              house.objectType = objects.house4.key;
              house.objectImage = objects.house4.image;
              break;
            case 3:
              house.objectType = objects.house3.key;
              house.objectImage = objects.house3.image;
              newCards.push(pickRandomlyFromArray(HOUSE_3_OPTIONS));
              break;
            case 2:
              house.objectType = objects.house2.key;
              house.objectImage = objects.house2.image;
              break;
          }

          grid.set(house, house);
        });

        const graves = neighbors.filter(
          (neighbor) => neighbor.objectType === "grave"
        );

        graves.forEach((grave) => {
          switch (grave.tileType) {
            case "forest":
              grave.objectType = "witchHut";
              grave.objectImage = objects.witchHut.image;
              break;
            case "grassland":
            default:
              grave.objectType = "house1";
              grave.objectImage = objects.house1.image;
              break;
          }

          grid.set(grave, grave);
        });

        return newCards;
      },
    },
    nest: {
      image: locationImages["locations_colored_20"],
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        switch (hex.tileType) {
          case "grassland":
            game.addPreviewSlot();
            break;
          case "forest":
            game.addBankSlot();
            break;
          default:
            break;
        }
      },
    },
    quarry: {
      image: locationImages["locations_colored_4"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["mine", "cave", "dungeon"];

        return [pickRandomlyFromArray(options)];
      },
    },
    lighthouse: {
      image: locationImages["locations_colored_13"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        return ["ship", "ship"];
      },
    },
    ship: {
      image: locationImages["locations_colored_28"],
      validTileTypes: ["ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid }) => {
        // If a ship is placed on a wave, turn it into a
        // shipwreck and don't generate any other tiles.
        if (hex.tileType === "oceanWave") {
          hex.objectType = objects.shipwreck.key;
          hex.objectImage = objects.shipwreck.image;

          grid.set(hex, hex);
          return;
        }

        const fishes = neighbors.filter((neighbor) =>
          neighbor.objectType?.includes("fish")
        );

        fishes.forEach((fish) => {
          let fishLevel = parseInt(fish.objectType[fish.objectType.length - 1]);

          fishLevel -= 1;

          switch (fishLevel) {
            case 2:
              fish.objectType = objects.fish2.key;
              fish.objectImage = objects.fish2.image;
              break;
            case 1:
              fish.objectType = objects.fish1.key;
              fish.objectImage = objects.fish1.image;
              break;
            case 0:
            default:
              fish.objectType = undefined;
              fish.objectImage = undefined;
              break;
          }

          grid.set(fish, fish);
        });

        // Add a house for each adjacent fish
        let newCards = new Array(fishes.length).fill("house1");

        // Add a random card for each adjacent lighthouse
        const lighthouses = neighbors.filter((neighbor) =>
          neighbor.objectType?.includes("lighthouse")
        );

        const lightHouseOptions = ["plant", "camp"];

        lighthouses.forEach(() => {
          newCards.push(pickRandomlyFromArray(lightHouseOptions));
        });

        return newCards;
      },
    },
    shipwreck: {
      image: locationImages["locations_colored_29"],
      validTileTypes: ["ocean", "oceanWave"],
    },
    cave: {
      image: locationImages["locations_colored_17"],
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.mountain;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        hex.tileType = "mountain";
        hex.tileImage = tileImage;
        hex.objectImage = undefined;
        hex.objectType = undefined;

        grid.set(hex, hex);
      },
    },
    dungeon: {
      image: locationImages["locations_colored_18"],
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["grave", "skull"];

        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );

        const newObjects = constructArray(
          () => constructArray(() => pickRandomlyFromArray(options), 3),
          mountains.length
        ).flat();

        return newObjects;
      },
    },
    grave: {
      image: locationImages["locations_colored_27"],
      validTileTypes: ["grassland", "forest"],
    },
    skull: {
      image: iconImages["icons_colored_4"],
      validTileTypes: ["grassland", "forest"],
      validObjectOverrides: ["all"],
      notValidObjectOverrides: ["grave"],
      requireOverride: true,
      onOverride: ({ hex, neighbors, grid }) => {
        hex.objectImage = objects.grave.image;
        hex.objectType = "grave";

        grid.set(hex, hex);
      },
    },
    witchHut: {
      image: locationImages["locations_colored_7"],
      validTileTypes: ["forest"],
    },
  })
);

export { objects };
