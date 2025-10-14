import dateFormat from "./dateFormatter.js";
import dateDiffFactory from "./Factories/dateDiffFactory.js";
import dateAddFactory from "./Factories/dateAddFactory.js";
import xDate from "../index.js";
import {
  isNumeric,
  localeInfoValidator,
  localeMonthnames,
  localeWeekdays,
  localLocaleInfo,
  retrieveFormattingFormats,
  setLocaleInfo,
} from "./genericHelpers.js";

const dateDiff = dateDiffFactory();
const weekdays = weekdayFactory();
const add2Date = dateAddFactory();
const wdShort = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const wdLong = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export {
  add2Date, addParts2Date, cloneInstance, compareDates, daysInMonth, daysUntil,
  DSTActive, firstWeekday, format, fullMonth, getAggregatedInfo, getDateValues,
  getDowNumber, getDTValues, getFullDate, getISO8601Weeknr, getNames, getQuarter,
  getTime, getTimeValues, getWeeksInYear, hasDST, localeInfoValidator, localeMonthnames,
  localeWeekdays, localLocaleInfo, nextOrPrevious, offset2Number, offsetFrom, pad0,
  relocate, removeTime, revalue, setDateParts, setLocaleInfo, setTimeParts,
  timezoneAwareDifferenceTo,toJSDateString,toLocalString, dateFormat, weekFor
};

function addParts2Date(instance, ...parts2Add) {
  add2Date(instance, ...parts2Add);
  return instance;
}

function weekFor(instance, sunday = false) {
  const firstDOW = firstWeekday(instance.clone, {sunday});
  const week = [firstDOW];
  return {
    weekStart: firstDOW.format(`WD`, `l:en-GB`),
    inputDate: instance,
    dates: week.concat([...Array(6)].map((_, i) =>
      firstDOW.clone.addDays(i + 1)))
  };
}

function compareDates(instance, {start, end, future, past, include = {start: false, end: false}} = {}) {
  const instnc = instance.clone.UTC;
  start = start?.value || start?.constructor === Date ? xDate(start?.value || start).UTC : xDate.now.UTC;
  end = end && end?.value || end?.constructor === Date ? xDate(end?.value || end).UTC : xDate.now.UTC;
  instnc.milliseconds = 0;
  start.milliseconds = 0;
  end.milliseconds = 0;
  
  return future ? start > end : past ? start < end :
    (include.start ? +instnc >= +start : +instnc > +start) && (include.end ? +instnc <= +end : +instnc < +end);
}

function format(instance, {zoneTime = false, formatStr, moreOptions} = {}) {
  moreOptions = zoneTime
    ? instance.localeInfo.formatOptions + (moreOptions ? `,${moreOptions}` : '')
    : localLocaleInfo.formatOptions + (moreOptions ? `,${moreOptions}` : '');
  
  if (!zoneTime) {
    return formatLocal(instance, formatStr, moreOptions);
  }
  /* node:coverage disable */
  if (!instance.localeInfo) {
    instance.localeInfo = localLocaleInfo;
  }
  /* node:coverage enable */
  
  return dateFormat(instance, formatStr, moreOptions);
}

