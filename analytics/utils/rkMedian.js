function rkMedian() {
  const arrayCopy = [...this.values()];

  arrayCopy.sort(function (a, b) {
    return a - b;
  });

  const midpoint = Math.floor(arrayCopy.length / 2);

  if (arrayCopy.length % 2) return arrayCopy[midpoint];

  return (arrayCopy[midpoint - 1] + arrayCopy[midpoint]) / 2.0;
}

export default rkMedian;
