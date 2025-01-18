import { extendCTOR, localeValidator, retrieveDateValueFromInput as retrieveDateValue, } from "./src/genericHelpers.js";
import { getTraps, instanceCreator,} from "./src/instantiationHelpers.js";
export default XDateFactory();

function XDateFactory() {
  return extendCTOR(ctor);
  
  function ctor(input, localeInfo) {
    let maybeDate = input?.locale || input?.timeZone ? new Date() : retrieveDateValue(input);
    const instanceExtensions = instanceCreator();
    instanceExtensions.localeInfo = input?.locale || input?.timeZone
      ? localeValidator(input) : localeValidator(localeInfo);
    const instance = instanceExtensions.proxy(new Date(maybeDate), getTraps(instanceExtensions));
    instance.addAggregates(instance);
    
    return Object.freeze(instance);
  }
}