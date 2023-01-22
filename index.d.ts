import { Context } from './src/models/context';
import { Activity } from './src/models/activity';
export function select(text: string, cfg: object): Activity[];

export function getContextNames(text: string, id?: boolean): (string | string[])[];

export function getActivitiesForContext(text: string, contextId: number): Activity[];
export function getActivityListForContext(text: string, contextId: string): string[];
export function getActivitiesOnly(plan: string): Activity[][];
export function getPlanListFromText(text: string): string[][];

export function addRawContext(text: string, context: string): string;
export function addActivityToContext(text: string, ctx: number, new_activity: string): string;

export function defaultPlan(): string;
export function selectRandom(plan: string, count?: number, config?: string): Activity[];
export function selectOrdered(plan: string, count?: number, config?: string): Activity[];
export function selectAlgo(plan: string, count?: number, config?: string): Activity[];
