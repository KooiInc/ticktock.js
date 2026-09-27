/* region import and initialize */
import $D from "../index.js";
import styleIt from "./Resource/StyleDocument.js";
import {$, logFactory} from "./Resource/htmlhelpers.min.js";
const start = performance.now();
styleIt($);
const loader = $.div({class: "spin"}, `Loading...`).render;
window.$D = $D; // use in console for testing
const templates = await fetchTemplates();
const {log: print} = logFactory();
const debug =  /localhost/.test(location.host);
/* endregion import and initialize */

/* region initialVariables */
const { initialCode, performanceCode, aucklandFormatEx, now$FormatEx, aucklandZoneFormatEx,
  acrossZonesEx0, acrossZonesEx1, acrossZonesEx2, fullMonth, yearCalendar, customs,
  customSyntax } = getCodeblocks();
const browserTZ = $D.localeInformation.timeZone;
const browserLocale = $D.localeInformation.locale;
const now$ = $D.now;
const chongqin = $D({l: `zh`, timeZone: "Asia/Chongqing"});
const auckland = $D({timeZone: "Pacific/Auckland", l:"en"});
const vancouver = now$.clone.relocate({locale: `en-CA`, timeZone: `America/Vancouver`});
const paris = $D({timeZone: "Europe/Paris"}).add("2 days, 3 hours, 22 minutes");
const berlin = $D({l: "de-DE", tz: "Europe/Berlin"});
const la = $D({timeZone: "America/Los_Angeles"});
const taiohae = $D.from(2025, 0, 1, 7, 0, 0);
const utc = $D.fromUxTS(+now$.value/1000).UTC;
taiohae.localeInfo = {tz: "Pacific/Marquesas"};
utc.hours += 3;
utc.minutes -= 15;
const detailBlocks = allBlocks();
initialize();
/* endregion initialVariables */

/* region header */
function printHeader() {
  print(...detailBlocks.headerElements());
  
  if (!debug) {
    const createClock = clockFactory();
    const myClock = $.div({class: `clockLine`, id: `demoClock`}).render;
    createClock({parent: myClock});
    const headerDims = $(`pre:first-child`).dimensions;
    const clockDims = myClock.dimensions;
    myClock.style({
      left: (headerDims.left + headerDims.width - clockDims.width - 14) + `px`,
      top: (headerDims.top) + 12 + `px`,
    });
  }
}
/* endregion header */

/* region All examples */
/* region instantiation */
print(
  toDetailChapter(`Instantiation`, `inst`,
    $.div(
      {class: `xtraTxt`},
      `There are several ways to create a TickTock date instance. Here are a few examples.`,
      $.div($.b({class: "note"}),
      `Instances are displayed using the by TickTock module `, $.code(`toString`), ` method.`
      )
    ),
  )
);
$(`#inst`).data.set({detailBlockId: `instantiationBlocks`});
/* endregion instantiation */

/* region ex:locale/timeZone */
print( toDetailChapter(`locale/timeZone`, `ltz`,) );
$(`#ltz`).data.set({detailBlockId: `localeTZBlock`});
/* endregion locale/timeZone */

/* region ex:toString */
print( toDetailChapter(`toString`, `tstr`) );
$(`#tstr`).data.set({detailBlockId: `toStringBlock`});
/* endregion toString */

/* region ex:Names */
print( toDetailChapter(`Names`, `names`) );
$(`#names`).data.set({detailBlockId: `namesBlock`});
/* endregion Names */

/* region ex:Difference */
print( toDetailChapter( `Difference`, `difference` ) );
$(`#difference`).data.set({detailBlockId: `differenceBlock`});
/* endregion Difference */

/* region ex:Date/time values */
print( toDetailChapter(`Date/time values`, `dtvalues`) );
$(`#dtvalues`).data.set({detailBlockId: `DTValuesBlock`});
/* endregion Date/time values */

/* region ex:Offset */
print( toDetailChapter(`Offset (from)`, `offset` ) );
$(`#offset`).data.set({detailBlockId: `offsetBlock`});
/* endregion Offset */

/* region ex:Info */
print( toDetailChapter(`Info`, `info`) );
$(`#info`).data.set({detailBlockId: `infoBlock`});
/* endregion Info */

/* region ex:Format */
print( toDetailChapter(`Format`, `format`) );
$(`#format`).data.set({detailBlockId: `formatBlock`});
/* endregion Format */

/* region ex:timeAcrossZones */
print( toDetailChapter(`Time across timezones`, `taz`) );
$(`#taz`).data.set({detailBlockId: `acrossTZSBlock`});
/* endregion ex:timeAcrossZones */

/* region ex:daysInMonth */
print( toDetailChapter(`Days in month`, `dim`,) );
$(`#dim`).data.set({detailBlockId: `daysInMonthBlock`});
/* endregion ex:daysInMonth */

