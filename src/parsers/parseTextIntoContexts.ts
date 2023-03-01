import config from '../config';
import { Context } from '../types/context';
import { parseLine } from './parseLine';

// move into text

export function parseTextIntoContexts(input: string) {
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
    let name: string = line.shift().replace(config.regex.contextHashMatch, '');

    let ctx: Context = {
      name,
      activities: [],
      raw: line.join('\n'),
      input: {},
      index: i,
    };

    contexts.push({ ...ctx, ...parseLine(head) });
  });

  return contexts;
}
