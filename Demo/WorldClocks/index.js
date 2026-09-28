import { $, logFactory } from "../Resource/htmlhelpers.min.js";
import $D from "../../index.js";
import styleDocument from "./Modules/DocumentStyling.js";
import clockFactory from "./Modules/IntlClockFactory.js";

const { log: print } = logFactory();
const [ tzones, codeBlocks ] = await fetchDataAndCode();
const createTZClock = clockFactory($, $D);
const allOpts = initialize();

createClockInUserTZ();

/**
 * initialize page, create selectors
 * @returns {object} {string, HTMLOptionElement ($ instance)}
 */
function initialize() {
  printHeader();
  styleDocument($);
  const [designators, allOpts] = createSelectors();

  $.div({class: `container`}).append(
    $(`#log2screen`),
    $.div({class: `screen`}, $.h3(`Select a timezone`)).append(
      $.select({id: `zoneContainers`}).append(...designators),
      $.select({id: `timezones`}).append($.option({ value: "000" }, `*Select`)),
      $.span(`&nbsp;`, $.button({class: `clear`}, `Clear clocks`)),
      $.span(`&nbsp;`, $.input({type: `checkbox`, id: `enOnly`}),
        $.label({attributes: {for: `enOnly`}}, `day/month/time only english`)),
      $.div({class: `clockLine`})
    ),
  ).render;
  $.handle({type: `change`, selector: `#zoneContainers`, handler: selectDesignator});
  $.handle({type: `change`, selector: `#timezones`, handler: createClock});
  $.handle({type: `click`, selector: `.clear`, handler: clearClocks});
  $.handle({type: `click`, selector: `[data-code-id]`, handler: displayCode});
  return allOpts;
}

/**
 * click handler for button[data-code-id]
 * display code in a tooltip
 * @param {object} {me: $ instance of event target, evt: event}
 * @returns boolean (true)
 */
function displayCode({me}) {
  const id = me.data.get(`codeId`);
  if (!!id) { displayAppCode(codeBlocks[id]); }
  return true;
}

/**
 * click handler for button.clear
 * @returns $ instance
 */
function clearClocks() {
  $(`#timezones`).hide();
  const containers = $(`#zoneContainers`);
  containers.node.selectedIndex = 0;
  containers.trigger(`change`);
  return $(`.clockLine`).clear();
}

/**
 * on load create the first clock within the user timezone
 */
function createClockInUserTZ() {
  const userZone = Intl.DateTimeFormat().resolvedOptions();
  const selectr = $(`#timezones`);
  const designator = userZone.timeZone.slice(0, userZone.timeZone.indexOf(`/`));
  const opt4User = allOpts[designator].find(opt => opt.value = userZone.timeZone);
  const containerSelectr = $(`#zoneContainers`);
  containerSelectr.node.selectedIndex = +opt4User.data.get(`designatorIndex`);
  containerSelectr.trigger(`change`);
  selectr.node.selectedIndex = $.nodes(`#timezones option`).findIndex(opt => opt.value === userZone.timeZone) ?? 0;
  selectr.node.selectedIndex > 0 && selectr.trigger(`change`);
}

/**
 * create all options for both selectors from timezone data ([tzones])
 * @returns [HTMLOptionElement[], HTMLOptionElement[]]
 */
function createSelectors() {
  const countryOpts = [$.option({ value: "000" }, `*Select continent/country`)];
  const all = {};
  let last = ``;
  let index = 0;
  tzones
    .sort((tz1, tz2) => tz1.timezone.localeCompare(tz2.timezone))
    .forEach(tz => {
      const continentOrCountry = tz.timezone.slice(0, tz.timezone.indexOf(`/`));
      if (continentOrCountry !== last) {
        countryOpts.push($.option({value: continentOrCountry}, continentOrCountry));
        last = continentOrCountry;
        all[continentOrCountry] = [];
        index += 1;
      }
      const tzValue = tz.timezone.slice(tz.timezone.indexOf(`/`) + 1).replace(/_/g, ` `);
      all[continentOrCountry].push( $.option({
        value: tz.timezone,
        data: {
          locale: tz.locale,
          designatorIndex: index
        }
      }, tzValue)
    );
  });
  return [countryOpts, all];
}

/**
 * change handler for cities selector of places.
 * @param {object} {evt: event}
 */
