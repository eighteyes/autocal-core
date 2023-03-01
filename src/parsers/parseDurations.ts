import config from '../config';

export function parseDurations(ln: string) {
  let durations: string[] = [];
  let splitPoints: number[] = [];
  // cycle through all meta info indices
  const durationMatches = ln.match(config.regex.duration);
  if (durationMatches) {
    durationMatches.forEach((d) => {
      splitPoints.push(ln.indexOf(d));
      durations.push(d);
    });
  }
  return { splitPoints, durations };
}
