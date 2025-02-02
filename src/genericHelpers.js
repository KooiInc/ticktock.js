import { add2Date, fullMonth, offset2Number, } from "./instanceHelpers.js";
import { instanceCreator } from "./instantiationHelpers.js";
import xDate from "../index.js";
const localLocaleInfo = localeInfoValidator();
export {
  localeWeekdays, localeMonthnames, localeInfoValidator, setLocaleInfo, localLocaleInfo,
  retrieveDateValueFromInput, getAggregates, extendCTOR, isNumberOrNumberString, };

function retrieveFormattingFormats(locale, timeZone) {
  return [
    `${locale && (!(Array.isArray(locale) && locale.length < 1)) ? `l:${locale}` : ``}`,
    `${timeZone ? `tz:${timeZone}` : ``}`]
    .filter(v => v).join(`,`);
}

function localeWeekdays(locale = `en-GB`) {
  locale = localeInfoValidator({locale}).locale;
  return {
    long: [...Array(7).keys()]
      .map( v => new Date(Date.UTC(1970, 0, 4 + v) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, weekday: `long` }) ),
    short: [...Array(7).keys()]
      .map( v => new Date(Date.UTC(1970, 0, 4 + v) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, weekday: `short` }) ),
  };
}

function localeMonthnames(locale = "en") {
  locale = localeInfoValidator({locale}).locale;

  return {
    long: [...Array(12).keys()]
    .map( v => new Date(Date.UTC(1970, v, 1) )
      .toLocaleDateString(locale, { timeZone: `Etc/UTC`, month: `long` }) ),
    short: [...Array(12).keys()]
      .map( v => new Date(Date.UTC(1970, v, 1) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, month: `short` }) )
  };
}

function calenderForYear({year, locale} = {}) {
  year = isNumberOrNumberString(year) ? +year : new Date().getFullYear();
  const calendar = { year, calendar: {} };
  const monthNames = localeMonthnames().long;
  
  for (let i = 0; i < 12; i += 1) {
    const firstDay = xDate.from(year, i, 1);
    calendar.calendar[monthNames[i]] = fullMonth(firstDay, locale);
  }
  
  return calendar;
}

function localeInfoValidator({ locale, timeZone, logError = false} = {}) {
  try {
    return Intl.DateTimeFormat(locale, {timeZone: timeZone}).resolvedOptions(); }
  catch (error) {
    logError && console.error(`localeValidator: invalid input, using computer locale`);
    return Intl.DateTimeFormat().resolvedOptions(); }
}

function setLocaleInfo({locale, timeZone} = {}) {
  const info = localeInfoValidator({locale, timeZone}, true);
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

function LocalDateAndTime4TimeZone({timeZoneDate, timeZoneID} = {}) {
  timeZoneID = localeInfoValidator({timeZone: timeZoneID}).timeZone;
  const timeZoneDT = xDate(new Date(timeZoneDate), {timeZone: timeZoneID});
  const info = timeZoneDT.info;
  const locals = info.dateTime.user;
  const localHere = xDate(timeZoneDate);
  const distance = offset2Number(locals.offsetFromRemote, true);
  localHere.time = {hours: localHere.hours + distance[0], minutes: localHere.minutes + distance[1]};
  return {
    remoteTimezone: timeZoneID.timeZone,
    userTimezone: localLocaleInfo.timeZone,
    offsetFromLocal: info.offset.fromUserTime,
    result: {
      [timeZoneID.replace(/\//, `_`)]: timeZoneDT.toString(`wd M d yyyy hh:mmi:ss`, `hrc:23`),
      [localLocaleInfo.timeZone.replace(/\//, `_`)]: localHere.toString(`wd M d yyyy hh:mmi:ss`, `hrc:23`),
    }
  };
}

function isNumberOrNumberString(value) {
  return !(Number.isNaN(parseInt(value)) && Number.isNaN(+value));
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
      value: localLocaleInfo,
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
        if (isNumberOrNumberString(monthIndex) && +monthIndex >= 1 && +monthIndex <= 12) {
          return new Date(1970, monthIndex, 0).getDate();
        }
        return `${monthIndex} should be a Number (1 - 12)`;
      },
    },
    yearCalendar: {
      value: calenderForYear,
    },
    monthCalendar: {
      value({monthNr, locale} = {}) {
        if (isNumberOrNumberString(monthNr) && +monthNr >= 1 && +monthNr <= 12) {
          return $D({locale: `en-CA`}).fullMonth(locale);
        }
        
        return `${monthNr} should be a Number (1 - 12)`;
      }
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
    validateLocaleInformation: { value: localeInfoValidator },
    localDateTime4TimeZone: { value: LocalDateAndTime4TimeZone },
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