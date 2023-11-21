import { Context } from '../types/context';
import { Activity } from '../types/activity';
import { parseLine } from '../parsers/parseLine';
import { generateWeights } from './generateWeights';
import { calculateCyclicWeight } from './calculateCyclicWeight';
import { calculateAttributeWeight } from './calculateAttributeWeight';
import { generateTextReference } from './generateTextReference';
import { applyContext } from './applyContext';
import config from '../config';
import {Config} from '../types/config';

export function processContextActivities(ctx: Context, index: number, cfg: Config = config): Context {
  // console.log('Processing', ctx.name);
  // to reference contexts from activity via number
  ctx.index = index;

  // cycle through every event in the context
  ctx.raw.split('\n').forEach((ln, i) => {
    // in case of empty context, skip first line b/c that is context
    if (ln.length === 0 || ln == '\n' || i == 0) {
      return;
    }
    // need to restore the newline for modifying raws later
    const act: Activity = parseLine(ln, ctx);
    // so we can select by index
    act.index = i;
    let input = act.input;
    // propagate contexts attributes to activities
    input.attributes.push(...ctx.input.attributes);
    input.tags.push(...ctx.input.tags);
    act.links.push(...ctx.links)

    // set up weights 
    // make items closer to the top of the list more important
    if ( !act.done && cfg.positionWeight > 0 ){
      act.integerWeight -= i * cfg.positionWeight;
    }
    
    // turn integer into float - important to know about for selection
    act.weight = Math.min(act.integerWeight / Math.pow(10, cfg.integerWeightFactor), 1);
    
    ctx.activities.push(act);
  });

  return ctx;
}
