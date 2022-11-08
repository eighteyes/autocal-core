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
    downstreamTags?: string[],
    upstreamTags?: string[],
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