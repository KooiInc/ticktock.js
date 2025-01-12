import dateFormat from "./dateFormat.js";
import dateDiffFactory from "./dateDiffFactory.js";
import dateAddFactory from "./dateAddFactory.js";
import xDate from "../index.js";
import {localeMonthnames, localeWeekdays, setLocaleInfo,} from "./genericHelpers.js";

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

function daysUntil(instance, nextDate) {
  if (!nextDate?.clone) {
    nextDate = instance.clone().revalue(nextDate || instance);
  }
  
  const diffDays = dateDiff({
    start: instance.clone().midnight,
    end: (nextDate || instance).clone().midnight}).diffInDays;
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

function getDTValues(instance) {
  return instance.format("yyyy-m-d-h-mi-s").split(/-/).map(Number).concat(instance.getMilliseconds());
}

function daysInMonth(instance) {
  return new Date(instance.year, instance.month + 1, 0, 0, 0, 0).getDate();
}

function nextOrPrevious(instance, {day, next = false, forFirstWeekday = false} = {}) {
  let dayNr = weekdays(day?.toLowerCase());
  const cloned = xDate(new Date(...instance.dateValues));
  
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
}

function setTimeParts(instance, {hours, minutes, seconds, milliseconds} = {}) {
  isNumberOrString(hours) && instance.setHours(hours);
  isNumberOrString(minutes) && instance.setMinutes(minutes);
  isNumberOrString(seconds) && instance.setSeconds(seconds);
  isNumberOrString(milliseconds) && instance.setMilliseconds(milliseconds);
  return instance;
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
  if (!proxy[Symbol.for(`ESD`)]) {
    throw new TypeError(`ES-Date-Fiddler: invalid proxy`);
  }
  
  return proxy;
}

function extraHelpers(instance) {
  return {
    addYears(amount = 1) {
      add2Date(instance, `${amount} years`);
      return instance;
    },
    addMonths(amount = 1) {
      add2Date(instance, `${amount} months`);
      return instance;
    },
    addWeeks(amount = 1) {
      add2Date(instance, `${amount * 7} days`);
      return instance;
    },
    addDays(amount = 1) {
      add2Date(instance, `${amount} days`);
      return instance;
    },
    get nextYear() {
      add2Date(instance, `1 year`);
      return instance;
    },
    get nextWeek() {
      add2Date(instance, `7 days`);
      return instance;
    },
    get previousWeek() {
      add2Date(instance, "subtract, 7 days");
      return instance;
    },
    get previousYear() {
      add2Date(instance, `subtract, 1 year`);
      return instance;
    },
    get nextMonth() {
      add2Date(instance, `1 month`);
      return instance;
    },
    get previousMonth() {
      add2Date(instance, `subtract, 1 month`);
      return instance;
    },
    get tomorrow() {
      add2Date(instance, `1 day`);
      return instance;
    },
    get yesterday() {
      add2Date(instance, `subtract, 1 day`);
      return instance;
    },
  };
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