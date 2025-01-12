import {
  daysInMonth, daysUntil, firstWeekday, format, getFullDate,
  getNames,  getTime, toLocalString, getTimeValues, getDateValues,
  getDTValues, dateDiff, nextOrPrevious, setTimeParts, setDateParts,
  diffFromUTC, revalue, relocate, setProxy, add2Date, extraHelpers,
  xDate, compareDates, setLocaleInfo, getISO8601Weeknr, getWeeksInYear,
  getQuarter,
} from "./instanceHelpers.js";

export default instanceCreator;

function instanceCreator({instance,localeFormats, localeInfo} = {}) {
  const extensions = {
    format(formatStr, moreOptions) { return format(instance, formatStr, moreOptions); },
    daysUntil(nextDate) { return daysUntil(instance, nextDate); },
    revalue(date) { instance = revalue(instance, date); return instance; },
    firstWeekday({sunday = false, midnight = false} = {}) { return firstWeekday(instance, {sunday, midnight}); },
    next(day) { return nextOrPrevious(instance, {day, next: true}); },
    previous(day) { return nextOrPrevious(instance, {day}); },
    add(...args) { add2Date(instance, ...args); return instance; },
    subtract(...args) { add2Date(instance, ...[`subtract`].concat(args)); return instance; },
    clone() { return xDate(new Date(instance), instance.localeInfo); },
    differenceTo(date) { return dateDiff({start: instance.clone(), end: date}); },
    relocate({locale, timeZone} = {}) { localeInfo = relocate(instance, {locale, timeZone}); return instance; },
    offsetFrom(date) { return diffFromUTC(instance, date); },
    between(date1, date2) { return compareDates(instance, {start: date1, end: date2}); },
    isPast(date) { return compareDates(instance, {start: date, before: true}); },
    isFuture(date) { return compareDates(instance, {start: date, before: false}); },
    
    set localeInfo({locale, timeZone}) { localeInfo = setLocaleInfo({locale, timeZone, validate: true}); },
    set year(n) { isNumberOrString(n) && instance.setFullYear(+n); },
    set month(n) { isNumberOrString(n) && instance.setMonth(+n - 1); },
    set hours(n) { isNumberOrString(n) && instance.setHours(+n); },
    set minutes(n) { isNumberOrString(n) && instance.setMinutes(+n); },
    set seconds(n) { isNumberOrString(n) && instance.setSeconds(+n); },
    set milliseconds(n) { isNumberOrString(n) && instance.setMilliseconds(+n); },
    set time({hours, minutes, seconds, milliseconds} = {}) { return setTimeParts(instance, {hours, minutes, seconds, milliseconds}); },
    set date({year, month, date} = {}) { return setDateParts(instance, {year, month, date}); },
    
    get age() { return instance.differenceTo(new Date()).years; },
    get localeString() { return toLocalString(instance); },
    get local() { return toLocalString(instance); },
    get ISO() { return instance.toISOString(); },
    get isLeapYear() { return new Date(instance.getFullYear(), 2, 0).getDate() === 29; },
    get names() { return getNames(instance); },
    get daysInMonth() { return daysInMonth(instance); },
    get daysThisMonth() { return daysInMonth(instance); },
    get localeInfo() { return localeInfo },
    get timeZone() { return ( localeInfo || setLocaleInfo() ).timeZone; },
    get locale() { return ( localeInfo || setLocaleInfo() ).locale; },
    get midnight() { instance.clone().time = {hours: 0, minutes: 0, seconds: 0, milliseconds: 0}; return instance; },
    get formatStr() { return localeFormats; },
    get year() { return +instance.getFullYear(); },
    get month() { return +instance.getMonth(); },
    get dateValue()  { return instance.getDate(); },
    get hours() { return instance.getHours(); },
    get minutes() { return instance.getMinutes(); },
    get seconds() { return instance.getSeconds(); },
    get milliseconds() { return instance.getMilliseconds(); },
    get time() { return getTime(instance); },
    get timeValues() { return getTimeValues(instance); },
    get dateValues() { return getDateValues(instance); },
    get dateTimeValues() { return getDTValues(instance); },
    get date() { return getFullDate(instance); },
    get dateTime() { return Object.freeze({...instance.date, ...instance.time}); },
    get UTC() { return instance.clone().relocate({locale: instance.locale, timeZone: `Etc/UTC`}); },
    get UTCDiff() { return diffFromUTC(instance); },
    get offsetFromUTC() { return diffFromUTC(instance); },
    get day() { return instance.getDay(); },
    get weeknr() { return getISO8601Weeknr(instance); },
    get weeksInYear() { return getWeeksInYear(instance.year, 31); },
    get weekDay() { return instance.names.dayName; },
    get monthName() { return instance.names.monthName; },
    get quarter() { return getQuarter(instance); },
    get quarterNr() { return getQuarter(instance, true); },
  };
  
  Object.defineProperties(extensions, {
    proxy: { value(prx) { instance = setProxy(prx); return instance; }, enumerable: false },
    keys: { get() { return  Object.keys(extensions).sort( (a,b) => a.localeCompare(b)); } },
    addExtra: { value(instance) {
      const addHelpers = extraHelpers(instance);
      Object.entries(Object.getOwnPropertyDescriptors(addHelpers))
        .forEach( ([key, descriptor]) => Object.defineProperty(extensions, key, descriptor) );
    }, enumerable: false },
  });
  
  return extensions;
}