/* region ex:weeksInYear */
print( toDetailChapter(`Weeks in year`, `wiy`,) )
$(`#wiy`).data.set({detailBlockId: `weeksInYearBlock`});
/* endregion ex:daysInMonth */

/* region ex:fullMonth */
print( toDetailChapter(`Full month localized calendar`, `fm` ) );
$(`#fm`).data.set({detailBlockId: `fullMonthBlock`});
function monthExampleReducer(acc, v) {
  if (v.dateNr < 3  || v.dateNr > 27 ) {
    const formatted  = v.zoneFormat(`WD d MM yyyy hh:mmi:ss dp`);
    const value2Concat = v.dateNr === 28 ? [`...`, formatted] : [formatted];
    
    return [...acc, ...value2Concat];
  }
  
  return acc;
}
function getFullMonth() {
  const monthLocal = $D(`2000/02/12`)
    .fullMonth()
    .reduce(monthExampleReducer, []);
  
  const monthPT = $D("2000/02/12").fullMonth("pt")
    .reduce(monthExampleReducer, []);
  
  const monthTH = $D("2000/02/12").fullMonth("th")
    .reduce(monthExampleReducer, []);
  
  const monthDeFromStatic = $D.monthCalendar({year: 2000, monthNr: 2, locale: `de-DE`})
    .reduce(monthExampleReducer, []);
  
  return [monthPT, monthTH, monthLocal, monthDeFromStatic];
}
/* endregion ex:fullMonth */

/* region ex:yearCalendar */
print( toDetailChapter(`Full year localized calendar`, `yc`));
$(`#yc`).data.set({detailBlockId: `yearCalendarBlock`});

function yearCalendarEx() {
  const calendar = $D.yearCalendar({year: 2000, locale: `hu`}).calendar;
  const months = Object.keys(calendar);
  return `<ul>${Object.values(calendar).reduce((acc, month, i) =>
    acc.concat(`<li><b>${months[i]}</b>: [${month.shift().zoneFormat(`WD d MM yyyy`)}, ..., ${
      month.pop().zoneFormat(`WD d MM yyyy`)}]</li>`), "")}</ul>`
}
/* endregion ex:yearCalendar */

/* region ex:customs */
customsExample();
print( toDetailChapter(`Create custom methods/getters`, `custms`,) );
$(`#custms`).data.set({detailBlockId: `customsBlock`});

function customsExample() {
// a custom, non enumerable getter
  $D.addCustom({name: "addCentury", method: instance => instance.clone.add("100 years"), isGetter: true});
  
  // a custom, enumerable method
  function qToCustomString(instance, showDate = true) {
    return ` Results for the ${instance.quarter.toLowerCase()} quarter ${
      (showDate ? `(${instance.local})` : "")}`;
  }
  $D.addCustom( {
    name: "quarterString",
    method: qToCustomString,
    enumerable: true } );
}
/* endregion ex:customs */

/* endregion All examples */

/* region finishIt */
hljs.highlightAll();
$(`.codeblock`).first$().closest(`li`).append(
  $.div(
      $.span({style: `display: inline-block;`},
      $.button({id: "bttnOpenClose", data: {allopen: 0}}, `all chapters`),
      $.button({id: `bttnPerformance`}, `About performance`)
    ), debug &&
      $.span(
        $.span(`page load time: `, $.b(((performance.now() - start)/1000).toFixed(3)), ` seconds, `),
        $.span(
          ` $D instances used: `,
          $.span({data: {instanceCounter: 1}, style: `font-weight: bold;`}, `${$D.now.iCounts}`)
        )
      ) || ``,
  )
);
$(`.spin`).remove();
/* endregion finishIt */

/* region performance */
function createPerformancePopup() {
  const perf = perfRunner();
  $.editCssRules(
    `#jqxPopupContent {
      code {
        max-width: 97%;
      }
     }`
  );
  $.Popup.show({
      content: $.div({class: `perf`},
        $.div(`TickTock is not really fast ...`),
        $.ul(
          $.li({class: `head`}, `Created 1500 <code>TickTock</code> - and 1500 <code>Date</code> instances,
                  and changed every instance Date value using <code>setDate</code>`),
          $.li(`<code>TickTock</code> instances`, $.span(` => ${perf[0]}`)),
          $.li(`<code>Date</code> instances`,
            $.span(` => ${perf[1]}`)),
        ),
        $.div({class: `xtraTxt`},  $.b({class: `red`}, `Conclusion`),
          `: consider `, $.b($.i({class: `red`}, `not`)), ` (or selectively)
            using TickTock. In other words, TickTock is especially useful for
            its extensions, not for bulk processing JS Date Objects.`)
      )
    }
  );
}


