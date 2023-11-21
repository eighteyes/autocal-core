import { Context } from '../types/context';
import { generateDependencies } from '../process/dependency/dependencies';
import { processContextActivities } from '../process/processContextActivities';
import { findBlockers } from '../models/context/findBlockers';
import { parseTextIntoContexts } from './parseTextIntoContexts';
import config from '../config';
import {Config} from '../types/config';

// critical path
// entry point for processing a text file into Contexts with post processing steps
// dependency needs the entire structure in place before operating
export function parseComplete(input: string, cfg: Config = config): Context[] {
  const ctxs: Context[] = parseTextIntoContexts(input, cfg);
  ctxs.forEach((c, i) => processContextActivities(c, i, cfg));

  // after we have all contexts, process dependencies
  generateDependencies(ctxs);
  findBlockers(ctxs);

  return ctxs;
}
