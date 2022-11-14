import { Activity } from './activity';
export interface Context {
  name: string;
  activities: Activity[];
  raw?: string;
}