function perfRunner() {
  const results = [];
  const opts1 = {minimumFractionDigits: 3, maximumFractionDigits: 3};
  const opts2 = {minimumFractionDigits: 6, maximumFractionDigits: 6};
  let perfStart = performance.now(), perfEnd;
  for (let i = 0; i < 1500; i += 1) {
    $D.now.setDate(i + 1);
  }
  perfEnd = performance.now() - perfStart;
  let seconds = perfEnd/1000;
  let perIterationS = (seconds/1500).toLocaleString(browserLocale, opts2) + ` seconds`;
  seconds = seconds.toLocaleString(browserLocale, opts1);
  results.push(`creation in ${seconds} seconds, ${
    perIterationS} <i>per iteration</i>`);
  // ---
  perfStart = performance.now();
  for (let i = 0; i < 1500; i += 1) {
    new Date(new Date().setDate(i + 1));
  }
  perfEnd = performance.now() - perfStart;
  seconds = perfEnd/1000;
  perIterationS = (seconds/1500).toLocaleString(browserLocale, opts2) + ` seconds`;
  seconds = seconds.toLocaleString(browserLocale, opts1);
  results.push(`creation in ${seconds} seconds, ${perIterationS} <i>per iteration</i>`);
  return results;
}
/* endregion performance */

/* region helpers */
function getCodeblocks() {
  const initialCode = toCodeBlock(templates.find$(`#initial`).HTML.get().trim());
  const performanceCode = toCodeBlock(templates.find$(`#perf`).HTML.get().trim());
  const aucklandFormatEx = toCodeBlock(templates.find$(`#formatAucklandEx`).HTML.get().trim());
  const now$FormatEx = toCodeBlock(templates.find$(`#formatNowEx`).HTML.get().trim());
  const aucklandZoneFormatEx = toCodeBlock(templates.find$(`#zoneFormatAucklandEx`).HTML.get().trim());
  const acrossZonesEx0 = toCodeBlock(templates.find$(`#acrossZonesEx0`).HTML.get().trim());
  const acrossZonesEx1 = toCodeBlock(templates.find$(`#acrossZonesEx1`).HTML.get().trim());
  const acrossZonesEx2 = toCodeBlock(templates.find$(`#acrossZonesEx2`).HTML.get().trim());
  const fullMonth = toCodeBlock(templates.find$(`#fullMonth`).HTML.get().trim());
  const yearCalendar = toCodeBlock(templates.find$(`#yearCalendar`).HTML.get().trim());
  const customs = toCodeBlock(templates.find$(`#custom`).HTML.get().trim());
  const customSyntax = toCodeBlock(templates.find$(`#customSyntax`).HTML.get().trim());
  return { initialCode, performanceCode, aucklandFormatEx, now$FormatEx, aucklandZoneFormatEx,
    acrossZonesEx0, acrossZonesEx1, acrossZonesEx2, fullMonth, yearCalendar, customs, customSyntax };
}

function toCodeBlock(str) {
  return `<pre class="language-javascript codeblock"><code>${str}</code></pre>`;
}

function toJSONString(obj, detail = true, noFormat = false) {
  return `<pre${detail ? ` class="detail"` : ``}>${JSON.stringify(obj, null, noFormat ? null : 2)}</pre>`;
}

function toDetailChapter(summary, id, ...lemmas) {
  const bttnSpan = id ? $.span({class: `button`, data: {close: 0}}, `all below`) : ``;
  return $.details(
    {class: `chapter`, id: id ?? ``},
      $.summary(
        $.span( $.b(summary), ` `, bttnSpan) ),
      $.div(...lemmas)
    );
}

function toDetailsBlock(summary, str, open) {
  open = !!open;
  return $.details(
    {open: !!open, data: {keepOpen: +(open)}},
    $.summary(summary),
    str);
}

function firstUp(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}

function tellTime() {
  const timeElem = $(`#tellTime`);
  
  timer();
  
  function timer() {
    timeElem.HTML.set(firstUp($D.now.format(`WD d MM yyyy hh:mmi:ss`, `hrc:23`)));
    return setTimeout(timer, 1000);
  }
}

function initialize() {
  printHeader();
  handlers();
}

