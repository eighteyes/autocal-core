# AutoCal

Rule The Day and turn Plans into Actions

# Usage
```
// retrieve a set of activities from string and selection configuration
select(text: string, cfg: object): Activity[];
// various lookup / transformation utils for clients
get(plan: string, opts: ProcessGetOptions): ProcessGetOutput;
set(plan: string, opts: ProcessMutateOptions): string;
```

# Info

Activities are collected into Contexts. Selection chooses from these activites using a variety of mechanisms which are determined by the configuration passed to selection.
Options for configuration can be found at `./src/types/config.ts`