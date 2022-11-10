interface Activity {
    content: string,
    durations: string[],
    raw?: {
        meta?: string,
        metas?: string[],
        attributes?: string
    },
    tags: string[],
    attributes: string[],
    reference?: string,

    //begin dep refactor
    downstreamTags?: string[],
    downstream?: Activity[],
    upstreamTags?: string[],
    upstream?: Activity[],
    required?: ActivityRequired,
    // < or > 
    attachNext?: string,

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

interface ActivityRequired{
    upstream?: Activity[],
    downstream?: Activity[],
    upstreamTags: string[],
    downstreamTags: string[]
}