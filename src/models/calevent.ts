interface CalEvent {
    content: string,
    durations: string[],
    raw?: {
        meta?: string,
        metas?: string[],
        effects?: string
    },
    tags: string[],
    effects: string[],
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