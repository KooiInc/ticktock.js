const [digits, numeric, long, short] = [`2-digit`, `numeric`, `long`, `short`];
const allOptions = {
  fixed: {
    MM: {month: long},
    M: {month: short},
    m: {month: numeric},
    mm: {month: digits},
    yyyy: {year: numeric},
    yy: {year: digits},
    WD: {weekday: long},
    wd: {weekday: short},
    d: {day: numeric},
    dd: {day: digits},
    h: {hour: numeric},
    hh: {hour: digits},
    mi: {minute: numeric},
    mmi: {minute: digits},
    s: {second: numeric},
    ss: {second: digits},
    ms: {fractionalSecondDigits: 3},
    tz: {timeZoneName: `shortOffset`},
    dl: {locale: `default`},
    h12: {hour12: false},
    yn: {yearName: ``},
    ry: {relatedYear: true},
    msp: {fractionalSecond: true},
  },
  dynamic: {
    tzn: v => ({timeZoneName: v.slice(4)}),
    hrc: v => ({hourCycle: `h${v.slice(4)}`}),
    ds: v => ({dateStyle: v.slice(3)}),
    ts: v => ({timeStyle: v.slice(3)}),
    tz: v => ({timeZone: v.slice(3)}),
    e: v => ({era: v.slice(2)}),
    l: v => ({locale: v.slice(2)}),
  },
};
const dtfOptions = {
  ...allOptions,
  retrieveDynamic(fromValue) {
    const key = fromValue?.slice(0, fromValue?.indexOf(`:`));
    return allOptions.dynamic[key] && allOptions.dynamic[key](fromValue);
  },
  get re() {
    return new RegExp(`\\b(${Object.keys(allOptions.fixed).join(`|`)})\\b`, `g`);
  },
};

export default dateFormatter;

function dateFormatter(date, template, moreOptions = `l:default`) {
  return (/ds:|ts:/.test(moreOptions))
    ? dtNoParts(...[date, extractFromTemplate(undefined), moreOptions])
    : dtFormatted(...[date, extractFromTemplate(template || undefined), moreOptions]);
}

function extractFromTemplate(rawTemplateString = `dtf`, plainTextIndex = 0) {
  let formatStr = ` ${rawTemplateString
    .replace(/(?<=\{)(.+?)(?=})/g, _ => `[${plainTextIndex++}]`)
    .replace(/[{}]/g, ``)
    .trim()} `;
  const texts = rawTemplateString.match(/(?<=\{)(.+?)(?=})/g) || [];
  return {
    get texts() {
      return texts;
    },
    formatString(v) {
      formatStr = v;
    },
    set formatStr(v) {
      formatStr = v;
    },
    get formatStr() {
      return formatStr;
    },
    get units() {
      return formatStr.match(dtfOptions.re) || [];
    },
    finalize(dtf = ``, h12 = ``, era = ``, yn = ``) {
      return formatStr
        .replace(/~([\d+]?)/g, `$1`)
        .replace(/dtf/, dtf)
        .replace(/era/, era)
        .replace(/dp\b|~dp\b/, h12)
        .replace(/yn\b/, yn)
        .replace(/\[(\d+?)]/g, (_, d) => texts[d].trim())
        .trim();
    }
  };
}

function getOpts(...opts) {
  return opts?.reduce((acc, optValue) => {
    return ({...acc, ...(dtfOptions.retrieveDynamic(optValue) || dtfOptions.fixed[optValue]),});
  },
  dtfOptions.fixed.dl);
}

function dtNoParts(date, xTemplate, moreOptions) {
  const opts = getOpts(...removeSpacing(moreOptions).split(`,`));
  const formatted = Intl.DateTimeFormat(opts.locale, opts).format(date);
  return xTemplate.finalize(formatted);
}

function dtFormatted(date, xTemplate, moreOptions) {
  const optsCollected = getOpts(...xTemplate.units.concat(removeSpacing(moreOptions).split(`,`)).flat());
  const opts = {...dtfOptions.fixed};
  // note: numeric is locale independent
  const checkNumeric = (type, value) => optsCollected[type] === `numeric` && value.startsWith(`0`)
    ? value.slice(1) : value;
  const dtf = Intl.DateTimeFormat(optsCollected.locale, optsCollected)
    .formatToParts(date)
    .reduce((parts, v) =>
      ((v.type === `literal` && /[ ,/-]/.test(v.value)) ? parts : {
        ...parts,
        [v.type]: checkNumeric(v.type, v.value)
      }), {});
  opts.ms = optsCollected.fractionalSecondDigits ? opts.msp : opts.ms;
  opts.yyyy = dtf.relatedYear ? opts.ry : opts.yyyy;
  
  xTemplate.formatStr = xTemplate.formatStr
    .replace(dtfOptions.re, dtUnit =>
      /^(M|MM)$/.test(dtUnit)
        ? getMonthName(date, optsCollected.locale, optsCollected.timeZone, /^M$/.test(dtUnit))
        : dtf[Object.keys(opts[dtUnit]).shift()] || dtUnit);
  
  return xTemplate.finalize(...[undefined, dtf.dayPeriod, dtf.era, dtf.yearName]);
}

function getMonthName(forDate, locale, timeZone, shrt) {
  return forDate.toLocaleString(locale, {timeZone: timeZone, month: shrt ? short : long});
}

function removeSpacing(str) {
  return str.replace(/\s+/g, ``);
}
