export interface Activity {
    content: string,
    durations: string[],
    raw?: {
        meta?: string,
        metas?: string[],
        attributes?: string,
        input?: string
    },
    tags: string[],
    attributes: string[],
    reference?: string,

    //begin dep refactor
    dependencies: ActivityDependencies,

    // end refactor
    done: boolean,
    // before we get too far
    integerWeight?: number,
    // 0-1 number
    weight?: number,
    // integer value for selection
    energy?: number,
    // where raw becomes content
    splitPoint?: number
}

export interface ActivityDependencies {
    downstreamTags?: string[],
    downstream?: Activity[],
    upstreamTags?: string[],
    upstream?: Activity[],
    required?: ActivityRequired,
    // < or > 
    attachNext?: string,
}
interface ActivityRequired extends ActivityDependencies {

}