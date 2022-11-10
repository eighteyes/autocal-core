
import { Activity } from './activity'


export function addDependentActivity( act: Activity, dep: Activity, upstream: boolean = false){
    if ( typeof dep === 'undefined'){
        throw new Error('Invalid Dependency Added ' + act.content)
    }
    if ( !upstream ){
        // downstream
        if( act.dependencies.downstream.indexOf(dep) == -1 ){
            act.dependencies.downstream.push(dep);
        }
        // mirror
        if ( dep.dependencies.upstream.indexOf(act) == -1 ){
            dep.dependencies.upstream.push(act);
        }
    } else {
        // upstream
        if( act.dependencies.upstream.indexOf(dep) == -1 ){
            act.dependencies.upstream.push(dep);
        }
        // mirror
        if ( dep.dependencies.downstream.indexOf(act) == -1 ){
            dep.dependencies.downstream.push(act);
        }
    }
}