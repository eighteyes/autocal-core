import { regex, startWeight, attributeList, integerWeightFactor } from '../defaults';
import { Context } from './context';
import { generateDependencies } from './dependencies';
import { Activity, ActivityLink } from './activity';
import { positionWeight } from '../defaults';

export function parseComplete(input: string): Context[] {
  const ctxs: Context[] = parseTextIntoContexts(input);
  ctxs.forEach((c) => processContext(c));
  return ctxs;
}

export function parseTextIntoContexts(input: string) {
  let contextraws: string[] = [];
  let contexts: Context[] = [];

  // break input into context blocks
  const contextStrings = input.split('\n\n');
  contextStrings.forEach((c: string) => {
    // trim in case of extra whitespace btwn contexts
    contextraws.push(c.trim());
  });

  contextraws.forEach((c) => {
    // split along lines
    let line = c.split('\n');
    // shift mutates array
    let name: string = line.shift().replace(regex.contextHashMatch, '');

    let ctx: Context = {
      name,
      activities: [],
      raw: line.join('\n'),
    };

    contexts.push(ctx);
  });
  return contexts;
}

export function processContext(ctx: Context): Context {
  // cycle through every event in the context
  ctx.raw.split('\n').forEach((ln) => {
    const e: Activity = parseLine(ln);
    ctx.activities.push(e);
  });

  // after all lines are parsed
  generateReferences(ctx);
  generateWeights(ctx);
  generateDependencies(ctx);
  markAvailable(ctx);

  // changes are applied inline, but return anyway
  return ctx;
}

export function parseLine(ln: string): Activity {
  let durations: string[] = [];
  let tags: string[] = [];
  let attributes: string[] = [];
  let integerWeight = startWeight;
  let links: ActivityLink[] = [];
  let available = true;
  let attachNext = '';

  let done = ln[0] == 'x';
  if (done) {
    ln = ln.replace('x ', '');
  }

  // just in case of whitespace
  ln = ln.trim();

  // start with length, so we have something in place in case of only content
  let splitPoints = [ln.length];

  // add effect split points
  let attributeMatches = ln.match(regex.attributes);

  if (attributeMatches) {
    attributeMatches[0].split('').forEach((e) => {
      splitPoints.push(ln.indexOf(e));
      attributes.push(e);
      let eObj = attributeList.filter((e1) => {
        return e1.symbol == e;
      })[0];
      integerWeight += eObj.weight;
    });
  }

  // cycle through all meta info indices
  const durationMatches = ln.match(regex.duration);
  if (durationMatches) {
    durationMatches.forEach((d) => {
      splitPoints.push(ln.indexOf(d));
      durations.push(d);
    });
  }

  let dependencyMatch: string[] = ln.match(regex.dependencies);

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
        const endTagIndex =
          ln.indexOf(' ', depIndex + 3) !== -1
            ? ln.indexOf(' ', depIndex + 2 + d.length)
            : ln.length;
        const tag = ln.slice(depTagIndex + 1, endTagIndex);

        let linkObj: ActivityLink = {
          type: 'dependency-tag-notag',
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

  const tagMatches = ln.match(regex.tag);
  if (tagMatches) {
    tagMatches.forEach((t) => {
      // remove leading #
      t = t.slice(1);

      // skip dependency tags
      if (
        links
          .map((l) => {
            return l.tags;
          })
          .flat()
          .indexOf(t) === -1
      ) {
        const tagIndex = ln.indexOf(t);
        splitPoints.push(tagIndex);
        tags.push(t);
      }
    });
  }

  // split out the content from the meta information
  let splitIndex = Math.min(...splitPoints);
  let content = ln.slice(0, splitIndex).trim();

  // deprioritize done acts
  if (done) {
    integerWeight = 0;
  }

  let raw = {
    meta: ln.slice(splitIndex),
    metas: ln.slice(splitIndex).split(' '),
  };

  return {
    links,
    content,
    raw,
    durations,
    tags,
    attributes,
    done,
    integerWeight,
    available,
    attachNext,
  };
}

export function generateReferences(ctx: Context) {
  // pull list of content from context
  ctx.activities.forEach((c) => {
    c.reference = c.content.replace(regex.lettersOnly, '').slice(0, 10).toLowerCase();
    return c.reference;
  });
}

export function generateWeights(ctx: Context) {
  // reverse to apply a slight weighting towards the top of the list
  ctx.activities.forEach((c, i) => {
    c.integerWeight -= i * positionWeight;

    // turn integer into float - kinda important to know about
    c.weight = Math.min(c.integerWeight / Math.pow(10, integerWeightFactor), 1);
  });
}

export function selectTopSortedActivity(ctx: Context, count: number = 1) {
  return sortpositionWeights(ctx).slice(0, count);
}

export function sortpositionWeights(ctx: Context) {
  // inplace sort
  return ctx.activities.sort((a: Activity, b: Activity) => {
    if (a.weight < b.weight) return 1;
    if (a.weight > b.weight) return -1;
    if (a.weight === b.weight) return 0;
  });
}

export function findActivitiesByTags(ctx: Context, tags: string[]): Activity[] {
  let acts: Activity[] = [];

  tags.forEach((t) => {
    let matchActs: Activity[] = findActivitiesByTag(ctx, t);
    matchActs.forEach((m) => {
      // don't insert dupes
      if (acts.indexOf(m) === -1) {
        acts.push(m);
      }
    });
  });

  return acts;
}

export function findActivitiesByTag(ctx: Context, tagName: string): Activity[] {
  let acts: Activity[] = [];

  acts = ctx.activities.filter((a) => {
    return a.tags.includes(tagName);
  });

  return acts;
}

export function selectActivityUsingWeights(ctx: Context, count: number = 1): Activity[] {
  let input: Activity[] = sortpositionWeights(ctx);
  let output: Activity[] = [];

  for (let i = 0; i < input.length; i++) {
    const act = input[i];
    // crux of selection, use weight as % chance

    if (!act.done && act.available && Math.random() > act.weight) {
      output.push(act);
    }
    if (output.length >= count) {
      break;
    }
  }

  return output;
}

// call this after dependencies are hydrated with refernce
function markAvailable(ctx: Context): Context {
  ctx.activities.forEach((act: Activity) => {
    act.links.forEach((l: ActivityLink) => {
      if (l.required) {
        let ref = l.reference;
        // expire anything not available
        if (!act.done) {
          ref.available = false;
        } else {
          ref.available = true;
        }
      }
    });
  });

  return ctx;
}
