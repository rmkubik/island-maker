import pickRandomlyFromArrayInternal from "./pickRandomlyFromArrayInternal";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const createRandomStringInternal = (generatorFunction) => (length) => {
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += pickRandomlyFromArrayInternal(generatorFunction)(
      characters.split("")
    );
  }

  return result;
};

export default createRandomStringInternal;
