import { Context } from '../types/context';
import { Activity } from '../types/activity';
import { parseLine } from '../parsers/parseLine';
import { generateWeights } from './generateWeights';
import { calculateCyclicWeight } from './calculateCyclicWeight';
import { calculateAttributeWeight } from './calculateAttributeWeight';
import { generateTextReference } from './generateTextReference';
import { applyContext } from './applyContext';

export function processContextActivities(ctx: Context, index: number): Context {
  // console.log('Processing', ctx.name);
  // to reference contexts from activity via number
  ctx.index = index;

  // cycle through every event in the context
  ctx.raw.split('\n').forEach((ln, i) => {
    // in case of empty context, skip first line
    if (ln.length === 0 || ln == '\n' || i == 0) {
      return;
    }
    const act: Activity = parseLine(ln, ctx);
    // so we can select by index
    act.index = i;
    let input = act.input;
    // propagate contexts attributes to activities
    input.attributes.push(...ctx.input.attributes);
    input.tags.push(...ctx.input.tags);
    ctx.activities.push(act);
  });

  
  // after all activities are parsed
  if (ctx.activities.length > 0) {
    applyContext(ctx);
    // calculateCyclicWeight(ctx);
    // calculateAttributeWeight(ctx);
    generateWeights(ctx);
  }

  // changes are applied inline, but return anyway
  return ctx;
}
