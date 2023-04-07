import { Activity } from './activity';
import { Context } from './context';

export interface ProcessOptionsBase {
  type: 'context' | 'activity' | 'plan';
}

export interface ProcessGetOptions extends ProcessOptionsBase {
  format?: 'object' | 'array' | 'array2d' | 'string' | 'number' | 'planlist';
  filter?: 'index' | 'ctx-index';
  filterVal?: string | number;
  lookup?: string;
}

export interface ProcessMutateOptions extends ProcessOptionsBase {
  targetContextIndex?: number;
  targetActivityIndex?: number;
  op: 'add' | 'remove' | 'replace' | 'finish' | 'unfinish';
  value?: string;
}

export type ProcessGetOutput = Activity | Activity[] | Context[] | string | string[] | string[][];
