# AutoCal

Rule The Day and turn Plans into Actions

https://autocal.tech

# Overview

Activities are collected into Contexts and Selected by the user when they want to have a machine tell them what to work on next. Selection chooses from these activites using a variety of mechanisms which are determined by the configuration passed to selection.
Options for configuration can be found at `./src/types/config.ts`

# Usage
```
// retrieve a set of activities from string and selection configuration
select(text: string, cfg: object): Activity[];
// various lookup / transformation utils for clients
get(plan: string, opts: ProcessGetOptions): ProcessGetOutput;
set(plan: string, opts: ProcessMutateOptions): string;
```

# Code Tour
`src/models/{ activities, context }` - find, sort, render functions
`src/parsers/*` - functions involved with turning text into objects
`src/process/*` - post parse actions, used to build out objects using configuration
`src/selectors/*` - functions for delivering selections
`src/types/*` - typescript types for all entities
`config.ts` - default config

