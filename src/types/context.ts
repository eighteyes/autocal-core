import { Activity, ActivityInput, ActivityLink } from './activity';

export interface Context {
  name: string;
  id?: string;
  activities: Activity[];
  links?: ActivityLink[];
  raw?: string;
  // stores text - parseline only into input
  input?: ContextInput;
  tags?: string[];

  // used in text selection
  index?: number;
}

// Same surface area as ActivityInput
interface ContextInput extends ActivityInput {

}
