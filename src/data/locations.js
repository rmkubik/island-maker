import combineEntriesWithKeys from "../utils/combineEntriesWithKeys";

import * as locationImages from "../../assets/Locations 134x134/*.png";
import * as iconImages from "../../assets/Icons 134x134/*.png";
import * as resourceImages from "../../assets/resources/*.png";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import constructArray from "../utils/constructArray";
import { tilePaths } from "./tiles";
import getHouseLevel from "../utils/getHouseLevel";

const HOUSE_3_OPTIONS = ["inn", "church"];

const objectImages = {
  ...locationImages,
  ...iconImages,
  ...resourceImages,
};

function getDungeonRandomOutcome(hex) {
  const options = ["grave", "skull"];

  return [
    [pickRandomlyFromArray(options), hex],
    [pickRandomlyFromArray(options), hex],
    [pickRandomlyFromArray(options), hex],
  ];
}

const editObjects = combineEntriesWithKeys(
  Object.entries({
    deleteObject: {
      name: "Delete Object",
      image: "icons_colored_3",
      desc: "Remove selected object",
      onEditOverride: ({ hex, neighbors, grid }) => {
        hex.objectImage = undefined;
        hex.objectType = undefined;

        grid.set(hex, hex);
      },
    },
    placeForest: {
      name: "Place Forest",
      image: "icons_colored_12",
      desc: "Turn terrain into forest",
      onEditOverride: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.forest;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        hex.tileType = "forest";
        hex.tileImage = tileImage;

        grid.set(hex, hex);
      },
    },
    placeOcean: {
      name: "Place Ocean",
      image: "icons_colored_8",
      desc: "Turn terrain into ocean",
      onEditOverride: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.ocean;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        hex.tileType = "ocean";
        hex.tileImage = tileImage;

        grid.set(hex, hex);
      },
    },
    placeOceanWave: {
      name: "Place Ocean Wave",
      image: "icons_colored_8",
      desc: "Turn terrain into ocean wave",
      onEditOverride: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.oceanWave;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        hex.tileType = "oceanWave";
        hex.tileImage = tileImage;

        grid.set(hex, hex);
      },
    },
    placeGrassland: {
      name: "Place Grassland",
      image: "icons_colored_0",
      desc: "Turn terrain into grassland",
      onEditOverride: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.grassland;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        hex.tileType = "grassland";
        hex.tileImage = tileImage;

        grid.set(hex, hex);
      },
    },
    placeMountain: {
      name: "Place Mountain",
      image: "icons_colored_16",
      desc: "Turn terrain into mountain",
      onEditOverride: ({ hex, neighbors, grid }) => {
        const tileTypeImages = tilePaths.mountain;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        hex.tileType = "mountain";
        hex.tileImage = tileImage;

        grid.set(hex, hex);
      },
    },
  })
);

