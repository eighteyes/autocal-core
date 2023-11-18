import config from '../config';
import { Config } from '../types/config';

export function parseAttributes(ln: string, configuration: Config = config) {
  let integerWeight = 0;
  let attributes: string[] = [];
  let splitPoints: number[] = [];

  for ( const a of configuration.attributeList ){
    let index = ln.indexOf(a.symbol);
    if (index >= 0) {
      let escaped = '\\' + a.symbol;
      let matchCount = ln.match(new RegExp(escaped,'g')).length;
      integerWeight += a.weight * matchCount;
      splitPoints.push(index);
      attributes.push(a.symbol.repeat(matchCount));
    }
  }

  return { integerWeight, attributes, splitPoints };
}
