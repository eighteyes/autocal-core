import { Context } from '../types/context';
import { Activity } from '../types/activity';
import { parseLine } from '../parsers/parseLine';
import { generateWeights } from './generateWeights';
import { calculateCyclicWeight } from './calculateCyclicWeight';
import { calculateAttributeWeight } from './calculateAttributeWeight';
import { generateTextReference } from './generateTextReference';
import { applyContext } from './applyContext';

export function processContext(ctx: Context, index: number): Context {
  // console.log('Processing', ctx.name);
  // to reference contexts from activity via number
  ctx.index = index;

  // cycle through every event in the context
  ctx.raw.split('\n').forEach((ln, i) => {
    // in case of empty context
    if (ln.length === 0 || ln == '\n') {
      return;
    }
    const e: Activity = parseLine(ln, ctx);
    // so we can select by index
    e.index = i;
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
