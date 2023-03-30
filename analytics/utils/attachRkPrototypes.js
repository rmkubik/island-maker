import rkSum from "./rkSum.js";
import rkMedian from "./rkMedian.js";
import rkToFixedFloat from "./rkToFixedFloat.js";

function attachRkPrototypes() {
  Array.prototype.rkSum = rkSum;
  Array.prototype.rkMedian = rkMedian;

  Number.prototype.rkToFixedFloat = rkToFixedFloat;
}

export default attachRkPrototypes;
