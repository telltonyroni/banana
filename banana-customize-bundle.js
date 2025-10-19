<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Banana Customize Bundle (Isolated)</title>
  <style>
    /* --- Minimal tokens --- */
    :root{
      --surface:#ffffff; --ink:#0A0A0A; --muted:#737373;
      --accent:#FFD93D; --accent-dark:#E0C24B; --warn:#ef4444; --info:#3b82f6;
      --shadow-md:0 4px 16px rgba(0,0,0,.06); --shadow-lg:0 8px 24px rgba(0,0,0,.08);
      --radius:12px;
    }

    /* --- Icons utility --- */
    .icon{width:18px;height:18px;display:inline-block}

    /* --- Modal shell (reused by Customizer) --- */
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(8px);z-index:2000;display:none}
    .modal-overlay.show{display:block}
    .modal{position:fixed;inset:0;z-index:2001;display:none;align-items:center;justify-content:center;padding:20px}
    .modal.show{display:flex}
    .modal-content{width:min(720px,100%);max-height:90vh;background:rgba(255,255,255,.96);border-radius:20px;box-shadow:0 12px 32px rgba(0,0,0,.12);overflow:hidden;position:relative;display:flex;flex-direction:column}
    .modal-close{position:absolute;top:16px;right:16px;width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);color:#fff;border:none;cursor:pointer;display:grid;place-items:center}
    .modal-body{padding:24px;overflow-y:auto;flex:1}

    /* --- Customize UI --- */
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    .customize-header{display:flex;align-items:center;gap:20px;margin-bottom:24px;padding-bottom:20px;border-bottom:2px solid rgba(0,0,0,0.06)}
    .customize-stage{flex-shrink:0;width:200px;height:300px;background:linear-gradient(135deg,rgba(255,217,61,0.12),rgba(224,194,75,0.12));border-radius:20px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .customize-stage::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,217,61,0.2),transparent 70%);animation:pulse 3s ease-in-out infinite}
    .customize-preview-svg{width:140px;height:auto;filter:drop-shadow(0 6px 16px rgba(0,0,0,0.12));transition:all .3s cubic-bezier(.34,1.56,.64,1);position:relative;z-index:2}
    .customize-preview-svg.changing{transform:scale(.85) rotate(-5deg);opacity:.7}
    .customize-info h4{font-size:20px;font-weight:700;color:var(--ink);margin-bottom:10px}
    .customize-info p{font-size:14px;color:var(--muted);line-height:1.6}

    .customize-tabs{display:flex;gap:8px;margin-bottom:20px;background:rgba(0,0,0,0.03);padding:6px;border-radius:12px}
    .customize-tab{flex:1;padding:12px 16px;border:none;border-radius:8px;background:transparent;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s ease;color:var(--muted)}
    .customize-tab.active{background:linear-gradient(135deg,var(--accent),var(--accent-dark));color:var(--ink);box-shadow:var(--shadow-md)}

    .customize-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:12px;margin-bottom:24px}
    .customize-option{position:relative;aspect-ratio:1;border:2px solid rgba(0,0,0,0.1);border-radius:14px;padding:10px;cursor:pointer;transition:all .2s ease;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#fff}
    .customize-option:hover{border-color:var(--accent-dark);transform:translateY(-3px);box-shadow:var(--shadow-md)}
    .customize-option.selected{border-color:var(--accent-dark);background:linear-gradient(135deg,rgba(255,217,61,.15),rgba(224,194,75,.15));box-shadow:var(--shadow-md)}
    .customize-option-preview{width:60px;height:60px;display:flex;align-items:center;justify-content:center}
    .customize-option-preview svg{width:100%;height:auto;max-height:100%}
    .customize-option-label{font-size:11px;font-weight:600;color:var(--ink);text-align:center;line-height:1.2}
    .customize-option.none-option{border-style:dashed;opacity:.6}

    .customize-action-bar{display:flex;gap:12px;padding-top:20px;border-top:2px solid rgba(0,0,0,0.06)}
    .customize-action-bar button{flex:1;padding:16px;border:none;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:center;gap:10px}
    .btn-reset{background:rgba(0,0,0,.06);color:var(--ink);border:1px solid rgba(0,0,0,.1)}
    .btn-apply{background:linear-gradient(135deg,var(--accent),var(--accent-dark));color:var(--ink);border:1px solid var(--accent-dark);box-shadow:var(--shadow-md)}

    /* Optional: tiny toast for inline feedback */
    .toast{position:fixed;left:50%;transform:translateX(-50%);bottom:90px;z-index:10000;background:rgba(255,255,255,.96);backdrop-filter:blur(16px);padding:10px 16px;border-radius:var(--radius);box-shadow:0 12px 32px rgba(0,0,0,.12);font-size:13px;font-weight:600;border:1px solid rgba(0,0,0,0.06)}
  </style>
</head>
<body>

  <!-- Minimal icon sprite needed by the customizer -->
  <svg style="position:absolute;width:0;height:0" aria-hidden="true">
    <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></symbol>
    <symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13zM5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" fill="currentColor"/></symbol>
    <symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
  </svg>

  <!-- Container that will host the customizer modal when invoked -->
  <div id="bananaCustomizeHost"></div>
  <div id="bananaToastHost"></div>

  <script>
  /**********************
   * BANANA CUSTOMIZE BUNDLE
   * - Self-contained UI for picking head/accessory/shirt
   * - Provides: openCustomizeModal({ initial, onApply }) and renderCompositeBananaSVG(head, accessory, shirt)
   **********************/

  // ====== Config: SVG sources (same paths as original app) ======
  const VIEWBOX = '0 0 308 574';
  const BASE_SVG_URL = 'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/base.svg';
  const HEAD_SVG_URLS = {
    default:null,
    backcap:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/backcap.svg',
    cat:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/cat.svg',
    chef:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/chef.svg',
    detective:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/detective.svg',
    explorer:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/explorer.svg',
    funcap:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/funcap.svg',
    wizard:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/wizard.svg',
    artcap:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/artcap.svg',
    beanie:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/beanie.svg',
    sailorcap:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/heads/sailorcap.svg',
  };
  const ACCESSORY_SVG_URLS = {
    default:null,
    backpack:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/accessories/backpack.svg',
    shades:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/accessories/shades.svg',
    hearts:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/accessories/hearts.svg',
  };
  const SHIRT_SVG_URLS = {
    default:null,
    bowtie:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/shirts/bowtie.svg',
    suit:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/shirts/suit.svg',
    overalls:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/shirts/overalls.svg',
    shirt:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/shirts/shirt.svg',
    green:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/shirts/green.svg',
    sailor:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/shirts/sailor.svg',
    art:'https://raw.githubusercontent.com/telltonyroni/banana/refs/heads/main/svgs/shirts/art.svg',
  };

  // ====== Option model ======
  const CUSTOMIZATION_OPTIONS = {
    head:[
      {value:'default',label:'None'},
      {value:'backcap',label:'Back Cap'},
      {value:'artcap',label:'Art Cap'},
      {value:'beanie',label:'Beanie'},
      {value:'sailorcap',label:'Sailor Cap'},
      {value:'cat',label:'Cat'},
      {value:'chef',label:'Chef'},
      {value:'detective',label:'Detective'},
      {value:'explorer',label:'Explorer'},
      {value:'funcap',label:'Fun Cap'},
      {value:'wizard',label:'Wizard'},
    ],
    accessory:[
      {value:'default',label:'None'},
      {value:'shades',label:'Shades'},
      {value:'backpack',label:'Backpack'},
      {value:'hearts',label:'Hearts'},
    ],
    shirt:[
      {value:'default',label:'None'},
      {value:'bowtie',label:'Bow Tie'},
      {value:'suit',label:'Suit'},
      {value:'overalls',label:'Overalls'},
      {value:'shirt',label:'Shirt'},
      {value:'green',label:'Green Tee'},
      {value:'sailor',label:'Sailor'},
      {value:'art',label:'Art Smock'},
    ]
  };

  // ====== Helpers ======
  const esc = s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
  const svgCache = {};
  const fetchText = async url => {
    if(!url) return '';
    if(svgCache[url]) return svgCache[url];
    const res = await fetch(url);
    const txt = await res.text();
    svgCache[url] = txt; return txt;
  };
  const stripOuterSVG = s => {
    if(!s) return '';
    const open = s.indexOf('<svg');
    const close = s.lastIndexOf('</svg>');
    if(open!==-1 && close!==-1){
      const innerStart = s.indexOf('>',open)+1;
      return s.slice(innerStart,close).trim();
    }
    return s.trim();
  };

  // Build composite SVG for the banana based on selected parts
  async function getCompositeBananaSVG(head, accessory, shirt){
    const [base, shirtSVG, accessorySVG, headSVG] = await Promise.all([
      fetchText(BASE_SVG_URL),
      fetchText(SHIRT_SVG_URLS[shirt]||null),
      fetchText(ACCESSORY_SVG_URLS[accessory]||null),
      fetchText(HEAD_SVG_URLS[head]||null),
    ]);
    return `\n<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">\n  <g class="banana-base">${stripOuterSVG(base)}</g>\n  ${shirtSVG?`<g class="banana-shirt">${stripOuterSVG(shirtSVG)}</g>`:''}\n  ${accessorySVG?`<g class="banana-accessory">${stripOuterSVG(accessorySVG)}</g>`:''}\n  ${headSVG?`<g class="banana-head">${stripOuterSVG(headSVG)}</g>`:''}\n</svg>`;
  }

  // Public helper: render a composite directly into a DOM element
  async function renderCompositeBananaSVG(head='default', accessory='default', shirt='default', target){
    const html = await getCompositeBananaSVG(head, accessory, shirt);
    if(target) target.innerHTML = html;
    return html;
  }

  // Tiny toast (optional)
  const toastHost = document.getElementById('bananaToastHost');
  function toast(msg, ms=1600){
    if(!toastHost) return;
    toastHost.innerHTML = `<div class="toast">${esc(msg)}</div>`;
    if(ms>0) setTimeout(()=>toastHost.innerHTML='', ms);
  }

  // ====== Core UI: openCustomizeModal ======
  // Usage: openCustomizeModal({ initial:{head,accessory,shirt}, onApply:(sel)=>{} })
  async function openCustomizeModal({ initial = {head:'default', accessory:'default', shirt:'default'}, onApply }={}){
    // Ensure host shells exist
    let overlay = document.getElementById('bananaCustomizeOverlay');
    let modal = document.getElementById('bananaCustomizeModal');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'bananaCustomizeOverlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'bananaCustomizeModal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <button class="modal-close" id="bananaCustomizeClose"><svg class="icon"><use href="#i-close"/></svg></button>
          <div class="modal-body">
            <div class="customize-header">
              <div class="customize-stage"><div class="customize-preview-svg" id="customizePreviewSVG"></div></div>
              <div class="customize-info">
                <h4>🎨 Customize Your Banana</h4>
                <p>Pick a hat, add a little flair, or dress it up. Your banana, your vibe.</p>
              </div>
            </div>
            <div class="customize-tabs">
              <button class="customize-tab active" data-category="head">👒 Hats</button>
              <button class="customize-tab" data-category="accessory">🎒 Gear</button>
              <button class="customize-tab" data-category="shirt">👕 Outfits</button>
            </div>
            <div class="customize-grid" id="customizeGrid"></div>
            <div class="customize-action-bar">
              <button class="btn-reset" id="resetCustomize"><svg class="icon"><use href="#i-trash"/></svg>Reset</button>
              <button class="btn-apply" id="applyCustomize"><svg class="icon"><use href="#i-sparkles"/></svg>Apply</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }

    const close = ()=>{ overlay.classList.remove('show'); modal.classList.remove('show'); };
    overlay.onclick = close;
    modal.querySelector('#bananaCustomizeClose').onclick = close;

    // State
    let selections = { ...{head:'default', accessory:'default', shirt:'default'}, ...initial };
    let activeCategory = 'head';

    // Preview
    const preview = modal.querySelector('#customizePreviewSVG');
    async function updatePreview(){
      preview.classList.add('changing');
      setTimeout(async()=>{
        preview.innerHTML = await getCompositeBananaSVG(selections.head, selections.accessory, selections.shirt);
        setTimeout(()=>preview.classList.remove('changing'), 50);
      }, 150);
    }

    // Grid render
    const grid = modal.querySelector('#customizeGrid');
    function renderCategory(category){
      grid.innerHTML = CUSTOMIZATION_OPTIONS[category].map(opt=>{
        const isNone = opt.value==='default';
        const isSelected = selections[category]===opt.value;
        return `<div class="customize-option ${isNone?'none-option':''} ${isSelected?'selected':''}" data-value="${opt.value}" data-category="${category}">
          <div class="customize-option-preview" id="preview-${category}-${opt.value}"></div>
          <div class="customize-option-label">${esc(opt.label)}</div>
        </div>`;
      }).join('');

      // Paint tiny previews (solo part on banana base)
      setTimeout(async()=>{
        for(const opt of CUSTOMIZATION_OPTIONS[category]){
          if(opt.value==='default') continue;
          const el = document.getElementById(`preview-${category}-${opt.value}`);
          if(el){
            const tempSel = { head:'default', accessory:'default', shirt:'default' };
            tempSel[category] = opt.value;
            el.innerHTML = await getCompositeBananaSVG(tempSel.head, tempSel.accessory, tempSel.shirt);
          }
        }
      }, 30);

      grid.querySelectorAll('.customize-option').forEach(optEl=>{
        optEl.onclick = ()=>{
          const cat = optEl.dataset.category;
          const val = optEl.dataset.value;
          selections[cat] = val;
          renderCategory(cat);
          updatePreview();
        };
      });
    }

    // Tabs
    modal.querySelectorAll('.customize-tab').forEach(tab=>{
      tab.onclick = ()=>{
        modal.querySelectorAll('.customize-tab').forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = tab.dataset.category;
        renderCategory(activeCategory);
      };
    });

    // Actions
    modal.querySelector('#resetCustomize').onclick = ()=>{
      selections = { head:'default', accessory:'default', shirt:'default' };
      renderCategory(activeCategory);
      updatePreview();
      toast('Reset to default');
    };
    modal.querySelector('#applyCustomize').onclick = async ()=>{
      try{
        if(typeof onApply === 'function') await onApply({...selections});
        toast('Banana customized!');
      }catch(e){
        console.error(e); toast('Apply failed', 1800);
      }
      close();
    };

    // Show
    overlay.classList.add('show');
    modal.classList.add('show');

    // Initial paint
    await updatePreview();
    renderCategory('head');
  }

  // Expose to global (so you can call from your page)
  window.BananaCustomize = {
    openCustomizeModal,
    renderCompositeBananaSVG,
    getCompositeBananaSVG, // exported in case you want raw string
    CUSTOMIZATION_OPTIONS,
    HEAD_SVG_URLS, ACCESSORY_SVG_URLS, SHIRT_SVG_URLS
  };
  </script>

  <!-- Example usage (remove in production): -->
  <div style="display:flex;gap:24px;align-items:flex-start;margin:24px">
    <div>
      <h3>Inline Preview</h3>
      <div id="inlineBanana" style="width:160px"></div>
      <button style="margin-top:12px" onclick="BananaCustomize.openCustomizeModal({ initial: state, onApply: sel=>{ state=sel; BananaCustomize.renderCompositeBananaSVG(sel.head, sel.accessory, sel.shirt, document.getElementById('inlineBanana')); } })">Open Customizer</button>
    </div>
    <pre id="stateOut" style="padding:12px;background:#fafafa;border:1px solid #eee;border-radius:8px"></pre>
  </div>
  <script>
    // Demo wiring
    let state = { head:'default', accessory:'default', shirt:'default' };
    BananaCustomize.renderCompositeBananaSVG(state.head, state.accessory, state.shirt, document.getElementById('inlineBanana'));
    const dump = ()=>document.getElementById('stateOut').textContent = JSON.stringify(state, null, 2);
    dump();
    window.addEventListener('click', ()=>{ dump(); }, true);
  </script>

</body>
</html>
