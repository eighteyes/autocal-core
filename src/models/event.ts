interface CalEvent {
    content: string,
    duration: string,
    raw?: {
        meta?: string,
        metas?: string[],
        tokens?: string
    },
    tags: string[],
    tokens: string[],
    downstreamTags?: string[],
    upstreamTags?: string[],
    done: boolean
}