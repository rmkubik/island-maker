import { useState } from "react";
import trackEvent from "../utils/trackEvent";
import useSession from "./useSession";
import useUser from "./useUser";

const useJournal = () => {
  const [user] = useUser();
  const [session] = useSession();

  let queuedUnlocks = [];
  const [journal, setJournal] = useState({});

  const isUnlocked = (objectKey, ruleKey) => {
    if (ruleKey) {
      return journal[objectKey]?.rules?.[ruleKey] ?? false;
    }

    return journal[objectKey]?.isUnlocked ?? false;
  };

  const unlockItem = (objectKey) => {
    queuedUnlocks.push({
      type: "ITEM",
      objectKey,
    });
  };

  const unlockRule = (objectKey, ruleKey) => {
    queuedUnlocks.push({
      type: "RULE",
      objectKey,
      ruleKey,
    });
  };

  const commitUnlocks = () => {
    const newJournal = { ...journal };

    queuedUnlocks.forEach((unlock) => {
      const { objectKey } = unlock;

      if (!newJournal[objectKey]) {
        newJournal[objectKey] = {};
      }

      switch (unlock.type) {
        case "ITEM":
          if (!newJournal[objectKey].isUnlocked) {
            // Only track a new unlock
            trackEvent({
              eventName: "journalItemUnlocked",
              userId: user.id,
              sessionId: session.id,
              data: {
                itemKey: objectKey,
              },
            });
          }

          newJournal[objectKey].isUnlocked = true;
          break;
        case "RULE":
          const { ruleKey } = unlock;

          if (!newJournal[objectKey].rules) {
            newJournal[objectKey].rules = {};
          }

          newJournal[objectKey].rules[ruleKey] = true;
          break;
        default:
          break;
      }
    });

    setJournal(newJournal);
  };

  return {
    journal,
    setJournal,
    isUnlocked,
    unlockItem,
    unlockRule,
    commitUnlocks,
  };
};

export default useJournal;
