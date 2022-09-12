import React, { useState } from "react";
import Menu from "./Menu";
import { objectImages, objects } from "../data/locations";
import constructArray from "../utils/constructArray";
import JournalEntryItem from "./JournalEntryItem";
import JournalEntryList from "./JournalEntryList";

const JournalMenu = ({ setView, isUnlocked }) => {
  const [selectedObject, setSelectedObject] = useState();

  const objectsInJournal = Object.values(objects).filter(
    (object) => object.isInJournal
  );

  return (
    <Menu maxWidth="1200px" maxHeight="80%">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "inherit",
          maxWidth: "inherit",
        }}
      >
        <JournalEntryList
          objectsInJournal={objectsInJournal}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          isUnlocked={isUnlocked}
          onBack={() => {
            setView("none");
          }}
        />
        {selectedObject && (
          <JournalEntryItem
            object={selectedObject}
            isUnlocked={isUnlocked}
            onBack={() => setSelectedObject()}
          />
        )}
        <button
          style={{
            padding: "16px 32px",
            borderRadius: "8px",
            fontSize: "1.25em",
            cursor: "pointer",
            marginRight: "8px",
            marginTop: "64px",
          }}
          onClick={() => {
            setView("none");
          }}
        >
          Back
        </button>
      </div>
    </Menu>
  );
};

export default JournalMenu;
