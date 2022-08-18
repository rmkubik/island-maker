import combineEntriesWithKeys from "../utils/combineEntriesWithKeys";

import * as locationImages from "../../assets/Locations 134x134/*.png";
import * as iconImages from "../../assets/Icons 134x134/*.png";
import * as resourceImages from "../../assets/resources/*.png";
import * as isleOfLore2Recolors from "../../assets/isle-of-lore-2-recolors/*.png";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import constructArray from "../utils/constructArray";
import { tilePaths } from "./tiles";
import getHouseLevel from "../utils/getHouseLevel";

const HOUSE_3_OPTIONS = ["inn", "church"];
const SHIP_3_OPTIONS = ["merchant", "pirate"];

const objectImages = {
  ...locationImages,
  ...iconImages,
  ...resourceImages,
  ...isleOfLore2Recolors,
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
      desc: "X marks the spot!",
      image: "icons_colored_3",
      validTileTypes: ["grassland"],
    },
    fish1: {
      name: "Fish",
      desc: "Swims in the sea",
      image: "fish_1",
      validTileTypes: ["ocean", "oceanWave"],
    },
    fish2: {
      name: "Fish",
      desc: "Swims in the sea",
      image: "fish_2",
      validTileTypes: ["ocean", "oceanWave"],
    },
    fish3: {
      name: "Fish",
      desc: "Swims in the sea",
      image: "fish_3",
      validTileTypes: ["ocean", "oceanWave"],
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
      desc: "Creates a forest",
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
      desc: "Gives a mill when placed on a forest",
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
      desc: "Harvests adjacent turnips",
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
      desc: "Mines adjacent mountains",
      isInJournal: true,
      image: "locations_colored_19",
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );
        const newQuarries = mountains.map((mountain, index) => {
          const newObjectType = index % 2 === 0 ? "cave" : "quarry";

          return [newObjectType, mountain];
        });

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
      desc: "Counts for 1 population",
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
      desc: "Counts for 2 population",
      isInJournal: true,
      image: "house_2",
      validTileTypes: ["grassland"],
    },
    house3: {
      name: "Village",
      desc: "Counts for 3 population",
      isInJournal: true,
      image: "house_3",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        return [[pickRandomlyFromArray(HOUSE_3_OPTIONS), hex]];
      },
    },
    house4: {
      name: "Town",
      desc: "Counts for 4 population",
      isInJournal: true,
      image: "house_4",
      validTileTypes: ["grassland"],
    },
    mill: {
      name: "Mill",
      desc: "Harvests adjacent farms",
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
      desc: "Gives a house for each adjacent house",
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
      desc: "Upgrades each adjacent house",
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
      desc: "Adds another bank slot",
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
      desc: "Copies adjacent buildings",
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
      desc: "Creates a ship for each adjacent ocean",
      isInJournal: true,
      image: "locations_colored_13",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        const oceans = neighbors.filter((neighbor) =>
          neighbor.tileType?.includes("ocean")
        );

        const ships = oceans.map((ocean) => ["ship1", ocean]);

        return ships;
      },
    },
    ship: {
      name: "Ship",
      desc: "Harvests adjacent fish",
      isInJournal: false,
      image: "locations_colored_28",
      validTileTypes: ["ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        console.log(
          "This is the old ship object. It shouldn't exist any more!"
        );
        return;
      },
    },
    ship1: {
      name: "Ship",
      desc: "Harvests adjacent fish",
      isInJournal: true,
      image: "ship_1",
      validTileTypes: ["ocean", "oceanWave"],
      validObjectOverrides: ["ship1", "ship2"],
      onOverride: ({ hex, neighbors, grid, game }) => {
        let shipLevel = parseInt(hex.objectType[hex.objectType.length - 1]);

        shipLevel += 1;

        switch (shipLevel) {
          case 3:
            hex.objectType = objects.ship3.key;
            hex.objectImage = objects.ship3.image;
            game.unlockItem("ship3");
            break;
          case 2:
            hex.objectType = objects.ship2.key;
            hex.objectImage = objects.ship2.image;
            game.unlockItem("ship2");
            break;
          default:
            break;
        }

        grid.set(hex, hex);
      },
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

        // Start counting fishes and creating houses
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

        let newCards = [];

        // Add a house for each adjacent fish
        newCards = fishes.map((fish) => ["house1", fish]);

        // Add a random card for each adjacent lighthouse
        const lighthouses = neighbors.filter((neighbor) =>
          neighbor.objectType?.includes("lighthouse")
        );

        const lightHouseOptions = ["plant", "camp"];

        lighthouses.forEach((lighthouse) => {
          newCards.push([pickRandomlyFromArray(lightHouseOptions), lighthouse]);
        });

        // Support ship stacking
        const shipLevel = parseInt(hex.objectType[hex.objectType.length - 1]);

        if (shipLevel === 3) {
          newCards.push([pickRandomlyFromArray(SHIP_3_OPTIONS), hex]);
        }

        return newCards;
      },
    },
    ship2: {
      name: "Flotilla",
      desc: "Harvests adjacent fish",
      isInJournal: true,
      image: "ship_2",
      validTileTypes: ["ocean", "oceanWave"],
    },
    ship3: {
      name: "Fleet",
      desc: "Harvests adjacent fish",
      isInJournal: true,
      image: "ship_3",
      validTileTypes: ["ocean", "oceanWave"],
    },
    ship4: {
      name: "Armada",
      desc: "Harvests adjacent fish",
      image: "ship_4",
      validTileTypes: ["ocean", "oceanWave"],
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
      desc: "Creates a mountain",
      isInJournal: true,
      image: "locations_colored_17",
      validTileTypes: ["grassland", "forest", "ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid }) => {
        switch (hex.tileType) {
          case "grassland":
          case "forest": {
            const tileTypeImages = tilePaths.mountain;
            const tileImage = pickRandomlyFromArray(tileTypeImages);

            hex.tileType = "mountain";
            hex.tileImage = tileImage;
            hex.objectImage = undefined;
            hex.objectType = undefined;
            break;
          }
          case "ocean":
          case "oceanWave": {
            const tileTypeImages = tilePaths.grassland;
            const tileImage = pickRandomlyFromArray(tileTypeImages);

            hex.tileType = "grassland";
            hex.tileImage = tileImage;
            hex.objectImage = undefined;
            hex.objectType = undefined;
            break;
          }
          default:
            console.error(
              `Invalid tileType "${hex.tileType}" for "cave" onPlace.`
            );
            break;
        }

        grid.set(hex, hex);
      },
    },
    dungeon: {
      name: "Dungeon",
      desc: "Creates graves and curses for each adjacent mountain",
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
      desc: "Turns target into a grave",
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
      desc: "Gives a curse",
      isInJournal: true,
      image: "locations_colored_7",
      validTileTypes: ["forest"],
      onPlace: ({ hex, neighbors, grid }) => {
        return [["skull", hex]];
      },
    },
    ruin: {
      name: "Ruin",
      desc: "Gives a curse when mined",
      isInJournal: true,
      image: "locations_colored_24",
      validTileTypes: ["forest", "grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        // Does nothing on place right now
        return;
      },
    },
    merchant: {
      name: "Merchant",
      desc: "Use resource on this to trade",
      isInJournal: true,
      image: "85_trading_ship-resize",
      validTileTypes: ["ocean", "oceanWave"],
      onTargeted: ({ hex, selected, neighbors, grid, game }) => {
        if (
          !selected.validTileTypes.includes("ocean") &&
          !selected.validTileTypes.includes("oceanWave")
        ) {
          // This means selected item is a "land" item
          return {
            skipPlacement: true,
            newCards: [["fish3", hex]],
          };
        }

        return {
          skipPlacement: false,
          newCards: [],
        };
      },
      onPlace: ({ hex, neighbors, grid }) => {
        const fleets = neighbors.filter(
          (neighbor) => neighbor.objectType === "ship3"
        );

        if (fleets.length > 0) {
          return ["key", hex];
        }
      },
    },
    pirate: {
      name: "Pirate",
      desc: "Sinks adjacent ships",
      isInJournal: true,
      image: "87_pirate_ship-resize",
      validTileTypes: ["ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid }) => {
        const ships = neighbors.filter(
          (neighbor) =>
            neighbor.objectType === "ship1" ||
            neighbor.objectType === "merchant"
        );

        ships.forEach((ship) => {
          ship.objectType = objects.shipwreck.key;
          ship.objectImage = objects.shipwreck.image;

          grid.set(ship, ship);
        });

        let newCards = [];

        const exes = neighbors.filter(
          (neighbor) => neighbor.objectType === "x"
        );
        exes.forEach((ex) => {
          ex.objectType = undefined;
          ex.objectImage = undefined;

          newCards.push(["treasure", ex]);
        });

        return newCards;
      },
    },
    kraken: {
      name: "Kraken",
      desc: "It looks hungry",
      isInJournal: true,
      image: "63_kraken-resize",
      validTileTypes: ["ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid }) => {
        // Does nothing on place right now
        return;
      },
    },
    treasure: {
      name: "Treasure",
      desc: "What's inside?",
      isInJournal: true,
      image: "icons_colored_18",
      validTileTypes: ["grassland", "forest"],
      onTargeted: ({ hex, selected, neighbors, grid, game }) => {
        console.log({ hex, selected });
        if (selected.key === "key") {
          hex.objectType = undefined;
          hex.objectImage = undefined;

          return { newCards: [["fishRelic", hex]], skipPlacement: true };
        }

        return { newCards: [], skipPlacement: false };
      },
    },
    key: {
      name: "Key",
      desc: "Opens something",
      isInJournal: true,
      image: "icons_colored_10",
      validTileTypes: ["grassland", "forest"],
    },
    fishRelic: {
      name: "Relic",
      desc: "Fish count as population",
      isInJournal: true,
      image: "locations_colored_23",
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        // Use game object to set fish as score?
        // Or maybe we just hard code this into
        // the score checking logic?
      },
    },
  })
);

export { objects, editObjects, objectImages };
