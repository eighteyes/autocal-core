import { parseComplete } from './parseComplete';
import { readFile } from '../read';
import { fileName } from '../text';

// lookup names by id
// return only context contents, or content with index for lookup on selection

export function getContextNames(
  text: string = readFile(fileName),
  index: boolean = false
): (string | (string | number)[])[] {
  let ctxs = parseComplete(text);

  const r = ctxs.map((c) => {
    if (index) {
      return [c.input.content, c.index];
    }
    return c.input.content;
  });

  return r;
}
