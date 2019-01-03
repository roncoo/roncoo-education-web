import devEnv from './dev.env';
import testEnv from './test.env';
import prodEnv from './prod.env';
let result = {};

if (process.env.NODE_ENV == 'development') {
  result = devEnv;
}else if (process.env.NODE_ENV == 'testing') {  
  result = testEnv;
}else {
  result = prodEnv;
}

export default result
