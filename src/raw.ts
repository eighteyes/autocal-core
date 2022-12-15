export function addRawContext(text: string, ctx: string): string {
  return text + ['', '# ' + ctx, ''].join('\n');
}