function formatLocal(instance, formatStr, options) {
  const localized = instance.clone.relocate(localLocaleInfo);
  
  options = (options || ``).startsWith(`+`)
    ? `${localized.localeInfo.formatOptions},${options.slice(1)}`
    : options || localized.localeInfo.formatOptions;
  return dateFormat(localized, formatStr, options);
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
  const tzOpt = !inUserTimeZone ? `tz:${instance.timeZone}` : `tz:${localLocaleInfo.timeZone}`;
  const opts = `l:en-CA,${tzOpt},hrc:23,ts:medium`;
  
  return instance.format("", opts)
    .split(/:/)
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

function getFirstDayFromLocale(instance) {
  let firstDayFromLocale = instance.localeInfo.weekInfo?.firstDay;
  firstDayFromLocale = firstDayFromLocale > 6 ? 0 : firstDayFromLocale;
  return wdLong[firstDayFromLocale || 1];
}

function firstWeekday(instance, {sunday = false} = {}) {
  const day = sunday ? `sunday` : getFirstDayFromLocale(instance);
  return nextOrPrevious(instance, { day, preserveTodayWhenEqual: true});
}

function zoneDiff(d1, d2) {
  let gmt1 = d1.toString().match(/GMT([+-])\d+/)?.[0]?.slice(3) ?? `+0000`;
  let gmt2 = d2.toString().match(/GMT([+-])\d+/)?.[0]?.slice(3) ?? `+0000`;
  gmt1 = offset2Number(gmt1.slice(0, 3) + `:` + gmt1.slice(-2), true);
  gmt2 = offset2Number(gmt2.slice(0, 3) + `:` + gmt2.slice(-2), true);
  return [-gmt1[0] + gmt2[0], -gmt1[1] + gmt2[1]].map(v => gmt1[0] < 0 ? -v : v);
}

function timezoneAwareDifferenceTo({start, end} = {}) {
  /* node:coverage disable */
  if (!end) {
    end = start.clone;
  }
  /* node:coverage enable */
  
  if (!end?.clone) {
    end = xDate(end, {timeZone: start.timeZone});
  }

  start = xDate(DTInTimezone(start, start.timeZone), {timeZone: start.timeZone});
  end = xDate(DTInTimezone(end, end.timeZone), {timeZone: end.timeZone});
  const diff = dateDiff({start, end, diffs: {timeZoneStart: start.timeZone, timeZoneEnd: end.timeZone}});
  const diffZones = zoneDiff(end, start);
  const aheadBehind = diff.sign.startsWith(`-`) ? `ahead of` : `behind`;
  const [hr, mi] = diffZones.map(v => Math.abs(v));
  const [hours, minutes] = [
    `${hr} ${maybePlural(hr, `hour`)}`,
    `${mi} ${maybePlural(mi, `minute`)}` ];
  
  diff.timeZonesOffsetDifference = diff.sign.length < 1 || hr + mi === 0
    ? `Offsets of ${start.timeZone} and ${end.timeZone} are equal`
    : `${start.timeZone} is ${hours}${mi > 0 ? ` and ${minutes}` : ``} ${aheadBehind} ${end.timeZone}`;
  return diff;
}

function offsetFrom(instance, from) {
  const isUTC = String(from).toLowerCase() === `utc` || from.timeZone === `UTC`;
  from = isUTC
    ? instance.clone.relocate({timeZone: `UTC`})
    : xDate(instance.value, { timeZone: from.timeZone || localLocaleInfo.timeZone });
  
  const diff = timezoneAwareDifferenceTo({start: instance.clone, end: from});
  const sign = diff.sign;
  const offset = `${sign}${pad0(diff.hours)}:${pad0(diff.minutes)}`;
  
  return {
    fromTZ: instance.timeZone,
    toTZ: from.timeZone,
    offset,
    offsetText: `${from.timeZone} ${timeDiffenceInWords(offset)} ${instance.timeZone}`
  };
}

function pad0(number2Pad, n = 2) {
  return `${number2Pad}`.padStart(n, `0`);
}

function maybePlural(value, word) {
  return `${word}${value > 1 || value === 0 ? `s` : ``}`;
}

function timeDiffenceInWords(diffInfo) {
  if (/00:00/.test(diffInfo)) { return `no time diffence to`; }
  const hoursAndMinutes = diffInfo.slice(1).split(`:`).map(Number);
  const [hours, minutes] = hoursAndMinutes;
  const hoursTxt = maybePlural(hours, `hour`);
  const minutesTxt = maybePlural(minutes, `minute`);
  const later = diffInfo.startsWith(`+`);
  
  return minutes > 0
    ? `${hours} ${hoursTxt} and ${minutes} ${minutesTxt} ${later ? `ahead of`: `behind`}`
    : `${hours} ${hoursTxt} ${later ? `ahead of`: `behind`}`;
}

function toFormattedJSDateString(instance, formatString, formatOptions) {
  return instance.clone.format(formatString, formatOptions || instance.localeInfo.formatOptions);
}

function toJSDateString(instance, {withFormat, withFormatOptions, local=false} = {}) {
  if (withFormat) {
    return local
      ? toFormattedJSDateString(instance, withFormat, $D.localeInformation.formatOptions)
      : toFormattedJSDateString(instance, withFormat, withFormatOptions);
  }
  
  const instanceEN = instance.clone.relocate({locale: `en`});
  const fmtOpts = local ? localLocaleInfo.formatOptions : instanceEN.localeInfo.formatOptions;
  const gmtString = instanceEN.format(`tz`, fmtOpts + `,tzn:longOffset`).replace(`:`, ``);
  const formatString = `wd M dd yyyy hh:mmi:ss ${gmtString} (tz)`;
  return instanceEN.format(formatString, fmtOpts + `,tzn:long, hrc:23`);
}

function getDowNumber(instance, remote = false) {
  const dayFormat = Intl.DateTimeFormat(`en`, {
    timeZone: remote ? instance.timeZone : localLocaleInfo.timeZone,
    weekday: "short",
  });
  
  return weekdays(dayFormat.format(instance));
}

function getAggregatedInfo(instance) {
  const userZone = localLocaleInfo;
  const remoteZone = instance.localeInfo;
  const localInstance = instance.clone.relocate({locale: userZone.locale, timeZone: userZone.timeZone});
  const timeDifferenceUserLocal2Remote = instance.offsetFrom(localInstance);
  const timeDifferenceRemote2UserLocal = localInstance.offsetFrom(instance);
  const local = userZone;
  const remote = remoteZone;
  const pmRemote = instance.format(`hh:mmi:ss dp`, `hrc:12,tz:${instance.timeZone}`);
  const pmLocal = localInstance.format(`hh:mmi:ss dp`, `hrc:12,tz:${localInstance.timeZone}`);
  const userData = {
    note: "'user' are values for your locale/timeZone, 'remote' (if applicable) idem for the instance",
    locales: {
      user: {locale: local.locale, timeZone: local.timeZone},
    },
    dateTime: {
      user: {
        ...instance.dateTime,
        monthName: localInstance.monthName,
        weekdayNr: localInstance.day,
        weekdayName: localInstance.dayName,
        dayPeriodTime: pmLocal,
        hasDST: localInstance.hasDST,
        DSTActive: localInstance.DSTActive,
        offsetFromRemote: timeDifferenceUserLocal2Remote.offset,
        string: localInstance.toString()
      },
    },
    offset: {
      fromUTC: instance.UTC.offsetFrom(instance).offsetText,
    }
  };
  
  if (remoteZone.timeZone !== userZone.timeZone) {
    userData.locales.remote = {locale: remote.locale, timeZone: remote.timeZone };
    userData.dateTime.remote = {
      ...instance.zoneDateTime,
      monthName: instance.zoneNames.monthName,
      weekdayNr: getDowNumber(instance, true),
      weekdayName: instance.zoneNames.dayName,
      dayPeriodTime: pmRemote,
      hasDST: instance.hasDST,
      DSTActive: instance.DSTActive,
      offsetFromUser: timeDifferenceRemote2UserLocal.offset,
      string: instance.toString(),
    };
    
    userData.offset.fromUserTime = timeDifferenceRemote2UserLocal.offsetText;
  }
  
  return userData;
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
    ];
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
  forLocale = localeInfoValidator({locale: forLocale || instance.localeInfo.locale}).locale;
  const firstDay = instance.clone.relocate({locale: forLocale});
  firstDay.date = { date: 1 };
  return [firstDay].concat([...Array(daysInMonth(firstDay)-1)].map( (v, i) => firstDay.clone.add(`${i+1} days`) ));
}

