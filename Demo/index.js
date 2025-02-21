/* region import and initialize */
import $D from "../index.js";
window.$D = $D; // use in console for testing
const {$, logFactory} = (await import("https://kooiinc.github.io/SBHelpers/index.browser.js"));
const templates = await fetchTemplates();
const {log: print} = logFactory();
initialize();
/* endregion import and initialize */

/* region initialVariables */
const { initialCode, performanceCode, aucklandFormatEx, now$FormatEx, aucklandZoneFormatEx,
  acrossZonesEx1, acrossZonesEx2 } = getCodeblocks();
const browserTZ = $D.localeInformation.timeZone;
const browserLocale = $D.localeInformation.locale;
const now$ = $D.now;
const chongqin = $D({l: `zh`, timeZone: "Asia/Chongqing"});
const auckland = $D({timeZone: "Pacific/Auckland"});
const vancouver = now$.clone.relocate({locale: `en-CA`, timeZone: `America/Vancouver`});
const paris = $D({timeZone: "Europe/Paris"}).add("2 days, 3 hours, 22 minutes");
const berlin = $D({l: "de-DE", tz: "Europe/Berlin"});
const la = $D({timeZone: "America/Los_Angeles"});
const taiohae = $D.from(2025, 0, 1, 7, 0, 0);
const utc = $D.now.UTC;
taiohae.localeInfo = {tz: "Pacific/Marquesas"};
utc.hours += 3;
utc.minutes -= 15;
/* endregion initialVariables */

/* region header */
print('<p><a target="_top" href="https://github.com/KooiInc/ticktock.js"> Github Repository</a></p>');

