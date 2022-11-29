export function logWeights(object: { [index: string]: number }) {
  for (const key in object) {
    const element = object[key];
    console.debug(key, element.toFixed(3));
  }
}
