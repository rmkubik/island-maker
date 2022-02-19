const constructArray = (constructorFn, length) => {
  return new Array(length).fill("").map((_, index) => constructorFn(index));
};

export default constructArray;
