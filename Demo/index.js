/* region import and initialize */
import $D from "../index.js";
window.$D = $D; // use in console for testing
const {$, logFactory} = (await import("https://kooiinc.github.io/SBHelpers/index.browser.js"));
const templates = await fetchTemplates();
const {log: print} = logFactory();
const debug = false;
initialize();

/* endregion import and initialize */

/* region initialVariables */
const { initialCode, performanceCode, aucklandFormatEx, now$FormatEx, aucklandZoneFormatEx,
  acrossZonesEx1, acrossZonesEx2, fullMonth, yearCalendar, customs } = getCodeblocks();
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
/* endregion initialVariables */

/* region header */
print('<p><a target="_top" href="https://github.com/KooiInc/ticktock.js"> Github Repository</a></p>');
print(
  `<h2 data-topline>TickTock.js Examples (work in progress) <span id="tellTime"></span></h2>`,
  `${initialCode}`,
  
  `<button id="bttnOpenClose" data-allopen="0"></button>`
);

if (!debug) {
  const createClock = clockFactory();
  const myClock = $.div({class: `clockLine`, id: `demoClock`})[Symbol.jql]
  createClock({parent: myClock});
  const headerDims = $(`pre:first-child`).dimensions;
  const clockDims = myClock.dimensions;
  myClock.style({
    left: (headerDims.left + headerDims.width - clockDims.width - 14) + `px`,
    top: (headerDims.top) + 12 + `px`,
  });
}

/* endregion header */

/* region All examples */
/* region ex:locale/timeZone */
print(
  toDetailChapter(`locale/timeZone`, `ltz`,
    toDetailsBlock(
      `<code>$D.localeInformation</code>: environment (here: browser) locale- and timeZone information`,
      toJSONString($D.localeInformation, true)),
    
    toDetailsBlock(
      `<code>$D.validateLocaleInformation({locale: "cs-CZ", tz: "Europe/Prague"})</code> Valid`,
      toJSONString($D.validateLocaleInformation({locale: "cs-CZ", tz: "Europe/Prague"}))),
    
    toDetailsBlock(
      `<code>$D.validateLocaleInformation({l:"ch", tz: "Bern"})</code> Not valid, so browser locale/timeZone`,
      toJSONString($D.validateLocaleInformation({l:"ch", tz: "Bern"}))),
    
    toDetailsBlock(
      `<code>now$.localeInfo</code>`,
      toJSONString(now$.localeInfo, true)),
    
    toDetailsBlock(
      `<code>chongqin.localeInfo</code> (chinese locale, Chongqing timeZone)`,
      toJSONString(chongqin.localeInfo, true)) ),
);
/* endregion locale/timeZone */

/* region ex:toString */
print(
  toDetailChapter(`toString`, `tostring`,
    toDetailsBlock(
      `<code>chongqin.toString()</code> (Chongqing timeZone)`,
      chongqin.toString(), true),
    
    toDetailsBlock(
      `<code>chongqin.<span class="red">value</span>.toString()</code> (<i>your</i> timeZone)`,
      chongqin.value.toString(), true),
    
    toDetailsBlock(
      `<code>chongqin.toString("WD d MM yyyy")</code> (see Format)`,
      chongqin.toString("WD d M yyyy"), true),
  )
);
/* endregion toString */

/* region ex:Names */
print(
  toDetailChapter(`Names`, `names`,
    toDetailsBlock(
      `<code>$D.localMonthnames("es-CL").long.slice(0, 3).join(" / ")</code>`,
      $D.localMonthnames("es-CL").long.slice(0, 3).join(` / `) ),
      
    toDetailsBlock(
      `<code>berlin.dayName</code>/<code>berlin.zoneDayname</code>`,
      `${berlin.dayName}/${berlin.zoneDayname}`),
    
    toDetailsBlock(
      `<code>berlin.monthName</code>/<code>berlin.zoneMonthname</code>`,
      `${berlin.monthName}/${berlin.zoneMonthname}`),
    
    toDetailsBlock(
      `<code>chongqin.monthName</code>/<code>chongqin.zoneMonthname</code>`,
      `${chongqin.monthName}/${chongqin.zoneMonthname}`),
    
    toDetailsBlock(
      `<code>chongqin.names</code>`,
      toJSONString(chongqin.names)),
    
    toDetailsBlock(
      `<code>chongqin.<span class="red">zone</span>Names.monthNames.long</code>`,
      toJSONString(chongqin.zoneNames.monthNames.long)),
    
    toDetailsBlock(
      `<code>paris.relocate({l:"fr"}).zoneNames.dayNames.long</code>`,
      toJSONString(paris.relocate({l: "fr"}).zoneNames.dayNames.long)),
    
    toDetailsBlock(
      `<code>paris.clone.relocate({l:"ar-DZ"}).zoneNames.monthNames.long</code>`,
      toJSONString(paris.clone.relocate({l: "ar-DZ"}).zoneNames.monthNames.long)),
    
    toDetailsBlock(
      `<code>$D.localMonthnames("fr")</code>`,
      toJSONString($D.localMonthnames("fr")) ),
  )
);
/* endregion Names */

