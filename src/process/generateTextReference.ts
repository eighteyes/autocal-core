import config from '../config';
import { Context } from '../types/context';

export function generateTextReference(ctx: Context) {
  // pull list of content from context
  ctx.activities.forEach((c) => {
    c.txtref = c.input.content
      .replace(config.regex.lettersOnly, '')
      .replace(config.regex.vowels, '')
      .slice(0, 10)
      .toLowerCase();
    return c.txtref;
  });
}