function createClock({evt}) {
  if (evt.target.selectedIndex < 1) { return true; }
  const optSelected = evt.target.querySelector(`option:checked`);

  if (!optSelected) { return true; }

  const {timeZone} = $D.validateLocaleInformation({timeZone: optSelected.value});

  if ($.node(`[data-tz="${timeZone}"]`)) {
    return setTimeout(() => $.Popup.show({
      content: $.div(`The clock for ${timeZone} is already running...`),
      closeAfter: 3 }));
  }

  const locale = !!$.node(`#enOnly:checked`) ? `en-GB` : optSelected.dataset?.locale ?? `en-GB`;

  createTZClock({locale, timeZone, parent: $(`.clockLine`)});
  const designatorSelector = $.node(`#zoneContainers`);

  if (designatorSelector.selectedIndex !== +optSelected.dataset.designatorIndex) {
    designatorSelector.selectedIndex = +optSelected.dataset.designatorIndex;
    $(designatorSelector).trigger(`change`);
  }
}

/**
 * change handler for continent/country selector
 * @param {object} {me: $ select instance}
 */
function selectDesignator({me}) {
  if (me.node.selectedIndex === 0) { return true; }
  const value = me.find$(`option:checked`).node.value;
  const tzSelector = $(`#timezones`).clear().show();
  tzSelector.append($.option({ value: "000" }, `*Select`), ...allOpts[value]);
  tzSelector.node.selectedIndex = 0;
  tzSelector.trigger(`change`);
}

/**
 * render top lines to screen
 */
function printHeader() {
  print(
    $.h2({data: {header: 1}, class: `head clks`}, `Select your clock(s)`),
    $.div({data: {header: 1}}, $.b({class: "warn"}, `Notes`),
      	$.ul(
          $.li(
            $.button({data: {codeId: `main`}}, `display main script code`), `&nbsp;`,
            $.button({data: {codeId: `clockModule`}}, `display clock module code`),
          ),
          $.li(`+/-hh:mm or 00:00 =&gt; the time offset from the browser (probably `,
            $.i(`your`), ` time zone (so, `, $.i(`not`), ` from UTC)).`),
          $.li(`Where possible, the clock day/month/time are displayed using
            the (main) local language inferred from the time zone location. Disclaimer: due to browser
            differences this may not be accurate in your browser.
            Firefox (the spidermonkey engine) provides the most accurate support for different 'locales'.`),
          $.li(`Some time zones are translated (by ES Intl, e.g. Brazil/DeNoronha => America/Noronha).`),
          $.li(`A clock for the browser time zone/locale is created after the page is loaded.`),
          $.li(`Powered by `,
            $.a({
              target: `_top`,
              href: `https://github.com/KooiInc/ticktock.js`,
              text: `TickTock`}),
            ` | `,
            $.a({
              target: "_top",
              href: "../",
              text: `TickTock examples`}),
          ),
        )
  ));
}

/**
 * fetch time zone-/locale data and code for display
 * @returns {tzs: object, main: string, clockModule: string}
 */
async function fetchDataAndCode() {
  const tzs = await fetch("./Data/TZSxLocales.json").then(r => r.json());
  const main = await fetch(`./index.js`).then(r => r.text());
  const clockModule = await fetch(`./Modules/IntlClockFactory.js`)
    .then(r => r.text());
  const moduleLines = [
    `/*`,
    ` * The clock factory code`,
    ` * $D is the imported ticktock constructor`,
    ` * $ is a DOMHelper from htmlHelpers (see: https://npmx.dev/package/dynamic-html-helpers)`,
     `*/\n`].join(`\n`);
  return [
    tzs,
    {
      main: `// ${`-`.repeat(30)}\n// The script code for this page\n// ${`-`.repeat(30)}\n${main}`,
      clockModule: `${moduleLines}${clockModule}`
        .replace(/url\((.+)\)`;/, a => a.slice(0, 60) + ` ...\`;` + ` // (abbreviated for code viewer)`)
    }];
}

/**
 * displays code in a popup
 * @param {string} appCode
 */
function displayAppCode(appCode) {
  const highLightedCode = hljs.highlight(
    appCode, {language: 'javascript'}
  ).value;
  setTimeout(_ => {
    $.Popup.show({
    content: $.pre({class: `codeblock`},
      $.code({class: `hljs`}, highLightedCode)),
    callback: () => $(`#jqxPopup`).removeClass(`appCode`)});
    $(`#jqxPopup`).addClass(`appCode`);
  });
}