function handlers() {
  $.delegate(`click`, `#bttnOpenClose, #bttnPerformance, details.chapter, button[data-close]`, ({evt}) => {
    const isLemmaBttn = evt.target.closest(`.button`)?.dataset.close;
    const mainBttn = evt.target.closest(`#bttnOpenClose`);
    const lemma = evt.target.closest(`details:not(.chapter)`);
    const chapter = evt.target.closest(`.chapter`);
    const perf = evt.target.closest(`#bttnPerformance`);
    
    if (mainBttn) {
      const allOpen = mainBttn.dataset.allopen === '1';
      
      $(`.chapter`).each(el => {
        el.open = !allOpen;
        setTimeout(() => $(el).trigger(`click`));
      });
      
      return mainBttn.dataset.allopen = allOpen ? `0` : `1`;
      
    }
    
    if (isLemmaBttn) {
      evt.preventDefault();
      const open = isLemmaBttn === `0`;
      const chapter = $(evt.target.closest(`.chapter`));
      chapter.find$(`details`).each(dt => { dt.open = dt.dataset?.keepOpen === `1` ? true : open; });
      evt.target.dataset.close = `${+(!!open)}`;
      return true;
    }
    
    if (lemma) {
      return setTimeout( () => {
        $.node(`.button`, evt.target.closest(`.chapter`)).dataset.close = `${+(!!lemma.open)}`;
      });
    }
    
    if (chapter) {
      const detailBlock = chapter.dataset.detailBlockId;
      
      if (!!detailBlock && !chapter.querySelectorAll(`details`).length) {
        const thisBlock = detailBlocks[detailBlock]();
        $(chapter).append(...thisBlock);
        debug && $(`[data-instance-counter]`).text(`${$D.now.iCounts}`) || void(0);
        const codeBlocks = chapter.querySelectorAll(`.codeblock`);
        
        if (codeBlocks.length) {
          for (const cblock of codeBlocks) {
            const codeElement = cblock.querySelector(`code`);
            if (!codeElement.dataset?.highligthed) {
              hljs.highlightElement(codeElement);
            }
          }
        }
      }
      
      return setTimeout(() => {
        const theDetailsElements = $.nodes(`details.chapter`).filter(el => el.open);
        const theBttn = $.node(`#bttnOpenClose`);
        theBttn.dataset.allopen = theDetailsElements.length ? `1` : `0`;
      });
    }
    
    if (perf) {
      return setTimeout(createPerformancePopup);
    }
    return true;
  });
}

function clockFactory() {
  const clockElem = $.div(
    {class: `clockContainer`},
    $.div({class: `header`}),
    $.div(
      {class: `clock`},
      $.div({class: `hour`}),
      $.div({class: `minute`}),
      $.div({class: `second`})
    ),
  );
  
  /**
   * the factory 'product'.
   * Creates a clock for [timeZone] within [parent] element
   * @param {Object} params
   * @param {string} params.timeZone
   * @param {HTMLElement} params.parent
   * @returns {number} (ultimately) a unique setTimeout return value (integer)
   */
  return function ({timeZone, parent} = {}) {
    timeZone = $D.validateLocaleInformation({timeZone}).timeZone;
    const currentClockContainer = clockElem
      .duplicate(true, parent)
      .append($.div({class: `footer`},
        `${timeZone} ${$D.now.offsetFrom($D({timeZone})).offset}`));
    currentClockContainer.data.set({tz: timeZone});
    
    return tickTock(currentClockContainer);
  }
  
  /**
   * @param {HTMLElement} currentClock
   * @returns {number} a unique setTimeout return value (integer)
   */
  function tickTock(currentClock) {
    const clockEl = currentClock.first();
    const header = currentClock.find$(`.header`);
    const [hour, minute, second, timeZone] = [
      $.node(`.hour`, clockEl).style,
      $.node(`.minute`, clockEl).style,
      $.node(`.second`, clockEl).style,
      currentClock.data.get(`tz`)];
    
    return runClock();
    
    // note: using static $D methods for performance
    function runClock() {
      header.html($D.format({template: `MM {<b>}d{</b>} hh:mmi:ss dp`, timeZone, opts: `l:en,hrc:23`}));
      //             ↳ creates a formatted 'now' date
      const [hours, minutes, seconds] = $D.values({timeZone}).slice(-4, -1);
      //                                   ↳ returns [hour, minute ... milliseconds] for 'now'
      hour.transform = `rotate(${Math.floor(30 * hours + minutes / 2)}deg)`;
      minute.transform = `rotate(${6 * minutes}deg)`;
      second.transform = `rotate(${6 * seconds}deg)`;
      return setTimeout(runClock, 1000);
    }
  }
}

