/**
 * Returns number of merkle tree levels based on the number of merkle values.
 * @param size Number of merkle tree values. 
 */ 
export function getLevelFromSize(size: number) {
  let level = 0;
  while (true) {
    size = size - Math.pow(2, level);
    if (size <= 0) {
      return level;
    }
    else {
      level++;
    }
  }
}

/**
 * Returns the number of merkle tree values based on level index.
 * @param level Merkle tree level.
 */ 
export function getSizeFromLevel(level: number) {
  return [...Array(level + 1)].map((l, i) => Math.pow(2, i)).reduce((a, b) => a + b, 0);
}
