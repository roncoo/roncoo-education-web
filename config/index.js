import devEnv from './dev.env';
import prodEnv from './prod.env';
let result = {};

if (process.env.NODE_ENV == 'development') {
  result = devEnv;
}else {
  result = prodEnv;
}

export default result