/* region ex:Difference */
print(
  toDetailChapter(`Difference`, `difference`,
    toDetailsBlock(`<code>chongqin.differenceTo(auckland)</code>`,
      toJSONString(chongqin.differenceTo(auckland), true)),
    
    toDetailsBlock(`<code>vancouver.differenceTo(now$)</code>`,
      toJSONString(vancouver.differenceTo(now$), true)),
    
    toDetailsBlock(`<code>la.differenceTo(auckland)</code>`,
      toJSONString(la.differenceTo(auckland), true)),
    
    toDetailsBlock(`<code>now$.differenceTo(utc)</code>`,
      toJSONString(now$.differenceTo(utc), true)),
    
    toDetailsBlock(`<code>paris.differenceTo(taiohae)</code>`,
      toJSONString(taiohae.differenceTo(paris), true)),
    
    toDetailsBlock(`<code>paris.differenceTo(berlin)</code>`,
      toJSONString(paris.differenceTo(berlin), true))
  )
);
/* endregion Difference */

/* region ex:Date/time values */
print(
  toDetailChapter(`Date/time values`, `dtvalues`,
    toDetailsBlock("<code>auckland.date</code>", toJSONString(auckland.date)),
    
    toDetailsBlock("<code>auckland.time</code>", toJSONString(auckland.time)),
    
    toDetailsBlock("<code>auckland.dateTime</code>", toJSONString(auckland.dateTime)),
    
    toDetailsBlock("<code>auckland.<span class='red'>zone</span>Date</code>", toJSONString(auckland.zoneDate)),
    
    toDetailsBlock("<code>auckland.<span class='red'>zone</span>Time</code>", toJSONString(auckland.zoneTime)),
    
    toDetailsBlock("<code>auckland.<span class='red'>zone</span>DateTime</code>", toJSONString(auckland.zoneDateTime)),
    
    toDetailsBlock("<code>taiohae.zoneDateTime</code> (<b>note</b>: UTC offset -9:30)",
      toJSONString(taiohae.zoneDateTime)),
    
    `<div class="xtraTxt">
        Date and time values as <code>Object&lt;string, number|string></code>
          from <code>[instance].values</code> method</div>`,
    
    toDetailsBlock("<code>auckland.values(<span class='comment'>/*local=*/</span>false)</code>",
      toJSONString(auckland.values(false))),
    
    toDetailsBlock("<code>auckland.values(true)</code>",
      toJSONString(auckland.values(true))),
    
    `<div class="xtraTxt">
      Date and time values as <code>Array&lt;Number></code>:
        <code>[instance].toArray</code> method</div>`,
    
    toDetailsBlock("<code>taiohae.toArray(<span class='comment'>/*local=*/</span>false)</code>",
      toJSONString(taiohae.toArray(false), true, true)),
    
    toDetailsBlock("<code>taiohae.toArray(true)</code>",
      toJSONString(taiohae.toArray(true), true, true)),
  )
);
/* endregion Date/time values */

/* region ex:Offset */
print(
  toDetailChapter(`Offset (from)`, `offset`,
    toDetailsBlock( "<code>taiohae.offsetFrom(now$)</code>", toJSONString(taiohae.offsetFrom(now$)) ),
    toDetailsBlock( "<code>la.offsetFrom(auckland)</code>", toJSONString(la.offsetFrom(auckland)) ),
    toDetailsBlock( "<code>auckland.offsetFrom(la)</code>", toJSONString(auckland.offsetFrom(la)) ),
    toDetailsBlock( "<code>utc.offsetFrom(la)</code>", toJSONString(utc.offsetFrom(la)) ),
    `<div class="xtraTxt">UTC offset can also be retrieved using the <code>[instance].UTCOffset</code> getter</div>`,
    toDetailsBlock( "<code>la.UTCOffset</code>", toJSONString(la.UTCOffset) ),
  )
);
/* endregion Offset */

/* region ex:Info */
print(
  toDetailChapter(`Info`, `info`,
    toDetailsBlock("<code>taiohae.info</code>", toJSONString(taiohae.info), ),
    toDetailsBlock("<code>chongqin.info</code>", toJSONString(chongqin.info), ),
    toDetailsBlock("<code>now$.info</code>", toJSONString(now$.info), )
  )
);
/* endregion Info */

