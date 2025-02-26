import {
  localeInfoValidator,
  retrieveDateValueFromInput,
  getAggregates,
  createExtendedCTOR,
  getTraps,
  instanceCreator,
} from "./src/genericHelpers.js";

const customMethods = {};
export default createExtendedCTOR(ctor, customMethods);

function ctor(input, localeInfo) {
  const inputIsLocaleInfo = input?.locale || input?.timeZone || input?.tz || input?.l;
  let maybeDate = new Date(inputIsLocaleInfo ? Date.now() : retrieveDateValueFromInput(input));
  const localeInfoResolved = inputIsLocaleInfo ? localeInfoValidator(input) : localeInfoValidator(localeInfo || {});
  const instanceExtensions = instanceCreator({localeInfo: localeInfoResolved});
  const instance = instanceExtensions.proxy(maybeDate, getTraps(instanceExtensions));
  instance.addAggregates(getAggregates(instance, customMethods));
  return Object.freeze(instance);
}