import dateFormat from "./dateFormat.js";
import dateDiffFactory from "./dateDiffFactory.js";
import dateAddFactory from "./dateAddFactory.js";
import xDate from "../index.js";
import {
  localeMonthnames, localeInfoValidator, localeWeekdays,
  setLocaleInfo, isNumberOrNumberString, localLocaleInfo,
  retrieveFormattingFormats,
} from "./genericHelpers.js";

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
  getTimeValues,
  getDateValues,
  getDTValues,
  nextOrPrevious,
  setTimeParts,
  setDateParts,
  revalue,
  relocate,
  setProxy,
  addParts2Date,
  add2Date,
  localeWeekdays,
  localeMonthnames,
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
  offset2Number,
  offsetFrom,
  getAggregatedInfo,
  localeInfoValidator,
  toJSDateString,
  getDowNumber,
  fullMonth,
  localLocaleInfo,
  pad0,
};

function addParts2Date(instance, ...parts2Add) {
  add2Date(instance, ...parts2Add);
  return instance;
}

function compareDates(instance, {start, end, before, include = {start: false, end: false}} = {}) {
  const instnc = instance.clone.UTC;
  start = start?.value || start?.constructor === Date ? xDate(start?.value || start).UTC : xDate.now.UTC;
  instnc.milliseconds = 0;
  start.milliseconds = 0;
  
  if (!Number.isNaN(+start) && !end) {
    return before ? +instnc < +start : +instnc > +start
  }

  end = xDate(end).UTC;

  return (include.start ? +instnc >= +start : +instnc > +start) &&
    (include.end ? +instnc <= +end : +instnc < +end);
}

function format(instance, formatStr, moreOptions) {
  if (!instance.localeInfo) {
    instance.localeInfo = setLocaleInfo();
  }
  moreOptions = moreOptions || instance.localeInfo.formatOptions;
  return dateFormat(instance, formatStr, moreOptions);
}

function daysUntil(instance, nextDate) {
  const diff = dateDiff({start: instance, end: nextDate || instance});
  return parseInt(`${diff.sign}${diff.diffInDays}`);
}

function getNames(instance, forLocale = false) {
  const { locale, timeZone, } = forLocale ? instance.localeInfo : localLocaleInfo;
  const formatOptions = retrieveFormattingFormats(locale, timeZone);
  const monthAndDay = instance.format(`MM|WD`, formatOptions).split(`|`);

  return {
    locale,
    timeZone,
    monthName: monthAndDay[0],
    dayName: monthAndDay[1],
    dayNames: localeWeekdays(locale),
    monthNames: localeMonthnames(locale),
  };
}

function getTime(instance, inUserTimezone = false) {
  const [hours, minutes, seconds, milliseconds] = getTimeValues(instance, inUserTimezone);
  const values4Timezone = !inUserTimezone ? instance.timeZone : localLocaleInfo.timeZone
  const returnValue = { values4Timezone, hours, minutes, seconds, milliseconds };

  return Object.freeze(returnValue);
}

function getTimeValues(instance, inUserTimeZone = false) {
  const tzOpt = !inUserTimeZone ? `,tz:${instance.timeZone}` : `,tz:${localLocaleInfo.timeZone}`;
  const opts = `l:en-CA${tzOpt},hrc:23`;
  
  return instance.format("hh-mmi-ss", opts)
    .split(/-/)
    .map(Number)
    .concat(instance.getMilliseconds());
}

function getFullDate(instance, inUserTimeZone) {
  const tzOpt = !inUserTimeZone ? `,tz:${instance.timeZone}` : `tz:${localLocaleInfo.timeZone}`;
  let [year, month, date] = instance.format(`yyyy-mm-dd`, tzOpt).split(/-/) .map(Number);
  month -= 1;
  const values4Timezone = !inUserTimeZone ? instance.timeZone : localLocaleInfo.timeZone;
  
  return Object.freeze({ values4Timezone, year, month, date, });
}

function getDateValues(instance, inUserTimezone = true) {
  if (inUserTimezone) {
    return [instance.getFullYear(), instance.getMonth(), instance.getDate()];
  }
  
  const values = instance.format("yyyy-m-d", instance.localeInfo.formatOptions).split(/-/).map(Number);
  values[1] -= 1;
  return values;
}

function firstWeekday(instance, {sunday = false} = {}) {
  return nextOrPrevious(instance, { day: sunday ? `sunday` : `monday` }) ;
}

function timezoneAwareDifferenceTo({start, end} = {}) {
  if (!end?.clone) {
    end = xDate(end, {timeZone: start.timeZone});
  }

  if (!end) {
    end = start.clone;
  }

  start = xDate(DTInTimezone(start, start.timeZone), {timeZone: start.timeZone});
  end = xDate(DTInTimezone(end, end.timeZone), {timeZone: end.timeZone});

  return dateDiff({start, end, diffs: {timeZoneStart: start.timeZone, timeZoneEnd: end.timeZone}});
}

function flipSign(sign) {
  return sign === `+` ? `-` : `+`;
}

