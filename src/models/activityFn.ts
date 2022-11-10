export function addDependentActivity( act: Activity, dep: Activity, upstream: boolean = false){
    if ( typeof dep === 'undefined'){
        throw new Error('Invalid Dependency Added ' + act.content)
    }
    if ( !upstream ){
        // downstream
        if( act.downstream.indexOf(dep) == -1 ){
            act.downstream.push(dep);
        }
        // mirror
        if ( dep.upstream.indexOf(act) == -1 ){
            dep.upstream.push(act);
        }
    } else {
        // upstream
        if( act.upstream.indexOf(dep) == -1 ){
            act.upstream.push(dep);
        }
        // mirror
        if ( dep.downstream.indexOf(act) == -1 ){
            dep.downstream.push(act);
        }
    }
}