function nextOrPrevious(instance, {day, next = false, preserveTodayWhenEqual = false} = {}) {
  day = day?.toLowerCase() || `-`;
  const dayNr = weekdays(day);
  
  if (dayNr < 0) {
    console.error(`[TickTock instance].next/previous invalid day value ${day}`);
    return instance.clone;
  }
  
  const addTerm = next ? 1 : -1 ;
  let cloned = xDate(new Date(...instance.dateTimeValues), instance.localeInfo);
  return preserveTodayWhenEqual && dayNr === cloned.day
    ? cloned
    : findDayRecursive(cloned.addDays(next ? 1 : -1), dayNr, addTerm);
}

function findDayRecursive(instance, dayNr, addTerm) {
  function findIt(d) {
    switch(true) {
      case d.day === dayNr: return d;
      default: return findIt(d.add(`${addTerm} days`));
    }
  }
  
  return findIt(instance);
}

function toLocalString(instance, {dateOnly = false, timeOnly = false} = {}) {
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
  if (isNumeric(year)) { instance.setFullYear(parseInt(year)); }
  if (isNumeric(date)) { instance.setDate(parseInt(date)); }
  if (isNumeric(month)) { instance.setMonth(parseInt(month)); }
  return instance;
}

function setTimeParts(instance, {hours, minutes, seconds, milliseconds} = {}) {
  if (isNumeric(hours)) { instance.setHours(parseInt(hours)); }
  if (isNumeric(minutes)) { instance.setMinutes(parseInt(minutes)); }
  if (isNumeric(seconds)) { instance.setSeconds(parseInt(seconds)) }
  if (isNumeric(milliseconds)) { instance.setMilliseconds(parseInt(milliseconds)); }
  return instance;
}