function offsetFrom(instance, from) {
  const isUTC = String(from).toLowerCase() === `utc`;
  from = isUTC
    ? instance.clone.relocate({timeZone: `UTC`})
    : xDate(instance.value, { timeZone: from.timeZone || localLocaleInfo.timeZone });
  
  const diff = timezoneAwareDifferenceTo({start: instance.clone, end: from});
  const sign = !isUTC ? diff.sign : flipSign(diff.sign);

  return {
    fromTZ: instance.timeZone,
    toTZ: from.timeZone,
    offset: `${sign}${pad0(diff.hours)}:${pad0(diff.minutes)}`
  };
}

function pad0(number2Pad, n = 2) {
  return `${number2Pad}`.padStart(n, `0`);
}

function maybePlural(value, word) {
  return `${word}${value > 1 ? `s` : ``}`;
}

function timeDiffenceInWords(diffInfo) {
  if (/00:00/.test(diffInfo)) { return `no time diffence to`; }
  const hoursAndMinutes = diffInfo.slice(1).split(`:`).map(Number);
  const [hours, minutes] = hoursAndMinutes;
  const later = diffInfo.at(0) === `+`;
  return minutes > 0
    ? `${hours} ${maybePlural(hours, `hour`)} and ${minutes} ${
      maybePlural(minutes, `minute`)} ${later ? `ahead of`: `behind`}`
    : `${hours} ${maybePlural(hours, `hour`)} ${later ? `ahead of`: `behind`}`;
}

function toFormattedJSDateString(instance, formatString, formatOptions) {
  return instance.clone.format(formatString, formatOptions || instance.localeInfo.formatOptions);
}

function toJSDateString(instance, withFormat, withFormatOptions) {
  if (withFormat) {
    return toFormattedJSDateString(instance, withFormat, withFormatOptions);
  }
  
  const instanceEN = instance.clone.relocate({locale: `en`});
  const gmtString = instanceEN.format(`tz`, instanceEN.localeInfo.formatOptions + `,tzn:longOffset`).replace(`:`, ``);
  const formatString = `wd M dd yyyy hh:mmi:ss ${gmtString} (tz)`;
  return instanceEN.format(formatString, instanceEN.localeInfo.formatOptions + `,tzn:long, hrc:23`);
}

function getDowNumber(instance, remote = false) {
  const dayFormat = Intl.DateTimeFormat(`en-CA`, {
    timeZone: remote ? instance.timeZone : localLocaleInfo.timeZone,
    weekday: "short",
  });
  
  return weekdays(dayFormat.format(instance).toLowerCase());
}

function getAggregatedInfo(instance) {
  const localInstance = instance.clone
    .relocate({locale: instance.userLocaleInfo.locale, timeZone: instance.userLocaleInfo.timeZone});
  const timeDifferenceUserLocal2Remote = instance.offsetFrom(localInstance).offset;
  const timeDifferenceRemote2UserLocal = localInstance.offsetFrom(instance).offset;
  const local = instance.userLocaleInfo;
  const remote = instance.localeInfo;
  const pmRemote = instance.format(`hh:mmi:ss dp`, `hrc:12,tz:${instance.timeZone}`);
  const pmLocal = localInstance.format(`hh:mmi:ss dp`, `hrc:12,tz:${localInstance.timeZone}`);
  
  return {
    note: "'user' are values for your locale/timeZone, 'remote' idem for the instance",
    locales: {
      user: {locale: local.locale, timeZone: local.timeZone },
      remote: {locale: remote.locale, timeZone: remote.timeZone }
    },
    dateTime: {
      user: {
        ...instance.dateTime,
        monthName: localInstance.monthName,
        weekdayNr: getDowNumber(localInstance),
        weekdayName: localInstance.dayName,
        dayPeriodTime: pmLocal,
        hasDST: localInstance.hasDST,
        DSTActive: localInstance.DSTActive,
        offsetFromRemote: timeDifferenceRemote2UserLocal,
        string: localInstance.toString()
      },
      remote: {
        ...instance.zoneDateTime,
        monthName: instance.zoneNames.monthName,
        weekdayNr: getDowNumber(instance, true),
        weekdayName: instance.zoneNames.dayName,
        dayPeriodTime: pmRemote,
        hasDST: instance.hasDST,
        DSTActive: instance.DSTActive,
        offsetFromUser: timeDifferenceUserLocal2Remote,
        string: instance.toString(),
      },
    },
    offset: {
      fromUserTime: `${instance.timeZone} ` + timeDiffenceInWords(timeDifferenceUserLocal2Remote)
        + ` ${localInstance.timeZone}`,
      fromUTC: `${instance.timeZone} ` + timeDiffenceInWords(instance.UTCOffset.offset) + ` GMT`
    },
  };
}

function getDTValues(instance, local = true) {
  if (local) {
    return [
      instance.getFullYear(),
      instance.getMonth(),
      instance.getDate(),
      instance.getHours(),
      instance.getMinutes(),
      instance.getSeconds(),
      instance.getMilliseconds()
    ]
  }

  const numbers = instance.format("yyyy-m-d-hh-mmi-ss", `${instance.localeInfo.formatOptions},hrc23:true`)
    .split(/-/)
    .map(Number)
    .concat(instance.getMilliseconds());
  numbers[1] -= 1;
  return numbers;
}

