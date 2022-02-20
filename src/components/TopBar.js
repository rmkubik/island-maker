import React from "react";
import { objects } from "../data/locations";
import constructArray from "../utils/constructArray";
import countPopulation from "../utils/countPopulation";
import update from "../utils/update";

const TopBar = ({
  selected,
  setSelected,
  deck,
  setDeck,
  banked,
  setBanked,
  grid,
  previewCount,
}) => {
  let preview = deck.slice(0, previewCount);
  const missingPreviewCount = previewCount - preview.length;

  if (missingPreviewCount > 0) {
    preview = [
      ...preview,
      ...constructArray(() => objects.x, missingPreviewCount),
    ];
  }

  return (
    <div
      className="topbar"
      style={{
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        zIndex: 10000,
      }}
    >
      <div>
        <p>Current: </p>
        <img src={selected ? selected.image : objects.x.image} />
      </div>
      <div>
        <p>Next:</p>
        {preview.map((item, index) => (
          <img key={index} src={item.image} />
        ))}
      </div>
      <div>
        <p>Deck:</p>
        <p>{deck.length}</p>
      </div>
      <div>
        <p>Bank:</p>
        {banked.map((bankedObject, index) => (
          <button
            style={{
              background: "none",
              border: "6px solid white",
              borderRadius: "6px",
              padding: 0,
              margin: 0,
            }}
            key={index}
            onClick={(e) => {
              e.stopPropagation();

              switch (true) {
                case Boolean(selected && bankedObject.key === "x"): {
                  const newBanked = update(banked, index, selected);
                  setBanked(newBanked);

                  const [newSelected, ...newDeck] = deck;

                  setDeck(newDeck);
                  setSelected(newSelected);
                  return;
                }
                case Boolean(selected && bankedObject.key !== "x"): {
                  const newBanked = update(banked, index, selected);
                  setBanked(newBanked);

                  setSelected(banked[index]);
                  return;
                }
                case Boolean(!selected && bankedObject.key !== "x"): {
                  const newBanked = update(banked, index, objects.x);
                  setBanked(newBanked);

                  setSelected(banked[index]);
                  return;
                }
                default:
                  return;
              }
            }}
          >
            <img src={bankedObject.image} />
          </button>
        ))}
      </div>
      <div>
        <p>Population:</p>
        <p>{grid ? countPopulation(grid) : 0}</p>
      </div>
    </div>
  );
};

export default TopBar;
