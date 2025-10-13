import {
  daysInMonth, daysUntil, firstWeekday, format, getFullDate,
  getNames, getTime, toLocalString, getTimeValues, getDateValues,
  getDTValues, nextOrPrevious, setTimeParts, setDateParts,
  revalue, relocate, addParts2Date, compareDates, setLocaleInfo,
  getQuarter, hasDST, getWeeksInYear, removeTime, DSTActive,
  cloneInstance, timezoneAwareDifferenceTo, offsetFrom,
  getAggregatedInfo, toJSDateString, getDowNumber, fullMonth,
  localLocaleInfo, getISO8601Weeknr,
} from "./instanceHelpers.js";

import {getAggregates} from "./genericHelpers.js";

export default instanceCreator;

function instanceCreator({localeInfo, customMethods, dateValue} = {}) {
  let instance;
  const customDateExtensions = {
    add(...args) { return addParts2Date(instance, ...args); },
    between({start, end, include} = {}) { return compareDates(instance, {start, end, include}); },
    cloneWith(date) { return cloneInstance(instance, date); },
    daysUntil(nextDate) { return daysUntil(instance, nextDate); },
    differenceTo(date) { return timezoneAwareDifferenceTo({start: instance, end: date}); },
    differenceUntil(date) { return instance.differenceTo(date).clean; },
    firstWeekday({sunday = false, midnight = false} = {}) { return firstWeekday(instance, {sunday, midnight}); },
    format(formatStr, moreOptions) { return format(instance, {formatStr, moreOptions}); },
    fullMonth(forLocale) { return fullMonth(instance, forLocale); },
    isFuture(date) { return compareDates(instance, {start: instance, end: date, future: true}); },
    isPast(date) { return compareDates(instance, {start: instance, end: date, past: true}); },
    next(day, preserveTodayWhenEqual) { return nextOrPrevious(instance, {day, next: true, preserveTodayWhenEqual: !!preserveTodayWhenEqual}); },
    offsetFrom(date) { return offsetFrom(instance, date); },
    previous(day, preserveTodayWhenEqual) { return nextOrPrevious(instance, {day, next: false, preserveTodayWhenEqual: !!preserveTodayWhenEqual}); },
    relocate({locale, timeZone, l, tz} = {}) { return relocate(instance, {locale, timeZone, l, tz}); },
    revalue(date) { instance = revalue(instance, date); return instance; },
    setDateValues({year, month, date} = {}) { return setDateParts(instance, {year, month, date}); },
    setTimeValues({hours, minutes, seconds, milliseconds} = {}) {
      return setTimeParts(instance, {hours, minutes, seconds, milliseconds}); },
    subtract(...args) { return addParts2Date(instance, `subtract,` + args.join(`,`)); },
    toArray(local = false) { return getDTValues(instance, local); },
    toString({template, formatOptions, local} = {}) {
      return toJSDateString(instance, {withFormat: template, withFormatOptions: formatOptions, local}); },
    values(local = false) { return local ? instance.dateTime : instance.zoneDateTime; },
    zoneFormat(formatStr, moreOptions) { return format(instance, {zoneTime: true, formatStr, moreOptions}); },
    
    set date({year, month, date}) { setDateParts(instance, {year, month, date}); },
    set dateNr(n) { setDateParts(instance, {date: n }); },
    set hours(n) { setTimeParts(instance, {hours: n}); },
    set localeInfo({locale, timeZone, l, tz}) { localeInfo = setLocaleInfo({locale, timeZone, l, tz}); },
    set milliseconds(n) { setTimeParts(instance, {milliseconds: `${n}`}); },
    set minutes(n) { setTimeParts(instance, {minutes: n}); },
    set month(n) { setDateParts(instance, {month: n}); },
    set seconds(n) { setTimeParts(instance, {seconds: n}); },
    set time({hours, minutes, seconds, milliseconds}) { setTimeParts(instance, {hours, minutes, seconds, milliseconds}); },
    set year(n) { setDateParts(instance, {year: n}); },
    
    get age() { return instance.differenceTo(new Date()).years; },
    get ageFull() { return instance.differenceTo(new Date()).clean; },
    get clone() { return cloneInstance(instance); },
    get date() { return getFullDate(instance, true); },
    get dateNr()  { return instance.date.date; },
    get dateTime() { return {...instance.date, ...instance.time}; },
    get dateTimeValues() { return getDTValues(instance, true); },
    get dateValues() { return getDateValues(instance, true); },
    get day() { return instance.getDay(); },
    get dayName() { return instance.names.dayName; },
    get daysThisMonth() { return daysInMonth(instance); },
    get DSTActive() { return DSTActive(instance); },
    get hasDST() { return hasDST(instance); },
    get hours() { return instance.time.hours; },
    get info() { return getAggregatedInfo(instance); },
    get isLeapYear() { return new Date(instance.getFullYear(), 2, 0).getDate() === 29; },
    get ISO() { return instance.toISOString(); },
    get local() { return toLocalString(instance); },
    get localDate() { return toLocalString(instance, {dateOnly: true}); },
    get locale() { return ( localeInfo || setLocaleInfo() ).locale; },
    get localeInfo() { return localeInfo },
    get localeString() { return toLocalString(instance); },
    get localTime() { return toLocalString(instance, {timeOnly: true}); },
    get milliseconds() { return instance.getMilliseconds(); },
    get minutes() { return instance.time.minutes; },
    get month() { return instance.date.month; },
    get monthName() { return instance.names.monthName; },
    get names() { return getNames(instance); },
    get quarter() { return getQuarter(instance); },
    get quarterNr() { return getQuarter(instance, true); },
    get removeTime() { return removeTime(instance); },
    get seconds() { return instance.time.seconds; },
    get time() { return getTime(instance, true); },
    get timeValues() { return getTimeValues(instance, true); },
    get timeZone() { return ( localeInfo || setLocaleInfo() ).timeZone; },
    get unixEpochTimestamp() { return Math.floor(+instance/1000); },
    get userLocaleInfo() { return localLocaleInfo; },
    get UTC() { return instance.clone.relocate({locale: instance.locale, timeZone: `UTC`}); },
    get UTCOffset() { return offsetFrom(instance, `UTC`); },
    get value() { return new Date(instance); },
    get weeknr() { return getISO8601Weeknr(instance); },
    get weeksInYear() { return getWeeksInYear(instance.year, 31); },
    get year() { return instance.date.year; },
    get zoneDate() { return getFullDate(instance, false); },
    get zoneDateNr()  { return instance.zoneDate.date; },
    get zoneDateTime() { return {...instance.zoneDate, ...instance.zoneTime}; },
    get zoneDateTimeValues() { return getDTValues(instance, false); },
    get zoneDateValues() { return getDateValues(instance, false); },
    get zoneDay() { return getDowNumber(instance, true); },
    get zoneDayname() { return instance.zoneNames.dayName; },
    get zoneHours() { return instance.zoneTime.hours; },
    get zoneMinutes() { return instance.zoneTime.minutes; },
    get zoneMonth() {return instance.zoneDate.month; },
    get zoneMonthname() {return instance.zoneNames.monthName; },
    get zoneNames() { return getNames(instance, true); },
    get zoneSeconds() { return instance.zoneTime.seconds; },
    get zoneTime() { return getTime(instance); },
    get zoneTimeValues() { return getTimeValues(instance); },
    get zoneYear() { return instance.zoneDate.year; },
    get zoneValues() { return instance.zoneDateTime; },
    get zoneArray() { return getDTValues(instance, false); },
  };
  
  if (!localeInfo && !dateValue) { return customDateExtensions; }
  
  customDateExtensions.localeInfo = localeInfo || setLocaleInfo();
  instance = new Proxy(dateValue, getTraps(customDateExtensions));
  
  Object.entries(Object.getOwnPropertyDescriptors(getAggregates(instance, customMethods)))
    .forEach( ([key, descriptor]) => Object.defineProperty(customDateExtensions, key, descriptor) );
  
  return Object.freeze(instance);
}

function getTraps(extensions) {
  return {
    get( target, key ) {
      return key !== `toString` && key in target
        ? target[key].bind(target) : Reflect.get(extensions, key);
    },
    set( target, key, value ) {
      return key in extensions && Reflect.set(extensions, key, value);
    },
  };
}
