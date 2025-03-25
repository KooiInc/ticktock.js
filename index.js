import {
  localeInfoValidator,
  retrieveDateValueFromInput,
  createExtendedCTOR,
  instanceCreator as createInstance,
} from "./src/genericHelpers.js";

const customMethods = {};
export default createExtendedCTOR(customDateConstructor, customMethods);

function customDateConstructor(input, localeInfo) {
  if (input?.localeInfo) { return input.clone; }
  
  const inputIsLocaleInfo = input?.locale || input?.timeZone || input?.tz || input?.l;
  
  return createInstance({
    localeInfo: localeInfoValidator(inputIsLocaleInfo ? input : localeInfo),
    dateValue: new Date(inputIsLocaleInfo ? Date.now() : retrieveDateValueFromInput(input)),
    customMethods });
}
