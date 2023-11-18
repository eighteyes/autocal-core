import config from '../config';
import { Context } from '../types/context';
import { Activity, ActivityInput } from '../types/activity';
import { Config } from '../types/config';
import { parseCyclics } from './parseCyclics';
import { parseTags } from './parseTags';
import { parseDependencies } from './parseDependencies';
import { parseDurations } from './parseDurations';
import { parseAttributes } from './parseAttributes';

// tokenizer for activities and contexts

export function parseLine(ln: string, ctx?: Context, configuration: Config = config): Activity {
  let integerWeight = configuration.startWeight;
  let integerWeightAdj = 0;
  let available = false;
  let raw = ln+"";

  let done = ln[0] == 'x';
  if (done) {
    ln = ln.replace('x ', '');
  }

  let isContext = ln[0] == '#';
  if ( isContext ){
    // remove context hash
    ln = ln.substr(1);
  }

  // just in case of whitespace
  ln = ln.trim();

  // start with length, so we have something in place in case of only content
  let splitPoints = [ln.length];

  let attributeObj = parseAttributes(ln, configuration);
  let attributes: string[] = attributeObj.attributes;
  splitPoints.push(...attributeObj.splitPoints);
  integerWeight += attributeObj.integerWeight;
  integerWeightAdj += attributeObj.integerWeight;

  // duration push
  // let durationObj = parseDurations(ln);
  // let durations: string[] = durationObj.durations;
  // splitPoints.push(...durationObj.splitPoints);

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
  splitPoints.push(...cycObj.splitPoints);

  // split out the content from the signals
  let splitIndex = Math.min(...splitPoints);
  // capture ctx content correctly
  let content = ln.slice(0, splitIndex).trim();

  // deprioritize done acts
  if (done) {
    integerWeight = 0;
  }

  // input should be the only output on this stage
  let input: ActivityInput = {
    attributes: attributes,
    // durations: durations,
    splitPoint: splitIndex,
    cyclics: cyclicTokens,
    tags: tags,
    content: content,
    raw
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
