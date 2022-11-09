import { makeTestRef } from "../src/utils"

export const tags = {
    single: "Mow the lawn 1h #yardwork",
    multiple: "Mow the lawn 1h #yardwork #hardwork"
}

export const duration = {

}

export const dependencies = {

}

export const attributes = {
    many: "Very Important 1h !*$^+-",
    all: "A thing! to do !*$`"
}

export const content = {
    splitBasic: "Call Marcelo RE : Landing Page 1h",
    splitComplex: "Presents 4 Judy & Mark! // (and f) 4h"
}

export const contexts = {
    basic: "# Context\nDo Thing !",
    long: "# Context\n" + Array(100).fill(makeTestRef(), 0,100).join('\n')
}

export const deps = {
    may: "# Context\n" + "A thing >\nAnother Thing",
    mayTags: "# Context\n" + "A thing > #this\nAnother Thing\nThe Thing #this",
}