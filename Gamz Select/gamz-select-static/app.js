// Utilities
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

async function loadInventory() {
  const r = await fetch('data/inventory.json');
  return await r.json();
}

function money(n){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n); }

// Render helpers
function productCard(p){
  const img = (p.images && p.images[0]) || 'assets/placeholder.jpg';
  return `
  <a class="card" href="product.html?slug=${encodeURIComponent(p.slug)}">
    <div class="product-img"><img src="${img}" alt="${p.brand} ${p.model}"></div>
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <div style="font-weight:600">${p.brand} ${p.model}</div>
        <div style="opacity:.7;font-size:12px">Ref. ${p.reference}</div>
      </div>
      <div style="opacity:.75;font-size:14px">${p.year} · ${p.caseSize}mm · ${p.material}</div>
      <div style="margin-top:6px;font-weight:700">${money(p.price)}</div>
      <div style="margin-top:8px">
        <span class="badge">${p.condition}</span>
        <span class="badge">${p.availability}</span>
        <span class="badge">${p.boxPapers}</span>
      </div>
    </div>
  </a>`;
}

// Index page
async function initIndex(){
  const wrap = $('#featured');
  if(!wrap) return;
  const list = (await loadInventory()).slice(0,6);
  wrap.innerHTML = list.map(productCard).join('');
}

// Shop page
async function initShop(){
  const grid = $('#shop-grid');
  if(!grid) return;
  const data = await loadInventory();
  // filters
  const brands = [...new Set(data.map(p=>p.brand))].sort();
  const brandSel = $('#brand');
  brandSel.innerHTML = '<option value="">Brand</option>' + brands.map(b=>`<option>${b}</option>`).join('');
  function apply(){
    const b = brandSel.value;
    const max = parseFloat($('#maxPrice').value || '0');
    const cond = $('#cond').value;
    let filtered = data.slice();
    if(b) filtered = filtered.filter(p=>p.brand===b);
    if(max>0) filtered = filtered.filter(p=>p.price <= max);
    if(cond) filtered = filtered.filter(p=>p.condition===cond);
    grid.innerHTML = filtered.map(productCard).join('');
  }
  ['change','input'].forEach(ev=>{
    $('#filters').addEventListener(ev, apply);
  });
  apply();
}

// Product page
async function initProduct(){
  const root = $('#product');
  if(!root) return;
  const slug = new URLSearchParams(location.search).get('slug');
  const p = (await loadInventory()).find(x=>x.slug===slug);
  if(!p){ root.innerHTML = '<p>Product not found.</p>'; return; }
  const img = (p.images && p.images[0]) || 'assets/placeholder.jpg';
  document.title = `${p.brand} ${p.model} – ${p.reference} | Gamz Select`;
  root.innerHTML = `
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:24px">
      <div class="hero-img"><img src="${img}" alt="${p.brand} ${p.model}"></div>
      <div>
        <h1 style="margin:0 0 6px 0">${p.brand} ${p.model}</h1>
        <div style="opacity:.75">Ref. ${p.reference} • ${p.year} • ${p.caseSize}mm • ${p.material}</div>
        <div style="margin-top:12px;font-size:24px;font-weight:700">${money(p.price)}</div>
        <div style="margin-top:8px">
          <span class="badge">${p.condition}</span>
          <span class="badge">${p.availability}</span>
          <span class="badge">${p.boxPapers}</span>
        </div>
        <p style="margin-top:14px;opacity:.9">${p.notes || ''}</p>
        <div style="display:flex;gap:10px;margin-top:18px">
          <a class="btn btn-primary" href="mailto:sales@gamzselect.com?subject=Purchase%20Inquiry%20${encodeURIComponent(p.sku)}">Inquire to Purchase</a>
          <a class="btn" href="sell-trade.html">Sell / Trade</a>
        </div>
      </div>
    </div>`;
}

// Orologo page (client)
async function initOrologo(){
  const root = $('#orologo');
  if(!root) return;
  const paid = document.cookie.includes('orologo_paid=1');
  const demo = (window.OROLOGO_DEMO === true);

  const ui = `
  <div class="card" style="padding:16px">
    <div id="msgs" style="height:360px;overflow:auto;display:flex;flex-direction:column;gap:8px"></div>
    <form id="chat" style="display:flex;gap:8px;margin-top:10px">
      <input id="input" placeholder="${paid||demo?'Ask about references, servicing, prices…':'Purchase access or use demo'}" style="flex:1;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:#0f0f16;color:#fff">
      <button class="btn btn-primary">Send</button>
    </form>
  </div>`;

  const paywall = paid ? '' : `
  <div class="card" style="padding:16px;margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center">
      <div><div style="font-weight:600">Unlock full access</div><div style="opacity:.75;font-size:14px">Use Gumroad or enter your license to activate.</div></div>
      <div style="display:flex;gap:8px;align-items:center">
        <a class="btn" href="#" id="buy">Buy Day Pass</a>
        <a class="btn btn-primary" href="#" id="buyMonthly">Go Monthly</a>
      </div>
    </div>
    <form id="licenseForm" style="margin-top:10px;display:flex;gap:8px">
      <input name="key" placeholder="Enter license key" style="flex:1;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:#0f0f16;color:#fff">
      <button class="btn">Activate</button>
    </form>
    <div style="margin-top:6px;font-size:12px;opacity:.6">Demo mode may be enabled by the site owner.</div>
  </div>`;

  root.innerHTML = paywall + ui;

  const msgs = $('#msgs');
  const chatForm = $('#chat');
  const input = $('#input');

  const add = (role, text) => {
    const b = document.createElement('div');
    b.style.maxWidth = '80%';
    b.style.padding = '8px 10px';
    b.style.borderRadius = '12px';
    b.style.background = role==='assistant'?'rgba(255,255,255,.06)':'var(--primary)';
    b.style.marginLeft = role==='assistant'?'0':'auto';
    b.textContent = text;
    msgs.appendChild(b);
    msgs.scrollTop = msgs.scrollHeight;
  };

  add('assistant', paid||demo ? "You're in. Ask me anything about watches." : "Unlock Orologo to chat. Use demo if available.");

  chatForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!input.value.trim()) return;
    const text = input.value.trim();
    input.value='';
    add('user', text);
    try{
      const r = await fetch('/api/orologo',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: [{role:'user',content:text}] })
      });
      const data = await r.json();
      add('assistant', data.answer || '…');
    }catch(err){
      add('assistant', 'Error contacting Orologo server.');
    }
  });

  const licForm = $('#licenseForm');
  if(licForm){
    licForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const key = licForm.key.value.trim();
      if(!key) return;
      const r = await fetch('/api/verify',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ license: key })
      });
      const ok = (await r.json()).ok;
      if(ok){ location.reload(); } else { alert('Invalid license'); }
    });
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  initIndex(); initShop(); initProduct(); initOrologo();
});
