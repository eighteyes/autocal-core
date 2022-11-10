
import { Activity, ActivityDependencies } from './activity'
import { integerWeightFactor } from '../defaults';

export class Weight {
    weight: number;
    reference: Activity;
    static weights: Weight[] = [];

    constructor( weight, reference ) {
        if ( weight >= 1 ){
            this.weight = weight/Math.pow(10, integerWeightFactor);
        }
        this.reference = reference;
        Weight.weights.push(this)
    }

    static selectTop(count:number = 1){
        return Weight.sortWeights().slice(0, count)                   
    }

    static sortWeights(){
        let sortedWeights: Weight[] = [];
        sortedWeights = Weight.weights.sort(
            (a:Weight,b:Weight) => {
                if (a.weight < b.weight) return 1;
                if (a.weight > b.weight) return -1;
                if (a.weight === b.weight) return 0;
            }
        )
        return sortedWeights;
    }

    static selectUsingWeights(count:number = 1){
        let output : Weight[] = [];
        
        for (let i = 0; i < Weight.sortWeights().length; i++) {
            const element = Weight.weights[i];
            // crux of selection, use weight as % chance
            if ( Math.random() > element.weight ){
                output.push( element )
            }
            if ( output.length >= count ){
                break;
            }
        }

        return output
    }
}