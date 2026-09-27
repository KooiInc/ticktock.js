import {
  localeInfoValidator,
  retrieveDateValueFromInput,
  createExtendedCTOR,
  instanceCreator as createInstance,
} from "./src/genericHelpers.js";

const customMethods = {};
const ctor = createExtendedCTOR(customDateConstructor, customMethods);
export default ctor;

function customDateConstructor(input, localeInfo) {
  ctor.iCount.increment();
  input = input?.value?.getMilliseconds ? input.value : input;
  const inputIsLocaleInfo = input?.locale || input?.timeZone || input?.tz || input?.l;
  
  return createInstance({
    localeInfo: localeInfoValidator(inputIsLocaleInfo ? input : localeInfo),
    dateValue: new Date(inputIsLocaleInfo ? Date.now() : retrieveDateValueFromInput(input)),
    customMethods });
}
