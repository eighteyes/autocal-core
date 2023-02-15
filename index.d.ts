import { Context } from './src/models/context';
import { Activity } from './src/models/activity';
import { Config } from './src/types/config';
import { ProcessOptions } from './src/types/process';

export function select(text: string, cfg: object): Activity[];
export function get(
  plan: string,
  opts: ProcessOptions
): Activity | Activity[] | Context[] | string[] | string[][] | number;

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

export function getContextNames(text: string, id?: boolean): (string | string[])[];

export function getActivitiesForContext(text: string, contextId: number): Activity[];
export function getActivityListForContext(text: string, contextId: string): string[];
export function getActivitiesOnly(plan: string): Activity[][];
export function getPlanListFromText(text: string): string[][];
export function lookupContextTextFromIndex(text: string, ctxId: number): string;

export function addRawContext(text: string, context: string): string;
export function addActivityToContext(text: string, ctx: number, new_activity: string): string;

export function defaultPlan(): string;
export function selectRandom(plan: string, count?: number, config?: Partial<Config>): Activity[];
export function selectOrdered(plan: string, count?: number, config?: Partial<Config>): Activity[];
export function selectAlgo(plan: string, count?: number, config?: Partial<Config>): Activity[];
