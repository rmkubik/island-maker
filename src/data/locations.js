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
      name: "Circle",
      image: iconImages["icons_colored_0"],
    },
    question: {
      name: "Question",
      image: iconImages["icons_colored_1"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        return [
          ["house1", hex],
          ["house2", hex],
          ["house3", hex],
        ];
      },
    },
    x: {
      name: "X",
      image: iconImages["icons_colored_3"],
    },
    tracks: {
      name: "Tracks",
      desc: "Something was here",
      image: iconImages["icons_colored_11"],
    },
    fish1: {
      name: "Fish",
      desc: "Swims in the sea",
      image: resourceImages["fish_1"],
    },
    fish2: {
      name: "Fish",
      desc: "Swims in the sea",
      image: resourceImages["fish_2"],
    },
    fish3: {
      name: "Fish",
      desc: "Swims in the sea",
      image: resourceImages["fish_3"],
    },
    turnip1: {
      name: "Turnip",
      desc: "Grows in the ground",
      image: resourceImages["turnip_1"],
    },
    turnip2: {
      name: "Turnip",
      desc: "Grows in the ground",
      image: resourceImages["turnip_2"],
    },
    turnip3: {
      name: "Turnip",
      desc: "Grows in the ground",
      image: resourceImages["turnip_3"],
      validTileTypes: ["grassland"],
    },
    plant: {
      name: "Grow",
      desc: "The trees will rise",
      image: iconImages["icons_colored_12"],
      validObjectOverrides: ["house1"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.forest;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        const newCards = [];

        hex.tileType = "forest";
        hex.tileImage = tileImage;

        switch (hex.objectType) {
          case "house1":
            hex.objectImage = objects.witchHut.image;
            hex.objectType = "witchHut";
            newCards.push(["skull", hex]);
            break;
          default:
            hex.objectImage = undefined;
            hex.objectType = undefined;
            break;
        }

        grid.set(hex, hex);
        return newCards;
      },
    },
    camp: {
      name: "Camp",
      desc: "Hunts in the woods",
      image: locationImages["locations_colored_8"],
      validTileTypes: ["forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["turnip3", "mill"];

        const tracks = neighbors.filter(
          (neighbor) => neighbor.objectType === "tracks"
        );

        const nests = tracks.map((track) => {
          track.objectType = undefined;
          track.objectImage = undefined;

          grid.set(track, track);

          return ["nest", track];
        });

        return [...nests, [pickRandomlyFromArray(options), hex]];
      },
    },
    farm: {
      name: "Farm",
      desc: "Harvests turnips",
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

        const houses = turnips.map((turnip) => ["house1", turnip]);

        return houses;
      },
    },
    mine: {
      name: "Mine",
      desc: "Extracts from mountains",
      image: locationImages["locations_colored_19"],
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["quarry", "lighthouse"];

        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );

        const newObjects = mountains.map((mountain) => [
          pickRandomlyFromArray(options),
          mountain,
        ]);

        return newObjects;
      },
    },
    house1: {
      name: "House",
      desc: "A nice place to live",
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
          return [[pickRandomlyFromArray(HOUSE_3_OPTIONS), hex]];
        }
      },
    },
    house2: {
      name: "Hamlet",
      desc: "Two is company",
      image: resourceImages["house_2"],
      validTileTypes: ["grassland"],
    },
    house3: {
      name: "Village",
      desc: "Three's a crowd",
      image: resourceImages["house_3"],
      validTileTypes: ["grassland"],
    },
    house4: {
      name: "Town",
      desc: "Bustling",
      image: resourceImages["house_4"],
      validTileTypes: ["grassland"],
    },
    mill: {
      name: "Mill",
      desc: "Farms the farms",
      image: locationImages["locations_colored_6"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const farms = neighbors.filter(
          (neighbor) => neighbor.objectType === "farm"
        );

        const newFarms = farms.map((farm) => ["farm", farm]);

        return newFarms;
      },
    },
    inn: {
      name: "Inn",
      desc: "Gives the people happiness",
      image: locationImages["locations_colored_12"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const houses = neighbors.filter(
          (neighbor) => getHouseLevel(neighbor) > 0
        );

        const newHouses = houses.map((house) => ["house1", house]);

        return newHouses;
      },
    },
    church: {
      name: "Church",
      desc: "Brings the people faith",
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
              newCards.push([pickRandomlyFromArray(HOUSE_3_OPTIONS), house]);
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
              newCards.push(["skull", grave]);
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
      name: "Nest",
      desc: "Room for one more?",
      image: locationImages["locations_colored_20"],
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        switch (hex.tileType) {
          case "grassland":
            // TODO: This needs a new reward since
            // all previews are open now.
            // game.addPreviewSlot();
            game.addBankSlot();
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
      name: "Quarry",
      desc: "What's under the ground?",
      image: locationImages["locations_colored_4"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["mine", "cave", "dungeon"];

        return [pickRandomlyFromArray(options), hex];
      },
    },
    lighthouse: {
      name: "Lighthouse",
      desc: "Lights the way",
      image: locationImages["locations_colored_13"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        return [
          ["ship", hex],
          ["ship", hex],
        ];
      },
    },
    ship: {
      name: "Ship",
      desc: "Gathers fish",
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
        let newCards = fishes.map((fish) => ["house1", fish]);

        // Add a random card for each adjacent lighthouse
        const lighthouses = neighbors.filter((neighbor) =>
          neighbor.objectType?.includes("lighthouse")
        );

        const lightHouseOptions = ["plant", "camp"];

        lighthouses.forEach((lighthouse) => {
          newCards.push([pickRandomlyFromArray(lightHouseOptions), lighthouse]);
        });

        return newCards;
      },
    },
    shipwreck: {
      name: "Shipwreck",
      desc: "To the bottom of the sea",
      image: locationImages["locations_colored_29"],
      validTileTypes: ["ocean", "oceanWave"],
    },
    cave: {
      name: "Seed",
      desc: "A rocky spore",
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
      name: "Dungeon",
      desc: "What's inside?",
      image: locationImages["locations_colored_18"],
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const options = ["grave", "skull"];

        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );

        const newObjects = mountains
          .map((mountain) => {
            return constructArray(
              () => [pickRandomlyFromArray(options), mountain],
              3
            );
          })
          .flat();

        return newObjects;
      },
    },
    grave: {
      name: "Grave",
      desc: "Rest in piece",
      image: locationImages["locations_colored_27"],
      validTileTypes: ["grassland", "forest"],
    },
    skull: {
      name: "Curse",
      desc: "All things must pass",
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
      name: "Witch Hut",
      desc: "Not so friendly",
      image: locationImages["locations_colored_7"],
      validTileTypes: ["forest"],
    },
  })
);

export { objects };
