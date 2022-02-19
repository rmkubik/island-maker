import { useEffect, useState } from "react";
import { objects } from "../data/locations";
import shuffle from "../utils/shuffle";

const useDeck = () => {
  const [deck, setDeck] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const unShuffledDeck = [
      objects.camp,
      objects.camp,
      objects.mine,
      objects.mine,
      objects.farm,
      objects.farm,
    ];
    const initialDeck = shuffle(unShuffledDeck);

    const initialSelected = initialDeck.shift();

    setDeck(initialDeck);
    setSelected(initialSelected);
  }, []);

  return { deck, setDeck, selected, setSelected };
};

export default useDeck;
