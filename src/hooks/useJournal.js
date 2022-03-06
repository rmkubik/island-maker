import { useState } from "react";

const useJournal = () => {
  let queuedUnlocks = [];
  const [journal, setJournal] = useState({});

  const isUnlocked = (key) => {
    return journal[key]?.isUnlocked;
  };

  const unlockItem = (key) => {
    queuedUnlocks.push(key);
  };

  const commitUnlocks = () => {
    const newJournal = { ...journal };

    queuedUnlocks.forEach((key) => {
      if (!newJournal[key]) {
        newJournal[key] = {};
      }

      newJournal[key].isUnlocked = true;
    });

    setJournal(newJournal);
  };

  return { journal, setJournal, isUnlocked, unlockItem, commitUnlocks };
};

export default useJournal;
