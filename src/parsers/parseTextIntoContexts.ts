import config from '../config';
import {Config} from '../types/config';
import { Context } from '../types/context';
import { parseLine } from './parseLine';

// move into text

export function parseTextIntoContexts(input: string, cfg: Config = config) {
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
  
  contextraws.forEach((c, i) => {
    // split along lines
    let line = c.split('\n');
    let head = line[0].toString();
    // shift mutates array
    let name: string = line.shift().replace(cfg.regex.flags, '').trim();

    let ctx: Context = {
      name,
      activities: [],
      // missing the context line
      raw: c,
      input: {},
      index: i,
    };

    // merge these objects
    contexts.push({ ...ctx, ...parseLine(head, null, cfg) });
  });

  return contexts;
}
