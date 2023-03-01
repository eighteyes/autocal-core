import config from '../config';

export function parseAttributes(ln: string) {
  let integerWeight = 0;
  let attributes: string[] = [];
  let splitPoints: number[] = [];

  // add effect split points
  let attributeMatches = ln.match(config.regex.attributes);

  if (attributeMatches) {
    attributeMatches[0].split('').forEach((e) => {
      splitPoints.push(ln.indexOf(e));
      attributes.push(e);
    });
  }
  return { integerWeight, attributes, splitPoints };
}
