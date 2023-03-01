import config from '../config';
import { ActivityLink } from '../types/activity';

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
