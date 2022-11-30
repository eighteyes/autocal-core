export function logWeights(object: { [index: string]: number }) {
  let log = [];
  for (const key in object) {
    const element = object[key];
    log.push([key, element.toFixed(2)].join(':'));
  }
  console.debug(log.join(' '));
}
