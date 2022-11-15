import { regex, startWeight, attributeList, integerWeightFactor } from '../defaults';
import { Context } from './context';
import { generateDependencies } from './dependencies';
import { Activity, ActivityLink } from './activity';
import { positionWeight } from '../defaults';
import { parseAttributes, parseDurations, parseTags, parseDependencies, parseCyclics } from '../parse';
import { duration } from '../../tests/inputs';

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
    let head = line[0].toString();
    // shift mutates array
    let name: string = line.shift().replace(regex.contextHashMatch, '');

    let ctx: Context = {
      name,
      activities: [],
      raw: line.join('\n'),
      input: {},
    };

    // parse context here
    let attObj = parseAttributes(head);
    ctx.input.attributes = attObj.attributes;

    let durObj = parseDurations(head);
    ctx.input.durations = durObj.durations;

    // let depObj = parseDependencies(head);

    let tagObj = parseTags(head);
    ctx.input.tags = tagObj.tags;

    let cycObj = parseCyclics(head);
    ctx.input.cyclics = cycObj.cyclics;

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
  applyContext(ctx);
  generateReferences(ctx);
  generateWeights(ctx);
  generateDependencies(ctx);
  markAvailable(ctx);

  // changes are applied inline, but return anyway
  return ctx;
}

// activities
export function parseLine(ln: string): Activity {
  let integerWeight = startWeight;
  let available = true;

  let done = ln[0] == 'x';
  if (done) {
    ln = ln.replace('x ', '');
  }

  // just in case of whitespace
  ln = ln.trim();

  // start with length, so we have something in place in case of only content
  let splitPoints = [ln.length];

  let attributeObj = parseAttributes(ln);
  let attributes: string[] = attributeObj.attributes;
  splitPoints.push(...attributeObj.splitPoints);
  integerWeight += attributeObj.integerWeight;

  let durationObj = parseDurations(ln);
  let durations: string[] = durationObj.durations;
  splitPoints.push(...durationObj.splitPoints);

  let depObj = parseDependencies(ln);
  let links = depObj.links;
  splitPoints.push(...depObj.splitPoints);
  let attachNext: string = depObj.attachNext;

  const excludeTags = links
    .map((l) => {
      return l.tags;
    })
    .flat();

  let tagObj = parseTags(ln, excludeTags);
  let tags: string[] = tagObj.tags;
  splitPoints.push(...tagObj.splitPoints);

  let cycObj = parseCyclics(ln);
  let cyclics = cycObj.cyclics;

  // split out the content from the meta information
  let splitIndex = Math.min(...splitPoints);
  let content = ln.slice(0, splitIndex).trim();

  // deprioritize done acts
  if (done) {
    integerWeight = 0;
  }

  // input should be the only output on this stage
  let input = {
    meta: ln.slice(splitIndex),
    metas: ln.slice(splitIndex).split(' '),
    attributes: attributes,
    durations: durations,
    splitPoint: splitIndex,
    cyclics: cyclics,
    tags: tags,
    content: content,
    raw: ln,
  };

  return {
    links,
    input,
    done,
    integerWeight,
    available,
    attachNext,
  };
}

export function generateReferences(ctx: Context) {
  // pull list of content from context
  ctx.activities.forEach((c) => {
    c.reference = c.input.content.replace(regex.lettersOnly, '').slice(0, 10).toLowerCase();
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
    return a.input.tags.includes(tagName);
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

function applyContext(ctx: Context): Context {
  ctx.activities.forEach((act) => {
    act.input.attributes.push(...ctx.input.attributes);
    act.input.tags.push(...ctx.input.tags);
    act.input.durations.push(...ctx.input.durations);
    act.input.cyclics.push(...ctx.input.cyclics);
  });

  return ctx;
}