/* region ex:Format */
print(
  toDetailChapter(`Format`, `format`,
    `<div class="xtraTxt">
        See <a target="_blank" href="https://github.com/KooiInc/dateformat">[GitHub]dateformat</a> for syntax
     </div>`,
    
    toDetailsBlock("<code>auckland.<span class='red'>zone</span>Format(...)</code> formats to instance embedded locale/timeZone",
      `${aucklandZoneFormatEx}<div>${auckland.zoneFormat('{=> in Auckland it\'s now} WD MM d yyyy, hh:mmi:ss dp')}</div>`),
    
    toDetailsBlock(`<code>auckland.format(...)</code> formats to <i>browser</i> locale/timeZone`,
      `${aucklandFormatEx}<div>${auckland.format(`{=> formatted for (browser) locale '${browserLocale}'
        and - timeZone '${browserTZ}}'<br>WD MM d yyyy, hh:mmi:ss dp`)}</div>`),
    
    toDetailsBlock(`<code>auckland.format(...)</code> formats to <i>browser</i> locale/timeZone`,
      `${aucklandFormatEx}<div>${auckland.format(`{=> formatted for (browser) locale '${browserLocale}'
        and - timeZone '${browserTZ}}'<br>WD MM d yyyy, hh:mmi:ss dp`)}</div>`),
    
    toDetailsBlock("<code>now$.clone.relocate({l:\"fr-FR\"}).<span class='red'>zone</span>Format(...)</code> " +
      "formats to browser timeZone, France locale",
      `${now$FormatEx}<div>${
        now$.clone.relocate({l:`fr-FR`}).zoneFormat(
          `{=> Il est}: {<b class="red">}WD{</b>} d {<b class="red">}MM{</b>} yyyy, hh:mmi:ss.ms dp {dans votre fuseau horaire (${browserTZ})}`)}</div>`,),
  )
);
/* endregion Format */

/* region ex:timeAcrossZones */
print(
  toDetailChapter(`Time across timezones`, `taz`,
    toDetailsBlock(
      "<code>$D.timeAcrossZones(...)</code> Auckland time vs browser time",
      `${toCodeBlock(acrossZonesEx1)}
      ${toJSONString($D.timeAcrossZones({timeZoneDate: auckland.value, timeZoneID: auckland.timeZone}))}`
    ),
    
    toDetailsBlock(
      "<code>$D.timeAcrossZones(...)</code> Auckland time vs Los Angeles time",
      `${toCodeBlock(acrossZonesEx2)}
       ${toJSONString($D.timeAcrossZones({timeZoneDate: auckland.value, timeZoneID: auckland.timeZone, userTimeZoneID: la.timeZone}))}`
    ),
  )
);
/* endregion ex:timeAcrossZones */

/* region ex:daysInMonth */
print(
  toDetailChapter(`Days in month`, `dim`,
    `<div class="xtraTxt">Static constructor method
    (<b class="red">Note</b>: month number is <b class="red"><i>not</i></b> zero based)</div>`,
    toDetailsBlock(
      "<code>$D.daysInMonth(<span class=\"comment\">/*monthNr=*/</span>4)</code>",
      `=> ${$D.daysInMonth(4)}`
    ),
    
    toDetailsBlock(
      "<code>$D.daysInMonth($D.now.month + 1)</code>",
      `=> ${$D.daysInMonth($D.now.month + 1)}`
    ),
    
    toDetailsBlock(
      "<code>$D.daysInMonth(2)</code> not leap year",
      `=> ${$D.daysInMonth(2)}`
    ),
    
    toDetailsBlock(
      "<code>$D.daysInMonth(2, <span class=\"comment\">/*leapYear=*/</span>true)</code> leap year",
      `=> ${$D.daysInMonth(2, true)}`
    ),
    
    `<div class="xtraTxt"><i>Instance getter</i></div>`,
    toDetailsBlock(
      "<code>$D(`2000/02/01`).daysThisMonth</code>",
      `=> ${$D(`2000/02/01`).daysThisMonth}`
    ),
    
    toDetailsBlock(
      "<code>$D.now.daysThisMonth</code>",
      `=> ${$D.now.daysThisMonth}`
    ),
  )
);
/* endregion ex:daysInMonth */

/* region ex:weeksInYear */
print(
  toDetailChapter(`Weeks in year`, `wiy`,
    `<div class="xtraTxt">Static constructor method</div>`,
    
    toDetailsBlock(
      "<code>$D.weeksInYear(2020)</code>",
      `=> ${$D.weeksInYear(2020)}`
    ),
    
    toDetailsBlock(
      "<code>$D.weeksInYear($D(\"2025/01/01\").year)</code>",
      `=> ${$D.weeksInYear($D("2025/01/01").year)}`
    ),
    
    `<div class="xtraTxt"><i>Instance getter</i></div>`,
    toDetailsBlock(
      "<code>$D.from(2020).weeksInYear</code>",
      `=> ${$D(`2020/02/01`).weeksInYear}`
    ),
    
    toDetailsBlock(
      "<code>$D([2021]).weeksInYear</code>",
      `=> ${$D([2021]).weeksInYear}`
    ),
  )
);
/* endregion ex:daysInMonth */

/* region ex:fullMonth */
const [pt, th, local, deStatic] = getFullMonth();
print(
  toDetailChapter(`Full month localized calendar`, `fm`,
    `<div class="xtraTxt">The instance method <code>.fullMonth([forLocale])</code> delivers
        an Array of TickTock instances for each day of the
        month of the instance month value, from which one
        can for example build a calender.
    </div>`,
    
    toDetailsBlock(`<b class="blue">Code</b>`, fullMonth, false, true),
    
    toDetailsBlock(
      `<code>monthLocal.join("&lt;br>")</code> (browser locale: ${$D.localeInformation.locale}) =>`,
      `${local.join(`<br>`)}`),
    
    toDetailsBlock(
      `<code>monthPT.join("&lt;br>")</code> (Portugese) =>`,
      `${pt.join(`<br>`)}`),
    
    toDetailsBlock(
      `<code>monthTH.join("&lt;br>")</code> (Thai, buddhist year) =>`,
      `${th.join(`<br>`)}`),
    
    `<div class="xtraTxt">Also available as static constructor method <code>$D.monthCalendar</code>
      <br>(<b class="red">Note</b>: month number is <b class="red"><i>not</i></b> zero based)</div>`,
    
    toDetailsBlock(
      `<code>monthDeFromStatic.join("&lt;br>")</code> (German) =>`,
      `${deStatic.join(`<br>`)}`),
  )
);

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

/* region ex:fullYear */

/* endregion ex:fullYear */

/* endregion ex:daysInMonth */

/* region ex:yearCalendar */
const cal = yearCalendarEx();
print(
  toDetailChapter(`Full year localized calendar`, `yc`,
    `<div class="xtraTxt">
      The constructor method <code>.yearCalendar({year, locale})</code> delivers
        an Array of TickTock instances for each month of the
        <code>year</code>, if applicable localized for <code>locale</code>.
    </div>`,
    toDetailsBlock(`<b class="blue">Code</b>`, yearCalendar, false, true),
    toDetailsBlock(`<code>calendarHU</code> (year 2000, Hungarian locale) =>`, cal))
);

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
print(
  toDetailChapter(`Create custom methods/getters`, `yc`,
   `<div class="xtraTxt">
      Use <code>$D.addCustom({name:string, method:function, enumerable:boolean, isGetter:boolean})</code>
      to create custom getters or methods for the TickTock.js 'constructor'
      (see <a
        target="_blank"
        href="https://github.com/KooiInc/ticktock.js/wiki/The-TickTock-%27constructor%27-and-its-static-extensions#customExtensions"
        >Wiki</a>).
   </div>`,
   
  toDetailsBlock(`<b class="blue">Code</b>`, customs, false, true),
  
  toDetailsBlock(
      `<code>$D.now.<span class="red">addCentury</span>.toString("{&lt;b class='red'>}yyyy{&lt;/b>}/mm/dd hh:mmi:ss")</code>`,
      `=> ${$D.now.addCentury.toString(`<b class="red">yyyy</b>/mm/dd hh:mmi:ss`)}`),
    
    toDetailsBlock(
      `<code>$D("2022/04/01 12:00", {locale: "en-CA"}).<span class="red">quarterString</span>()</code>`,
      `=> ${$D("2022/04/01 12:00", {locale: "en-CA"}).quarterString()}`),
    
    toDetailsBlock(
      `<code>$D("2022/08/01 12:00").<span class="red">quarterString</span>(false)</code>`,
      `=> ${$D("2022/08/01 12:00").quarterString(false)}`),
    
    toDetailsBlock(
      `<code>$D.keys.filter(k => /addCentury|quarterString/.test(k))</code>`,
      ` => [${$D.keys.filter(k => /addCentury|quarterString/.test(k))}]`,)
  )
);

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

/* region ex:performance */
// don't interfere with the flow
setTimeout( () => {
  const perf = perfRunner();
  print(toDetailChapter(`Performance`, false,
      toDetailsBlock(`<b class="blue">Code</b>`, performanceCode, false, true),
      toDetailsBlock("<code>testValues</code>", `<div style="font-size: 1em;">${perf[0]}</div>`, true),
      toDetailsBlock("<code>plainDateTestValues </code>", `<div style="font-size: 1em;">${perf[1]}</div>`, true),
      
      `<div class="xtraTxt">
      <b class="warn">Note</b>: consider <b><i class="warn">not</i></b> (or selectively)
        using TickTock.js for processing a gazillion Dates &#128128;
   </div>`
    ),
  );
  Prism.highlightAll();
});

function perfRunner() {
  const results = [];
  let perfStart = performance.now(), perfEnd;
  [...Array(1500)].map((_, i) => $D.now.setDate(i + 1));
  perfEnd = performance.now() - perfStart;
  let seconds = perfEnd/1000;
  let perIterationMs = (perfEnd/1500).toLocaleString(browserLocale, {minimumFractionDigits: 3, maximumFractionDigits: 3}) + ` milliseconds`;
  let perIterationS = (seconds/1500).toLocaleString(browserLocale, {minimumFractionDigits: 6, maximumFractionDigits: 6}) + ` seconds`;
  seconds = seconds.toLocaleString(browserLocale, {minimumFractionDigits: 3, maximumFractionDigits: 3});
  results.push(`=> creation in ${seconds} seconds, ${perIterationMs} / ${
    perIterationS} <i>per iteration</i>`);
  // ---
  perfStart = performance.now();
  [...Array(1500)].map((_, i) => {
      const now = new Date();
      return new Date(now.setDate(i + 1));
    });
  perfEnd = performance.now() - perfStart;
  seconds = perfEnd/1000;
  perIterationMs = (perfEnd/1500).toLocaleString(browserLocale, {minimumFractionDigits: 3, maximumFractionDigits: 3}) + ` milliseconds`;
  perIterationS = (seconds/1500).toLocaleString(browserLocale, {minimumFractionDigits: 6, maximumFractionDigits: 6}) + ` seconds`;
  seconds = seconds.toLocaleString(browserLocale, {minimumFractionDigits: 3, maximumFractionDigits: 3});
  results.push(`=> creation in ${seconds} seconds, ${perIterationMs} / ${
    perIterationS} <i>per iteration</i>`);
  return results;
}
/* endregion performance */
/* endregion Examples */

/* region helpers */
Prism.highlightAll();

function getCodeblocks() {
  const initialCode = toCodeBlock(templates.find$(`#initial`).HTML.get().trim());
  const performanceCode = toCodeBlock(templates.find$(`#perf`).HTML.get().trim());
  const aucklandFormatEx = toCodeBlock(templates.find$(`#formatAucklandEx`).HTML.get().trim());
  const now$FormatEx = toCodeBlock(templates.find$(`#formatNowEx`).HTML.get().trim());
  const aucklandZoneFormatEx = toCodeBlock(templates.find$(`#zoneFormatAucklandEx`).HTML.get().trim());
  const acrossZonesEx1 = toCodeBlock(templates.find$(`#acrossZonesEx1`).HTML.get().trim());
  const acrossZonesEx2 = toCodeBlock(templates.find$(`#acrossZonesEx2`).HTML.get().trim());
  const fullMonth = toCodeBlock(templates.find$(`#fullMonth`).HTML.get().trim());
  const yearCalendar = toCodeBlock(templates.find$(`#yearCalendar`).HTML.get().trim());
  const customs = toCodeBlock(templates.find$(`#custom`).HTML.get().trim());
  return { initialCode, performanceCode, aucklandFormatEx, now$FormatEx, aucklandZoneFormatEx,
          acrossZonesEx1, acrossZonesEx2, fullMonth, yearCalendar, customs };
}

function toCodeBlock(str) {
  return `<pre class="line-numbers language-javascript"><code class="line-numbers language-javascript">${
    str}</code></pre>`;
}

function toJSONString(obj, detail = true, noFormat = false) {
  return `<pre${detail ? ` class="detail"` : ``}>${JSON.stringify(obj, null, noFormat ? null : 2)}</pre>`;
}

function toDetailChapter(summary, id, ...lemmas) {
  const elId = id.length ? `id="${id}"` : "";
  return `
    <details class="chapter" ${elId}>
      <summary>
        <span>
          <b>${summary}</b>
          ${id ? `<button data-close="${id}">Close all below</button>` : ``}
        </span>
      </summary>
      ${lemmas.join(``)}
    </details>`;
}

function toDetailsBlock(summary, str, open = false) {
  return `
    <details${open ? ` open` : ``}${open ? ` data-keep-open="1"` : ``}>
      <summary>${summary}</summary>
      ${str}
    </details>`;
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
  $.editCssRules(
    `body { overflow-y: scroll; overflow-x: auto; }`,
    `.container {
      inset: 0;
      position: absolute;
      padding: 1rem 2rem;
    }`,
    `h2 {
       line-height: 1.5em;
       span#tellTime {
          display: inline-block;
          font-size: 14px;
          line-height: inherit;
          background-color: #6196cc;
          color: floralwhite;
          padding: 0 12px;
          border-radius: 5px;
          box-shadow: 2px 2px 8px #AAA;
       }
    }`,
    `#log2screen {
      margin: 0 auto;
      width: 900px;
      @media screen and (width < 900px) {
        max-width: 720px;
      }
    }`,
    `code:not(.language-javascript) {
      background-color: rgb(227, 230, 232);
      color: rgb(12, 13, 14);
      padding: 2px 4px;
      display: inline-block;
      border-radius: 4px;
      margin: 1px 0;
    }`,
    `code.language-javascript {
      background-color: inherit;
    }`,
    `details {
       cursor: pointer;
       font-size: 1em;
       &.chapter {
          &:open {
            summary {
              button { display: inline-block; }
              color: green;
              list-style: inside disclosure-open;
              span:not(.red, .comment) {
                background-color: #6196cc;
                color: floralwhite;
                border-radius: 3px;
                display: inline-block;
              }
            }
          }
          summary {
            button { display: none; }
            font-family: monospace;
            font-size: 1.2rem;
            font-weight: bold;
            color: black;
            margin-bottom: 0.5rem;
            padding: 0;
            span:not(.red,.comment) {
              padding: 2px 4px;
              &:hover {
                background-color: #6196cc;
                color: floralwhite;
                border-radius: 3px;
              }
            }
          }
          
          div {
            font-weight: normal;
            color: darkolivegreen;
          }
          
          details:not(.chapter) {
            margin-left: 2rem;
            
            summary {
              font-size: 1rem;
              color: green;
              list-style: outside disclosure-closed;
              text-decoration: none;
              color: black;
              font-weight: normal;
              margin-bottom: 0.2rem;
            }
            &:open {
              position: relative;
              summary { list-style: outside disclosure-open; }
            }
          }
        }
     }`,
    `button {
      &[data-allopen="1"]:before {
        content: "Close all chapters";
      }
      &[data-allopen="0"]:before {
        content: "Open all chapters";
      }
    }`,
    `pre.detail { margin: 0.2em 0; position: relative; }`,
    `a code:hover { text-decoration: underline; }`,
    `sup.inline {
      margin-top: -4px;
      display: inline-block;
    }`,
    `#log2screen li {
      list-style: none;
      margin: 0.7rem 0px 0px -1.2rem;
      padding-left: 0;
      
      .content pre { max-width: 90%; }
      
      ul {
        margin-left: -1.2rem;
        color: #777;
        li {
          list-style: "✓";
          margin: revert;
          padding-left: 0.2rem;
        }
      }
    }`,
    `.red { color: red; font-weight: bold; }`,
    `.blue { color: blue; }`,
    `#log2screen li div {
      font-weight: normal;
      color: darkolivegreen;
      max-width: 100%;
      h3 { color: black; margin: 0; margin-top: 0.2rem !important; }
      div.xtraTxt {
        color: #555;
        padding: 0.2rem 5rem 0.2rem 2.2rem;
        
        &:before {
          content: '☑️ ';
          margin-left: -1.6rem;
        }
      }
      div {
        margin: 0.4rem 0;
        
        code.block {
          display: block;
          padding: 0.5rem;
          margin: 0.4rem 0;
          white-space: pre;
        }
      }
    }`,
    `.comment { color: #888; font-weight: normal;}`,
    `.warn {
      color: red;
      code { color: inherit; }
    }`,
    `#demoClock {
      max-width: 200px;
      position: fixed;
      /*top: 1rem;*/
      /*right: 2em;*/
      background-color: white;
      opacity: 0.7;
      border-radius: 5%;
    }`,
    `.clockLine {
      float: none;
      clear: both;
      margin: 0 auto;
      font-size: 0.9em;

      .clockContainer {
        height: auto;
        padding: 3px 0.2rem;
        text-align: center;

        .footer {
          display: block;
          text-wrap: nowrap;
         }
         
        .clock {
          position: relative;
          height: 100px;
          width: 100px;
          margin: 0 auto;
          background: ${getClockFace()} no-repeat;
          background-size: contain;
          
          .hour, .minute, .second {
            position: absolute;
            border-radius: 10px;
            transform-origin: bottom;
            background-color: black;
          }
         
          .hour {
            width: 1.8%;
            height: 25%;
            top: 25%;
            left: 48.85%;
            opacity: 0.8;
         }
        
          .minute {
            width: 1.5%;
            height: 30%;
            top: 19%;
            left: 48.9%;
            opacity: 0.8;
            background-color: #555;
          }
        
          .second {
            width: 0.8%;
            height: 40%;
            top: 9%;
            left: 49.25%;
            opacity: 0.8;
            background-color: red;
          }
        }
      }
    }`
  );
  $.delegate(`click`, `#bttnOpenClose, details.chapter, button[data-close]`, evt => {
    const isLemmaCloser = evt.target.dataset.close;
    const mainBttn = evt.target.closest(`#bttnOpenClose`);
    const lemma = evt.target.closest(`details:not(.chapter)`);
    const chapter = evt.target.closest(`.chapter`);
    
    if (mainBttn) {
      const allOpen = mainBttn.dataset?.allopen === '1' ?? false;
      $(`.chapter`).each(el => {
        el.open = !allOpen;
        if (!el.open) {
          $(el).find(`details`).forEach(dt => dt.open = dt.dataset.keepOpen ? true : false);
        }
      });
      
      return mainBttn.dataset.allopen = allOpen ? `0` : `1`;
    }
    
    if (isLemmaCloser) {
      evt.preventDefault();
      $(evt.target.closest(`.chapter`))
        .find$(`details`).each(dt => dt.open = false);
      
      return true;
    }
    
    if (lemma) {
      return true;
    }
    
    if (chapter) {
      return setTimeout(() => {
        const theDetailsElements = $.nodes(`details.chapter`).filter(el => el.open);
        const theBttn = $.node(`#bttnOpenClose`);
        theBttn.dataset.allopen = theDetailsElements.length ? `1` : `0`;
      });
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
    const currentClockContainer = clockElem[Symbol.jqlvirtual]
      .duplicate(true, parent)
      .append($.div({class: `footer`},
        `${timeZone} ${$D.now.offsetFrom($D({timeZone})).offset}`));
    currentClockContainer.data.set({tz: timeZone});
    
    return tickTock(currentClockContainer);
  }
  
  /**
   * @param {currentClock} HTMLElement
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

function getClockFace() {
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='200' height='200'%3E%3ClinearGradient id='a' x1='.7495' x2='198.2495' y1='1.252' y2='197.752' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23666'/%3E%3Cstop offset='1' stop-color='%23b2b2b2'/%3E%3C/linearGradient%3E%3Ccircle cx='100' cy='100' r='97.5' fill='url(%23a)'/%3E%3ClinearGradient id='b' x1='21.7056' x2='177.7056' y1='16.687' y2='182.687' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23e5e5e5'/%3E%3Cstop offset='1' stop-color='%23fff'/%3E%3C/linearGradient%3E%3Ccircle cx='100' cy='100' r='93.5' fill='url(%23b)'/%3E%3CradialGradient id='c' cx='59.1675' cy='35.834' r='252.8037' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.1057' stop-color='%23fff'/%3E%3Cstop offset='1' stop-color='%23e5e5e5'/%3E%3C/radialGradient%3E%3Ccircle cx='100' cy='100' r='88.5' fill='url(%23c)'/%3E%3Cpath d='M96.695 14.852V26.5h-3.219v-7.633c-.521.396-1.025.716-1.512.961-.487.245-1.098.479-1.832.703v-2.609c1.083-.349 1.924-.768 2.523-1.258.599-.489 1.067-1.094 1.406-1.813h2.634zM109.469 26.5h-9.547c.109-.942.441-1.829.996-2.66.555-.831 1.595-1.811 3.121-2.941.932-.692 1.528-1.219 1.789-1.578.26-.359.391-.7.391-1.023 0-.349-.129-.647-.387-.895-.258-.247-.582-.371-.973-.371-.406 0-.738.128-.996.383s-.432.706-.52 1.352l-3.188-.258c.125-.896.354-1.595.688-2.098.333-.502.803-.888 1.41-1.156.606-.268 1.446-.402 2.52-.402 1.119 0 1.99.128 2.613.383.622.255 1.111.647 1.469 1.176.356.529.535 1.121.535 1.777 0 .698-.205 1.365-.613 2-.409.636-1.152 1.333-2.23 2.094-.641.443-1.069.753-1.285.93-.217.177-.471.409-.762.695h4.969V26.5zm68.437 69.27-3.008-.539c.25-.958.73-1.692 1.441-2.203.711-.51 1.717-.766 3.02-.766 1.494 0 2.575.279 3.242.836.666.558 1 1.258 1 2.102 0 .495-.136.943-.406 1.344-.271.401-.68.753-1.227 1.055.442.109.781.237 1.016.383.38.234.676.543.887.926s.316.84.316 1.371c0 .667-.175 1.307-.523 1.918-.35.612-.852 1.084-1.508 1.414s-1.519.496-2.586.496c-1.042 0-1.863-.123-2.465-.367s-1.097-.603-1.484-1.074c-.389-.471-.687-1.063-.895-1.777l3.18-.422c.125.641.318 1.085.582 1.332.263.248.598.371 1.004.371.427 0 .782-.156 1.066-.469.283-.313.426-.729.426-1.25 0-.531-.137-.942-.41-1.234-.273-.292-.645-.438-1.113-.438-.25 0-.594.063-1.031.188l.164-2.273c.177.026.314.039.414.039.416 0 .764-.133 1.043-.398.278-.266.418-.581.418-.945 0-.349-.104-.627-.313-.836-.209-.208-.495-.313-.859-.313-.375 0-.68.113-.914.34s-.394.621-.477 1.189zm-160.945 5.57 3.164-.398c.083.443.224.756.422.938.198.183.44.273.727.273.51 0 .909-.258 1.195-.773.208-.38.364-1.185.469-2.414-.38.391-.771.677-1.172.859-.401.183-.865.273-1.391.273-1.026 0-1.892-.364-2.598-1.094-.706-.729-1.059-1.651-1.059-2.766 0-.76.18-1.453.539-2.078s.854-1.098 1.484-1.418c.63-.32 1.422-.48 2.375-.48 1.146 0 2.065.197 2.758.59.692.394 1.246 1.019 1.66 1.875.414.857.621 1.988.621 3.395 0 2.068-.435 3.582-1.305 4.543-.87.961-2.076 1.441-3.617 1.441-.912 0-1.63-.105-2.156-.316-.526-.211-.964-.52-1.313-.926-.347-.407-.616-.915-.803-1.524zm5.859-5.11c0-.62-.156-1.105-.469-1.457s-.693-.527-1.141-.527c-.422 0-.772.159-1.051.477-.279.318-.418.794-.418 1.43 0 .641.145 1.13.434 1.469.289.339.649.508 1.082.508.448 0 .82-.164 1.117-.492s.446-.798.446-1.408zm81.211 79.895-3.164.391c-.084-.442-.223-.755-.418-.938-.195-.182-.437-.273-.723-.273-.516 0-.917.261-1.203.781-.208.375-.362 1.178-.461 2.406.38-.385.771-.67 1.172-.855.401-.185.864-.277 1.391-.277 1.021 0 1.884.365 2.59 1.094.705.729 1.059 1.654 1.059 2.773 0 .756-.179 1.445-.535 2.07-.357.625-.852 1.098-1.484 1.418s-1.426.48-2.379.48c-1.146 0-2.065-.195-2.758-.586-.693-.391-1.246-1.014-1.66-1.871-.414-.856-.621-1.99-.621-3.402 0-2.067.435-3.582 1.305-4.543.87-.961 2.075-1.441 3.617-1.441.911 0 1.631.105 2.16.316.528.211.967.52 1.316.926.348.406.614.917.796 1.531zm-5.859 5.102c0 .62.156 1.105.469 1.457s.695.527 1.148.527c.417 0 .766-.158 1.047-.477.281-.317.422-.791.422-1.422 0-.646-.146-1.138-.438-1.477-.292-.338-.654-.508-1.086-.508-.443 0-.814.164-1.113.492-.3.329-.449.798-.449 1.408zM143.73 26.383l-2.963-1.711-3.1 5.369c1 .551 1.991 1.115 2.965 1.708l3.098-5.366zM55.268 172.761l2.962 1.711 3.163-5.478c-1-.55-1.992-1.114-2.966-1.705l-3.159 5.472zm85.5 1.711 2.963-1.711-3.159-5.472c-.974.592-1.965 1.156-2.966 1.706l3.162 5.477zM58.23 24.671l-2.962 1.711 3.098 5.366c.973-.592 1.965-1.157 2.965-1.708l-3.101-5.369zm114.458 119.133 1.712-2.962-5.455-3.149c-.551 1-1.116 1.991-1.708 2.964l5.451 3.147zM26.311 55.341 24.6 58.303l5.393 3.114c.549-1.001 1.114-1.992 1.705-2.966l-5.387-3.11zm-2.139 85.927 1.709 2.962 5.965-3.443c-.594-.972-1.161-1.961-1.714-2.96l-5.96 3.441zm149.8-82.537-1.711-2.962-4.88 2.818c.589.975 1.157 1.963 1.705 2.965l4.886-2.821z'/%3E%3CradialGradient id='d' cx='99.5' cy='99.5' r='7' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.0088' stop-color='%234d4d4d'/%3E%3Cstop offset='1'/%3E%3C/radialGradient%3E%3Ccircle cx='99.5' cy='99.5' r='7' fill='url(%23d)'/%3E%3Ccircle cx='99.5' cy='99.5' r='3'/%3E%3C/svg%3E")`;
}

async function fetchTemplates() {
  $.allowTag(`template`);
  const templates = await fetch(`./Resource/Templates.txt`).then(r => r.text());
  const templatesContainer = $.virtual(templates);
  return templatesContainer;
}
/* endregion helpers */
