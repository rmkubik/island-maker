const pickRandomlyFromArrayInternal = (generatorFunction) => (array) => {
  return array[Math.floor(generatorFunction() * array.length)];
};

export default pickRandomlyFromArrayInternal;
