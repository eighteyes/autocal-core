import config from '../config';

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
        const tagIndex = ln.indexOf(t)-1;
        splitPoints.push(tagIndex);
        tags.push(t);
      }
    });
  }
  return { tags, splitPoints };
}
