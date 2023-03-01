import config from '../config';

export function parseCyclics(ln: string) {
  const cyclicMatches = ln.match(config.regex.cyclics);
  let cyclics: string[] = [];
  if (!cyclicMatches) {
    return { cyclics };
  }

  let cyclicStrength = 0;

  // only pass through - and +
  cyclics = cyclicMatches
    .join('')
    .replace(/[^-|+]*/g, '')
    .trim()
    .split('');

  // only pass points that match
  let splitPoints: number[] = [ln.indexOf('-'), ln.indexOf('+')].filter((n) => {
    return n > 0;
  });

  return { cyclics, splitPoints };
}
