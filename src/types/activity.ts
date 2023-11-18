export interface Activity {
  id?: string;
  input?: ActivityInput;
  txtref?: string;

  // dependency is on next line
  attachNext: string;

  links: ActivityLink[];

  done: boolean;
  // can we select this one?
  available?: boolean;
  // blocked by dependencies
  blocked?: boolean;

  // plus or minus the base weight
  integerWeightAdj?: number;
  // before we get too far
  integerWeight?: number;
  // 0-1 number
  weight?: number;
  // integer value for selection = 2
  cyclicStrength?: number;
  // { boost: 3, drain: 1 }
  cyclics?: object;

  // selected by algo, do not reselect if true, do not persist
  selected?: boolean;

  // used for selection in text interfaces
  index?: number;

  // so we can id the ctx from the activity
  ctxIndex?: number;
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
  attributes?: string[];
  cyclics?: string[];
  // durations?: string[];
  raw?: string;
  // where raw becomes content
  splitPoint?: number;

  tags?: string[];
  content?: string;
  contextName?: string;
}
