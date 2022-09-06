import React, { useState } from "react";
import Menu from "./Menu";
import { objectImages, objects } from "../data/locations";
import constructArray from "../utils/constructArray";

const JournalEntryList = ({
  objectsInJournal,
  selectedObject,
  setSelectedObject,
  isUnlocked,
  onBack,
}) => {
  return (
    <>
      <h1 style={{ marginBottom: "64px" }}>Journal</h1>
      <div
        style={{
          flexShrink: "2",
          overflowY: "scroll",
          overflowX: "hidden",
          backgroundColor: "rgb(90, 90, 90)",
        }}
        className="journal-entry-list"
      >
        <ul
          style={{
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: constructArray(() => "1fr", 7).join(" "),
          }}
        >
          {objectsInJournal.map((object, index) => {
            const [className, setClassName] = useState("");

            let renderedObject = object;

            if (!isUnlocked(renderedObject.key)) {
              renderedObject = objects.question;
            }

            return (
              <li
                key={index}
                className={className}
                onAnimationEnd={() => setClassName("")}
              >
                <button
                  onClick={() => {
                    if (!isUnlocked(renderedObject.key)) {
                      setClassName("shake");
                      return;
                    }

                    if (selectedObject && selectedObject.key === object.key) {
                      setSelectedObject(undefined);
                      return;
                    }

                    setSelectedObject(object);
                  }}
                >
                  <img src={objectImages[renderedObject.image]} />
                  <p style={{ fontSize: "1.25rem" }}>{renderedObject.name}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default JournalEntryList;
