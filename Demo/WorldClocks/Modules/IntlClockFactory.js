export default clockFactory;

function clockFactory($, $D) {
  setClockStyle($);
  const clockHeaderTemplate = `(WD, MM) {<b class="emph">}d{</b><br>} hh:mmi:ss dp`;
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
   * @param {HTMLElement} params.parent (a JQL instance)
   * @returns {number} (ultimately) a unique setTimeout return value (integer)
   */
  return function({locale, timeZone, parent} = {}) {
    timeZone = $D.validateLocaleInformation({timeZone, locale}).timeZone;
    const now$ = $D({timeZone});
    const dst = `
      <div class="dst" data-offset="${$D.now.offsetFrom(now$).offset}">
        ${!now$.hasDST ? `No DST` : `DST ${now$.DSTActive ? `active` : `not active`}`}
      </div>`;
    const currentClockContainer = clockElem
      .duplicate(false)
      .append($.div({class: `footer`},
        `${timeZone} ${dst}`))
      .renderTo(parent);
    currentClockContainer.data.set({tz: timeZone});

    return tickTock(locale, currentClockContainer);
  }

  /**
   * Check value of the DST footer (every hour, called from runClock)
   * @param {HTMLElement} dstFooter (a JQL instance)
   * @param {string} timeZone
   */
  function maybeChangeDSTFooter(dstFooter, timeZone) {
    const nowInGivenTimezone = $D({timeZone});
    dstFooter.data.set({offset: $D.now.offsetFrom(nowInGivenTimezone).offset});
    dstFooter.text(!nowInGivenTimezone.hasDST ? `No DST` : `DST ${nowInGivenTimezone.DSTActive ? `active` : `not active`}`);
  }

  /**
   * @param {HTMLElement} currentClock (a JQL instance)
   * @returns {number} a unique setTimeout return value (integer)
   */
  function tickTock(locale, currentClock) {
    const clockEl = currentClock.first();
    const header = currentClock.find$(`.header`);
    const dstFooter = currentClock.find$(`.dst`);
    let previousHour = $D.now.hours;
    const [hour, minute, second, timeZone] = [
      $.node(`.hour`, clockEl).style,
      $.node(`.minute`, clockEl).style,
      $.node(`.second`, clockEl).style,
      currentClock.data.get(`tz`)
    ];

    return runClock(locale);

    // note: using static $D methods for performance
    function runClock(locale) {
      header.html($D.format({template: clockHeaderTemplate, timeZone, opts: `l:${locale},hrc:23`} ));
      //              ↳ formats [now] within the given timeZone
      const [hours, minutes, seconds] = $D.values({timeZone}).slice(-4, -1);
      //                                   ↳ returns all date/time values for [now] within given timeZone

      if (previousHour !== hours) {
        maybeChangeDSTFooter(dstFooter, timeZone);
        previousHour = hours;
      }

      hour.transform   = `rotate(${Math.floor(30 * hours + minutes / 2)}deg)`;
      minute.transform = `rotate(${6 * minutes}deg)`;
      second.transform = `rotate(${6 * seconds}deg)`;

      return setTimeout(() => runClock(locale), 1000);
    }
  }
}

/**
 * Initialize clock styling (using htmlHelpers.$)
 * @param {*} $
 */
function setClockStyle($) {
  $.editCssRules(
    `.clockLine {
      margin-top: 2rem;

      .clockContainer {
        height: 200px;
        width: 200px;
        text-align: center;
        margin: 0 0.5rem 0.5rem 0;
        border-radius: 0.3rem;
        box-shadow: 2px 4px 8px #999;
        display: inline-block;

        b.emph {
          color: #bd2a44;
          font-style: italic;
        }

        .dst {
          color: #999;

          &:before {
            content: attr(data-offset)" ";
          }
        }

        .footer {
          display: block;
          min-height: 2.5rem;
          max-width: 180px;
          margin: 0 5px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .clock {
          position: relative;
          height: 125px;
          width: 125px;
          margin: 0 auto;

          background: ${clockFaceImage()} no-repeat;
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
    }`,
  );
}

