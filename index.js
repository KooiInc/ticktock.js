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
  input = input?.value?.getMilliseconds ? input.value : input;
  const inputIsLocaleInfo = input?.locale || input?.timeZone || input?.tz || input?.l;
  ctor.iCount.increment();
  return createInstance({
    localeInfo: localeInfoValidator(inputIsLocaleInfo ? input : localeInfo),
    dateValue: new Date(inputIsLocaleInfo ? Date.now() : retrieveDateValueFromInput(input)),
    customMethods
  });
}
