import { Activity, ActivityLink } from './activity';
import { Context } from './context';

export function addDependentActivity(
  act: Activity,
  dep: Activity,
  upstream: boolean = false,
  required: boolean = false
) {
  if (typeof dep === 'undefined') {
    throw new Error('Invalid Dependency Added ' + act.input.content);
  }

  let link: ActivityLink = {
    type: 'dependency-inline-source',
    reference: dep,
    upstream: upstream,
    downstream: !upstream,
    required: required,
  };

  act.links.push(link);

  // clone object
  link = Object.assign({}, link);

  // dependency points back to parent act
  link.upstream = !upstream;
  link.downstream = upstream;
  link.reference = act;
  link.type = 'dependency-inline-dependent';

  dep.links.push(link);
}

export function getDependencyTags(act: Activity): string[] {
  return act.links
    .map((l) => {
      return l.tags;
    })
    .flat();
}

export function canBeSelected(act: Activity): boolean {
  return !act.done && !act.blocked && !act.selected && act.available;
}

export function render(act: Activity): string {
  return (
    [
      act.input.raw,
      act.input.content,
      act.input.attributes.join(''),
      act.input.tags.join(' '),
      act.input.cyclics.join(''),
      act.input.durations.join(' '),
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
