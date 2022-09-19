import { useEffect, useState } from "react";
import { GAME_MODE_OPTIONS } from "../data/config";
import { editObjects, objects } from "../data/locations";
import getNextId from "../utils/getNextId";
import shuffle from "../utils/shuffle";

const defaultDeck = [
  objects.camp,
  objects.camp,
  objects.mine,
  objects.mine,
  objects.farm,
  objects.farm,
  objects.lighthouse,
  objects.lighthouse,
];

const useDeck = ({ gameMode, initialDeck: unShuffledDeck = defaultDeck }) => {
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    let initialDeckWithIds;

    switch (gameMode) {
      default:
      case GAME_MODE_OPTIONS.SEEDED: {
        const initialDeck = shuffle(unShuffledDeck);

        initialDeckWithIds = initialDeck.map((card) => {
          return { ...card, id: getNextId() };
        });

        break;
      }
      case GAME_MODE_OPTIONS.EDITOR: {
        const initialDeck = Object.values(objects).filter(
          (object) => object.name && object.desc
        );
        const initialDeckWithEditObjects = [
          ...Object.values(editObjects),
          ...initialDeck,
        ];

        initialDeckWithIds = initialDeckWithEditObjects.map((card) => {
          return { ...card, id: getNextId() };
        });
        break;
      }
    }

    setDeck(initialDeckWithIds);
  }, [gameMode]);

  return { deck, setDeck };
};

export default useDeck;
