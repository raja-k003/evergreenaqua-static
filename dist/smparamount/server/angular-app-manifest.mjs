
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  baseHref: "/",
  criticalCssPlans: [[1,"/styles-UG5AIRVM.css",14143,["*","*:before","*:after","h1","h2","h3","h4","{font-size:var(--font-size-lg)}","p","ul","ol","a","img","svg","video","address","skip-link",".split","split","{grid-template-columns:1fr 1fr}","lead","text-center","prose","li","media","btn","true","btn--outline","btn--ghost","btn--light","spin","check-list","card","card--interactive","steps","table","th","td","num","accordion","details","open","","summary","accordion__body","{margin:0}",".cta-band","cta-band","alert","pagination",".form__row","form__row","field","{color:var(--color-danger)}","req","hint",".field textarea","input","select","textarea","aria-invalid"],[["@media(prefers-reduced-motion:reduce){"],["@media(min-width:900px){"],["@media(min-width:640px){"],["@media(min-width:800px){"]],[[10,"@charset \"UTF-8\";"],[5,":root","{--font-sans:ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Arial, sans-serif;--font-size-xs:.8125rem;--font-size-sm:.9375rem;--font-size-md:1rem;--font-size-lg:1.125rem;--font-size-xl:clamp(1.25rem, 1.1rem + .6vw, 1.5rem);--font-size-2xl:clamp(1.5rem, 1.2rem + 1.2vw, 2rem);--font-size-3xl:clamp(1.875rem, 1.4rem + 2vw, 2.75rem);--font-size-4xl:clamp(2.125rem, 1.5rem + 2.8vw, 3.5rem);--space-1:.25rem;--space-2:.5rem;--space-3:.75rem;--space-4:1rem;--space-5:1.5rem;--space-6:2rem;--space-7:3rem;--space-8:4rem;--space-section:clamp(3rem, 2rem + 4vw, 5.5rem);--radius-sm:.5rem;--radius-md:.875rem;--radius-lg:1.25rem;--radius-pill:999px;--shadow-sm:0 1px 2px rgb(15 23 42 / .06), 0 1px 3px rgb(15 23 42 / .05);--shadow-md:0 4px 10px rgb(15 23 42 / .06), 0 12px 28px rgb(15 23 42 / .07);--shadow-lg:0 18px 50px rgb(15 23 42 / .12);--header-height:4.25rem;--container:76rem;--transition:.16s ease}",[0]],[5,":root[data-theme=midnight]","{--shadow-sm:0 1px 2px rgb(0 0 0 / .4);--shadow-md:0 8px 24px rgb(0 0 0 / .35);--shadow-lg:0 18px 50px rgb(0 0 0 / .5)}",[["",[[0,0,0,[["data-theme",1,"midnight",0]]]]]]],[5,[1,2,3],"{box-sizing:border-box}",[0,0,0]],[5,"html","{-webkit-text-size-adjust:100%;text-size-adjust:100%;scroll-padding-top:calc(var(--header-height) + 1rem)}",[0]],[37,"body","{margin:0;min-height:100vh;font-family:var(--font-sans);font-size:var(--font-size-md);line-height:1.65;color:var(--color-text);background:var(--color-bg);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}",[0],["var(--font-sans)"]],[5,[4,5,6,7],"{margin:0 0 var(--space-3);line-height:1.2;font-weight:700;letter-spacing:-.02em;color:var(--color-text);text-wrap:balance}",[3,3,3,3]],[5,4,"{font-size:var(--font-size-4xl)}",[3]],[5,5,"{font-size:var(--font-size-3xl)}",[3]],[5,6,"{font-size:var(--font-size-xl);letter-spacing:-.01em}",[3]],[5,7,8,[3]],[5,9,"{margin:0 0 var(--space-4);text-wrap:pretty}",[3]],[5,[10,11],"{margin:0 0 var(--space-4);padding-left:1.25rem}",[3,3]],[5,12,"{color:var(--color-primary);text-underline-offset:.2em;text-decoration-thickness:1px}",[3]],[5,"a:hover","{color:var(--color-primary-hover)}",[[0,0,[12],0]]],[5,[13,14,15],"{display:block;max-width:100%;height:auto}",[3,3,3]],[5,16,"{font-style:normal}",[3]],[21,[1,2,3],"{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}",[0,0,0],0],[5,".visually-hidden","{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}",[1]],[5,".skip-link","{position:absolute;left:var(--space-4);top:-100px;z-index:100;padding:var(--space-3) var(--space-4);background:var(--color-primary);color:var(--color-on-primary);border-radius:var(--radius-sm);font-weight:600}",[1]],[5,".skip-link:focus","{top:var(--space-3);color:var(--color-on-primary)}",[[[17],0,0,0]]],[5,".container","{width:100%;max-width:var(--container);margin-inline:auto;padding-inline:clamp(1rem,.5rem + 2.5vw,2rem)}",[1]],[5,".section","{padding-block:var(--space-section)}",[1]],[5,".section--alt","{background:var(--color-surface-alt)}",[1]],[5,".section--tight","{padding-block:clamp(2rem,1.5rem + 2vw,3.5rem)}",[1]],[5,".stack>*+*","{margin-top:var(--space-4)}",[[">+",["stack",[0,0,0,0],[0,0,0,0]]]]],[5,".grid","{display:grid;gap:var(--space-5);grid-template-columns:repeat(auto-fill,minmax(min(100%,var(--grid-min, 17rem)),1fr))}",[1]],[5,".grid--2","{--grid-min:22rem}",[1]],[5,".grid--4","{--grid-min:14rem}",[1]],[5,18,"{display:grid;gap:clamp(2rem,1rem + 4vw,4rem);align-items:center}",[1]],[21,18,20,[1],1],[21,".split--reverse>:first-child","{order:2}",[[">",["split--reverse",[0,0,0,0]]]],1],[5,".lead","{font-size:var(--font-size-lg);color:var(--color-text-muted);max-width:42rem}",[1]],[5,".muted","{color:var(--color-text-muted)}",[1]],[5,".text-center","{text-align:center}",[1]],[5,".text-center .lead","{margin-inline:auto}",[[" ",[22,21]]]],[5,".prose","{max-width:44rem;font-size:1.0625rem}",[1]],[5,".prose h2","{font-size:var(--font-size-2xl);margin-top:var(--space-7)}",[[" ",[23,[5,0,0,0]]]]],[5,".prose h3","{margin-top:var(--space-5)}",[[" ",[23,[6,0,0,0]]]]],[5,".prose li+li","{margin-top:var(--space-2)}",[[" +",[23,[24,0,0,0],[24,0,0,0]]]]],[5,".media","{position:relative;overflow:hidden;border-radius:var(--radius-md);background:var(--color-surface-alt);aspect-ratio:var(--ratio, 4/3)}",[1]],[5,".media img","{object-fit:var(--fit, cover)}",[[" ",[25,[13,0,0,0]]]]],[5,".media--contain","{--fit:contain}",[1]],[5,".media--square","{--ratio:1}",[1]],[5,".media--wide","{--ratio:16 / 9}",[1]],[5,".card-list","{list-style:none;padding:0;margin:0}",[1]],[5,".btn","{--btn-bg:var(--color-primary);--btn-fg:var(--color-on-primary);--btn-border:var(--color-primary);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);min-height:2.75rem;padding:.625rem 1.25rem;border:1.5px solid var(--btn-border);border-radius:var(--radius-pill);background:var(--btn-bg);color:var(--btn-fg);font:inherit;font-weight:600;font-size:var(--font-size-sm);line-height:1.2;text-decoration:none;white-space:nowrap;cursor:pointer;transition:background-color var(--transition),border-color var(--transition),color var(--transition),box-shadow var(--transition)}",[1]],[5,".btn:hover","{--btn-bg:var(--color-primary-hover);--btn-border:var(--color-primary-hover);color:var(--btn-fg)}",[[[26],0,0,0]]],[5,[".btn:disabled",".btn[aria-disabled=true]"],"{opacity:.6;cursor:not-allowed}",[[[26],0,0,0],["",[[0,[26],0,[["aria-disabled",1,27,0]]]]]]],[5,".btn--outline","{--btn-bg:transparent;--btn-fg:var(--color-primary)}",[1]],[5,".btn--outline:hover","{--btn-bg:var(--color-primary-soft);--btn-border:var(--color-primary);--btn-fg:var(--color-primary-hover)}",[[[28],0,0,0]]],[5,".btn--ghost","{--btn-bg:transparent;--btn-fg:var(--color-text);--btn-border:transparent}",[1]],[5,".btn--ghost:hover","{--btn-bg:var(--color-surface-alt);--btn-border:transparent;--btn-fg:var(--color-text)}",[[[29],0,0,0]]],[5,".btn--light","{--btn-bg:var(--color-surface);--btn-fg:var(--color-primary);--btn-border:var(--color-surface)}",[1]],[5,".btn--light:hover","{--btn-bg:var(--color-primary-soft);--btn-border:var(--color-primary-soft);--btn-fg:var(--color-primary-hover)}",[[[30],0,0,0]]],[5,".btn--sm","{min-height:2.5rem;padding:.5rem .9rem}",[1]],[5,".btn--lg","{min-height:3.25rem;padding:.875rem 1.75rem;font-size:var(--font-size-md)}",[1]],[5,".btn--block","{width:100%}",[1]],[5,".btn--icon","{padding:0;width:2.75rem}",[1]],[5,".btn-row","{display:flex;flex-wrap:wrap;gap:var(--space-3)}",[1]],[69,".spinner","{width:1.1em;height:1.1em;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:spin .7s linear infinite;flex-shrink:0}",[1],[31,".7s","linear","infinite"]],[258,"@keyframes spin{to{transform:rotate(360deg)}}",31],[5,".eyebrow","{display:inline-block;margin-bottom:var(--space-3);padding:.25rem .75rem;border-radius:var(--radius-pill);background:var(--color-primary-soft);color:var(--color-primary);font-size:var(--font-size-xs);font-weight:700;letter-spacing:.06em;text-transform:uppercase}",[1]],[5,".badge","{display:inline-flex;align-items:center;padding:.15rem .6rem;border-radius:var(--radius-pill);background:var(--color-surface-alt);border:1px solid var(--color-border);color:var(--color-text-muted);font-size:var(--font-size-xs);font-weight:600}",[1]],[5,".price","{font-weight:700;color:var(--color-text);font-variant-numeric:tabular-nums}",[1]],[5,".check-list","{list-style:none;padding:0;display:grid;gap:var(--space-3);--tick:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5L20 7'/%3E%3C/svg%3E\")}",[1]],[5,".check-list li","{position:relative;padding-left:2rem}",[[" ",[32,[24,0,0,0]]]]],[5,".check-list li:before","{content:\"\";position:absolute;left:0;top:.2em;width:1.3rem;height:1.3rem;border-radius:50%;background:var(--color-primary-soft)}",[[" ",[32,[24,0,0,0]]]]],[5,".check-list li:after","{content:\"\";position:absolute;left:0;top:.2em;width:1.3rem;height:1.3rem;background:var(--color-primary);-webkit-mask:var(--tick) center/.8rem no-repeat;mask:var(--tick) center/.8rem no-repeat}",[[" ",[32,[24,0,0,0]]]]],[21,".check-list--2",20,[1],2],[5,".chips","{display:flex;flex-wrap:wrap;gap:var(--space-2);list-style:none;padding:0;margin:0}",[1]],[5,".card","{position:relative;display:flex;flex-direction:column;height:100%;padding:var(--space-5);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);transition:box-shadow var(--transition),border-color var(--transition),transform var(--transition)}",[1]],[5,[".card--interactive:hover",".card--interactive:focus-within"],"{box-shadow:var(--shadow-md);border-color:color-mix(in srgb,var(--color-primary) 35%,var(--color-border))}",[[[34],0,0,0],[[34],0,0,0]]],[5,".card--flush","{padding:0;overflow:hidden}",[1]],[5,".card__body","{padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-2);flex:1}",[1]],[5,".card__title","{font-size:var(--font-size-lg);margin:0}",[1]],[5,".card__text","{color:var(--color-text-muted);margin:0;font-size:var(--font-size-sm)}",[1]],[5,".card__footer","{margin-top:auto;padding-top:var(--space-3);display:flex;align-items:center;justify-content:space-between;gap:var(--space-3)}",[1]],[5,".card .stretched-link:after","{content:\"\";position:absolute;inset:0;border-radius:inherit}",[[" ",[33,"stretched-link"]]]],[5,".icon-tile","{display:grid;place-items:center;width:3rem;height:3rem;margin-bottom:var(--space-3);border-radius:var(--radius-md);background:var(--color-primary-soft);color:var(--color-primary);flex-shrink:0}",[1]],[5,".steps","{list-style:none;padding:0;margin:0;display:grid;gap:var(--space-5);counter-reset:step;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))}",[1]],[5,".steps>li","{counter-increment:step;position:relative;padding:var(--space-5);padding-top:calc(var(--space-5) + 2.75rem);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg)}",[[">",[35,[24,0,0,0]]]]],[5,".steps>li:before","{content:counter(step,decimal-leading-zero);position:absolute;top:var(--space-5);left:var(--space-5);font-size:var(--font-size-xl);font-weight:800;color:var(--color-primary)}",[[">",[35,[24,0,0,0]]]]],[5,".steps>li h3",8,[["> ",[35,[24,0,0,0],[6,0,0,0]]]]],[5,".steps>li p","{margin:0;color:var(--color-text-muted);font-size:var(--font-size-sm)}",[["> ",[35,[24,0,0,0],[9,0,0,0]]]]],[5,".table-wrap","{overflow-x:auto;border:1px solid var(--color-border);border-radius:var(--radius-md);background:var(--color-surface)}",[1]],[5,".table","{width:100%;border-collapse:collapse;font-size:var(--font-size-sm)}",[1]],[5,".table caption","{text-align:left;padding:var(--space-4);font-weight:600}",[[" ",[36,["caption",0,0,0]]]]],[5,[".table th",".table td"],"{padding:var(--space-3) var(--space-4);text-align:left;border-top:1px solid var(--color-border);white-space:nowrap}",[[" ",[36,[37,0,0,0]]],[" ",[36,[38,0,0,0]]]]],[5,".table thead th","{background:var(--color-surface-alt);font-weight:600;color:var(--color-text-muted);font-size:var(--font-size-xs);text-transform:uppercase;letter-spacing:.04em}",[["  ",[36,["thead",0,0,0],[37,0,0,0]]]]],[5,[".table td.num",".table th.num"],"{text-align:right;font-variant-numeric:tabular-nums}",[[" ",[36,[38,[39],0,0]]],[" ",[36,[37,[39],0,0]]]]],[5,".accordion","{display:grid;gap:var(--space-3)}",[1]],[5,".accordion details","{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md)}",[[" ",[40,[41,0,0,0]]]]],[5,".accordion details[open]","{box-shadow:var(--shadow-sm)}",[[" ",[40,[41,0,0,[[42,0,43,0]]]]]]],[5,".accordion summary","{display:flex;justify-content:space-between;align-items:center;gap:var(--space-4);padding:var(--space-4) var(--space-5);font-weight:600;cursor:pointer;list-style:none}",[[" ",[40,[44,0,0,0]]]]],[5,".accordion summary::-webkit-details-marker","{display:none}",[[" ",[40,[44,0,0,0]]]]],[5,".accordion summary:after","{content:\"+\";flex-shrink:0;display:grid;place-items:center;width:1.75rem;height:1.75rem;border-radius:50%;background:var(--color-primary-soft);color:var(--color-primary);font-size:1.25rem;line-height:1}",[[" ",[40,[44,0,0,0]]]]],[5,".accordion details[open] summary:after","{content:\"\\2013\"}",[["  ",[40,[41,0,0,[[42,0,43,0]]],[44,0,0,0]]]]],[5,".accordion .accordion__body","{padding:0 var(--space-5) var(--space-4);color:var(--color-text-muted)}",[[" ",[40,45]]]],[5,".accordion .accordion__body p:last-child",46,[["  ",[40,45,[9,0,0,0]]]]],[5,47,"{display:grid;gap:var(--space-5);align-items:center;padding:clamp(1.75rem,1rem + 3vw,3rem);border-radius:var(--radius-lg);background:linear-gradient(135deg,var(--color-primary),color-mix(in srgb,var(--color-primary) 70%,var(--color-accent)));color:var(--color-on-primary)}",[1]],[5,".cta-band h2","{color:inherit;font-size:var(--font-size-2xl);margin:0 0 var(--space-2)}",[[" ",[48,[5,0,0,0]]]]],[5,".cta-band p","{margin:0;opacity:.92}",[[" ",[48,[9,0,0,0]]]]],[21,47,"{grid-template-columns:1fr auto}",[1],3],[5,".alert","{display:flex;gap:var(--space-3);align-items:flex-start;padding:var(--space-4);border-radius:var(--radius-md);border:1px solid;font-size:var(--font-size-sm)}",[1]],[5,".alert p",46,[[" ",[49,[9,0,0,0]]]]],[5,".alert--success","{border-color:var(--color-success);background:color-mix(in srgb,var(--color-success) 8%,var(--color-surface))}",[1]],[5,".alert--error","{border-color:var(--color-danger);background:color-mix(in srgb,var(--color-danger) 8%,var(--color-surface))}",[1]],[5,".alert--info","{border-color:var(--color-border);background:var(--color-surface-alt)}",[1]],[5,".pagination","{display:flex;flex-wrap:wrap;gap:var(--space-2);justify-content:center;list-style:none;padding:0;margin:var(--space-7) 0 0}",[1]],[5,[".pagination a",".pagination span"],"{display:inline-grid;place-items:center;min-width:2.75rem;height:2.75rem;padding:0 var(--space-3);border-radius:var(--radius-sm);border:1px solid var(--color-border);background:var(--color-surface);text-decoration:none;font-weight:600}",[[" ",[50,[12,0,0,0]]],[" ",[50,["span",0,0,0]]]]],[5,".pagination [aria-current=page]","{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}",[[" ",[50,[0,0,0,[["aria-current",1,"page",0]]]]]]],[5,[".form",51],"{display:grid;gap:var(--space-4)}",[1,1]],[21,51,20,[1],2],[5,".field","{display:grid;gap:var(--space-2)}",[1]],[5,".field label","{font-weight:600;font-size:var(--font-size-sm)}",[[" ",[53,["label",0,0,0]]]]],[5,".field .req",54,[[" ",[53,55]]]],[5,".field .hint","{font-size:var(--font-size-xs);color:var(--color-text-muted)}",[[" ",[53,56]]]],[5,[".field input",".field select",57],"{width:100%;min-height:2.875rem;padding:.625rem .875rem;font:inherit;font-size:1rem;color:var(--color-text);background:var(--color-surface);border:1.5px solid var(--color-border);border-radius:var(--radius-sm);transition:border-color var(--transition),box-shadow var(--transition)}",[[" ",[53,[58,0,0,0]]],[" ",[53,[59,0,0,0]]],[" ",[53,[60,0,0,0]]]]],[5,[".field input:hover",".field select:hover",".field textarea:hover"],"{border-color:color-mix(in srgb,var(--color-primary) 40%,var(--color-border))}",[[" ",[53,[58,0,0,0]]],[" ",[53,[59,0,0,0]]],[" ",[53,[60,0,0,0]]]]],[5,[".field input:focus-visible",".field select:focus-visible",".field textarea:focus-visible"],"{outline:none;border-color:var(--color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--color-primary) 25%,transparent)}",[[" ",[53,[58,0,0,0]]],[" ",[53,[59,0,0,0]]],[" ",[53,[60,0,0,0]]]]],[5,[".field input[aria-invalid=true]",".field select[aria-invalid=true]",".field textarea[aria-invalid=true]"],"{border-color:var(--color-danger)}",[[" ",[53,[58,0,0,[[61,1,27,0]]]]],[" ",[53,[59,0,0,[[61,1,27,0]]]]],[" ",[53,[60,0,0,[[61,1,27,0]]]]]]],[5,57,"{min-height:8rem;resize:vertical}",[[" ",[53,[60,0,0,0]]]]],[5,".field .error","{display:flex;gap:var(--space-1);align-items:center;margin:0;color:var(--color-danger);font-size:var(--font-size-xs);font-weight:600}",[[" ",[53,"error"]]]],[5,".hp","{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}",[1]],[5,".hint","{margin:0;font-size:var(--font-size-xs);color:var(--color-text-muted)}",[1]],[5,".req",54,[1]],[5,".link-btn","{padding:0;border:0;background:none;font:inherit;font-weight:600;color:var(--color-primary);text-decoration:underline;cursor:pointer}",[1]]]]],
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-D34qP2-D.js",
      "chunk-BzcqMxYA.js"
    ],
    "route": "/about"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-BeCUowoQ.js",
      "chunk-BzcqMxYA.js"
    ],
    "route": "/services"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-DXjXq3Q5.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/how-it-works"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-D8nU2r4I.js",
      "chunk-D6dwQtRc.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/products"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CVb6YL3K.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/products/ro-water-purifiers"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CaLiFNWx.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/products/water-softeners"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CaLiFNWx.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/products/purolite-softener-resin"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CaLiFNWx.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/products/sand-filters"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CaLiFNWx.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/products/iron-filters"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CaLiFNWx.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/products/carbon-filters"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-CaLiFNWx.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/products/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-UZd6EtUj.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js",
      "chunk-pnsMInyr.js"
    ],
    "route": "/calculator"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-B6mIcUe3.js",
      "chunk-D6dwQtRc.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js",
      "chunk-DUyHs845.js"
    ],
    "route": "/testimonials"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CZOoGU6o.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js",
      "chunk-pnsMInyr.js",
      "chunk-BUMzSMKZ.js"
    ],
    "route": "/faq"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-DGm5DO0D.js",
      "chunk-D6dwQtRc.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js",
      "chunk-pnsMInyr.js",
      "chunk-BUMzSMKZ.js"
    ],
    "route": "/careers"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CUXlWcY2.js",
      "chunk-D6dwQtRc.js",
      "chunk-BzcqMxYA.js",
      "chunk-DQ6ruJln.js"
    ],
    "route": "/gallery"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-CwFwWn42.js",
      "chunk-D6dwQtRc.js",
      "chunk-BzcqMxYA.js",
      "chunk-DKHkPZuT.js"
    ],
    "route": "/blog"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-BfJ0A1o6.js",
      "chunk-BzcqMxYA.js",
      "chunk-DKHkPZuT.js"
    ],
    "route": "/blog/signs-of-hard-water"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-BfJ0A1o6.js",
      "chunk-BzcqMxYA.js",
      "chunk-DKHkPZuT.js"
    ],
    "route": "/blog/water-softener-maintenance-tips"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-BfJ0A1o6.js",
      "chunk-BzcqMxYA.js",
      "chunk-DKHkPZuT.js"
    ],
    "route": "/blog/choosing-the-right-water-softener"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-BfJ0A1o6.js",
      "chunk-BzcqMxYA.js",
      "chunk-DKHkPZuT.js"
    ],
    "route": "/blog/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CFZJxemw.js",
      "chunk-BzcqMxYA.js",
      "chunk-pnsMInyr.js",
      "chunk-BUMzSMKZ.js"
    ],
    "route": "/contact"
  },
  {
    "renderMode": 0,
    "status": 404,
    "headers": {
      "Cache-Control": "no-store"
    },
    "preload": [
      "chunk-C50nRZ4B.js"
    ],
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    "index.csr.html": {size: 3285, hash: "451e02ee74e0c092", text: () => import("./assets-chunks/index_csr_html.mjs").then(m => m.default)},
    "index.server.html": {size: 1924, hash: "dc5d39ff8c31da6d", text: () => import("./assets-chunks/index_server_html.mjs").then(m => m.default)},
    "services/index.html": {size: 93912, hash: "2adcea4c017ef09c", text: () => import("./assets-chunks/services_index_html.mjs").then(m => m.default)},
    "how-it-works/index.html": {size: 73988, hash: "0284f4a52e6e5a2e", text: () => import("./assets-chunks/how-it-works_index_html.mjs").then(m => m.default)},
    "products/ro-water-purifiers/index.html": {size: 82120, hash: "04273cfa8bfb0c1b", text: () => import("./assets-chunks/products_ro-water-purifiers_index_html.mjs").then(m => m.default)},
    "products/water-softeners/index.html": {size: 89526, hash: "bda5fd55767dafe7", text: () => import("./assets-chunks/products_water-softeners_index_html.mjs").then(m => m.default)},
    "faq/index.html": {size: 75349, hash: "af3b83aefac2b1bf", text: () => import("./assets-chunks/faq_index_html.mjs").then(m => m.default)},
    "careers/index.html": {size: 75345, hash: "b6eee45767dbed76", text: () => import("./assets-chunks/careers_index_html.mjs").then(m => m.default)},
    "blog/water-softener-maintenance-tips/index.html": {size: 98962, hash: "d75238c3684cdcef", text: () => import("./assets-chunks/blog_water-softener-maintenance-tips_index_html.mjs").then(m => m.default)},
    "blog/choosing-the-right-water-softener/index.html": {size: 99931, hash: "c98b6bc45adb8c58", text: () => import("./assets-chunks/blog_choosing-the-right-water-softener_index_html.mjs").then(m => m.default)},
    "index.html": {size: 212262, hash: "da32469d635eeacd", text: () => import("./assets-chunks/index_html.mjs").then(m => m.default)},
    "about/index.html": {size: 90625, hash: "6e4884f3c200f61d", text: () => import("./assets-chunks/about_index_html.mjs").then(m => m.default)},
    "products/purolite-softener-resin/index.html": {size: 81645, hash: "3d9b0debacf5f3cb", text: () => import("./assets-chunks/products_purolite-softener-resin_index_html.mjs").then(m => m.default)},
    "products/sand-filters/index.html": {size: 86876, hash: "b5cc5ce15fbc65c8", text: () => import("./assets-chunks/products_sand-filters_index_html.mjs").then(m => m.default)},
    "calculator/index.html": {size: 74282, hash: "7b382c2e9f67cc05", text: () => import("./assets-chunks/calculator_index_html.mjs").then(m => m.default)},
    "testimonials/index.html": {size: 83535, hash: "f6eb43d4a47cad1a", text: () => import("./assets-chunks/testimonials_index_html.mjs").then(m => m.default)},
    "contact/index.html": {size: 90777, hash: "16504ca4f9416b6f", text: () => import("./assets-chunks/contact_index_html.mjs").then(m => m.default)},
    "products/iron-filters/index.html": {size: 83528, hash: "d192cf9099e32c5f", text: () => import("./assets-chunks/products_iron-filters_index_html.mjs").then(m => m.default)},
    "products/carbon-filters/index.html": {size: 83662, hash: "4aa042c66353ead8", text: () => import("./assets-chunks/products_carbon-filters_index_html.mjs").then(m => m.default)},
    "gallery/index.html": {size: 86571, hash: "7bd6a30b5331172a", text: () => import("./assets-chunks/gallery_index_html.mjs").then(m => m.default)},
    "blog/signs-of-hard-water/index.html": {size: 99524, hash: "30227688094d1b64", text: () => import("./assets-chunks/blog_signs-of-hard-water_index_html.mjs").then(m => m.default)}
  },
};
