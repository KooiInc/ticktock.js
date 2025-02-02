import {
  localeInfoValidator,
  retrieveDateValueFromInput as retrieveDateValue,
  getAggregates,
  extendCTOR,
} from "./src/genericHelpers.js";
import { getTraps, instanceCreator,} from "./src/instantiationHelpers.js";

let ctorIsExtended = false;

export default XDateFactory();

function XDateFactory() {
  const customMethods = {};
  
  if (!ctorIsExtended) {
    extendCTOR(ctor, customMethods);
    ctorIsExtended = true;
  }
  
  return ctor;

  function ctor(input, localeInfo) {
    let maybeDate = input?.locale || input?.timeZone ? new Date() : retrieveDateValue(input);
    const localeInfoResolved = input?.locale || input?.timeZone
      ? localeInfoValidator(input) : localeInfoValidator(localeInfo || {});
    const instanceExtensions = instanceCreator({localeInfo: localeInfoResolved});
    const instance = instanceExtensions.proxy(new Date(maybeDate), getTraps(instanceExtensions));
    const instanceAggregates = getAggregates(instance, customMethods);
    instance.addAggregates(instance, instanceAggregates);
    return Object.freeze(instance);
  }
}