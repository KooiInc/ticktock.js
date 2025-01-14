import dateFormat from "./dateFormat.js";
import dateDiffFactory from "./dateDiffFactory.js";
import dateAddFactory from "./dateAddFactory.js";
import xDate from "../index.js";
import {localeMonthnames, localeValidator, localeWeekdays, setLocaleInfo} from "./genericHelpers.js";

const dateDiff = dateDiffFactory();
const weekdays = weekdayFactory();
const add2Date = dateAddFactory();

export {
  toLocalString,
  format,
  daysUntil,
  getNames,
  getTime,
  getFullDate,
  firstWeekday,
  daysInMonth,
  dateDiff,
  getTimeValues,
  getDateValues,
  getDTValues,
  nextOrPrevious,
  setTimeParts,
  setDateParts,
  diffFromUTC,
  revalue,
  relocate,
  setProxy,
  add2Date,
  extraHelpers,
  localeWeekdays,
  localeMonthnames,
  xDate,
  setLocaleInfo,
  compareDates,
  getISO8601Weeknr,
  getWeeksInYear,
  getQuarter,
  hasDST,
  removeTime,
  DSTAcive,
  cloneInstance,
  timezoneAwareDifferenceTo,
};

function compareDates(instance, {start, end, before} = {}) {
  const instnc = instance.clone().UTC;
  start = xDate(start).UTC;
  
  if (!Number.isNaN(+start) && !end) {
    return before ? +instnc < +start : +instnc > +start
  }
  
  end = xDate(end).UTC;
  
  return +instnc > +start && +instnc < +end;
}

function format(instance, formatStr, moreOptions) {
  if (!instance.localeInfo) {
    instance.localeInfo = setLocaleInfo();
  }
  
  return dateFormat(new Date(instance), formatStr, moreOptions || instance.localeInfo.formatOptions);
}

function equalizeDateTimes(first, second) {
  return {
    first: xDate(first || new Date()).removeTime,
    second: xDate(second || new Date()).removeTime,
  };
}

function daysUntil(instance, nextDate) {
  const {first: start, second: end} = equalizeDateTimes(instance, nextDate);
  const diffDays = dateDiff({start, end}).diffInDays;
  const isNegative = diffDays > 0 && +nextDate < +instance;
  return isNegative ? -diffDays : diffDays;
}

function getNames(instance) {
  const {locale, timeZone, formats} = instance.localeInfo;
  const monthAndDay = instance.format(`MM|WD`, formats).split(`|`);
  
  return { locale, timeZone,
    monthName: monthAndDay[0],
    dayName: monthAndDay[1],
    dayNames: localeWeekdays(instance.locale),
    monthNames: localeMonthnames(instance.locale),
  };
}

function getTime(instance) {
  const [hours, minutes, seconds, milliseconds] = getTimeValues(instance);
  
  return Object.freeze({ hours, minutes, seconds, milliseconds, });
}

function getFullDate(instance) {
  const [year, month, date] = getDateValues(instance);
  
  return Object.freeze({ year, month, date, });
}

function firstWeekday(instance, {sunday = false, midnight = false} = {}) {
  return nextOrPrevious(instance, { day: sunday ? `sun` : `mon`, midnight, forFirstWeekday: true }) ;
}

function getTimeValues(instance) {
  return instance.format("h-mi-s").split(/-/).map(Number).concat(instance.getMilliseconds());
}

function getDateValues(instance) {
  const values = instance.format("yyyy-m-d").split(/-/).map(Number);
  values[1] -= 1;
  return values;
}

function timezoneAwareDifferenceTo({start, end} = {}) {
  end = end?.clone?.() ?? xDate(end);
  const instanceDate = new Date(...start.dateTimeValues);
  const comparisonDate = new Date(...end.dateTimeValues);
  return dateDiff({start: instanceDate, end: comparisonDate});
}

