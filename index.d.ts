import { Context } from './src/types/context';
import { Activity } from './src/types/activity';
import { Config } from './src/types/config';
import { ProcessGetOptions, ProcessMutateOptions, ProcessGetOutput } from './src/types/process';

// types
export { ProcessGetOptions, ProcessMutateOptions, ProcessGetOutput, Activity, Config, Context };
export function select(text: string, cfg: object): Activity[];
export function get(plan: string, opts: ProcessGetOptions): ProcessGetOutput;

export function set(plan: string, opts: ProcessMutateOptions): string;

// select
/**
 * input: planlist, opts
   format: object, name, debugName
   output: Activity
*/

// get
/**
 * input: planlist,
 * type: context|activity|plan
 * lookup: all, content[],
 * format: object, array, array2d, string, number, planlist
 * filter: none, id, name
 */

// mutate
/**
 * input: planlist
 * type: context|activity|plan
 * target: id, name
 * op: add, remove, reindex, replace
 * output: planlist
 */

// util
/**
 * defaultPlan
 * defaultContext
 */

export function defaultPlan(): string;
export function selectRandom(plan: string, count?: number, config?: Partial<Config>): Activity[];
export function selectOrdered(plan: string, count?: number, config?: Partial<Config>): Activity[];
export function selectAlgo(plan: string, count?: number, config?: Partial<Config>): Activity[];