/**
 * @returns css code for the clock face svg image
 */
function clockFaceImage() {
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='200' height='200'%3E%3ClinearGradient id='a' x1='.7495' x2='198.2495' y1='1.252' y2='197.752' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23666'/%3E%3Cstop offset='1' stop-color='%23b2b2b2'/%3E%3C/linearGradient%3E%3Ccircle cx='100' cy='100' r='97.5' fill='url(%23a)'/%3E%3ClinearGradient id='b' x1='21.7056' x2='177.7056' y1='16.687' y2='182.687' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23e5e5e5'/%3E%3Cstop offset='1' stop-color='%23fff'/%3E%3C/linearGradient%3E%3Ccircle cx='100' cy='100' r='93.5' fill='url(%23b)'/%3E%3CradialGradient id='c' cx='59.1675' cy='35.834' r='252.8037' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.1057' stop-color='%23fff'/%3E%3Cstop offset='1' stop-color='%23e5e5e5'/%3E%3C/radialGradient%3E%3Ccircle cx='100' cy='100' r='88.5' fill='url(%23c)'/%3E%3Cpath d='M96.695 14.852V26.5h-3.219v-7.633c-.521.396-1.025.716-1.512.961-.487.245-1.098.479-1.832.703v-2.609c1.083-.349 1.924-.768 2.523-1.258.599-.489 1.067-1.094 1.406-1.813h2.634zM109.469 26.5h-9.547c.109-.942.441-1.829.996-2.66.555-.831 1.595-1.811 3.121-2.941.932-.692 1.528-1.219 1.789-1.578.26-.359.391-.7.391-1.023 0-.349-.129-.647-.387-.895-.258-.247-.582-.371-.973-.371-.406 0-.738.128-.996.383s-.432.706-.52 1.352l-3.188-.258c.125-.896.354-1.595.688-2.098.333-.502.803-.888 1.41-1.156.606-.268 1.446-.402 2.52-.402 1.119 0 1.99.128 2.613.383.622.255 1.111.647 1.469 1.176.356.529.535 1.121.535 1.777 0 .698-.205 1.365-.613 2-.409.636-1.152 1.333-2.23 2.094-.641.443-1.069.753-1.285.93-.217.177-.471.409-.762.695h4.969V26.5zm68.437 69.27-3.008-.539c.25-.958.73-1.692 1.441-2.203.711-.51 1.717-.766 3.02-.766 1.494 0 2.575.279 3.242.836.666.558 1 1.258 1 2.102 0 .495-.136.943-.406 1.344-.271.401-.68.753-1.227 1.055.442.109.781.237 1.016.383.38.234.676.543.887.926s.316.84.316 1.371c0 .667-.175 1.307-.523 1.918-.35.612-.852 1.084-1.508 1.414s-1.519.496-2.586.496c-1.042 0-1.863-.123-2.465-.367s-1.097-.603-1.484-1.074c-.389-.471-.687-1.063-.895-1.777l3.18-.422c.125.641.318 1.085.582 1.332.263.248.598.371 1.004.371.427 0 .782-.156 1.066-.469.283-.313.426-.729.426-1.25 0-.531-.137-.942-.41-1.234-.273-.292-.645-.438-1.113-.438-.25 0-.594.063-1.031.188l.164-2.273c.177.026.314.039.414.039.416 0 .764-.133 1.043-.398.278-.266.418-.581.418-.945 0-.349-.104-.627-.313-.836-.209-.208-.495-.313-.859-.313-.375 0-.68.113-.914.34s-.394.621-.477 1.189zm-160.945 5.57 3.164-.398c.083.443.224.756.422.938.198.183.44.273.727.273.51 0 .909-.258 1.195-.773.208-.38.364-1.185.469-2.414-.38.391-.771.677-1.172.859-.401.183-.865.273-1.391.273-1.026 0-1.892-.364-2.598-1.094-.706-.729-1.059-1.651-1.059-2.766 0-.76.18-1.453.539-2.078s.854-1.098 1.484-1.418c.63-.32 1.422-.48 2.375-.48 1.146 0 2.065.197 2.758.59.692.394 1.246 1.019 1.66 1.875.414.857.621 1.988.621 3.395 0 2.068-.435 3.582-1.305 4.543-.87.961-2.076 1.441-3.617 1.441-.912 0-1.63-.105-2.156-.316-.526-.211-.964-.52-1.313-.926-.347-.407-.616-.915-.803-1.524zm5.859-5.11c0-.62-.156-1.105-.469-1.457s-.693-.527-1.141-.527c-.422 0-.772.159-1.051.477-.279.318-.418.794-.418 1.43 0 .641.145 1.13.434 1.469.289.339.649.508 1.082.508.448 0 .82-.164 1.117-.492s.446-.798.446-1.408zm81.211 79.895-3.164.391c-.084-.442-.223-.755-.418-.938-.195-.182-.437-.273-.723-.273-.516 0-.917.261-1.203.781-.208.375-.362 1.178-.461 2.406.38-.385.771-.67 1.172-.855.401-.185.864-.277 1.391-.277 1.021 0 1.884.365 2.59 1.094.705.729 1.059 1.654 1.059 2.773 0 .756-.179 1.445-.535 2.07-.357.625-.852 1.098-1.484 1.418s-1.426.48-2.379.48c-1.146 0-2.065-.195-2.758-.586-.693-.391-1.246-1.014-1.66-1.871-.414-.856-.621-1.99-.621-3.402 0-2.067.435-3.582 1.305-4.543.87-.961 2.075-1.441 3.617-1.441.911 0 1.631.105 2.16.316.528.211.967.52 1.316.926.348.406.614.917.796 1.531zm-5.859 5.102c0 .62.156 1.105.469 1.457s.695.527 1.148.527c.417 0 .766-.158 1.047-.477.281-.317.422-.791.422-1.422 0-.646-.146-1.138-.438-1.477-.292-.338-.654-.508-1.086-.508-.443 0-.814.164-1.113.492-.3.329-.449.798-.449 1.408zM143.73 26.383l-2.963-1.711-3.1 5.369c1 .551 1.991 1.115 2.965 1.708l3.098-5.366zM55.268 172.761l2.962 1.711 3.163-5.478c-1-.55-1.992-1.114-2.966-1.705l-3.159 5.472zm85.5 1.711 2.963-1.711-3.159-5.472c-.974.592-1.965 1.156-2.966 1.706l3.162 5.477zM58.23 24.671l-2.962 1.711 3.098 5.366c.973-.592 1.965-1.157 2.965-1.708l-3.101-5.369zm114.458 119.133 1.712-2.962-5.455-3.149c-.551 1-1.116 1.991-1.708 2.964l5.451 3.147zM26.311 55.341 24.6 58.303l5.393 3.114c.549-1.001 1.114-1.992 1.705-2.966l-5.387-3.11zm-2.139 85.927 1.709 2.962 5.965-3.443c-.594-.972-1.161-1.961-1.714-2.96l-5.96 3.441zm149.8-82.537-1.711-2.962-4.88 2.818c.589.975 1.157 1.963 1.705 2.965l4.886-2.821z'/%3E%3CradialGradient id='d' cx='99.5' cy='99.5' r='7' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.0088' stop-color='%234d4d4d'/%3E%3Cstop offset='1'/%3E%3C/radialGradient%3E%3Ccircle cx='99.5' cy='99.5' r='7' fill='url(%23d)'/%3E%3Ccircle cx='99.5' cy='99.5' r='3'/%3E%3C/svg%3E")`;
}