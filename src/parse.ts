import config from './config';
import { ActivityLink } from './types/activity';

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

export function parseDependencies(ln: string) {
  let attachNext: string;
  let links: ActivityLink[] = [];
  let splitPoints: number[] = [];
  let dependencyMatch: string[] = ln.match(config.regex.dependencies);

  if (dependencyMatch) {
    dependencyMatch.forEach((d) => {
      d = d.trim();

      const depIndex = ln.indexOf(d);
      splitPoints.push(depIndex);
      // check if a tag is specified
      if (ln.slice(depIndex, depIndex + 2 + d.length).includes('#')) {
        // where is the tag in the string
        const depTagIndex = ln.indexOf('#', depIndex);
        // find end of tag, OR set index to end of string
        const endTagIndex = ln.indexOf(' ', depIndex + 3) !== -1 ? ln.indexOf(' ', depIndex + 2 + d.length) : ln.length;
        const tag = ln.slice(depTagIndex + 1, endTagIndex);

        let linkObj: ActivityLink = {
          type: 'dependency-tagged',
        };

        if (d === '<>' || d === '><') {
          console.error('Bad dependency token: ', d);
        }

        if (d[0] === '<') {
          linkObj.upstream = true;
          linkObj.downstream = false;
        } else if (d[0] === '>') {
          linkObj.upstream = false;
          linkObj.downstream = true;
        }

        linkObj.required = d.length == 2 ? true : false;
        linkObj.tags = [tag];
        links.push(linkObj);
      } else {
        // no tag, next inferred, this dep is made in context scope
        attachNext = d;
      }
    });
  }
  return { attachNext, links, splitPoints };
}

export function parseTags(ln: string, exclude: string[] = []) {
  let tags: string[] = [];
  let splitPoints: number[] = [];
  const tagMatches = ln.match(config.regex.tag);
  if (tagMatches) {
    tagMatches.forEach((t) => {
      // remove leading #
      t = t.slice(1);

      // skip dependency tags
      if (exclude.indexOf(t) === -1) {
        const tagIndex = ln.indexOf(t);
        splitPoints.push(tagIndex);
        tags.push(t);
      }
    });
  }
  return { tags, splitPoints };
}

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