function allBlocks() {
  function retrieveYearCalendarBlock() {
    const cal = yearCalendarEx();
    return [
      $.div({class: "xtraTxt"},
        `The constructor method <code>.yearCalendar({year, locale})</code> delivers
            an Array of TickTock instances for each month of the
            <code>year</code>, if applicable localized for <code>locale</code>.`),
      toDetailsBlock($.b({class: "blue"}, `Code used`), yearCalendar),
      toDetailsBlock($.div($.code(`calendarHU <span class="comment">/* See 'Code used' */`), ` (year 2000, Hungarian locale) =>`), cal)
    ];
  }
  function retrieveFullMonthBlock() {
    const [pt, th, local, deStatic] = getFullMonth();
    return [
      $.div(
        {class: "xtraTxt"},
        `The instance method `,
        $.code(`.fullMonth([forLocale])`), `delivers
            an Array of TickTock instances for each day of the
            month of the instance month value, from which one
            can for example build a calender.`
      ),
      
      toDetailsBlock($.b({class:"blue"}, `Code used`), fullMonth),
      
      toDetailsBlock(
        $.div($.code(`monthLocal.join("&lt;br>")`), ` (browser locale: ${$D.localeInformation.locale})`),
        `${local.join(`<br>`)}`),
      
      toDetailsBlock(
        $.div($.code(`monthPT.join("&lt;br>")`), ` (Portugese)`),
        `${pt.join(`<br>`)}`),
      
      toDetailsBlock(
        $.div($.code(`monthTH.join("&lt;br>")`), ` (Thai, buddhist year)`),
        `${th.join(`<br>`)}`),
      
      $.div(
        {class: "xtraTxt"},
        `Also available as static constructor method `,
        $.code(`$D.monthCalendar`),
        $.div($.b({class: "note"}),
          `month number is `,
          $.b({class: "red"}, $.i(`not`)),
          ` zero based`),
      ),
      
      toDetailsBlock(
        $.div($.code(`monthDeFromStatic.join("&lt;br>")`, ` (German) =>`)),
        `${deStatic.join(`<br>`)}`)
    ];
  }
  
  function retrieveInfoBlock() {
    return [
      toDetailsBlock($.div($.code(`taiohae.info`)), toJSONString(taiohae.info), ),
      toDetailsBlock($.div($.code(`chongqin.info`)), toJSONString(chongqin.info), ),
      toDetailsBlock($.div($.code(`now$.info`)), toJSONString(now$.info), )
    ];
  }
  return {
    headerElements() {
      return [
          $.h3($.a({target: "_top", href: "https://github.com/KooiInc/ticktock.js"}, `Github Repository`)),
          $.h2({data: {topline: 1}}, `TickTock.js Examples (work in progress) `, $.span({id: "tellTime"})),
          initialCode,
        ];
    },
    instantiationBlocks() {
      return [
        toDetailsBlock($.div($.code(`$D("2000/01/01 22:00")`), ` (browser time zone)`), $D("2000/01/01 22:00").toString()),
        toDetailsBlock($.div($.code(`$D([2000,0,1,22])`), ` (browser time zone)`), $D([2000,0,1,22]).toString()),
        toDetailsBlock($.div($.code(`$D.from(2000,0,1,22)`), ` (browser time zone)`), $D.from(2000,0,1,22).toString()),
        toDetailsBlock($.div($.code(`$D()`), ` (now, browser time zone)`), $D().toString()),
        toDetailsBlock($.div($.code(`$D.now`), ` (now, browser time zone)`), $D.now.toString()),
        toDetailsBlock($.div($.code(`$D({timeZone: "America/New_York"})`), ` (now New York time zone)`),
          $D({timeZone: "America/New_York"}).toString()),
        toDetailsBlock($.div($.code(`$D("2000/01/01 22:00", {tz: "America/New_York"})`), ` (New York time zone)`),
          $D("2000/01/01 22:00", {tz: "America/New_York"}).toString()),
        toDetailsBlock($.div($.code(`$D.from(2020,0,1,22).relocate({timeZone: "America/New_York"})`), ` (New York time zone)`),
          $D.from(2020,0,1,22).relocate({timeZone: "America/New_York"}).toString()),
        toDetailsBlock($.div($.code(`$D({tz: "America/New_York"}).changeFullYear(2020).changeHours(22)`),
          ` (New York time zone)`), $D({tz: "America/New_York"}).changeFullYear(2020).changeHours(22).toString()),
        toDetailsBlock($.div($.code(`$D.fromUxTS($D.now.unixEpochTimestamp).changeFullYear(2030)`), ` (from unix timestamp)`),
          $D.fromUxTS($D.now.unixEpochTimestamp).changeFullYear(2030).toString()),
      ];
    },
    localeTZBlock() {
      return [
        toDetailsBlock(
          $.div($.code(`$D.localeInformation`), `: environment (here: browser) locale- and timeZone information`),
          toJSONString($D.localeInformation, true)),
        
        toDetailsBlock(
          $.div($.code(`$D.validateLocaleInformation({locale: "cs-CZ", tz: "Europe/Prague"})`), ` Valid`),
          toJSONString($D.validateLocaleInformation({locale: "cs-CZ", tz: "Europe/Prague"}))),
        
        toDetailsBlock(
          $.div($.code(`$D.validateLocaleInformation({l:"de-CH", tz: "Bern"})`), ` timeZone invalid`),
          `timeZone "Bern" not valid, so environment timeZone (${$D.localeInformation.timeZone})<br>${
            toJSONString($D.validateLocaleInformation({l:"de-CH", tz: "Bern"}))}`),
        
        toDetailsBlock(
          $.div($.code(`$D.validateLocaleInformation({l:"ch", tz: "Europe/Zurich"})`), ` locale invalid`),
          `locale "ch" not valid, so environment locale (${$D.localeInformation.locale})<br>${
            toJSONString($D.validateLocaleInformation({l:"ch", tz: "Europe/Zurich"}))}`),
        
        toDetailsBlock(
          $.div($.code(`now$.localeInfo`)),
          toJSONString(now$.localeInfo, true)),
        
        toDetailsBlock(
          $.div($.code(`chongqin.localeInfo`), ` (chinese locale, Chongqing timeZone)`),
          toJSONString(chongqin.localeInfo, true)),
      ];
    },
    toStringBlock() {
      return [
        toDetailsBlock(
          $.div($.code(`chongqin.toString()`), ` (Chongqing timeZone)`),
          chongqin.toString(), true),
        
        toDetailsBlock(
          $.div($.code(`chongqin.<span class="red">value</span>.toString()`), ` (<i>your</i> timeZone)`),
          chongqin.value.toString(), true),
        
        toDetailsBlock(
          $.div($.code(`chongqin.toString({<span class="red">local: true</span>})`), ` (<i>your</i> timeZone)`),
          chongqin.toString({local: true}), true),
        
        toDetailsBlock(
          $.div($.code(`chongqin.toString({template: "WD d MM yyyy"})`), ` (see Format)`),
          chongqin.toString({template: "WD d M yyyy"}), true)
      ];
    },
    namesBlock() {
      return [
        toDetailsBlock(
          $.div($.code(`$D.localMonthnames("es-CL").long.slice(0, 3).join(" / ")`)),
          $D.localMonthnames("es-CL").long.slice(0, 3).join(` / `) ),
        
        toDetailsBlock(
          $.div($.code(`$D.localMonthnames("es-CL").long.slice(0, 3).join(" / ")`)),
          $D.localMonthnames("es-CL").long.slice(0, 3).join(` / `) ),
        
        toDetailsBlock(
          $.div($.code(`berlin.dayName`),` / `, $.code(`berlin.zoneDayname`)),
          `${berlin.dayName} / ${berlin.zoneDayname}`),
        
        toDetailsBlock(
          $.div($.code(`berlin.monthName`), ` / `, $.code(`berlin.zoneMonthname`)),
          `${berlin.monthName} / ${berlin.zoneMonthname}`),
        
        toDetailsBlock(
          $.div($.code(`chongqin.monthName`), ` / `, $.code(`chongqin.zoneMonthname`)),
          `${chongqin.monthName} / ${chongqin.zoneMonthname}`),
        
        toDetailsBlock( $.div($.code(`chongqin.names`)), toJSONString(chongqin.names)),
        
        toDetailsBlock(
          $.div($.code(`chongqin.<span class="red">zone</span>Names.monthNames.long`)),
          toJSONString(chongqin.zoneNames.monthNames.long)),
        
        toDetailsBlock(
          $.div($.code(`paris.relocate({l:"fr"}).zoneNames.dayNames.long`)),
          toJSONString(paris.relocate({l: "fr"}).zoneNames.dayNames.long)),
        
        toDetailsBlock(
          $.div($.code(`paris.clone.relocate({l:"ar-DZ"}).zoneNames.monthNames.long`)),
          toJSONString(paris.clone.relocate({l: "ar-DZ"}).zoneNames.monthNames.long)),
        
        toDetailsBlock(
          $.div($.code(`$D.localMonthnames("fr")`)),
          toJSONString($D.localMonthnames("fr")) ),
      ];
    },
    differenceBlock() {
      return [
          toDetailsBlock(
            $.div($.code(`chongqin.differenceTo(auckland)`)),
            toJSONString(chongqin.differenceTo(auckland), true)),
          
          toDetailsBlock($.div($.code(`vancouver.differenceTo(now$)`)),
            toJSONString(vancouver.differenceTo(now$), true)),
          
          toDetailsBlock($.div($.code(`la.differenceTo(auckland)`)),
            toJSONString(la.differenceTo(auckland), true)),
          
          toDetailsBlock($.div($.code(`now$.differenceTo(utc)`)),
            toJSONString(now$.differenceTo(utc), true)),
          
          toDetailsBlock($.div($.code(`paris.differenceTo(taiohae)`)),
            toJSONString(taiohae.differenceTo(paris), true)),
          
          toDetailsBlock($.div($.code(`paris.differenceTo(berlin)`)),
            toJSONString(paris.differenceTo(berlin), true))
      ];
    },
    formatBlock() {
      return [
        $.div(
          {class:"xtraTxt"},
          `See `,
          $.a({target:"_blank", href:"https://github.com/KooiInc/dateformat"}, `[GitHub]dateformat`),
          ` for syntax`
        ),
        toDetailsBlock(
          $.div($.code(`auckland.<span class='red'>zone</span>Format(...)`), ` formats to instance embedded locale/timeZone`),
          `${aucklandZoneFormatEx}<div>${auckland.zoneFormat('{=> in Auckland it\'s now} WD MM d yyyy, hh:mmi:ss dp')}`),
        
        toDetailsBlock($.div($.code(`auckland.format(...)`), ` formats to <i>browser</i> locale/timeZone`),
          `${aucklandFormatEx}<div>${auckland.format(`{=> formatted for (browser) locale '${browserLocale}'
        and - timeZone '${browserTZ}}'<br>WD MM d yyyy, hh:mmi:ss dp`)}</div>`),
        
        toDetailsBlock(
          $.div($.code(`now$.clone.relocate({l:\"fr-FR\"}).<span class='red'>zone</span>Format(...)`),
          `formats to browser timeZone, France locale`),
          `${now$FormatEx}<div>${
            now$.clone.relocate({l:`fr-FR`}).zoneFormat(
              `{=> Il est}: {<b class="red">}WD{</b>} d {<b class="red">}MM{</b>} yyyy, hh:mmi:ss.ms dp {dans votre fuseau horaire (${browserTZ})}`)}</div>`,),
      ]
    },
    DTValuesBlock() {
      return [
        toDetailsBlock($.div($.code(`auckland.date`)), toJSONString(auckland.date)),
        
        toDetailsBlock($.div($.code(`auckland.time`)), toJSONString(auckland.time)),
        
        toDetailsBlock($.div($.code(`auckland.dateTime`)), toJSONString(auckland.dateTime)),
        
        toDetailsBlock($.div($.code(`auckland.<span class='red'>zone</span>Date`)), toJSONString(auckland.zoneDate)),
        
        toDetailsBlock($.div($.code(`auckland.<span class='red'>zone</span>Time`)), toJSONString(auckland.zoneTime)),
        
        toDetailsBlock($.div($.code(`auckland.<span class='red'>zone</span>DateTime`)), toJSONString(auckland.zoneDateTime)),
        
        toDetailsBlock($.div($.code(`taiohae.zoneDateTime`),` (<b>note</b>: UTC offset -9:30)`),
          toJSONString(taiohae.zoneDateTime)),
        
        $.div(
          {class: "xtraTxt"},
          ` Date and time values as <code>Object&lt;string, number|string></code>
              from <code>[instance].values</code> method`),
        
        toDetailsBlock($.div($.code(`auckland.values(<span class='comment'>/*local=*/</span>false)`)),
          toJSONString(auckland.values(false))),
        
        toDetailsBlock($.div($.code(`auckland.values(true)`)),
          toJSONString(auckland.values(true))),
        
        $.div(
          {class: "xtraTxt"},
          `Date and time values as <code>Array&lt;Number></code>:
           <code>[instance].toArray</code> method`),
        
        toDetailsBlock($.div($.code(`taiohae.toArray(<span class='comment'>/*local=*/</span>false)`)),
          toJSONString(taiohae.toArray(false), true, true)),
        
        toDetailsBlock($.div($.code(`taiohae.toArray(true)`)),
          toJSONString(taiohae.toArray(true), true, true)),
      ];
    },
    offsetBlock() {
      return [
        toDetailsBlock( $.div($.code(`taiohae.offsetFrom(now$)`)), toJSONString(taiohae.offsetFrom(now$)) ),
        toDetailsBlock( $.div($.code(`la.offsetFrom(auckland)`)), toJSONString(la.offsetFrom(auckland)) ),
        toDetailsBlock( $.div($.code(`auckland.offsetFrom(la)`)), toJSONString(auckland.offsetFrom(la)) ),
        toDetailsBlock( $.div($.code(`utc.offsetFrom(la)`)), toJSONString(utc.offsetFrom(la)) ),
        $.div(
          {class: "xtraTxt"},
          `UTC offset can also be retrieved using the <code>[instance].UTCOffset</code> getter`
        ),
        toDetailsBlock( $.div($.code(`la.UTCOffset`)), toJSONString(la.UTCOffset) ),
      ]
    },
    infoBlock() { return retrieveInfoBlock(); },
    acrossTZSBlock() {
      return [
        toDetailsBlock(
          $.div($.code(`$D.timeAcrossZones(...)`), ` browser time vs Los Angeles (US) time`),
          `${acrossZonesEx0}
            ${toJSONString($D.timeAcrossZones( {
            timeZoneDate: $(),
            timeZoneID: "America/Los_Angeles"})
          )}`
        ),
        toDetailsBlock(
          $.div($.code(`$D.timeAcrossZones(...)`), ` Auckland time vs browser time`),
          `${acrossZonesEx1}
              ${toJSONString($D.timeAcrossZones( {
                timeZoneDate: auckland.value,
                timeZoneID: auckland.timeZone})
              )}`
        ),
        
        toDetailsBlock(
          $.div($.code(`$D.timeAcrossZones(...)`), `Auckland time vs Los Angeles time`),
          `${acrossZonesEx2}
              ${toJSONString($D.timeAcrossZones( {
                timeZoneDate: auckland.value,
                timeZoneID: auckland.timeZone,
                userTimeZoneID: la.timeZone} ))}`
        ),
      ]
    },
    daysInMonthBlock() {
      return [
        $.div(
          {class: "xtraTxt"},
          `Static constructor method `,
          $.b({class: "note"}),
          `month number is <b class="red"><i>not</i></b> zero based)`
        ),
        toDetailsBlock(
          $.div($.code(`$D.daysInMonth(<span class=\"comment\">/*monthNr=*/</span>4)`)),
          `=> ${$D.daysInMonth(4)}`
        ),
        
        toDetailsBlock(
          $.div($.code(`$D.daysInMonth($D.now.month + 1)`)),
          `=> ${$D.daysInMonth($D.now.month + 1)}`
        ),
        
        toDetailsBlock(
          $.div($.code(`$D.daysInMonth(2)`), ` not leap year`),
          `=> ${$D.daysInMonth(2)}`
        ),
        
        toDetailsBlock(
          $.div($.code(`$D.daysInMonth(2, <span class=\"comment\">/*leapYear=*/</span>true)`), ` leap year`),
          `=> ${$D.daysInMonth(2, true)}`
        ),
        
        $.div( {class: "xtraTxt"}, $.i(`Instance getter`) ),
        
        toDetailsBlock(
          $.div($.code(`$D("2000/02/01").daysThisMonth`)),
          `=> ${$D(`2000/02/01`).daysThisMonth}`
        ),
        
        toDetailsBlock(
          $.div($.code(`$D.now.daysThisMonth`)),
          `=> ${$D.now.daysThisMonth}`
        ),
      ]
    },
    weeksInYearBlock() {
      return [
        $.div({class: "xtraTxt"}, `Static constructor method`),
        
        toDetailsBlock(
          $.div($.code(`$D.weeksInYear(2020)`)),
          `=> ${$D.weeksInYear(2020)}`
        ),
        
        toDetailsBlock(
          $.div($.code(`$D.weeksInYear($D(\"2025/01/01\").year)`)),
          `=> ${$D.weeksInYear($D("2025/01/01").year)}`
        ),
        
        $.div({class: "xtraTxt"}, $.i(`Instance getter`)),
        toDetailsBlock(
          $.div($.code(`$D.from(2020).weeksInYear`)),
          `=> ${$D(`2020/02/01`).weeksInYear}`
        ),
        
        toDetailsBlock(
          $.div($.code(`$D([2021]).weeksInYear`)),
          `=> ${$D([2021]).weeksInYear}`
        ),
      ]
    },
    fullMonthBlock() { return retrieveFullMonthBlock(); },
    yearCalendarBlock() { return retrieveYearCalendarBlock(); },
    customsBlock() {
      return [
        $.div(
          {class:"xtraTxt"},
          `Use `, customSyntax,
          // $.code(`[imported TickTock constructor`, $.span({class: `comment`}, `/* here $D */`),
          //   `]`, $.br(),`&nbsp;&nbsp;.addCustom({`,
          //   $.br(),`&nbsp;&nbsp;&nbsp;&nbsp;name:string,`,
          //   $.br(),`&nbsp;&nbsp;&nbsp;&nbsp;method:function`,
          //   $.br(),`&nbsp;&nbsp;&nbsp;&nbsp;enumerable:boolean,`,
          //   $.br(),`&nbsp;&nbsp;&nbsp;&nbsp;isGetter:boolean})`),
          $.div(` to create custom getters or methods for the TickTock 'constructor'.`,
          ` See also`,
          $.a( {
              target: "_blank",
              href:"https://github.com/KooiInc/ticktock.js/wiki/The-TickTock-%27constructor%27-and-its-static-extensions#customExtensions"},
            `Wiki`))
        ),
        
        toDetailsBlock($.b({class: "blue"}, `Code used`), customs),
        
        toDetailsBlock(
          `<code>$D.now.<span class="red">addCentury</span>.toString({template: "{&lt;b class='red'>}yyyy{&lt;/b>}/mm/dd hh:mmi:ss"})</code>`,
          `=> ${$D.now.addCentury.toString({template: `<b class="red">yyyy</b>/mm/dd hh:mmi:ss`})}`
        ),
        
        toDetailsBlock(
          `<code>$D("2022/04/01 12:00", {locale: "en-CA"}).<span class="red">quarterString</span>()</code>`,
          `=> ${$D("2022/04/01 12:00", {locale: "en-CA"}).quarterString()}`),
        
        toDetailsBlock(
          `<code>$D("2022/08/01 12:00").<span class="red">quarterString</span>(false)</code>`,
          `=> ${$D("2022/08/01 12:00").quarterString(false)}`),
        
        toDetailsBlock(
          `<code>$D.keys.filter(k => /addCentury|quarterString/.test(k))</code>`,
          ` => [${$D.keys.filter(k => /addCentury|quarterString/.test(k))}]`,)
      ]
    }
  };
  
}

async function fetchTemplates() {
  $.allowTag(`template`);
  const templates = await fetch(`./Resource/Templates.txt`).then(r => r.text());
  return $.virtual(templates);
}
/* endregion helpers */
