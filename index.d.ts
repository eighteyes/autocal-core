import { Context } from './src/models/context';
import { Activity } from './src/models/activity';
export function select(text: string, cfg: object): Activity[];

export function getContextNames(text: string, id?: boolean): string[][];

export function getActivitiesForContext(text: string, contextId: string): Activity[];
export function getActivityListForContext(text: string, contextId: string): string[];

export function getPlanListFromText(text: string): string[][];

export function addRawContext(text: string, context: string): string;

export function defaultPlan(): string;
