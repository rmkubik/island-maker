function isValidCard(card) {
  if (card === undefined) {
    console.warn(`Card "${card}" is undefined.`);
    return false;
  }

  if (card === null) {
    console.warn(`Card "${card}" is null.`);
    return false;
  }

  if (!card.name) {
    console.warn(`Card "${card}" has no "name".`);
    return false;
  }

  if (!card.desc) {
    console.warn(`Card "${card}" has no "desc".`);
    return false;
  }

  if (!card.validTileTypes) {
    console.warn(`Card "${card}" has no "validTileTypes".`);
    return false;
  }

  if (card.validTileTypes.length === 0) {
    console.warn(`Card "${card}" has "validTileTypes" but array is empty.`);
    return false;
  }

  return true;
}

export default isValidCard;
