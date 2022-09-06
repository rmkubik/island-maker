import React from "react";
import Menu from "./Menu";
import { objectImages, objects } from "../data/locations";
import { tileNames } from "../data/tiles";
import constructArray from "../utils/constructArray";
import joinWithOxfordComma from "../utils/joinWithOxfordComma";

const JournalEntryItem = ({ onBack, object }) => {
  const validTileTypeNames = object.validTileTypes.map(
    (tileType) => tileNames[tileType]
  );
  const validTileTypeRuleText = joinWithOxfordComma(validTileTypeNames);

  return (
    <div
      style={{
        flex: "1",
        marginLeft: "2rem",
        marginRight: "2rem",
        marginTop: "3rem",
        marginBottom: "3rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <img
          style={{
            marginRight: "1rem",
          }}
          src={objectImages[object.image]}
        />
        <div
          style={{
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontSize: "2.3rem",
            }}
          >
            {object.name}
          </h2>
          <p
            style={{
              fontSize: "1.75rem",
            }}
          >
            {object.lore ?? object.desc}
          </p>
        </div>
      </div>
      {object.rules && Object.keys(object.rules).length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              flex: "1",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                fontSize: "2rem",
                marginBottom: "1rem",
              }}
            >
              Rules
            </h3>
            <ul
              style={{
                fontSize: "1.75rem",
                marginTop: "1rem",
              }}
            >
              <li>{`Placeable on ${validTileTypeRuleText}.`}</li>
              {Object.entries(object.rules).map(([key, rule], index) => {
                const desc = typeof rule === "string" ? rule : rule.desc;

                // TODO: Check if rule has been unlocked yet
                if (rule.hidden) {
                  return <li key={object.key + index}>???</li>;
                }

                return <li key={object.key + index}>{desc}</li>;
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntryItem;
