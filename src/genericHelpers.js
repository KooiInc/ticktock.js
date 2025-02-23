import {add2Date, fullMonth, offset2Number, getWeeksInYear} from "./instanceHelpers.js";
import instanceCreator from "./extensions.js";
import xDate from "../index.js";
const localLocaleInfo = localeInfoValidator();

export {
  localeWeekdays, localeMonthnames, localeInfoValidator, setLocaleInfo, localLocaleInfo,
  retrieveDateValueFromInput, getAggregates, createCTORStaticMethods, isNumberOrNumberString,
  retrieveFormattingFormats, aggregateDateAdder, getTraps, instanceCreator,};

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
  const monthNames = localeMonthnames().long.map(v => v.toLowerCase());
  
  for (let i = 0; i < 12; i += 1) {
    const firstDay = xDate.from(year, i, 1);
    calendar.calendar[monthNames[i]] = fullMonth(firstDay, locale);
  }
  
  return calendar;
}

function addFormatOptions(localeInfoResolved) {
  const value = retrieveFormattingFormats(localeInfoResolved.locale, localeInfoResolved.timeZone);
  Object.defineProperty( localeInfoResolved, `formatOptions`, { value, enumerable: false });
  return localeInfoResolved;
}

function localeInfoValidator({ locale, timeZone, l, tz, logError = false} = {}) {
  try {
    return addFormatOptions(Intl.DateTimeFormat(locale || l, {timeZone: timeZone || tz}).resolvedOptions());
  } catch (error) {
    logError && console.error(`localeValidator: invalid input, using computer locale`);
    return localLocaleInfo || addFormatOptions(Intl.DateTimeFormat().resolvedOptions()); }
}

function setLocaleInfo({locale, timeZone, l, tz} = {}) {
  return addFormatOptions(localeInfoValidator({locale, timeZone, l, tz}, true));
}

function valiDate(date) {
  return !Number.isNaN(+date) &&
    date?.constructor === Date &&
    !date?.toISOString?.().startsWith("1970-01-01T00:00:00")
    ?  date : new Date();
}

function retrieveDateValueFromInput(input) {
  const now = new Date();
  
  switch(true) {
    case input?.constructor === String:
      return valiDate(new Date(input));
    case Array.isArray(input) && input.map(Number).length === input.length:
      return input.length === 1 ? new Date(input[0], 0, 1) : new Date(...input);
    case input?.constructor === Date:
      return valiDate(input);
    default: return now;
  }
}