function isDateOrInstance(maybeDate) {
  return maybeDate?.constructor === Date || maybeDate?.value;
}

function cloneInstance(instance, date) {
  if (isDateOrInstance(date)) {
    return xDate(date?.value || date, instance.localeInfo);
  }

  return xDate.from(...instance.dateTimeValues).relocate(instance.localeInfo);
}



function weekdayFactory() {
  // const dow = {
  //   short: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  //   long: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  // };

  return function(day) {
    day = `${day}`.toLowerCase();
    let dayNr = wdShort.indexOf(day);
    return dayNr < 0 ? wdLong.indexOf(day) : dayNr;
  };
}

function offset2Number(offsetString) {
  let values = offsetString.slice(1).split(/[-:]/).map(Number);
  const minus = offsetString.startsWith('-');
  values = values.map(v => minus ? -v : v);
  return values;
}

function removeTime(instance) {
  instance.time = {hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
  return instance;
}

function getTimezoneName(dt, timeZone) {
  return Intl.DateTimeFormat(`en-CA`, {timeZone, timeZoneName: `long`})
    .format(dt).split(/,/)[1].trim();
}

function hasDST(instance, timeZone) {
  timeZone = timeZone || instance?.timeZone || localLocaleInfo.timeZone;
  instance = instance?.value
    ? instance : instance?.constructor === Date
      ? xDate(instance, {timeZone}) : xDate({timeZone});
  const year = instance.year || instance.getFullYear();
  const janTZN = getTimezoneName(new Date(year, 0, 1), timeZone);
  const midYrTZN = getTimezoneName(new Date(year, 5, 1), timeZone);
  return janTZN !== midYrTZN;
}

function DSTActive(instance, timeZone) {
  timeZone = timeZone || instance?.timeZone || localLocaleInfo.timeZone;
  instance = instance?.hasDST
    ? instance : instance?.constructor === Date
      ? xDate(instance, {timeZone}) : xDate({timeZone});
  return instance.hasDST ? !/standard/i.test(instance.toString()) : false;
}

function relocate(instance, {locale, timeZone, l, tz} = {}) {
  instance.localeInfo = localeInfoValidator({
    locale: l || locale || instance.l || instance.locale,
    timeZone: tz || timeZone || instance.tz || instance.timeZone,
  });
  
  return instance;
}

function revalue(instance, date) {
  if (!isDateOrInstance(date)) { return instance; }
  instance = xDate(date.value || date, date.localeInfo || instance.localeInfo);
  return instance;
}

function getWeeksInYear(year, d) {
  const currentWeek = getISO8601Weeknr(new Date(year, 11, d || 31));
  return currentWeek === 1 ? getWeeksInYear(year, (d || 31) - 1) : currentWeek;
}

function getQuarter(instance, numeric) {
  const currentMonth = instance.month;
  switch(true) {
    case currentMonth < 3: return numeric ? 1 : `First`;
    case currentMonth < 6: return numeric ? 2 : `Second`;
    case currentMonth < 9: return numeric ? 3 : `Third`;
    case currentMonth < 12: return numeric ? 4 : `Fourth`;
    default: return `unknown`;
  }
}

function getISO8601Weeknr(date) {
  const clone = new Date(date);
  const dayn = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - dayn + 3);
  const firstThursday = clone.valueOf();
  clone.setMonth(0, 1);

  if (clone.getDay() !== 4) {
    clone.setMonth(0, 1 + ((4 - clone.getDay()) + 7) % 7);
  }

  return 1 + Math.ceil((firstThursday - clone) / 604800000);
}
