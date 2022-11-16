import { dependencies } from '../../tests/inputs';
export interface Activity {
  input?: ActivityInput;
  reference?: string;

  // dependency is on next line
  attachNext: string;

  links: ActivityLink[];

  done: boolean;
  // can we select this one?
  available?: boolean;
  // before we get too far
  integerWeight?: number;
  // 0-1 number
  weight?: number;
  // integer value for selection = 2
  cyclicStrength?: number;
  // { boost: 3, drain: 1 }
  cyclics?: object;
}

export interface ActivityLink {
  reference?: Activity;
  // dependency
  type: string;
  // upstream / downstream
  upstream?: boolean;
  downstream?: boolean;
  required?: boolean;
  tags?: string[];
}

export interface ActivityInput {
  meta?: string;
  metas?: string[];
  attributes?: string[];
  cyclics?: string[];
  durations?: string[];
  raw?: string;
  // where raw becomes content
  splitPoint?: number;

  tags?: string[];
  content?: string;
}
