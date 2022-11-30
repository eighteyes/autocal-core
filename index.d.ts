import { Activity } from './src/models/activity';
export function select(text: string, cfg: object): Activity[];

export function getContextNames(
  text: string,
  id?: boolean
): string[] | string[][];

export function getActivitiesForContext(
  text: string,
  contextId: number
): Activity[];
