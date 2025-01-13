export {
  dateFromString, localeWeekdays, localeMonthnames, extendCTOR, localeValidator,
  setLocaleInfo, retrieveDateValueFromInput, currentLocalTime4TZ};

function dateFromString(dateString, YMDOrder = "ymd") {
  dateString = dateString?.trim();
  
  if (!dateString) { return new Date(); }
  
  const dsArray = dateString?.split(/[T :\-\/.,]/g).filter(v => !!(v.trim()));
  const getResult = () => {
    const formatMap = [...YMDOrder].reduce((a, b, i) => (a[b] = i, a), {});
    const datePart = dsArray.slice(0, 3);
    const timePart = dsArray.slice(3);
    const [year, month, date, hours, minutes, seconds, milliseconds] =
      [ +datePart[formatMap.y], +datePart[formatMap.m] - 1, +datePart[formatMap.d], ]
        .concat([...Array(4)].map( (_, i) => +timePart[i] || 0 ) );
    
    if (year < 1900) {
      return new Date(new Date( year, month, date, hours, minutes, seconds, milliseconds ).setFullYear(year) );
    }
    
    return new Date( year, month, date, hours, minutes, seconds, milliseconds );
  };
  const convert = {
    get cando() { return getResult(); },
    get cannot() {
      if (!dateString || dsArray?.length < 3) {
        console.error(`DateTools::parse: can't convert "${!dateString
          ? `empty date string`
          : dateString}" to ES-Date. Result will be current Date` );
        return true;
      }
    },
  }
  
  return convert.cannot ? new Date() : convert.cando;
}

function retrieveFormattingFormats(locale, timeZone) {
  return [
    `${locale && (!(Array.isArray(locale) && locale.length < 1)) ? `l:${locale}` : ``}`,
    `${timeZone ? `tz:${timeZone}` : ``}`]
    .filter(v => v).join(`,`);
}

function localeWeekdays(locale = `en-GB`) {
  locale = localeValidator({locale}).locale;
  return {
    long: [...Array(7).keys()]
      .map( v => new Date(Date.UTC(1970, 0, 4 + v) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, weekday: `long` }) ),
    short: [...Array(7).keys()]
      .map( v => new Date(Date.UTC(1970, 0, 4 + v) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, weekday: `short` }) ),
  };
}

function localeMonthnames(locale = "en-GB") {
  locale = localeValidator({locale}).locale;
  
  return {
    long: [...Array(12).keys()]
    .map( v => new Date(Date.UTC(1970, v, 1) )
      .toLocaleDateString(locale, { timeZone: `Etc/UTC`, month: `long` }) ),
    short: [...Array(12).keys()]
      .map( v => new Date(Date.UTC(1970, v, 1) )
        .toLocaleDateString(locale, { timeZone: `Etc/UTC`, month: `short` }) )
  };
}

function localeValidator({ locale, timeZone, logError = true } = {}) {
  const reportLocaleError = errLocale =>
    console.error(`invalid locale (time zone: "${errLocale.timeZone}", locale: "${
      errLocale.locale}"), associated your locale instead`);
  try {
    return Intl.DateTimeFormat(locale, {timeZone: timeZone}).resolvedOptions();
  } catch (err) {
    logError && reportLocaleError({locale, timeZone});
    return Intl.DateTimeFormat().resolvedOptions();
  }
}

function setLocaleInfo({locale, timeZone} = {}) {
  const info = localeValidator({locale, timeZone}, true);
  return Object.freeze({...info, formatOptions: retrieveFormattingFormats(info.locale, info.timeZone)});
}

function extendCTOR(ctor) {
  Object.defineProperties(ctor, {
    clone: {
      value: function clone(instance) { return instance?.clone() || ctor(); },
    },
    now: {
      get() { return ctor(); }
    },
    parse: {
      value(string, ymdOrder = `ymd`) {
        return ctor(dateFromString(string, ymdOrder));
      }
    },
    localWeekdayNames: {
      value({locale, format} = {}) {
        return localeWeekdays(locale, format);
      }
    },
    localMonthNames: {
      value({locale, format} = {}) {
        return localeMonthnames(locale, format);
      }
    },
    daysInMonth: {
      value(monthIndex) {
        if (monthIndex >= 1 && monthIndex <= 12) {
          return new Date(1970, monthIndex, 0).getDate();
        }
        return `${monthIndex} not between 1 and 12`;
      },
    }
  });
  
  return ctor;
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

function currentLocalTime4TZ(date, localeHere) {
  const tzRemote = {timeZone: date.localeInfo.timeZone, hourCycle: `h23`};
  const inTheZone = new Date(date.toLocaleString(`en-CA`, tzRemote));
  console.log(inTheZone);
  return {
    localDate: inTheZone.toLocaleDateString(),
    localTime: inTheZone.toLocaleTimeString(localeHere.locale, {hourCycle: `h23`}),
  };
}
