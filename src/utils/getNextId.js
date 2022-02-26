/**
 * This function will use module level
 * state to globally track a next id. Every time
 * we need a new id, we'll increment the next one.
 *
 * This should ensure no id gets re-used.
 *
 * Theoretically we could overflow the int value max.
 * We don't really care because this game uses something
 * on the order of 10s of ids per game. A player would
 * need to play a LOT to run into this issue.
 */

let nextId = 0;

function getNextId() {
  return (nextId += 1);
}

export default getNextId;
