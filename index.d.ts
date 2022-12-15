import { Activity } from './src/models/activity';
export function select(text: string, cfg: object): Activity[];

export function getContextNames(text: string, id?: boolean): string[][];

export function getActivitiesForContext(text: string, contextId: number): Activity[];

export function getAll(text: string): string[][];

export function addRawContext(text: string, context: string): string;