print(
  `<h2>TickTock.js Examples (work in progress) <span id="tellTime"></span></h2>`,
  `${initialCode}`,
  
  `<button id="bttnOpenClose" data-allopen="0"></button>`
);
tellTime();
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
    toDetailsBlock("<code>auckland.dateTime</code>", toJSONString(auckland.dateTime)),
    
    toDetailsBlock("<code>auckland.<span class='red'>zone</span>DateTime</code>", toJSONString(auckland.zoneDateTime)),
    
    toDetailsBlock("<code>taiohae.zoneDateTime</code> (<b>note</b>: UTC offset -9:30)",
      toJSONString(taiohae.zoneDateTime)),
    
    `<div class="xtraTxt">Date and time values as <code>Object&lt;String, Number|String></code>
      from <code>[instance].values</code> method</div>`,
    
    toDetailsBlock("<code>auckland.values(<span class='comment'>/*local=*/</span>false)</code>",
      toJSONString(auckland.values(false))),
    
    toDetailsBlock("<code>auckland.values(true)</code>",
      toJSONString(auckland.values(true))),
    
    `<div class="xtraTxt">Date and time values as <code>Array&lt;Number></code>: <code>[instance].toArray</code> method</div>`,
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
    toDetailsBlock("<code>taiohae.offsetFrom(now$)</code>", toJSONString(taiohae.offsetFrom(now$)), ),
    toDetailsBlock("<code>la.offsetFrom(auckland)</code>", toJSONString(la.offsetFrom(auckland)), ),
    toDetailsBlock("<code>auckland.offsetFrom(la)</code>", toJSONString(auckland.offsetFrom(la)), ),
    toDetailsBlock("<code>utc.offsetFrom(la)</code>", toJSONString(utc.offsetFrom(la)), ),
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
    `<div class="xtraTxt">See <a target="_blank" href="https://github.com/KooiInc/dateformat">[GitHub]dateformat</a> for syntax</div>`,
    toDetailsBlock("<code>auckland.<span class='red'>zone</span>Format(...)</code> formats to instance embedded locale/timeZone",
      `${aucklandZoneFormatEx}<div>${auckland.zoneFormat('{=> in Auckland it\'s now} WD MM d yyyy, hh:mmi:ss dp')}</div>`, true),
    
    toDetailsBlock(`auckland.format(...) formats to <i>browser</i> locale/timeZone`,
      `${aucklandFormatEx}<div>${auckland.format(`{=> formatted for (browser) locale '${browserLocale}'
        and - timeZone '${browserTZ}}'<br>WD MM d yyyy, hh:mmi:ss dp`)}</div>`, true),
    
    toDetailsBlock("<code>now$.clone.relocate({l:\"fr-FR\"}).<span class='red'>zone</span>Format(...)</code> " +
      "formats to browser timeZone, France locale",
      `${now$FormatEx}<div>${
        now$.clone.relocate({l:`fr-FR`}).zoneFormat(
          `{=> Il est}: {<b class="red">}WD{</b>} d {<b class="red">}MM{</b>} yyyy, hh:mmi:ss.ms dp {dans votre fuseau horaire (${browserTZ})}`)}</div>`,
      true),
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

/* region ex:performance */
const perf = perfRunner();

print(toDetailChapter(`Performance`, false,
  toDetailsBlock(`Code used and result`, performanceCode + `<div style="font-size: 1em;">${perf.join(`<br>`)}</div>`),
  
  `<div class="xtraTxt"><b class="warn">Note</b>: consider <b><i class="warn">not</i></b> (or selectively) using TickTock.js
      for processing a gazillion Dates &#128128;</div>`
  ),
);

function perfRunner() {
  const results = [];
  let perfStart = performance.now();
  const today = $D.now.dateNr;
  const testValues = [...Array(1500)].map((_, i) => $D.now.setDate(i + 1));
  let perfEnd = performance.now() - perfStart;
  let seconds = perfEnd/1000;
  let perIterationMs = (perfEnd/1500).toFixed(3) + ` milliseconds`;
  let perIterationS = (seconds/1500).toFixed(6) + ` seconds`;
  results.push(`=> <code>testValues</code> creation in ${
    seconds.toLocaleString(browserLocale)} seconds, ${perIterationMs} / ${
    perIterationS} <i>per iteration</i>`);
  // ---
  perfStart = performance.now();
  const plainDateTestValues = [...Array(1500)].map((_, i) => {
    const now = new Date();
    return new Date(now.setDate(i + 1));
  });
  perfEnd = performance.now() - perfStart;
  seconds = perfEnd/1000;
  perIterationMs = (perfEnd/1500).toFixed(3) + ` milliseconds`;
  perIterationS = (seconds/1500).toFixed(6) + ` seconds`;
  results.push(`=> <code>plainDateTestValues</code> creation in ${
    seconds.toLocaleString(browserLocale)} seconds, ${perIterationMs} / ${
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
  return { initialCode, performanceCode, aucklandFormatEx, now$FormatEx, aucklandZoneFormatEx,
          acrossZonesEx1, acrossZonesEx2 };
}

function toCodeBlock(str) {
  return `<pre class="line-numbers language-javascript"><code class="line-numbers language-javascript">${
    str}</code></pre>`;
}

function toJSONString(obj, detail = true, noFormat = false) {
  return `<pre${detail ? ` class="detail"` : ``}>${JSON.stringify(obj, null, noFormat ? null : 2)}</pre>`;
}

function toDetailChapter(summary, id, ...lemmas) {
  return `
    <details class="chapter" ${id ? id="${id}" : ""}>
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
  return `<details${open ? ` open` : ``}><summary>${summary}</summary>
    <div class="content">${str}</div></details>`;
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
            font-size: 1.1em;
            line-height: 1.3em;
            color: darkolivegreen;
          }
          
          pre[class*="language-javascript"] {
            max-width: 100%;
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
            }
            &:open {
              summary {
                list-style: outside disclosure-open;
              }
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
    `pre.detail { margin-top: 0.2em; }`,
    `a code:hover { text-decoration: underline; }`,
    `sup.inline {
      margin-top: -4px;
      display: inline-block;
    }`,
    `#log2screen li {
      list-style: none;
      margin: 0.7rem 0px 0px -1.2rem;
      padding-left: 0;
    }`,
    `.red { color: red; font-weight: bold; }`,
    `#log2screen li div {
      font-weight: normal;
      color: darkolivegreen;
      max-width: 100%;
      h3 { color: black; margin: 0; margin-top: 0.2rem !important; }
      div.xtraTxt {
        margin: 0.4rem 0.7rem;
        color: #555;
        &:before {
          content: '☑️ ';
        }
      }
      div {
        max-width: 100%;
        margin: 0.4rem 0;
        
        code.block {
          display: block;
          padding: 0.5rem;
          margin: 0.4rem 0;
          white-space: pre;
        }
      }
    }`,
    `.comment { color: #888; font-weight: normal; }`,
    `.warn {
      color: red;
      code { color: inherit; }
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
        switch(el.open) {
          case true: $(el).find(`details`).forEach(dt => dt.open = true); break;
          default: $(el).find(`details`).forEach(dt => dt.open = false);
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
      setTimeout(() => {
        $(chapter).find(`details`).forEach(el => el.open = chapter.open);
        const theDetailsElements = $.nodes(`details.chapter`).filter(el => el.open);
        const theBttn = $.node(`#bttnOpenClose`);
        theBttn.dataset.allopen = theDetailsElements.length ? `1` : `0`;
      });
      
      return;
    }
    return true;
  });
}

async function fetchTemplates() {
  $.allowTag(`template`);
  const templates = await fetch(`./Resource/Templates.txt`).then(r => r.text());
  const templatesContainer = $.virtual(templates);
  return templatesContainer;
}
/* endregion helpers */