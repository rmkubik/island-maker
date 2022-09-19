function joinWithOxfordComma(array) {
  if (array.length === 1) {
    return array[0];
  }

  if (array.length === 2) {
    return array[0] + " and " + array[1];
  }

  const copiedArray = [...array];
  const finalItem = copiedArray.pop();

  return copiedArray.join(", ") + " and " + finalItem;
}

export default joinWithOxfordComma;
