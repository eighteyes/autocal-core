import { Activity, ActivityInput, ActivityLink } from './activity';

export interface Context {
  name: string;
  activities: Activity[];
  links?: ActivityLink[];
  raw?: string;
  // stores text - parseline only into input
  input?: ActivityInput;
  tags?: string[];
}
