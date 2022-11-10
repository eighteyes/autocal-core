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

  //begin dep refactor
  dependencies: ActivityDependencies;

  // end refactor
  done: boolean;
  // before we get too far
  integerWeight?: number;
  // 0-1 number
  weight?: number;
  // integer value for selection
  cyclic?: number;
  // where raw becomes content
  splitPoint?: number;
}

export interface DependencyTags {
  name: string;
  required?: boolean;
  upstream?: boolean;
  downstream?: boolean;
}
export interface ActivityDependencies {
  downstream: Activity[];
  upstream: Activity[];
  required?: ActivityRequired;
  tags?: DependencyTags[];
  attachNext?: string;
}
interface ActivityRequired extends ActivityDependencies {}
