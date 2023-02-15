export interface ProcessOptions {
  type: 'context' | 'activity' | 'plan';
  format: 'object' | 'array' | 'array2d' | 'string' | 'number' | 'planlist';
  filter?: 'index' | 'ctx-index' | 'id';
  filterVal?: string | number;
  lookup?: string;
}
