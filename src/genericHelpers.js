import {add2Date, fullMonth, offset2Number, getWeeksInYear, dateFormat, DSTActive, hasDST} from "./instanceHelpers.js";
import instanceCreator from "./extensions.js";
import xDate from "../index.js";
const localLocaleInfo = addFormatOptions(Intl.DateTimeFormat().resolvedOptions());
const dateSetterSynonyms = Object.getOwnPropertyNames(Date.prototype).filter(k => k.startsWith(`set`))
  .reduce((acc, k) => [...acc,  {native: k, syn: `change`+ k.slice(3) }], []);
const errSymbol = "\u{1f6ab}";

export {
  localeWeekdays, localeMonthnames, localeInfoValidator, setLocaleInfo, localLocaleInfo,
  retrieveDateValueFromInput, getAggregates, createExtendedCTOR, isNumeric,
  retrieveFormattingFormats, aggregateDateAdder, instanceCreator,};

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
  year = isNumeric(year) ? parseInt(year) : new Date().getFullYear();
  const calendar = { year, calendar: {} };
  const monthNames = localeMonthnames().long.map(v => v.toLowerCase());
  
  for (let i = 0; i < 12; i += 1) {
    const firstDay = xDate.from(year, i, 1);
    calendar.calendar[monthNames[i]] = fullMonth(firstDay, locale);
  }
  
  return calendar;
}

function calendarForMonth({year, monthNr, locale = `en-CA`} = {}) {
  year = isNumeric(monthNr) && parseInt(year) || -1;
  monthNr = isNumeric(monthNr) && parseInt(monthNr) || new Date().getFullYear();
  const monthOk = monthNr >= 1 && monthNr <= 12;
  locale = localeInfoValidator({locale}).locale;
  monthNr = monthOk ? monthNr - 1 : undefined;
  
  if (monthOk) {
    return xDate.from(year, monthNr, 1)
      .relocate({locale})
      .fullMonth(locale);
  }
  
  return `MonthNr should be a specific number (1 = january - 12 = december)`;
}

function addFormatOptions(localeInfoResolved) {
  const value = retrieveFormattingFormats(localeInfoResolved.locale, localeInfoResolved.timeZone);
  return Object.defineProperty( localeInfoResolved, `formatOptions`, { value, enumerable: false });
}

function retrieveFormattingFormats(locale, timeZone) {
  return [
    `${locale && (!(Array.isArray(locale) && locale.length < 1)) ? `l:${locale}` : ``}`,
    `${timeZone ? `tz:${timeZone}` : ``}`]
    .filter(v => v).join(`,`);
}

function localeInfoValidator({ locale, timeZone, l, tz } = {}) {
  timeZone = timeZone || tz;
  locale = locale || l;
  
  if (!locale && ! timeZone) {
    return localLocaleInfo;
  }
  
  return tryMe({
    trial: function() {
      const verified = Intl.DateTimeFormat(locale, {timeZone}).resolvedOptions();
      
      if (locale && verified.locale !== locale) {
        console.error(`${errSymbol} Intl changed locale (using best fit) "${locale}" to "${verified.locale}"`);
      }
      
      return addFormatOptions(verified);
    },
    whenError: function(error) {
      switch(true) {
        case /incorrect locale/i.test(error.message):
          console.error(`${errSymbol}  Intl locale "${locale}" best fit impossible, using "${localLocaleInfo.locale}"`);
          return localeInfoValidator({locale: localLocaleInfo.locale, timeZone});
        case /invalid time zone/i.test(error.message):
          console.error(`${errSymbol} timeZone "${timeZone}" not valid. Using "${localLocaleInfo.timeZone}"`);
          return localeInfoValidator({locale, timeZone: localLocaleInfo.timeZone});
        default:
          return localLocaleInfo || addFormatOptions(Intl.DateTimeFormat().resolvedOptions());
      }
    }
  });
}

function setLocaleInfo({locale, timeZone, l, tz} = {}) {
  return localeInfoValidator({locale, timeZone, l, tz}, true);
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

function tryMe({trial, whenError = () => undefined} = {}) {
    if (trial?.constructor !== Function) { return undefined; }
    
    try {
      return trial();
    } catch (error) {
      return whenError?.constructor === Function ? whenError(error) : undefined;
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
      [localTZ.timeZone.replace(/\//, `_`)]: xDate(timeZoneDate).toString({template: `yyyy/mm/dd hh:mmi:ss`, formatOptions: `hrc:23`}),
      [remoteTZ.timeZone.replace(/\//, `_`)]: remote4Real.toString({template: `yyyy/mm/dd hh:mmi:ss`, formatOptions: `hrc:23`}),
    }
  };
}

function isNumeric(value) {
  return !Number.isNaN(parseInt(value));
}

function aggregateDateAdder(value, instance, aggregatePart) {
  return value?.constructor === Number
    ? add2Date(instance, `${value} ${aggregatePart}`) : instance;
}

function retrieveAggregates(forInstance) {
  const addSubtractAggregates = {
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
  
  for(const synonym of dateSetterSynonyms) {
    addSubtractAggregates[synonym.syn] = function(...args) {
      forInstance[synonym.native](...args);
      return forInstance;
    };
  }
  
  return addSubtractAggregates;
}

function getAggregates(instance, customExtras) {
  const aggregates = retrieveAggregates(instance);
  
  for (const [methodName, methodContainer] of Object.entries(customExtras || {})) {
    const enumerable = methodContainer.enumerable;
    const prop2Add = methodContainer.isGetter
      ? { get() { return methodContainer.method(instance); }, enumerable, }
      : { value(...args) { return methodContainer.method(instance, ...args); }, enumerable, };
    
    Object.defineProperty( aggregates, methodName, prop2Add);
  }
  
  return aggregates;
}

function createExtendedCTOR(ctor, customMethods) {
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
        monthIndex = isNumeric(monthIndex) ? parseInt(monthIndex) : 0;
        
        if (monthIndex >= 1 && monthIndex <= 12) {
          return new Date(leapYear ? 2000 : 2005, monthIndex, 0).getDate();
        }
        
        return `${monthIndex} should be a Number (1 (january) - 12 (december))`;
      },
    },
    yearCalendar: {
      value: calenderForYear,
    },
    monthCalendar: {
      value: calendarForMonth,
    },
    from: { value(...input) { return ctor(input); } },
    fromUxTS: { value(ts, localeInfo) {
        ts = isNumeric(ts) ? parseInt(ts) * 1000 : undefined;
        const maybeDate = ts ? new Date(ts) : new Date();
        return xDate(maybeDate, localeInfo || localLocaleInfo);
      }
    },
    hasDST: {
      value({date, timeZone} = {}) {
        return hasDST(date, timeZone);
      }
    },
    DSTActive: {
      value({date, timeZone} = {}) {
        return DSTActive(date, timeZone);
      }
    },
    values: {
      value({date, timeZone} = {}) {
        date = date || date?.value || new Date();
        const nrs = dateFormat(date, `yyyy-m-d-h-mi-s`, localeInfoValidator({timeZone}).formatOptions.concat(`,hrc:23`))
          .split(`-`)
          .map(Number)
          .concat(date.getMilliseconds());
        nrs[1] -= 1;
        return nrs;
      }
    },
    format: {
      value({date, template, timeZone, locale, opts} = {}) {
        date = date || date?.value || new Date();
        template = template?.constructor === String ? template : `yyyy/mm/dd hh:mmi:ss dp`;
        let formatOptions = localeInfoValidator({timeZone, locale}).formatOptions;
        formatOptions += opts ? `,${opts}` : ``;
        return dateFormat(date, template, formatOptions);
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
