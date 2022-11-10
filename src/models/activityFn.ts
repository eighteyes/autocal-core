import { Activity } from './activity';

export function addDependentActivity(
  act: Activity,
  dep: Activity,
  upstream: boolean = false,
  required: boolean = false
) {
  if (typeof dep === 'undefined') {
    throw new Error('Invalid Dependency Added ' + act.content);
  }

  let actDownstreamTarget, depDownstreamTarget, depUpstreamTarget, actUpstreamTarget;

  if (required) {
    actDownstreamTarget = act.dependencies.required.downstream;
    actUpstreamTarget = act.dependencies.required.upstream;
    depDownstreamTarget = dep.dependencies.required.downstream;
    depUpstreamTarget = dep.dependencies.required.upstream;
  } else {
    actDownstreamTarget = act.dependencies.downstream;
    actUpstreamTarget = act.dependencies.upstream;
    depDownstreamTarget = dep.dependencies.downstream;
    depUpstreamTarget = dep.dependencies.upstream;
  }

  if (!upstream) {
    // downstream
    if (actDownstreamTarget.indexOf(dep) == -1) {
      actDownstreamTarget.push(dep);
    }
    // mirror to dep
    if (depUpstreamTarget.indexOf(act) == -1) {
      depUpstreamTarget.push(act);
    }
  } else {
    // upstream
    if (actUpstreamTarget.indexOf(dep) == -1) {
      actUpstreamTarget.push(dep);
    }
    // mirror to dep
    if (depDownstreamTarget.indexOf(act) == -1) {
      depDownstreamTarget.push(act);
    }
  }
}
