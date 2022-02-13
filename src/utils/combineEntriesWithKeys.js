import reduceEntries from "./reduceEntries";

function combineEntriesWithKeys(entries) {
  const entriesWithKeyAddedToValue = entries.map(([key, value]) => {
    return [
      key,
      {
        ...value,
        key,
      },
    ];
  });

  return reduceEntries(entriesWithKeyAddedToValue);
}

export default combineEntriesWithKeys;
