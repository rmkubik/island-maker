import { useState } from "react";
import trackEvent from "../utils/trackEvent";
import useSession from "./useSession";
import useUser from "./useUser";

const useJournal = () => {
  const [user] = useUser();
  const [session] = useSession();

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

      if (!newJournal[key].isUnlocked) {
        // Only track a new unlock
        trackEvent({
          eventName: "journalItemUnlocked",
          userId: user.id,
          sessionId: session.id,
          data: {
            itemKey: key,
          },
        });
      }

      newJournal[key].isUnlocked = true;
    });

    setJournal(newJournal);
  };

  return { journal, setJournal, isUnlocked, unlockItem, commitUnlocks };
};

export default useJournal;
