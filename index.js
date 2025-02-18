import {
  localeInfoValidator,
  retrieveDateValueFromInput,
  getAggregates,
  createCTORStaticMethods,
  getTraps,
  instanceCreator,
} from "./src/genericHelpers.js";

let ctorIsExtended;
export default XDateFactory();

function XDateFactory() {
  const customMethods = {};
  ctorIsExtended = ctorIsExtended || createCTORStaticMethods(ctor, customMethods);
  
  return ctor;

  function ctor(input, localeInfo) {
    const inputIsLocaleInfo = input?.locale || input?.timeZone || input?.tz || input?.l;
    let maybeDate = new Date(inputIsLocaleInfo ? Date.now() : retrieveDateValueFromInput(input));
    const localeInfoResolved = inputIsLocaleInfo
      ? localeInfoValidator(input) : localeInfoValidator(localeInfo || {});
    const instanceExtensions = instanceCreator({localeInfo: localeInfoResolved});
    const instance = instanceExtensions.proxy(maybeDate, getTraps(instanceExtensions));
    return Object.freeze(instance.addAggregates(instance, getAggregates(instance, customMethods)));
  }
}