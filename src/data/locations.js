import combineEntriesWithKeys from "../utils/combineEntriesWithKeys";

import * as locationImages from "../../assets/Locations 134x134/*.png";
import * as iconImages from "../../assets/Icons 134x134/*.png";
import * as resourceImages from "../../assets/resources/*.png";
import * as isleOfLore2Recolors from "../../assets/isle-of-lore-2-recolors/*.png";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import constructArray from "../utils/constructArray";
import { tilePaths } from "./tiles";
import getHouseLevel from "../utils/getHouseLevel";
import clamp from "../utils/clamp";
import createPickRandomlyFromArrayRigged from "../utils/createPickRandomlyFromArrayRigged";

const HOUSE_3_OPTIONS = ["inn", "church"];
const SHIP_3_OPTIONS = ["merchant", "pirate"];

const pickHouse3Outcome = createPickRandomlyFromArrayRigged(3);
const pickShip3Outcome = createPickRandomlyFromArrayRigged(3);
const pickShipLighthouseOutcome = createPickRandomlyFromArrayRigged(3);

const objectImages = {
  ...locationImages,
  ...iconImages,
  ...resourceImages,
  ...isleOfLore2Recolors,
};

const pickDungeonOutcome = createPickRandomlyFromArrayRigged(3);

function getDungeonRandomOutcome(hex) {
  const options = ["grave", "skull"];

  return [
    [pickDungeonOutcome(options), hex],
    [pickDungeonOutcome(options), hex],
    [pickDungeonOutcome(options), hex],
  ];
}

