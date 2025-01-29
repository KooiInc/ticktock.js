import {add2Date, fullMonth} from "./instanceHelpers.js";
import {instanceCreator} from "./instantiationHelpers.js";
import xDate from "../index.js";

export {
  localeWeekdays, localeMonthnames, localeValidator, setLocaleInfo,
  retrieveDateValueFromInput, currentLocalTime4TZ, getAggregates,
  extendCTOR, };

function retrieveFormattingFormats(locale, timeZone) {
  return [
    `${locale && (!(Array.isArray(locale) && locale.length < 1)) ? `l:${locale}` : ``}`,
    `${timeZone ? `tz:${timeZone}` : ``}`]
    .filter(v => v).join(`,`);
}

function localeWeekdays(locale = `en-GB`) {
  locale = localeValidator({locale}).locale;
  return {
    long: [...Array(7).keys()]
      .map( v => new Date(Date.UTC(1970, 0, 4 + v) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, weekday: `long` }) ),
    short: [...Array(7).keys()]
      .map( v => new Date(Date.UTC(1970, 0, 4 + v) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, weekday: `short` }) ),
  };
}

function localeMonthnames(locale = "en-GB") {
  locale = localeValidator({locale}).locale;

  return {
    long: [...Array(12).keys()]
    .map( v => new Date(Date.UTC(1970, v, 1) )
      .toLocaleDateString(locale, { timeZone: `Etc/UTC`, month: `long` }) ),
    short: [...Array(12).keys()]
      .map( v => new Date(Date.UTC(1970, v, 1) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, month: `short` }) )
  };
}

function calenderForYear(year) {
  const calendar = { year, calendar: {} };
  
  for (let i = 0; i < 12; i += 1) {
    const firstDay = xDate.from(year, i, 1).relocate({locale: `en-CA`});
    calendar.calendar[firstDay.monthName] = fullMonth(firstDay);
  }
  
  return calendar;
}

function localeValidator({ locale, timeZone, logError = true } = {}) {
  const reportLocaleError = errLocale =>
    console.error(`invalid locale (time zone: "${errLocale.timeZone}", locale: "${
      errLocale.locale}"), associated your locale instead`);
  try {
    return Intl.DateTimeFormat(locale, {timeZone: timeZone}).resolvedOptions();
  } catch (err) {
    logError && reportLocaleError({locale, timeZone});
    return Intl.DateTimeFormat().resolvedOptions();
  }
}

function setLocaleInfo({locale, timeZone} = {}) {
  const info = localeValidator({locale, timeZone}, true);
  return Object.freeze({...info, formatOptions: retrieveFormattingFormats(info.locale, info.timeZone)});
}

function valiDate(date) {
  return !Number.isNaN(+date) && date || new Date();
}

function retrieveDateValueFromInput(input) {
  const now = new Date();

  switch(true) {
    case input?.constructor === String:
      return valiDate(new Date(input));
    case Array.isArray(input) && input.map(Number).length === input.length:
      return valiDate(new Date(...input));
    case input?.constructor === Date:
      return valiDate(input);
    default: return now;
  }
}

function currentLocalTime4TZ(date, localeHere) {
  const tzRemote = {timeZone: date.localeInfo.timeZone, hourCycle: `h23`};
  const inTheZone = new Date(date.toLocaleString(`en-CA`, tzRemote));

  return {
    localDate: inTheZone.toLocaleDateString(),
    localTime: inTheZone.toLocaleTimeString(localeHere.locale, {hourCycle: `h23`}),
  };
}

function getAggregates(instance, customExtras) {
  const aggregates = {
    addYears(amount = 1) {
      const clone = instance.clone;
      return add2Date(clone, `${amount} years`);
    },
    addMonths(amount = 1) {
      const clone = instance.clone;
      return add2Date(clone, `${amount} months`);
    },
    addWeeks(amount = 1) {
      const clone = instance.clone;
      return add2Date(clone, `${amount * 7} days`);
    },
    addDays(amount = 1) {
      const clone = instance.clone;
      return add2Date(clone, `${amount} days`);
    },
    get nextYear() {
      const clone = instance.clone;
      return add2Date(clone, `1 year`);
    },
    get nextWeek() {
      const clone = instance.clone;
      return add2Date(clone, `7 days`);
    },
    get previousWeek() {
      const clone = instance.clone;
      return add2Date(clone, "-7 days");
    },
    get previousYear() {
      const clone = instance.clone;
      return add2Date(clone, `-1 year`);
    },
    get nextMonth() {
      const clone = instance.clone;
      return add2Date(clone, `1 month`);
    },
    get previousMonth() {
      const clone = instance.clone;
      return add2Date(clone, `-1 month`);
    },
    get tomorrow() {
      const clone = instance.clone;
      return add2Date(clone, `1 day`);
    },
    get yesterday() {
      const clone = instance.clone;
      return add2Date(clone, `-1 day`);
    },
  };

  if (Object.keys(customExtras || {}).length > 0) {
    customExtras.instance = instance;
    Object.entries(customExtras).forEach(([methodName, methodContainer]) => {
      if (customExtras[methodName].isGetter) {
        Object.defineProperty(
          aggregates,
          methodName, {
            get() { return methodContainer.method(instance); },
            enumerable: methodContainer.enumerable,
          });
        return false;
      }
      
      Object.defineProperty(
        aggregates,
        methodName, {
          value(...args) { return methodContainer.method(instance, ...args); },
          enumerable: methodContainer.enumerable,
        });
    });
  }

  return aggregates;
}

function extendCTOR(ctor, customMethods) {
  Object.defineProperties(ctor, {
    now: {
      get() {
        return ctor(new Date());
      }
    },
    localeInformation: {
      get() { return localeValidator() },
    },
    localWeekdaynames: {
      value(locale) {
        return localeWeekdays(locale);
      }
    },
    localMonthnames: {
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
    yearCalendar: {
      value: calenderForYear,
    },
    from: {
      value(...input) {
        return ctor(new Date(...input) || new Date());
      }
    },
    addCustom: {
      value( { name, method, enumerable = false, isGetter = false } = {} ) {
        if (name?.constructor === String && method?.constructor === Function && method.length > 0) {
          customMethods[name] = { method, enumerable, isGetter };
        }
      }
    },
    keys: {
      get() {
        const customEnumerables = Object.fromEntries(
          Object.entries(customMethods).filter( ([_, v]) => v.enumerable === true )
        );
        const allKeys = [
          ...Object.keys(instanceCreator()),
          ...Object.keys(getAggregates()),
          ...Object.keys(customEnumerables),
        ];
        return allKeys.sort( (a,b) => a.localeCompare(b) );
      }
    },
  });
  
  return ctor;
}