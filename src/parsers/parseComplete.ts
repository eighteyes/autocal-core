import { Context } from '../types/context';
import { generateDependencies } from '../process/dependency/dependencies';
import { processContextActivities } from '../process/processContextActivities';
import { findBlockers } from '../models/context/findBlockers';
import { parseTextIntoContexts } from './parseTextIntoContexts';

// critical path
// entry point for processing a text file into Contexts with post processing steps
// dependency needs the entire structure in place before operating
export function parseComplete(input: string): Context[] {
  const ctxs: Context[] = parseTextIntoContexts(input);
  ctxs.forEach((c, i) => processContextActivities(c, i));

  // after we have all contexts, process dependencies
  generateDependencies(ctxs);
  findBlockers(ctxs);

  return ctxs;
}
