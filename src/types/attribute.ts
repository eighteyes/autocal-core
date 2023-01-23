export interface Attribute {
  symbol: string;
  name: string;
  weight: number;
}

interface Cyclic extends Attribute {
  fn?: object;
}