function timeAcrossZones({timeZoneDate, timeZoneID, userTimeZoneID} = {}) {
  const localTZ = {timeZone: localeInfoValidator({timeZone: timeZoneID}).timeZone};
  const remoteTZ = {timeZone: localeInfoValidator({timeZone: userTimeZoneID || ""}).timeZone};
  const localDate = xDate(timeZoneDate, localTZ);
  const remoteDate = xDate(timeZoneDate, remoteTZ);
  const diff = remoteDate.differenceTo(localDate);
  const offset = localDate.offsetFrom(remoteDate).offset;
  const [hours, minutes] = offset2Number(offset, true);
  const remote4Real = remoteDate.clone.add(`${hours} hours, ${minutes} minutes`);
  const equal = diff.equalDates;
  const timeDiffInWords = equal
    ? `No difference`
    : `Time offset ${offset}: ${remoteTZ.timeZone} is ${diff.clean} ${
        hours < 0 ? `behind` : `ahead of`} ${localTZ.timeZone}`;

  return {
    remoteTimezone: localTZ.timeZone,
    userTimezone: remoteTZ.timeZone,
    timeDifference: timeDiffInWords,
    result: {
      [localTZ.timeZone.replace(/\//, `_`)]: xDate(timeZoneDate).toString(`yyyy/mm/dd hh:mmi:ss`, `hrc:23`),
      [remoteTZ.timeZone.replace(/\//, `_`)]: remote4Real.toString(`yyyy/mm/dd hh:mmi:ss`, `hrc:23`),
    }
  };
}

function isNumberOrNumberString(value) {
  return !Number.isNaN(parseInt(value)) && !Number.isNaN(+value);
}

function aggregateDateAdder(value, instance, aggregatePart) {
  return value?.constructor === Number
    ? add2Date(instance, `${value} ${aggregatePart}`) : instance;
}

function retrieveAggregates(forInstance) {
  return {
    addYears(amount = 1) {
      return aggregateDateAdder(amount, forInstance, `years`);
    },
    addMonths(amount = 1) {
      return aggregateDateAdder(amount, forInstance, `months`);
    },
    addWeeks(amount = 1) {
      amount = amount?.constructor === Number ? amount * 7 : 1;
      return aggregateDateAdder(amount, forInstance, `days`);
    },
    addDays(amount = 1) {
      return aggregateDateAdder(amount, forInstance, `days`);
    },
    get nextYear() {
      return add2Date(forInstance, `1 year`);
    },
    get nextWeek() {
      return add2Date(forInstance, `7 days`);
    },
    get previousWeek() {
      return add2Date(forInstance, "-7 days");
    },
    get previousYear() {
      return add2Date(forInstance, `-1 year`);
    },
    get nextMonth() {
      return add2Date(forInstance, `1 month`);
    },
    get previousMonth() {
      return add2Date(forInstance, `-1 month`);
    },
    get tomorrow() {
      return add2Date(forInstance, `1 day`);
    },
    get yesterday() {
      return add2Date(forInstance, `-1 day`);
    },
  };
}

function getAggregates(instance, customExtras) {
  const aggregates = retrieveAggregates(instance);

  if (Object.keys(customExtras || {}).length > 0) {
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

function createCTORStaticMethods(ctor, customMethods) {
  Object.defineProperties(ctor, {
    now: {
      get() {
        return ctor(new Date());
      }
    },
    localeInformation: {
      get() { return localeInfoValidator(); },
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
      value(monthIndex, leapYear = false) {
        if (isNumberOrNumberString(monthIndex) && +monthIndex >= 1 && +monthIndex <= 12) {
          return new Date(leapYear ? 2000 : 2005, monthIndex, 0).getDate();
        }
        
        return `${monthIndex} should be a Number (1 (january) - 12 (december))`;
      },
    },
    yearCalendar: {
      value: calenderForYear,
    },
    monthCalendar: {
      value({year, monthNr, locale = `en-CA`} = {}) {
        const monthOk = isNumberOrNumberString(monthNr) && +monthNr >= 1 && +monthNr <= 12;
        locale = locale || localLocaleInfo.locale;
        year = isNumberOrNumberString(monthNr) ? +year : new Date().getFullYear();
        monthNr = monthOk ? +monthNr - 1 : undefined;
        
        if (monthOk) {
          return xDate.from(year, monthNr, 1)
            .relocate({locale})
            .fullMonth(locale);
        }
        
        return `${monthNr} should be a number (1 = january - 12 = december)`
      }
    },
    from: { value(...input) { return ctor(input); } },
    addCustom: {
      value( { name, method, enumerable = false, isGetter = false } = {} ) {
        if (name?.constructor === String && method?.constructor === Function && method.length > 0) {
          customMethods[name] = { method, enumerable, isGetter };
        }
      }
    },
    validateLocaleInformation: { value: localeInfoValidator },
    timeAcrossZones: { value: timeAcrossZones },
    weeksInYear: { value(year) { return getWeeksInYear(year, 31); }  },
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

function getTraps(exts) {
  return {
    get( target, key ) {
      if (key !== `toString`) {
        if (key in target && target[key]?.constructor === Function) {
          return (...args) => target[key](...args);
        }
        
        if (key in target) {
          return target[key];
        }
      }
      if (key in exts) {
        return exts[key];
      }
      
      return undefined;
    },
    set( target, key, value ) {
      if (typeof key !== `symbol` && key in exts) {
        exts[key] = value;
        return true;
      }
      
      target[key] = value;
      return true;
    },
    has: (target, key) => key in exts || key in target,
  };
}