import { Activity, ActivityLink } from '../../types/activity';

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
