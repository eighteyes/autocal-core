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
  let raw = ln+"";

  let done = ln.substring(0,1) == 'x ';
  if (done) {
    ln = ln.replace('x ', '');
  }

  let isContext = ln.substring(0,1) == '#';
  if ( isContext ){
    // remove context hash
    ln = ln.substring(1);
  }

  // just in case of whitespace, especially for flags
  ln = ln.trim();

  // start with length, so we have something in place in case of only content
  let splitPoints = [ln.length];

  // pull attributes, adj weights and split points
  let attributeObj = parseAttributes(ln, configuration);
  let attributes: string[] = attributeObj.attributes;
  splitPoints.push(...attributeObj.splitPoints);
  integerWeight += attributeObj.integerWeight;
  integerWeightAdj += attributeObj.integerWeight;
  
  // make links, adj split points
  let depObj = parseDependencies(ln);
  let links = depObj.links;
  splitPoints.push(...depObj.splitPoints);

  // infer a dependency to the subsequent activity, used after ctx processing
  let attachNext: string = depObj.attachNext;

  // duration push
  // let durationObj = parseDurations(ln);
  // let durations: string[] = durationObj.durations;
  // splitPoints.push(...durationObj.splitPoints);

  // don't include link tags in activity tags
  const excludeTags = links
    .map((l) => {
      return l.tags;
    })
    .flat();

  let tagObj = parseTags(ln, excludeTags);
  let tags: string[] = tagObj.tags;
  splitPoints.push(...tagObj.splitPoints);

  // let cycObj = parseCyclics(ln);
  // let cyclicTokens = cycObj.cyclics;
  // splitPoints.push(...cycObj.splitPoints);

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
    tags: tags,
    content: content,
    raw
  };

  if ( splitIndex !== content.length ){
    console.warn('Split point issue.', ln, splitIndex, content)
  }

  if (ctx) {
    input.contextName = ctx.input.content;
  }

  return {
    links,
    input,
    done,
    integerWeight,
    attachNext,
  };
}
