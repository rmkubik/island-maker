import { useEffect, useState } from "react";
import { objects } from "../data/locations";
import getNextId from "../utils/getNextId";
import shuffle from "../utils/shuffle";

const useDeck = () => {
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    const unShuffledDeck = [
      objects.grave,
      objects.church,
      // objects.camp,
      // objects.camp,
      // objects.mine,
      // objects.mine,
      // objects.farm,
      // objects.farm,
    ];
    const initialDeck = shuffle(unShuffledDeck);
    const initialDeckWithIds = initialDeck.map((card) => {
      return { ...card, id: getNextId() };
    });

    setDeck(initialDeckWithIds);
  }, []);

  return { deck, setDeck };
};

export default useDeck;
