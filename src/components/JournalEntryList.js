import React, { useRef, useState } from "react";
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
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {objectsInJournal.map((object, index) => {
            const [className, setClassName] = useState("");
            const buttonRef = useRef();

            let renderedObject = object;

            if (!isUnlocked(renderedObject.key)) {
              renderedObject = objects.question;
            }

            const isSelected =
              selectedObject && selectedObject.key === object.key;

            return (
              <li
                key={index}
                className={className}
                onAnimationEnd={() => setClassName("")}
              >
                <button
                  ref={buttonRef}
                  className={isSelected ? "selected" : ""}
                  onClick={(e) => {
                    if (!isUnlocked(renderedObject.key)) {
                      setClassName("shake");
                      return;
                    }

                    if (isSelected) {
                      setSelectedObject(undefined);
                      return;
                    }

                    setTimeout(
                      () =>
                        buttonRef.current.scrollIntoView({ block: "nearest" }),
                      50
                    );
                    setSelectedObject(object);
                  }}
                >
                  <img
                    src={objectImages[renderedObject.image]}
                    draggable={false}
                  />
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