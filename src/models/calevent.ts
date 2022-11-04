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
    done: boolean
}