const objects = combineEntriesWithKeys(
  Object.entries({
    circle: {
      name: "Circle",
      image: "icons_colored_0",
    },
    question: {
      name: "???",
      image: "icons_colored_1",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        return [
          ["house1", hex],
          ["house2", hex],
          ["house3", hex],
        ];
      },
    },
    crown: {
      name: "crown",
      image: "icons_colored_9",
    },
    x: {
      name: "X",
      image: "icons_colored_3",
    },
    fish1: {
      name: "Fish",
      desc: "Swims in the sea",
      image: "fish_1",
    },
    fish2: {
      name: "Fish",
      desc: "Swims in the sea",
      image: "fish_2",
    },
    fish3: {
      name: "Fish",
      desc: "Swims in the sea",
      image: "fish_3",
      isInJournal: true,
    },
    turnip1: {
      name: "Turnip",
      desc: "Grows in the ground",
      image: "turnip_1",
    },
    turnip2: {
      name: "Turnip",
      desc: "Grows in the ground",
      image: "turnip_2",
    },
    turnip3: {
      name: "Turnip",
      desc: "Grows in the ground",
      image: "turnip_3",
      validTileTypes: ["grassland"],
      isInJournal: true,
    },
    plant: {
      name: "Grow",
      desc: "The trees will rise",
      isInJournal: true,
      image: "icons_colored_12",
      validObjectOverrides: ["house1"],
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        const tileTypeImages = tilePaths.forest;
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        const newCards = [];

        hex.tileType = "forest";
        hex.tileImage = tileImage;

        switch (hex.objectType) {
          case "house1":
            hex.objectImage = objects.witchHut.image;
            hex.objectType = "witchHut";
            game.unlockItem("witchHut");

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
      isInJournal: true,
      image: "locations_colored_8",
      validTileTypes: ["forest", "grassland"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        switch (hex.tileType) {
          case "forest": {
            const options = ["mill"];

            const tracks = neighbors.filter(
              (neighbor) => neighbor.objectType === "tracks"
            );

            if (tracks.length > 0) {
              game.unlockItem("tracks");
            }

            const nests = tracks.map((track) => {
              track.objectType = undefined;
              track.objectImage = undefined;

              grid.set(track, track);

              return ["nest", track];
            });

            return [...nests, [pickRandomlyFromArray(options), hex]];
          }
          case "grassland": {
            const adjacentForests = neighbors.filter(
              (neighbor) => neighbor.tileType === "forest"
            );

            adjacentForests.forEach((forest) => {
              const tileTypeImages = tilePaths.grassland;
              const tileImage = pickRandomlyFromArray(tileTypeImages);

              if (forest.objectType) {
                forest.objectType = objects.turnip3.key;
                forest.objectImage = objects.turnip3.image;
              }

              forest.tileType = "grassland";
              forest.tileImage = tileImage;

              grid.set(forest, forest);
            });

            break;
          }
          default:
            break;
        }
      },
    },
    farm: {
      name: "Farm",
      desc: "Harvests turnips",
      isInJournal: true,
      image: "locations_colored_5",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        const turnips = neighbors.filter((neighbor) =>
          neighbor.objectType?.includes("turnip")
        );

        if (turnips.length > 0) {
          game.unlockItem("turnip3");
        }

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
      isInJournal: true,
      image: "locations_colored_19",
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );
        const newQuarries = mountains.map((mountain) => ["quarry", mountain]);

        const ruins = neighbors.filter(
          (neighbor) => neighbor.objectType === "ruin"
        );
        const newCurses = ruins.map((ruin) => {
          // Side effect inside a map, shh don't tell the function police
          //
          // This is visually confusing as the ruins are destroyed
          // before the player actually sees the curses granted...
          // We would need some kind of callback hook or more complicated
          // animation framework to make this clearer.
          ruin.objectType = undefined;
          ruin.objectImage = undefined;

          return ["skull", ruin];
        });

        const newObjects = [...newCurses, ...newQuarries];

        return newObjects;
      },
    },
    brickHouse1: {
      name: "Brick House",
      desc: "Kind of snooty",
      image: "locations_colored_2",
    },
    house1: {
      name: "House",
      desc: "A nice place to live",
      isInJournal: true,
      image: "house_1",
      validTileTypes: ["grassland"],
      validObjectOverrides: ["house1", "house2"],
      onOverride: ({ hex, neighbors, grid, game }) => {
        let houseLevel = parseInt(hex.objectType[hex.objectType.length - 1]);

        houseLevel += 1;

        switch (houseLevel) {
          case 3:
            hex.objectType = objects.house3.key;
            hex.objectImage = objects.house3.image;
            game.unlockItem("house3");
            break;
          case 2:
            hex.objectType = objects.house2.key;
            hex.objectImage = objects.house2.image;
            game.unlockItem("house2");
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
      isInJournal: true,
      image: "house_2",
      validTileTypes: ["grassland"],
    },
    house3: {
      name: "Village",
      desc: "Three's a crowd",
      isInJournal: true,
      image: "house_3",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        return [[pickRandomlyFromArray(HOUSE_3_OPTIONS), hex]];
      },
    },
    house4: {
      name: "Town",
      desc: "Bustling",
      isInJournal: true,
      image: "house_4",
      validTileTypes: ["grassland"],
    },
    mill: {
      name: "Mill",
      desc: "Farms the farms",
      isInJournal: true,
      image: "locations_colored_6",
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
      isInJournal: true,
      image: "locations_colored_12",
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
      isInJournal: true,
      image: "locations_colored_16",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid, game }) => {
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
              game.unlockItem("house4");
              break;
            case 3:
              house.objectType = objects.house3.key;
              house.objectImage = objects.house3.image;
              game.unlockItem("house3");
              newCards.push([pickRandomlyFromArray(HOUSE_3_OPTIONS), house]);
              break;
            case 2:
              house.objectType = objects.house2.key;
              house.objectImage = objects.house2.image;
              game.unlockItem("house2");
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
              game.unlockItem("witchHut");

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
    tracks: {
      name: "Tracks",
      desc: "Something was here",
      image: "icons_colored_11",
      isInJournal: true,
    },
    nest: {
      name: "Nest",
      desc: "Room for one more?",
      isInJournal: true,
      image: "locations_colored_20",
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
      desc: "Imitation is the sincerest form of flattery",
      isInJournal: true,
      image: "locations_colored_4",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const newObjects = [];

        neighbors.forEach((neighbor) => {
          if (neighbor.objectType !== undefined) {
            // Ensure an object of neighbor's type is not
            // already in the newObjects array.
            //
            // TODO: This still seems incredibly overpowered
            // right now!
            // ESPECIALLY: The way a quarry can directly copy
            // a house2, house3, or house4.
            // ESPECIALLY: The with the quantity of quarries a
            // mine can generate. It's a very odd feeling!
            // There's HELLA duping happening. This could be
            // an alright ability, but its feels so weirdly
            // distorting right now.
            if (
              newObjects.every(
                ([newObject]) => newObject !== neighbor.objectType
              )
            ) {
              newObjects.push([neighbor.objectType, neighbor]);
            }
          }
        });

        return newObjects;
      },
    },
    lighthouse: {
      name: "Lighthouse",
      desc: "Lights the way",
      isInJournal: true,
      image: "locations_colored_13",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const oceans = neighbors.filter((neighbor) =>
          neighbor.tileType?.includes("ocean")
        );

        const ships = oceans.map((ocean) => ["ship", ocean]);

        return ships;
      },
    },
    ship: {
      name: "Ship",
      desc: "Gathers fish",
      isInJournal: true,
      image: "locations_colored_28",
      validTileTypes: ["ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        // If a ship is placed on a wave, turn it into a
        // shipwreck and don't generate any other tiles.
        if (hex.tileType === "oceanWave") {
          hex.objectType = objects.shipwreck.key;
          hex.objectImage = objects.shipwreck.image;

          game.unlockItem("shipwreck");

          grid.set(hex, hex);
          return;
        }

        const fishes = neighbors.filter((neighbor) =>
          neighbor.objectType?.includes("fish")
        );

        if (fishes.length > 0) {
          game.unlockItem("fish3");
        }

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
      isInJournal: true,
      image: "locations_colored_29",
      validTileTypes: ["ocean", "oceanWave"],
    },
    cave: {
      name: "Seed",
      desc: "A rocky spore",
      isInJournal: true,
      image: "locations_colored_17",
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
      isInJournal: true,
      image: "locations_colored_18",
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );

        const newObjects = mountains.map(getDungeonRandomOutcome).flat();

        return [["church", hex], ...newObjects];
      },
    },
    grave: {
      name: "Grave",
      desc: "Rest in peace",
      isInJournal: true,
      image: "locations_colored_27",
      validTileTypes: ["grassland", "forest"],
    },
    skull: {
      name: "Curse",
      desc: "All things must pass",
      isInJournal: true,
      image: "icons_colored_4",
      validTileTypes: ["grassland", "forest"],
      validObjectOverrides: ["all"],
      notValidObjectOverrides: ["grave"],
      requireOverride: true,
      onOverride: ({ hex, neighbors, grid }) => {
        // Mine is special case handled in onPlace
        if (hex.objectType !== "mine") {
          hex.objectImage = objects.grave.image;
          hex.objectType = "grave";
        }

        grid.set(hex, hex);
      },
      onPlace: ({ hex, neighbors, grid }) => {
        let newObjects = [];

        if (hex.objectType === "mine") {
          hex.objectImage = objects.dungeon.image;
          hex.objectType = "dungeon";

          newObjects = getDungeonRandomOutcome(hex);
        }

        return newObjects;
      },
    },
    witchHut: {
      name: "Witch Hut",
      desc: "Not so friendly",
      isInJournal: true,
      image: "locations_colored_7",
      validTileTypes: ["forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        return [["skull", hex]];
      },
    },
    ruin: {
      name: "Ruin",
      desc: "No living soul remains",
      isInJournal: true,
      image: "locations_colored_24",
      validTileTypes: ["forest", "grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        // Does nothing on place right now
        return;
      },
    },
  })
);

export { objects, editObjects, objectImages };
