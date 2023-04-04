import { parseComplete } from './parsers/parseComplete';
import { Context } from './types/context';
import { Activity } from './types/activity';
import { doSelection } from './selection';
import { processMutate } from './models/plan/set';
import { processGet } from './models/plan/get';
import { select, selectAlgo, selectOrdered, selectRandom } from './selection';

// point to TS in errors
require('source-map-support').install();

// whether we are running standalone or as a module
const isLocal = require.main === module;
let fileName = isLocal ? './examples/plan.acr' : module.path + '/../../examples/simple.acr';

export { processGet as get, processMutate as set, select, selectRandom, selectAlgo, selectOrdered, Context, Activity };
