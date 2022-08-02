import React from "react";
import Menu from "./Menu";
import { objectImages, objects } from "../data/locations";
import constructArray from "../utils/constructArray";

const JournalMenu = ({ setView, isUnlocked }) => {
  const objectsInJournal = Object.values(objects).filter(
    (object) => object.isInJournal
  );

  return (
    <Menu maxWidth="1200px">
      <h1 style={{ marginBottom: "64px" }}>Journal</h1>
      <div>
        <ul
          style={{
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: constructArray(() => "1fr", 7).join(" "),
          }}
        >
          {objectsInJournal.map((object, index) => {
            let renderedObject = object;

            if (!isUnlocked(renderedObject.key)) {
              renderedObject = objects.question;
            }

            return (
              <li key={index}>
                <img src={objectImages[renderedObject.image]} />
                <p>{renderedObject.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        style={{
          padding: "16px 32px",
          borderRadius: "8px",
          fontSize: "1.25em",
          cursor: "pointer",
          marginRight: "8px",
        }}
        onClick={() => {
          setView("none");
        }}
      >
        Back
      </button>
    </Menu>
  );
};

export default JournalMenu;
