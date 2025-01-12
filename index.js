import { extendCTOR, localeValidator, retrieveDateValueFromInput as retrieveDateValue, } from "./src/genericHelpers.js";
import { getTraps, wrapProxy, instanceCreator,} from "./src/instantiationHelpers.js";
export default XDateFactory();

function XDateFactory() {
  return extendCTOR(ctor);
  
  function ctor(input, localeInfo) {
    let maybeDate = retrieveDateValue(input) || new Date();
    const instanceExtensions = instanceCreator();
    instanceExtensions.localeInfo = input?.locale || input?.timeZone
      ? input : localeInfo ? localeInfo : localeValidator();
    const instance = instanceExtensions.proxy(wrapProxy(new Date(maybeDate), getTraps(instanceExtensions)));
    instance.addExtra(instance);
    
    return Object.freeze(instance);
  }
}