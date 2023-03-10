# AutoCal

Rule The Day and turn Plans into Actions

https://autocal.tech

# Overview
AutoCal is a system to help users collect, organize and select what's next from a list of things to do. AutoCal *Plans* are comprised of *Contexts*, each of which contain *Activities*. The heirarchy is `Plan > Context > Activities`. 

Activities are collected into Contexts and Selected by the user when they want to have a machine tell them what to work on next. Selection chooses from these activites using a variety of mechanisms which are determined by the configuration passed to selection.
Options for configuration can be found at `./src/types/config.ts`

The core intent behind AutoCal is to provide fun, planning-oriented text hyperprocessor, akin to Markdown or Mermaid.

# Usage
```
// retrieve a set of activities from string and selection configuration
// src/select/
select(text: string, cfg: object): Activity[];
// various lookup / transformation utils for clients
// src/models/plan/get
get(plan: string, opts: ProcessGetOptions): ProcessGetOutput;
// src/models/plan/set
set(plan: string, opts: ProcessMutateOptions): string;
```

# Code Tour
`src/models/{ activities, context, plan }` - find, sort, render functions. 
`src/parsers/*` - functions involved with turning text into objects
`src/process/*` - post parse actions, used to build out objects using configuration
`src/selectors/*` - functions for delivering selections
`src/types/*` - typescript types for all entities
`config.ts` - default config

# Running locally 
`autocal-core` is intended as a computation module to ingest and modify plans, and deliver selections, not store state or be a client interface. If you want to try it out, clone, `npm install` and ...

```
# run the test suite
npm test

# run and select from the example plan
npm start
```
