import pickRandomlyFromArray from "./pickRandomlyFromArray";

// TODO: I don't think this is actually working...
// We should probably try to write a test that actually
// validates this is functional.

function pickChoice(choices, lastChoices, riggingRange) {
  // We rig if there have already been riggingRange choices or if this is
  // the riggingRangth choice.
  const chosenEnoughTimesToRig = lastChoices.length >= riggingRange - 1;
  const allChoicesBeenPicked = choices.every((possibleChoice) =>
    lastChoices.includes(possibleChoice)
  );

  if (chosenEnoughTimesToRig && !allChoicesBeenPicked) {
    const unPickedChoices = choices.filter(
      (possibleChoice) => !lastChoices.includes(possibleChoice)
    );

    return pickRandomlyFromArray(unPickedChoices);
  }

  // Default to picking randomly
  return pickRandomlyFromArray(choices);
}

function createPickRandomlyFromArrayRigged(riggingRange) {
  let lastChoices = [];

  return function pick(choices) {
    const choice = pickChoice(choices, lastChoices.slice(1), riggingRange);

    if (lastChoices.length === riggingRange) {
      lastChoices.shift();
    }

    lastChoices.push(choice);

    return choice;
  };
}

export default createPickRandomlyFromArrayRigged;
