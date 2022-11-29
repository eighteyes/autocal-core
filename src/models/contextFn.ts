import {
  regex,
  startWeight,
  attributeList,
  integerWeightFactor,
} from '../defaults';
import { Context } from './context';
import { generateDependencies } from './dependencies';
import { Activity, ActivityLink, ActivityInput } from './activity';
import { render } from './activityFn';
import { positionWeight } from '../defaults';
import {
  parseAttributes,
  parseDurations,
  parseTags,
  parseDependencies,
  parseCyclics,
} from '../parse';
import { duration, cyclics } from '../../tests/inputs';

export function parseComplete(input: string): Context[] {
  const ctxs: Context[] = parseTextIntoContexts(input);
  ctxs.forEach((c) => processContext(c));

  // after we have all contexts, process dependencies
  generateDependencies(ctxs);
  findBlockers(ctxs);

  return ctxs;
}

export function parseTextIntoContexts(input: string) {
  let contextraws: string[] = [];
  let contexts: Context[] = [];

  // break input into context blocks
  const contextStrings = input.split('\n\n').filter((c) => {
    // no empty strings
    return c.trim().length !== 0;
  });

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

    contexts.push({ ...ctx, ...parseLine(head) });
  });

  return contexts;
}

export function processContext(ctx: Context): Context {
  // console.log('Processing', ctx.name);

  // cycle through every event in the context
  ctx.raw.split('\n').forEach((ln) => {
    const e: Activity = parseLine(ln, ctx);
    ctx.activities.push(e);
  });

  if (ctx.activities.length > 0) {
    // after all lines are parsed
    applyContext(ctx);
    calculateCyclicWeight(ctx);
    calculateAttributeWeight(ctx);
    generateTextReference(ctx);
    generateWeights(ctx);
  }

  // changes are applied inline, but return anyway
  return ctx;
}

// activities
export function parseLine(ln: string, ctx?: Context): Activity {
  let integerWeight = startWeight;
  let available = false;

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

  // don't include link tags in act tags
  const excludeTags = links
    .map((l) => {
      return l.tags;
    })
    .flat();

  let tagObj = parseTags(ln, excludeTags);
  let tags: string[] = tagObj.tags;
  splitPoints.push(...tagObj.splitPoints);

  let cycObj = parseCyclics(ln);
  let cyclicTokens = cycObj.cyclics;

  // split out the content from the meta information
  let splitIndex = Math.min(...splitPoints);
  let content = ln.slice(0, splitIndex).trim();

  // deprioritize done acts
  if (done) {
    integerWeight = 0;
  }

  // input should be the only output on this stage
  let input: ActivityInput = {
    meta: ln.slice(splitIndex),
    metas: ln.slice(splitIndex).split(' '),
    attributes: attributes,
    durations: durations,
    splitPoint: splitIndex,
    cyclics: cyclicTokens,
    tags: tags,
    content: content,
    raw: ln,
  };

  if (ctx) {
    input.contextName = ctx.name;
  }

  return {
    links,
    input,
    done,
    integerWeight,
    available,
    attachNext,
  };
}

export function generateTextReference(ctx: Context) {
  // pull list of content from context
  ctx.activities.forEach((c) => {
    c.txtref = c.input.content
      .replace(regex.lettersOnly, '')
      .slice(0, 10)
      .toLowerCase();
    return c.txtref;
  });
}

export function generateWeights(ctx: Context) {
  let adjustedIndex = 0;
  ctx.activities.forEach((c, i) => {
    // apply a slight weighting towards the top of the list
    c.integerWeight -= adjustedIndex * positionWeight;

    // turn integer into float - important to know about
    c.weight = Math.min(c.integerWeight / Math.pow(10, integerWeightFactor), 1);

    // we don't want to discount done tasks
    if (!c.done) {
      adjustedIndex++;
    }
  });
}

export function sortActivityByWeight(acts: Activity[]) {
  // inplace sort
  return acts.sort((a: Activity, b: Activity) => {
    if (a.weight < b.weight) return 1;
    if (a.weight > b.weight) return -1;
    if (a.weight === b.weight) return 0;
  });
}

export function findActivitiesByTags(
  ctxs: Context[],
  tags: string[]
): Activity[] {
  let acts: Activity[] = [];

  tags.forEach((t) => {
    let matchActs: Activity[] = findActivitiesByTag(ctxs, t);
    matchActs.forEach((m) => {
      // don't insert dupes
      if (acts.indexOf(m) === -1) {
        acts.push(m);
      }
    });
  });

  return acts;
}

// look through all contexts to return matching activities
export function findActivitiesByTag(
  ctxs: Context[],
  tagName: string
): Activity[] {
  let acts: Activity[] = [];

  acts = ctxs
    .map((ctx) => {
      return ctx.activities.filter((a) => {
        return a.input.tags.includes(tagName);
      });
    })
    .flat();

  return acts;
}

export function selectActivitiesUsingWeights(
  acts: Activity[],
  count: number = 1
): Activity[] {
  let input: Activity[] = sortActivityByWeight(acts);
  let output: Activity[] = [];

  for (let i = 0; i < input.length; i++) {
    const act = input[i];
    // crux of selection, use weight as % chance

    if (
      !act.done &&
      !act.selected &&
      act.available &&
      Math.random() > act.weight
    ) {
      //expire so we don't reselect
      act.selected = true;
      output.push(act);
    }
    if (output.length >= count) {
      break;
    }
  }

  return output;
}

// call this after dependencies are hydrated with refernce
function findBlockers(ctxs: Context[]): Context[] {
  ctxs.forEach((ctx) => {
    ctx.activities.forEach((act: Activity) => {
      act.links.forEach((l: ActivityLink) => {
        if (l.required) {
          if (!l.reference) {
            console.error('Tagged dependency', l.tags, 'has no reference.');
            return;
          }
          let ref = l.reference;
          // expire anything downstream not available
          // availability is determined as part of selection
          if (!act.done && l.downstream) {
            ref.blocked = true;
          } else {
            ref.blocked = false;
          }
        }
      });
    });
  });

  return ctxs;
}

function applyContext(ctx: Context): Context {
  ctx.activities.forEach((act) => {
    act.links = [...act.links, ...ctx.links];
    act.input.attributes.push(...ctx.input.attributes);
    act.input.tags.push(...ctx.input.tags);
    act.input.durations.push(...ctx.input.durations);
    act.input.cyclics.push(...ctx.input.cyclics);
  });

  return ctx;
}

function calculateCyclicWeight(ctx: Context): Context {
  ctx.activities.forEach((act) => {
    // calculate things now that context is applied
    // calculate cyclic strength
    act.cyclicStrength = act.input.cyclics.reduce((a, b) => {
      if (b !== '+' && b !== '-') {
        console.error('Bad cyclic indicator', b, cyclics);
      }
      let amt = b == '+' ? 1 : -1;
      return a + amt;
    }, 0);
  });

  return ctx;
}

function calculateAttributeWeight(ctx: Context): Context {
  ctx.activities.forEach((act) => {
    act.integerWeight = startWeight;
    act.input.attributes.forEach((att) => {
      // look up weight for this attribute
      let eObj = attributeList.filter((e1: Attribute) => {
        return e1.symbol == att;
      })[0];
      // add to running total for this activity
      act.integerWeight += eObj.weight;
    });
  });
  return ctx;
}

export function renderContext(ctx: Context) {
  let acts = ctx.activities.map((a) => {
    return render(a);
  });
  return ctx.input.raw + '\n' + acts.join('');
}
