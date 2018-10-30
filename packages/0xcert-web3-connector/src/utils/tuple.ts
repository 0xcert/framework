/**
 * Transforms an object into web3 tuple type.
 * @param obj Web3 structure as object.
 */
export default function tuple(obj) {
  if (!(obj instanceof Object)) {
    return [];
  }
  var output = [];
  var i = 0;
  Object.keys(obj).forEach((k) => {
      if (obj[k] instanceof Object) {
      output[i] = tuple(obj[k]);
      } else if (obj[k] instanceof Array) {
      let j1 = 0;
      let temp1 = [];
      obj[k].forEach((ak) => {
          temp1[j1] = tuple(obj[k]);
          j1++;
      });
      output[i] = temp1;
      } else {
      output[i] = obj[k];
      }
      i++;
  });
  return output;
}
