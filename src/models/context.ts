import { Activity, ActivityInput } from './activity';
export interface Context {
  name: string;
  activities: Activity[];
  raw?: string;
  // stores text - parseline only into input
  input?: ActivityInput;
}
