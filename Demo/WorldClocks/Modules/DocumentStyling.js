export default function setDocumentStyling($) {
  $.editCssRules(
    `.container {
       inset: 0;
       position: absolute;
       padding: 1rem 2rem;
       font: 14px/17px system-ui, verdana, arial, sans-serif;

       div.screen {
        margin: 0 auto;
        max-width: 900px;

        select {
          margin-right: 0.5rem;
        }

        input[type="checkbox"] {
          vertical-align: middle;
        }

        label { cursor: pointer; }

        &.center {
          text-align: center;
        }

        @media screen and (width < 900px) {
          max-width: 700px;
        }
      }
    }`,
    `#jqxPopupContent { font-family: system-ui; }`,
    `#log2screen {
      margin: 0 auto;
      max-width: 900px;
      nargin: 0 auto;
      
      li {
        &first-child {
          margin-top: 1.5rem;
        }
        h3 {
          margin-top: 0.5rem !important;
        }
      }
      
      div.center {
        margin: 0.5rem auto;
      }

      h2.head {
        margin: 2rem auto 0.5rem auto;
      }

      @media screen and (width < 900px) {
        max-width: 700px;
      }

      .center { text-align: center; }
      .margin-b { margin-bottom: 1.2rem; }

    }`,
    `code:not(.hljs) {
      background-color: rgb(227, 230, 232);
      color: rgb(12, 13, 14);
      padding: 0 4px;
      display: inline-block;
      border-radius: 4px;
      margin: 1px 0;
    }`,
    `a code:hover { text-decoration: underline; }`,
    `sup.inline {
      margin-top: -4px;
      display: inline-block;
    }`,
    `#log2screen li div {
      font-weight: normal;
      color: #777;
      max-width: 90%;

      code.block {
        display: block;
        padding: 0.5rem;
        margin: 0.4rem 0;
        white-space: pre;
        max-width: revert;
      }
      div {
        margin: 0.4rem 0;
      }
    }`,
    `.comment { color: #888; font-weight: normal; }`,
    `.warn {
      color: red;
      code { color: inherit; }
    }`,
    `pre.codeblock {
      code.hljs {
        position: relative;
        font-weight: normal !important;
        padding: 0.8em;
        width: 100%;
        border-radius: 6px !important;
        line-height: 1.2;
        max-height: inherit;
        box-shadow: 2px 2px 8px #999;
      }
    }`,
    `#jqxPopup {
      &.appCode {
        #jqxPopupContent {
          padding: 0 18px 18px 12px;
          max-height: 73vh;
          max-width: 40vw;
          width: fit-content;
          overflow: hidden;

          pre.codeblock {
            position: relative;
            margin-right: 1em;
            margin-bottom: 1em;
            max-height: 70vh;

            code.hljs {
              position: relative;
              font-weight: normal !important;
              padding: 0.8em;
              width: 100%;
              border-radius: 6px !important;
              line-height: 1.2;
              max-height: inherit;
              box-shadow: 2px 2px 8px #999;
            }
          }
        }
    }`,
  );
  console.log(document.referrer);
  $.img({src: "//sdn.nicon.nl/px0_kooi-dev-clockworks.png"}).render;
}