function harvestFish({ neighbors, grid, game }) {
  const fishes = neighbors.filter((neighbor) =>
    neighbor.objectType?.includes("fish")
  );

  if (fishes.length > 0) {
    game.unlockItem("fish3");
    game.unlockRule("fish3", "harvest");
    game.unlockRule("ship1", "fish");
    game.unlockRule("ship2", "fish");
    game.unlockRule("ship3", "fish");
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
  return fishes.map((fish) => ["house1", fish]);
}

function resupplyLighthouses({ hex, neighbors, game }) {
  const lighthouses = neighbors.filter((neighbor) =>
    neighbor.objectType?.includes("lighthouse")
  );

  if (lighthouses.length > 0) {
    game.unlockRule("lighthouse", "resupply");
    game.unlockRule("ship1", "resupply");
    game.unlockRule("ship2", "resupply");
    game.unlockRule("ship3", "resupply");
  }

  const lightHouseOptions = ["plant", "camp"];

  return lighthouses.map((lighthouse) => {
    return [pickShipLighthouseOutcome(lightHouseOptions), lighthouse];
  });
}

function stackShips({ hex, game }) {
  const shipLevel = parseInt(hex.objectType[hex.objectType.length - 1]);

  if (shipLevel === 3) {
    game.unlockRule("ship3", "stack3");

    return [pickShip3Outcome(SHIP_3_OPTIONS), hex];
  }

  return [];
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
      lore: "Old sailors whisper that fish are the true chosen of The Salt.",
      rules: {
        harvest: {
          hidden: true,
          desc: "Ships placed adjacent to a Fish give 1 House",
        },
        pop: {
          hidden: true,
          desc: "When the Tooth is placed in the world, Fish count as population",
        },
      },
      image: "fish_3",
      validTileTypes: ["ocean", "oceanWave"],
      isInJournal: true,
    },
    turnip1: {
      name: "Turnip",
      desc: "Grows in the ground",
      image: "turnip_1",
      validTileTypes: ["grassland"],
    },
    turnip2: {
      name: "Turnip",
      desc: "Grows in the ground",
      image: "turnip_2",
      validTileTypes: ["grassland"],
    },
    turnip3: {
      name: "Turnip",
      desc: "Grows in the ground",
      lore: "The last gift of The Loam before they left the world behind.",
      rules: {
        harvest: {
          hidden: true,
          desc: "Farms placed adjacent to a Turnip give 1 House",
        },
      },
      image: "turnip_3",
      validTileTypes: ["grassland"],
      isInJournal: true,
    },
    plant: {
      name: "Grow",
      desc: "The trees will rise",
      lore: "Some power left behind by The Loam can be wielded by man.",
      rules: {
        forest: {
          hidden: false,
          desc: "Creates a Forest in an empty hex.",
        },
        witch: {
          hidden: true,
          desc: "When used on a House, turns it into a Witch Hut.",
        },
      },
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

        game.unlockRule("plant", "forest");

        switch (hex.objectType) {
          case "house1":
            hex.objectImage = objects.witchHut.image;
            hex.objectType = "witchHut";
            game.unlockItem("witchHut");
            game.unlockRule("plant", "witch");

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
      desc: "Hunts in the forest",
      lore: "The forests can serve Agriculture too.",
      rules: {
        mill: { hidden: false, desc: "Gives a Mill when placed on a Forest." },
        chop: {
          hidden: true,
          desc: "Clears adjacent Forests when placed on a Grassland.",
        },
        turnip: {
          hidden: true,
          desc: "If an object in the Forest is cleared, it becomes a Turnip.",
        },
        tracks: {
          hidden: true,
          desc: "Produces a Nest when placed next to Tracks.",
        },
      },
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
              game.unlockRule("camp", "tracks");
              game.unlockRule("tracks", "tracks");
              game.unlockItem("tracks");
            }

            const nests = tracks.map((track) => {
              track.objectType = undefined;
              track.objectImage = undefined;

              grid.set(track, track);

              return ["nest", track];
            });

            game.unlockRule("camp", "mill");

            return [...nests, ["mill", hex]];
          }
          case "grassland": {
            const adjacentForests = neighbors.filter(
              (neighbor) => neighbor.tileType === "forest"
            );

            adjacentForests.forEach((forest) => {
              const tileTypeImages = tilePaths.grassland;
              const tileImage = pickRandomlyFromArray(tileTypeImages);

              if (forest.objectType) {
                game.unlockRule("camp", "turnip");
                forest.objectType = objects.turnip3.key;
                forest.objectImage = objects.turnip3.image;
              }

              forest.tileType = "grassland";
              forest.tileImage = tileImage;

              game.unlockRule("camp", "chop");

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
      lore: "Agriculture - the study of The Loam's gifts.",
      rules: {
        harvest: "Gives a House when placed next to a Turnip.",
        mill: {
          hidden: true,
          desc: "When Mill is placed adjacent to a Farm, Mill gives a Farm.",
        },
      },
      isInJournal: true,
      image: "locations_colored_5",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        const turnips = neighbors.filter((neighbor) =>
          neighbor.objectType?.includes("turnip")
        );

        if (turnips.length > 0) {
          game.unlockItem("turnip3");
          game.unlockRule("turnip3", "harvest");
          game.unlockRule("farm", "harvest");
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
      desc: "Extracts from adjacent mountains",
      lore: "Fragments of The Loam's body can create impressive replicas.",
      rules: {
        gatherOdd: "Gives a Rock Shard when placed next to a Mountain.",
        gatherEven: {
          hidden: true,
          desc: "Gives a Quarry for every other Mountain adjacent on place, after the first one.",
        },
        gatherRuin: {
          hidden: true,
          desc: "Gives a Curse when placed next to a Ruin.",
        },
      },
      isInJournal: true,
      image: "locations_colored_19",
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );
        const newQuarries = mountains.map((mountain, index) => {
          const newObjectType = index % 2 === 0 ? "cave" : "quarry";

          return [newObjectType, mountain];
        });

        if (newQuarries.length >= 1) {
          game.unlockRule("mine", "gatherOdd");
        }

        if (newQuarries.length >= 2) {
          game.unlockRule("mine", "gatherEven");
        }

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

          game.unlockRule("mine", "gatherRuin");

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
      lore: "Even if the world is dying, people still need a place to live.",
      rules: {
        pop1: "Counts for 1 population.",
        stack: { hidden: true, desc: "Can be stacked on other Houses." },
        stack3: {
          hidden: true,
          desc: "Gives a random Inn or Church when stacked to 3.",
        },
      },
      isInJournal: true,
      image: "house_1",
      validTileTypes: ["grassland"],
      validObjectOverrides: ["house1", "house2"],
      onOverride: ({ hex, neighbors, grid, game }) => {
        let houseLevel = parseInt(hex.objectType[hex.objectType.length - 1]);

        houseLevel += 1;

        game.unlockRule("house1", "pop1");

        switch (houseLevel) {
          case 3:
            hex.objectType = objects.house3.key;
            hex.objectImage = objects.house3.image;
            game.unlockRule("house1", "stack3");
            game.unlockRule("house3", "stack3");
            game.unlockItem("house3");
            break;
          case 2:
            hex.objectType = objects.house2.key;
            hex.objectImage = objects.house2.image;
            game.unlockRule("house1", "stack");
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
          return [[pickHouse3Outcome(HOUSE_3_OPTIONS), hex]];
        }
      },
    },
    house2: {
      name: "Hamlet",
      desc: "Two is company",
      lore: "There is safety in numbers.",
      rules: {
        pop2: "Counts for 2 population.",
      },
      isInJournal: true,
      image: "house_2",
      validTileTypes: ["grassland"],
    },
    house3: {
      name: "Village",
      desc: "Three's a crowd",
      lore: "People need more than just shelter.",
      rules: {
        pop3: "Counts for 3 population.",
        stack3: {
          hidden: true,
          desc: "Gives a random Inn or Church when stacked to 3.",
        },
      },
      isInJournal: true,
      image: "house_3",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid }) => {
        return [[pickHouse3Outcome(HOUSE_3_OPTIONS), hex]];
      },
    },
    house4: {
      name: "Town",
      desc: "Bustling",
      lore: "Belief, even in false gods, can accomplish impressive things.",
      rules: {
        pop4: "Counts for 4 population",
      },
      isInJournal: true,
      image: "house_4",
      validTileTypes: ["grassland"],
    },
    mill: {
      name: "Mill",
      desc: "Farms the farms",
      lore: "Larger settlements require more and more food to sustain.",
      rules: {
        farm: "Gives a Farm for each adjacent Farm",
      },
      isInJournal: true,
      image: "locations_colored_6",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        const farms = neighbors.filter(
          (neighbor) => neighbor.objectType === "farm"
        );

        const newFarms = farms.map((farm) => ["farm", farm]);

        if (newFarms.length > 1) {
          game.unlockRule("farm", "mill");
          game.unlockRule("mill", "farm");
        }

        return newFarms;
      },
    },
    inn: {
      name: "Inn",
      desc: "Gives adjacent homes happiness",
      lore: "Religion does not satisfy all of man's needs.",
      rules: {
        house: "Gives a House for each adjacent hex with Houses.",
      },
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
      desc: "Brings adjacent homes faith",
      lore: "Man never knew the old gods, so they concoct their own.",
      rules: {
        upgradeHouse: "Upgrades each adjacent house.",
        upgradeHouse4: {
          hidden: true,
          desc: "Upgrades a Village to a Town, beyond the normal stack max.",
        },
        resurrect: {
          hidden: true,
          desc: "Adjacent Graves turn into Houses.",
        },
        resurrectWitch: {
          hidden: true,
          desc: "Adjacent Graves on a Forest turn into Witch Huts.",
        },
      },
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
              game.unlockRule("church", "upgradeHouse4");
              game.unlockItem("house4");
              break;
            case 3:
              house.objectType = objects.house3.key;
              house.objectImage = objects.house3.image;
              game.unlockItem("house3");
              newCards.push([pickHouse3Outcome(HOUSE_3_OPTIONS), house]);
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
              game.unlockRule("church", "resurrectWitch");

              newCards.push(["skull", grave]);
              break;
            case "grassland":
            default:
              grave.objectType = "house1";
              grave.objectImage = objects.house1.image;
              game.unlockRule("church", "resurrect");
              game.unlockRule("grave", "church");
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
      lore: "People claim the grassland, but something else claims the forest.",
      validTileTypes: ["forest"],
      rules: {
        tracks: {
          hidden: true,
          desc: "Produces a Nest when a Camp is placed adjacent.",
        },
      },
      isInJournal: true,
    },
    nest: {
      name: "Nest",
      desc: "Room for one more?",
      lore: "People are not alone after the gods died.",
      rules: {
        storage: "Gives you another bank slot.",
      },
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
      name: "Sculptor",
      desc: "Fashions a copy of adjacent buildings",
      lore: "With enough practice, fragments of The Loam's body can be shaped.",
      rules: {
        copy: "Gives a copy of each type of adjacent buildings.",
      },
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
      desc: "Lights the way across the seas",
      lore: "After conquering the land, people turned toward The Salt's domain.",
      rules: {
        shipBuilder: "Gives a Ship for each adjacent Ocean.",
        resupply: {
          hidden: true,
          desc: "Placing a Ship adjacent gives a random Camp or Grow",
        },
      },
      isInJournal: true,
      image: "locations_colored_13",
      validTileTypes: ["grassland"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        const oceans = neighbors.filter((neighbor) =>
          neighbor.tileType?.includes("ocean")
        );

        game.unlockRule("lighthouse", "shipBuilder");

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
        console.warn(
          "This is the old ship object. It shouldn't exist any more!"
        );
        return;
      },
    },
    ship1: {
      name: "Ship",
      desc: "Harvests adjacent fish",
      lore: "It can be dangerous to sail the seas alone.",
      rules: {
        fish: "Gives a House when placed adjacent to Fish.",
        wreck: {
          hidden: true,
          desc: "Turns into a Shipwreck when placed on an Ocean with Waves.",
        },
        resupply: {
          hidden: true,
          desc: "Gives a Camp or Grow when placed adjacent to a Lighthouse.",
        },
        stack: { hidden: true, desc: "Can be stacked on other Ships." },
        stack3: {
          hidden: true,
          desc: "Gives a random Merchant or Pirate when stacked to 3.",
        },
      },
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
            game.unlockRule("ship1", "stack3");
            game.unlockItem("ship3");
            break;
          case 2:
            hex.objectType = objects.ship2.key;
            hex.objectImage = objects.ship2.image;
            game.unlockRule("ship1", "stack");
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

          game.unlockRule("ship1", "wreck");
          game.unlockItem("shipwreck");

          grid.set(hex, hex);
          return;
        }

        let newCards = [];
        // Start counting fishes and creating houses
        newCards.push(...harvestFish({ neighbors, grid, game }));

        // Add a random card for each adjacent lighthouse
        newCards.push(...resupplyLighthouses({ hex, neighbors, game }));

        // Support ship stacking
        newCards.push(...stackShips({ hex, game }));

        return newCards;
      },
    },
    ship2: {
      name: "Flotilla",
      desc: "Harvests adjacent fish",
      lore: "Grouping with other ships offers additional protection.",
      rules: {
        fish: "Gives a House when placed adjacent to Fish.",
        resupply: {
          hidden: true,
          desc: "Gives a Camp or Grow when placed adjacent to a Lighthouse.",
        },
      },
      isInJournal: true,
      image: "ship_2",
      validTileTypes: ["ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        let newCards = [];

        // Start counting fishes and creating houses
        newCards.push(...harvestFish({ neighbors, grid, game }));

        // Add a random card for each adjacent lighthouse
        newCards.push(...resupplyLighthouses({ hex, neighbors, game }));

        return newCards;
      },
    },
    ship3: {
      name: "Fleet",
      desc: "Harvests adjacent fish",
      lore: "As the seas get busier more specialized vessels are required.",
      rules: {
        fish: "Gives a House when placed adjacent to Fish.",
        resupply: {
          hidden: true,
          desc: "Gives a Camp or Grow when placed adjacent to a Lighthouse.",
        },
        stack3: {
          hidden: true,
          desc: "Gives a random Merchant or Pirate when placed.",
        },
      },
      isInJournal: true,
      image: "ship_3",
      validTileTypes: ["ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        let newCards = [];

        // Start counting fishes and creating houses
        newCards.push(...harvestFish({ neighbors, grid, game }));

        // Add a random card for each adjacent lighthouse
        newCards.push(...resupplyLighthouses({ hex, neighbors, game }));

        // Support ship stacking
        newCards.push(...stackShips({ hex, game }));

        return newCards;
      },
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
      lore: "It is unknown how many sailors lie beneath The Salt.",
      rules: {},
      isInJournal: true,
      image: "locations_colored_29",
      validTileTypes: ["ocean", "oceanWave"],
    },
    cave: {
      name: "Rock Shard",
      desc: "Creates rock where there is none",
      lore: "A fragment of The Loam's body twinkling with possibility.",
      rules: {
        mountain: "Creates a Mountain.",
        island: {
          hidden: true,
          desc: "Creates a Grassland when used on an Ocean.",
        },
        islandShipWreck: {
          hidden: true,
          desc: "Creates a Shipwreck on Grassland when used on a Ship, Merchant, or Pirate.",
        },
      },
      isInJournal: true,
      image: "locations_colored_17",
      validTileTypes: ["grassland", "forest", "ocean", "oceanWave"],
      validObjectOverrides: ["ship1", "merchant", "pirate"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        switch (hex.tileType) {
          case "grassland":
          case "forest": {
            const tileTypeImages = tilePaths.mountain;
            const tileImage = pickRandomlyFromArray(tileTypeImages);

            hex.tileType = "mountain";
            hex.tileImage = tileImage;
            hex.objectImage = undefined;
            hex.objectType = undefined;

            game.unlockRule("cave", "mountain");
            break;
          }
          case "ocean":
          case "oceanWave": {
            const tileTypeImages = tilePaths.grassland;
            const tileImage = pickRandomlyFromArray(tileTypeImages);

            hex.tileType = "grassland";
            hex.tileImage = tileImage;

            if (
              hex.objectType === "ship1" ||
              hex.objectType === "merchant" ||
              hex.objectType === "pirate"
            ) {
              game.unlockRule("cave", "islandShipWreck");

              hex.objectImage = objects.shipwreck.image;
              hex.objectType = "shipwreck";
            } else {
              hex.objectImage = undefined;
              hex.objectType = undefined;
            }

            game.unlockRule("cave", "island");
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
      desc: "Danger comes from the mountains",
      lore: "The body of a dead god produces dangerous things.",
      rules: {
        church: "Gives a Church when placed.",
        graves:
          "Gives 3 of an assortment of Graves and Curses per adjacent Mountain.",
      },
      isInJournal: true,
      image: "locations_colored_18",
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        const mountains = neighbors.filter(
          (neighbor) => neighbor.tileType === "mountain"
        );

        const newObjects = mountains.map(getDungeonRandomOutcome).flat();

        game.unlockRule("dungeon", "church");
        game.unlockRule("dungeon", "graves");

        return [["church", hex], ...newObjects];
      },
    },
    grave: {
      name: "Grave",
      desc: "Rest in peace",
      lore: "The dead will become part of The Loam's body in time.",
      rules: {
        church: {
          hidden: true,
          desc: "When a Church is placed adjacent, Grave is converted into a House.",
        },
      },
      isInJournal: true,
      image: "locations_colored_27",
      validTileTypes: ["grassland", "forest"],
    },
    skull: {
      name: "Curse",
      desc: "All things must pass",
      lore: "There is power in defiling The Loam's body.",
      rules: {
        grave: "Turns target into a Grave.",
        dungeon: { hidden: true, desc: "Turns a Mine into a Dungeon." },
      },
      isInJournal: true,
      image: "icons_colored_4",
      validTileTypes: ["grassland", "forest"],
      validObjectOverrides: ["all"],
      notValidObjectOverrides: ["grave"],
      requireOverride: true,
      onOverride: ({ hex, neighbors, grid, game }) => {
        // Mine is special case handled in onPlace
        // because it needs to grant the player cards
        if (hex.objectType !== "mine") {
          hex.objectImage = objects.grave.image;
          hex.objectType = "grave";

          game.unlockRule("skull", "grave");
        }

        grid.set(hex, hex);
      },
      onPlace: ({ hex, neighbors, grid, game }) => {
        let newObjects = [];

        if (hex.objectType === "mine") {
          hex.objectImage = objects.dungeon.image;
          hex.objectType = "dungeon";

          game.unlockRule("skull", "dungeon");
          newObjects = getDungeonRandomOutcome(hex);
        }

        return newObjects;
      },
    },
    witchHut: {
      name: "Witch Hut",
      desc: "Not so friendly",
      lore: "The Loam's body can be used to destroy as well as create.",
      rules: {
        curse: "Gives a Curse.",
      },
      isInJournal: true,
      image: "locations_colored_7",
      validTileTypes: ["forest"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        game.unlockRule("witchHut", "curse");

        return [["skull", hex]];
      },
    },
    ruin: {
      name: "Ruin",
      desc: "Contains a trace of deadly power",
      lore: "Old ruins from before the gods died contain traces of their power.",
      rules: {
        curse: "Gives a Curse when mined.",
      },
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
      desc: "Trades for fish",
      lore: "Mercantilism rules the waves.",
      rules: {
        trade: "Use a land-bound object on the Merchant to trade for a Fish.",
        fishLevel: {
          hidden: true,
          desc: "Traded Fish will be higher quantity per Merchant, up to 3.",
        },
        key: {
          hidden: true,
          desc: "Gives a Key when placed next to a Fleet.",
        },
      },
      isInJournal: true,
      image: "85_trading_ship-resize",
      validTileTypes: ["ocean", "oceanWave"],
      onTargeted: ({ hex, selected, neighbors, grid, game }) => {
        const merchants = grid.filter((hex) => hex.objectType === "merchant");
        const merchantCount = merchants.length;

        if (
          !selected.validTileTypes.includes("ocean") &&
          !selected.validTileTypes.includes("oceanWave")
        ) {
          game.unlockRule("merchant", "trade");
          // This means selected item is a "land" item

          if (merchantCount > 1) {
            game.unlockRule("merchant", "fishLevel");
          }

          // TODO: This should maybe support greater than 3 fish count
          // in the future?
          const newFishKey = `fish${clamp(merchantCount, 1, 3)}`;

          return {
            skipPlacement: true,
            newCards: [[newFishKey, hex]],
          };
        }

        return {
          skipPlacement: false,
          newCards: [],
        };
      },
      onPlace: ({ hex, neighbors, grid, game }) => {
        const fleets = neighbors.filter(
          (neighbor) => neighbor.objectType === "ship3"
        );

        if (fleets.length > 0) {
          game.unlockRule("merchant", "key");

          return ["key", hex];
        }
      },
    },
    pirate: {
      name: "Pirate",
      desc: "Sinks adjacent lone ships",
      lore: "Unprotected riches are just asking to be plundered.",
      rules: {
        sinkShip: "Turns adjacent lone Ships into Shipwrecks when placed.",
        plunderShip: {
          hidden: true,
          desc: "Plunders a Lighthouse from sinking a Ship.",
        },
        plunderMerchant: {
          hidden: true,
          desc: "Plunders a Bounce from sinking a Merchant.",
        },
        xMark: {
          hidden: true,
          desc: "Gives a Treasure when placed next to an X Mark.",
        },
      },
      isInJournal: true,
      image: "87_pirate_ship-resize",
      validTileTypes: ["ocean", "oceanWave"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        const sinkShip = (ship) => {
          ship.objectType = objects.shipwreck.key;
          ship.objectImage = objects.shipwreck.image;

          game.unlockRule("pirate", "sinkShip");

          grid.set(ship, ship);
        };

        let newCards = [];

        const ships = neighbors.filter(
          (neighbor) => neighbor.objectType === "ship1"
        );
        ships.forEach((ship) => {
          sinkShip(ship);
          game.unlockRule("pirate", "plunderShip");
          newCards.push(["lighthouse", ship]);
        });

        const merchants = neighbors.filter(
          (neighbor) => neighbor.objectType === "merchant"
        );
        merchants.forEach((merchant) => {
          sinkShip(merchant);
          game.unlockRule("pirate", "plunderMerchant");
          newCards.push(["bounce", merchant]);
        });

        const exes = neighbors.filter(
          (neighbor) => neighbor.objectType === "x"
        );
        exes.forEach((ex) => {
          ex.objectType = undefined;
          ex.objectImage = undefined;

          game.unlockRule("pirate", "xMark");

          newCards.push(["treasure", ex]);
        });

        return newCards;
      },
    },
    kraken: {
      name: "Kraken",
      desc: "It looks hungry",
      isInJournal: false,
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
      lore: "An ancient chest that appears to date back from before the gods died.",
      rules: {
        unlock: {
          hidden: true,
          desc: "Gives Sal's Tooth when opened by using a Key on the Treasure.",
        },
      },
      isInJournal: true,
      image: "icons_colored_18",
      validTileTypes: ["grassland", "forest"],
      onTargeted: ({ hex, selected, neighbors, grid, game }) => {
        if (selected.key === "key") {
          hex.objectType = undefined;
          hex.objectImage = undefined;

          game.unlockRule("treasure", "unlock");
          game.unlockRule("key", "unlock");

          return { newCards: [["fishRelic", hex]], skipPlacement: true };
        }

        return { newCards: [], skipPlacement: false };
      },
    },
    key: {
      name: "Key",
      desc: "Opens something",
      lore: "An ancient corroded key that appears to have tooth marks on it.",
      rules: {
        unlock: {
          hidden: true,
          desc: "Gives The Salt's Tooth when used on a Treasure.",
        },
      },
      isInJournal: true,
      image: "icons_colored_10",
      validTileTypes: ["grassland", "forest"],
    },
    fishRelic: {
      name: "The Salt's Tooth",
      desc: "The chosen ones will reign",
      lore: "An enormous tooth fallen from The Salt's maw. It radiates an ominous energy.",
      rules: {
        chosenOnes:
          "Fish count as population while The Salt's Tooth is placed.",
      },
      isInJournal: true,
      image: "locations_colored_23",
      validTileTypes: ["grassland", "forest"],
      onPlace: ({ hex, neighbors, grid, game }) => {
        // Use game object to set fish as score?
        // Or maybe we just hard code this into
        // the score checking logic?
        game.unlockRule("fishRelic", "chosenOnes");
        game.unlockRule("fish3", "pop");
      },
    },
    bounce: {
      name: "Bounce",
      desc: "Shifts the target's location",
      lore: "Merchants have learned interesting secrets while out in the waves.",
      rules: {
        bounce: "Returns targeted object to your deck.",
      },
      isInJournal: true,
      image: "bounce-icon",
      validTileTypes: ["grassland", "forest", "ocean", "oceanWave"],
      validObjectOverrides: ["all"],
      requireOverride: true,
      onPlace: ({ hex, neighbors, grid, game }) => {
        // This happens in onPlace instead of onOverride
        // because we need to generate a card.
        const cardType = hex.objectType;

        hex.objectImage = undefined;
        hex.objectType = undefined;

        game.unlockRule("bounce", "bounce");

        grid.set(hex, hex);

        return [cardType, hex];
      },
    },
  })
);

export { objects, editObjects, objectImages };
