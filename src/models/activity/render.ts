import { Activity } from '../../types/activity';

// Canonical activity rendering

export function render(act: Activity): string {
  return (
    [
      act.input.raw,
      act.input.content,
      act.input.attributes.join(''),
      act.input.tags.join(' '),
      act.input.cyclics.join(''),
      // act.input.durations.join(' '),
      act.links.map((l) => {
        let count = l.required ? 2 : 1;
        let direction = l.downstream ? '>' : '<';
        let token = direction.repeat(count);
        return [token, l.tags.join(' ')];
      }),
      act.attachNext,
    ]
      .join(' ')
      // dedupe spaces
      .replace(/\s+/g, ' ') + '\n'
  );
}