function daysInMonth(instance) {
  return new Date(instance.year, instance.month + 1, 0, 0, 0, 0).getDate();
}

function fullMonth(instance, forLocale) {
  const firstDay = instance.clone.relocate({locale: localeInfoValidator({locale: forLocale || `en`}).locale});
  firstDay.date = { date: 1 };
  return [firstDay].concat([...Array(daysInMonth(firstDay)-1)].map( (v, i) => firstDay.clone.add(`${i+1} days`) ));
}

function nextOrPrevious(instance, {day, next = false} = {}) {
  let dayNr = weekdays(day?.toLowerCase());
  const cloned = xDate(new Date(...instance.dateTimeValues), instance.localeInfo);
  
  if (dayNr < 0) {
    console.error(`[TickTock instance].next/previous invalid day value ${day}`);
    return cloned;
  }
  
  let addTerm = next ? 1 : -1 ;
  
  return findDayRecursive(cloned, dayNr, addTerm);
}

function findDayRecursive(cloned, dayNr, addTerm) {
  return add2Date(cloned, `${addTerm} day`).getDay() < dayNr
    ? findDayRecursive(cloned, dayNr, addTerm)
    : cloned;
}

function toLocalString(instance, {dateOnly = false, timeOnly = false} = {}) {
  if (!instance.localeInfo) {
    instance.localeInfo = setLocaleInfo();
  }
  const {locale, timeZone} = instance.localeInfo;
  return dateOnly
    ? new Date(instance).toLocaleDateString(locale, {timeZone})
    : timeOnly
      ? new Date(instance).toLocaleTimeString(locale, {timeZone})
      : new Date(instance).toLocaleString(locale, {timeZone});
}

function DTInTimezone(date, timeZoneID) {
  const timeZoneInfo = {timeZone: timeZoneID, hourCycle: `h23`};
  return new Date(new Date(date).toLocaleString(`en`, timeZoneInfo));
}

function setDateParts(instance, {year, month, date} = {}) {
  if (isNumberOrNumberString(year)) { instance.setFullYear(year); }
  if (isNumberOrNumberString(date)) { instance.setDate(date); }
  if (isNumberOrNumberString(month)) { instance.setMonth(month); }
  return true;
}

function setTimeParts(instance, {hours, minutes, seconds, milliseconds} = {}) {
  if (isNumberOrNumberString(hours)) { instance.setHours(hours); }
  if (isNumberOrNumberString(minutes)) { instance.setMinutes(minutes); }
  if (isNumberOrNumberString(seconds)) { instance.setSeconds(seconds) }
  if (isNumberOrNumberString(milliseconds)) { instance.setMilliseconds(milliseconds); }
  return true;
}

function cloneInstance(instance, date) {
  if (date?.constructor === Date || date?.value) {
    return xDate(date?.value || date, instance.localeInfo);
  }

  return xDate.from(...instance.dateTimeValues).relocate(instance.localeInfo);
}

function weekdayFactory() {
  const dow = {
    short: `sun,mon,tue,wed,thu,fri,sat`.split(`,`),
    long: `sunday,monday,tuesday,wednesday,thursday,friday,saturday`.split(`,`),
  };

  return function(day) {
    day = `${day}`.toLowerCase();
    let dayNr = dow.short.indexOf(day);
    return !isNumberOrNumberString(dayNr) && dow.long.findIndex(v => v === day);
  };
}

function setProxy(proxy) {
  return proxy;
}

function offset2Number(offsetString, all = false) {
  if (all) {
    let values = offsetString.slice(1).split(/[-:]/).map(Number);
    const minus = offsetString.slice(0, 1) === `-`;
    values = values.map(v => minus ? -v : v);
    return values;
  }
  
  return Number(offsetString.split(/[+-]/).slice(-1)[0].replace(/:/, ``));
}

function removeTime(instance) {
  instance.time = {hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
  return instance;
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
  const [fmt1, fmt2] = [offset2Number(fmt.format(dt1)), offset2Number(fmt.format(dt2))];
  
  return fmt1 - fmt2 !== 0;
}

function DSTAcive(instance) {
  if (instance.hasDST) {
    const dtJanuary = instance.clone;
    dtJanuary.month = 1;
    dtJanuary.date = 1;

    return dtJanuary.format(`tz`, `${dtJanuary.localeInfo.formatOptions},tzn:shortOffset`) !==
      instance.format(`tz`, `${instance.localeInfo.formatOptions},tzn:shortOffset`);
  }

  return false;
}

function relocate(instance, {locale, timeZone} = {}) {
  instance.localeInfo = localeInfoValidator({
    locale: locale || instance.locale,
    timeZone: timeZone || instance.timeZone,
  });
  
  return instance;
}

function revalue(instance, date) {
  if ((date?.value?.constructor || date?.constructor) !== Date) { return instance; }
  instance = xDate(date.value || date, date.localeInfo || instance.localeInfo);
  return instance;
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