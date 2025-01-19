import {
  localeValidator,
  retrieveDateValueFromInput as retrieveDateValue,
  getAggregates,
  dateFromString, localeWeekdays, localeMonthnames,
} from "./src/genericHelpers.js";
import { getTraps, instanceCreator,} from "./src/instantiationHelpers.js";
export default XDateFactory();

function XDateFactory() {
  const addedCustomFns = {};
  return extendCTOR(ctor);
  
  function ctor(input, localeInfo) {
    let maybeDate = input?.locale || input?.timeZone ? new Date() : retrieveDateValue(input);
    const instanceExtensions = instanceCreator();
    instanceExtensions.localeInfo = input?.locale || input?.timeZone
      ? localeValidator(input) : localeValidator(localeInfo);
    const instance = instanceExtensions.proxy(new Date(maybeDate), getTraps(instanceExtensions));
    const instanceAggregates = getAggregates(instance, addedCustomFns);
    instance.addAggregates(instance, instanceAggregates);
    return Object.freeze(instance);
  }
  
  function extendCTOR(ctor) {
    Object.defineProperties(ctor, {
      now: {
        get() { return ctor(); }
      },
      parse: {
        value(string, ymdOrder = `ymd`) {
          return ctor(dateFromString(string, ymdOrder));
        }
      },
      localWeekdayNames: {
        value(locale) {
          return localeWeekdays(locale);
        }
      },
      localMonthNames: {
        value(locale) {
          return localeMonthnames(locale);
        }
      },
      daysInMonth: {
        value(monthIndex) {
          if (monthIndex >= 1 && monthIndex <= 12) {
            return new Date(1970, monthIndex, 0).getDate();
          }
          return `${monthIndex} not between 1 and 12`;
        },
      },
      customFn: { value(name, fn, enumerable = false) {
        addedCustomFns[name] = { fn, enumerable }; },
      },
    });
    
    return ctor;
  }
}