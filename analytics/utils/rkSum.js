function rkSum() {
  let total = 0;
  const values = this.values();

  for (let value of values) {
    total += value;
  }

  return total;
}

export default rkSum;
