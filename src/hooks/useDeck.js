import { useEffect, useState } from "react";
import { locations } from "../data/locations";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import shuffle from "../utils/shuffle";

const useDeck = () => {
  const [deck, setDeck] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // const initialDeck = new Array(20).fill().map(() => {
    //   const locationTypes = Object.values(locations);

    //   return pickRandomlyFromArray(locationTypes);
    // });
    //.map(() => locations.house.image);
    // .map(() => pickRandomlyFromArray(Object.values(locationImages)));

    const unShuffledDeck = [
      locations.camp,
      locations.camp,
      locations.mine,
      locations.mine,
      locations.farm,
      locations.farm,
    ];
    const initialDeck = shuffle(unShuffledDeck);

    const initialSelected = initialDeck.shift();

    setDeck(initialDeck);
    setSelected(initialSelected);
  }, []);

  return { deck, setDeck, selected, setSelected };
};

export default useDeck;
