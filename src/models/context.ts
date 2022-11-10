
import { Activity, ActivityDependencies } from './activity'
export interface Context {
    name: string,
    activities: Activity[],
    raw?: string,
}