function getDTValues(instance) {
  return instance.format("yyyy-m-d-h-mi-s").split(/-/).map(Number).concat(instance.getMilliseconds());
}

function daysInMonth(instance) {
  return new Date(instance.year, instance.month + 1, 0, 0, 0, 0).getDate();
}

function nextOrPrevious(instance, {day, next = false, forFirstWeekday = false} = {}) {
  let dayNr = weekdays(day?.toLowerCase());
  const cloned = xDate(new Date(...instance.dateValues), instance.localeInfo);
  
  if (dayNr < 0) { console.log(`wtf`, day, dayNr ); return cloned; }
  
  let today = cloned.getDay();
  
  if (forFirstWeekday && today === dayNr) { return instance; }
  
  let addTerm = next ? 1 : -1 ;
  
  return findDayRecursive(today);
  
  function findDayRecursive(day) {
    return day !== dayNr
      ? findDayRecursive(cloned.add(`${addTerm} days`).getDay())
      : cloned;
  }
}

function toLocalString(instance) {
  if (!instance.localeInfo) {
    instance.localeInfo = setLocaleInfo();
  }
  const {locale, timeZone} = instance.localeInfo;
  return new Date(instance).toLocaleString(locale, {timeZone});
}

function currentLocalTime4TZ(timeZoneID) {
  timeZoneID = {timeZone: timeZoneID, hourCycle: `h23`};
  return new Date(new Date().toLocaleString(`en`, timeZoneID));
}

function diffFromUTC(instance, compareTo) {
  return diffFromUTCTo(instance, compareTo ? compareTo : xDate({timeZone: `Etc/UTC`}));
}

function diffFromUTCTo(instance, compareTo) {
  if (!compareTo.clone) { return `00:00`; }
  
  const instanceDate = currentLocalTime4TZ(instance.timeZone);
  const utcDate = currentLocalTime4TZ(compareTo.timeZone);
  const diffDate = new Date(Math.abs(instanceDate - utcDate));
  const isNegative = instanceDate < utcDate;
  let [hours, minutes] = [`${diffDate.getHours()}`.padStart(2, `0`), `${diffDate.getMinutes()}`.padStart(2, `0`)];
  const prefix = isNegative ? `-` : hours === `00` && minutes === `00` ? `` : `+`;
  return `${prefix}${hours}:${minutes}`;
}

function setDateParts(instance, {year, month, date} = {}) {
  if (isNumberOrString(year)) { instance.setFullYear(year); }
  if (isNumberOrString(date)) { instance.setDate(date); }
  if (isNumberOrString(month)) { instance.setMonth(month - 1); }
  return instance;
}

function setTimeParts(instance, {hours, minutes, seconds, milliseconds} = {}) {
  isNumberOrString(hours) && instance.setHours(hours);
  isNumberOrString(minutes) && instance.setMinutes(minutes);
  isNumberOrString(seconds) && instance.setSeconds(seconds);
  isNumberOrString(milliseconds) && instance.setMilliseconds(milliseconds);
  return instance;
}

function cloneInstance(instance, date) {
  date = new Date(date);
  date = isNaN(date) ? instance.value : date;
  return xDate(date, instance.localeInfo);
}

function weekdayFactory() {
  const dow = {
    short: `sun,mon,tue,wed,thu,fri,sat`.split(`,`),
    long: `sunday,monday,tuesday,wednesday,thursday,friday,saturday`.split(`,`),
  };
  
  return function(day) {
    if (!day) { return -1 }
    let dayNr = dow.short.indexOf(day);
    return dayNr < 0 ? dow.long.indexOf(day) : dayNr;
  };
}

function setProxy(proxy) {
  return proxy;
}

