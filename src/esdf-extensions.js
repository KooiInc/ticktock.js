import {
  daysInMonth, daysUntil, firstWeekday, format, getFullDate,
  getNames, getTime, toLocalString, getTimeValues, getDateValues,
  getDTValues, nextOrPrevious, setTimeParts, setDateParts,
  revalue, relocate, addParts2Date, compareDates, setLocaleInfo,
  getISO8601Weeknr, getWeeksInYear, getQuarter, hasDST,
  removeTime, DSTAcive, cloneInstance, timezoneAwareDifferenceTo,
  offsetFrom,
} from "./instanceHelpers.js";

export default instanceCreator;

function instanceCreator({instance, localeFormats, localeInfo} = {}) {
  const extensions = {
    format(formatStr, moreOptions) { return format(instance, formatStr, moreOptions); },
    daysUntil(nextDate) { return daysUntil(instance, nextDate); },
    revalue(date) { instance = revalue(instance, date); return instance; },
    firstWeekday({sunday = false, midnight = false} = {}) { return firstWeekday(instance, {sunday, midnight}); },
    next(day) { return nextOrPrevious(instance, {day, next: true}); },
    previous(day) { return nextOrPrevious(instance, {day}); },
    add(...args) { return addParts2Date(instance, ...args); },
    subtract(...args) { return addParts2Date(instance, ...[`subtract`].concat(args)); },
    clone(date) { return cloneInstance(instance, date); },
    differenceTo(date) { return timezoneAwareDifferenceTo({start: instance, end: date}); },
    relocate({locale, timeZone} = {}) { return relocate(instance, {locale, timeZone}); },
    offsetFrom(date) { return offsetFrom(instance, date); },
    between({start, end, include} = {}) { return compareDates(instance, {start, end, include}); },
    isPast(date) { return compareDates(instance, {start: date, before: true}); },
    isFuture(date) { return compareDates(instance, {start: date, before: false}); },
    DTLocalValues() { return getDTValues(instance, true); },

    // instance setters mutate
    set localeInfo({locale, timeZone}) { localeInfo = setLocaleInfo({locale, timeZone, validate: true}); },
    set year(n) { return setDateParts(instance, {year: n}); },
    set month(n) { return setDateParts(instance, {month: n}); },
    set hours(n) { return setTimeParts(instance, {hours: n}); },
    set minutes(n) { return setTimeParts(instance, {minutes: n}); },
    set seconds(n) { return setTimeParts(instance, {seconds: n}); },
    set milliseconds(n) { return setTimeParts(instance, {milliseconds: `${n}`}); },
    set time({hours, minutes, seconds, milliseconds} = {}) { return setTimeParts(instance, {hours, minutes, seconds, milliseconds}); },
    set date({year, month, date} = {}) { return setDateParts(instance, {year, month, date}); },
    
    get age() { return instance.differenceTo(new Date()).years; },
    get ageParts() { return instance.differenceTo(new Date()).full; },
    get localeString() { return toLocalString(instance); },
    get local() { return toLocalString(instance); },
    get ISO() { return instance.toISOString(); },
    get isLeapYear() { return new Date(instance.getFullYear(), 2, 0).getDate() === 29; },
    get names() { return getNames(instance); },
    get daysThisMonth() { return daysInMonth(instance); },
    get localeInfo() { return localeInfo },
    get timeZone() { return ( localeInfo || setLocaleInfo() ).timeZone; },
    get locale() { return ( localeInfo || setLocaleInfo() ).locale; },
    get formatStr() { return localeFormats; },
    get year() { return instance.getFullYear(); },
    get month() { return instance.date.month; },
    get dateSingle()  { return instance.date.date; },
    get hours() { return instance.time.hours; },
    get minutes() { return instance.time.minutes; },
    get seconds() { return instance.time.seconds; },
    get milliseconds() { return instance.getMilliseconds(); },
    get removeTime() { return removeTime(instance); },
    get time() { return getTime(instance); },
    get zoneTime() { return getTime(instance, true); },
    get timeValues() { return getTimeValues(instance); },
    get dateValues() { return getDateValues(instance); },
    get dateTimeValues() { return getDTValues(instance); },
    get date() { return getFullDate(instance); },
    get dateTime() { return Object.freeze({...instance.date, ...instance.time}); },
    get UTC() { return instance.clone().relocate({locale: instance.locale, timeZone: `Etc/UTC`}); },
    get UTCOffset() { return offsetFrom(instance); },
    get day() { return instance.getDay(); },
    get dayName() { return instance.names.dayName; },
    get weeknr() { return getISO8601Weeknr(instance); },
    get weeksInYear() { return getWeeksInYear(instance.year, 31); },
    get weekDay() { return instance.names.dayName; },
    get monthName() { return instance.names.monthName; },
    get quarter() { return getQuarter(instance); },
    get quarterNr() { return getQuarter(instance, true); },
    get hasDST() { return hasDST(instance); },
    get DSTActive() { return DSTAcive(instance); },
    get value() { return new Date(instance); },
    get isTT() { return true; },
  };

  Object.defineProperties(extensions, {
    proxy: { value(date, traps) { instance = new Proxy(date, traps); return instance; }, enumerable: false },
    addAggregates: { value(instance, aggregates2Add) {
      Object.entries(Object.getOwnPropertyDescriptors(aggregates2Add))
        .forEach( ([key, descriptor]) => Object.defineProperty(extensions, key, descriptor) );
    }, enumerable: false },
  });
  
  return extensions;
}