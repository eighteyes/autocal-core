import { Context } from '../types/context';
import { generateDependencies } from '../process/dependency/dependencies';
import { processContext } from '../process/processContext';
import { findBlockers } from '../models/context/findBlockers';
import { parseTextIntoContexts } from './parseTextIntoContexts';

// entry point for processing a text file into Contexts with post processing steps
// dependency needs the entire structure in place before operating
export function parseComplete(input: string): Context[] {
  const ctxs: Context[] = parseTextIntoContexts(input);
  ctxs.forEach((c, i) => processContext(c, i));

  // after we have all contexts, process dependencies
  generateDependencies(ctxs);
  findBlockers(ctxs);

  return ctxs;
}