function extraHelpers(instance) {
  return {
    addYears(amount = 1) {
      const clone = instance.clone();
      add2Date(clone, `${amount} years`);
      return clone;
    },
    addMonths(amount = 1) {
      const clone = instance.clone();
      add2Date(clone, `${amount} months`);
      return clone;
    },
    addWeeks(amount = 1) {
      const clone = instance.clone();
      add2Date(clone, `${amount * 7} days`);
      return clone;
    },
    addDays(amount = 1) {
      const clone = instance.clone();
      add2Date(clone, `${amount} days`);
      return clone;
    },
    get nextYear() {
      const clone = instance.clone();
      add2Date(clone, `1 year`);
      return clone;
    },
    get nextWeek() {
      const clone = instance.clone();
      add2Date(clone, `7 days`);
      return clone;
    },
    get previousWeek() {
      const clone = instance.clone();
      add2Date(clone, "subtract, 7 days");
      return clone;
    },
    get previousYear() {
      const clone = instance.clone();
      add2Date(clone, `subtract, 1 year`);
      return clone;
    },
    get nextMonth() {
      const clone = instance.clone();
      add2Date(clone, `1 month`);
      return clone;
    },
    get previousMonth() {
      const clone = instance.clone();
      add2Date(clone, `subtract, 1 month`);
      return clone;
    },
    get tomorrow() {
      const clone = instance.clone();
      add2Date(clone, `1 day`);
      return clone;
    },
    get yesterday() {
      const clone = instance.clone();
      add2Date(clone, `subtract, 1 day`);
      return clone;
    },
  };
}

function offset2Number(dtStr) {
  return +(dtStr.slice(dtStr.indexOf(`+`) + 1).replace(`:`, ``)) || 0;
}

function removeTime(instance) {
  instance = instance || xDate();
  return xDate(new Date(instance.year, instance.month, instance.date.date));
}

function hasDST(instance) {
  const timeZone = instance.timeZone;
  const dt1 = new Date(instance.year, 0, 1, 14);
  const dt2 = new Date(new Date(dt1).setMonth(6));
  const fmt = Intl.DateTimeFormat(`en-CA`, {
    year: `numeric`,
    timeZone: timeZone,
    timeZoneName: "shortOffset",
  });
  const [fmt1, fmt2] = [fmt.format(dt1), fmt.format(dt2)];
  return offset2Number(fmt1) - offset2Number(fmt2) !== 0;
}

function DSTAcive(instance) {
  if (instance.hasDST) {
    const dtJanuary = new Date(instance.year, 0, 1, 14, instance.hours, instance.minutes, instance.seconds);
    return dtJanuary.hours !== instance.hours;
  }
  
  return false;
}

function relocate(instance, {locale, timeZone} = {}) {
  const localeInfo = {
    locale: locale || instance.locale,
    timeZone: timeZone || instance.timeZone
  };
  
  return setLocaleInfo(localeInfo);
}

function revalue(instance, date) {
  if (!date instanceof Date) { return instance; }
  return xDate(date, instance.localeInfo);
}

function isNumberOrString(value) {
  return !(Number.isNaN(parseInt(value)) && Number.isNaN(+value));
}

function getWeeksInYear(year, date) {
  const currentWeek = getISO8601Weeknr(new Date(year, 11, date));
  return currentWeek === 1 ? getWeeksInYear(year, date-1) : currentWeek;
}

function getQuarter(instance, numeric) {
  const currentMonth = instance.month;
  switch(true) {
    case currentMonth < 3: return numeric ? 1 : `First`;
    case currentMonth < 6: return numeric ? 2 : `Second`;
    case currentMonth < 9: return numeric ? 3 : `Third`;
    case currentMonth < 12: return numeric ? 4 : `Fourth`;
  }
}

function getISO8601Weeknr(instance) {
  const clone = new Date(instance);
  const dayn = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - dayn + 3);
  const firstThursday = clone.valueOf();
  clone.setMonth(0, 1);
  
  if (clone.getDay() !== 4) {
    clone.setMonth(0, 1 + ((4 - clone.getDay()) + 7) % 7);
  }
  
  return 1 + Math.ceil((firstThursday - clone) / 604800000);
}