import config from '../config';
import { Context } from '../types/context';
import { Activity, ActivityInput } from '../types/activity';
import { parseAttributes, parseDurations, parseTags, parseDependencies, parseCyclics } from '../parse';

// tokenizer for activities and contexts

export function parseLine(ln: string, ctx?: Context): Activity {
  let integerWeight = config.startWeight;
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
    input.contextName = ctx.input.content;
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
