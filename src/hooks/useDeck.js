import { useEffect, useState } from "react";
import { objects } from "../data/locations";
import shuffle from "../utils/shuffle";

const useDeck = () => {
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    const unShuffledDeck = [
      // objects.dungeon,
      objects.camp,
      objects.camp,
      objects.mine,
      objects.mine,
      objects.farm,
      objects.farm,
    ];
    const initialDeck = shuffle(unShuffledDeck);

    setDeck(initialDeck);
  }, []);

  return { deck, setDeck };
};

export default useDeck;
