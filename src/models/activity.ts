import { dependencies } from '../../tests/inputs';
export interface Activity {
  content: string;
  durations: string[];
  raw?: {
    meta?: string;
    metas?: string[];
    attributes?: string;
    input?: string;
  };
  tags: string[];
  attributes: string[];
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
  // integer value for selection
  cyclic?: number;
  // where raw becomes content
  splitPoint?: number;
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
