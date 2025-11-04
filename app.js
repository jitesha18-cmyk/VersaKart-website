/* VersaKart — patched app.js (with seller-ID + prefills + buyer restrictions) */
const STORAGE_KEY = 'vk_products_v2';
const USER_KEY = 'vk_current_user';
const USERS_LIST_KEY = 'vk_users_v1';
const el = id => document.getElementById(id);

/* ---------------- sample data (used when localStorage empty) ---------------- */
const sampleData = [
  { id:'p1', productName:'Handmade Jute Bag', category:'Handicrafts', price:300, description:'Eco jute tote.', image:'', sellerName:'Kavita Crafts', sellerId:'', contactNumber:'919876543210', locationText:'KV Market, Ranchi', latitude:'23.3441', longitude:'85.3096', whatsapp:'https://wa.me/919876543210?text=Interested' },
  { id:'p2', productName:'Organic Mango Jam', category:'Food', price:150, description:'Home-made mango jam.', image:'', sellerName:'Sharma Foods', sellerId:'', contactNumber:'919812345678', locationText:'Patna', latitude:'25.5941', longitude:'85.1376', whatsapp:'https://wa.me/919812345678?text=Interested' },
  { id:'p3', productName:'Clay Diyas (set)', category:'Decor', price:200, description:'Handmade clay diyas.', image:'', sellerName:'Village Arts', sellerId:'', contactNumber:'919700000001', locationText:'Varanasi', latitude:'25.3176', longitude:'82.9739', whatsapp:'https://wa.me/919700000001?text=Interested' }
];

/* ---------------- storage & current user helpers ---------------- */
let products = [];
let role = null;
let currentUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

function loadProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) products = JSON.parse(raw);
  else { products = sampleData.slice(); saveProducts(); }
}
function saveProducts(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }
function uid(pref='p'){ return pref + Date.now().toString(36) + Math.floor(Math.random()*999).toString(36); }

function saveCurrentUser(u){
  localStorage.setItem(USER_KEY, JSON.stringify(u));
  currentUser = u;
}
function clearCurrentUser(){
  localStorage.removeItem(USER_KEY);
  currentUser = null;
}

/* ---------------- small UI helpers ---------------- */
function showModal(id){ if(el(id)) el(id).classList.remove('hidden'); document.body.style.overflow='hidden'; }
function hideModal(id){ if(el(id)) el(id).classList.add('hidden'); document.body.style.overflow='auto'; }
function getPlaceholder(){ return 'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#444" font-size="24">Image</text></svg>'); }

/* ---------------- file reader helper ---------------- */
function readFileAsDataURL(file){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=> res(r.result);
    r.onerror = ()=> rej(new Error('file read error'));
    r.readAsDataURL(file);
  });
}

/* ---------------- render categories & grid ---------------- */
function renderCategoryOptions(){
  const set = new Set(products.map(p=>p.category).filter(Boolean));
  const sel = el('categoryFilter'); if(!sel) return;
  sel.innerHTML = '<option value="">All categories</option>';
  set.forEach(c => { const o = document.createElement('option'); o.value=c; o.textContent=c; sel.appendChild(o); });
}

function renderGrid(filter=''){
  const grid = el('productGrid'); if(!grid) return;
  grid.innerHTML = '';
  const q = (filter||'').trim().toLowerCase();
  const cat = el('categoryFilter') ? el('categoryFilter').value : '';

  let filtered = products.filter(p=>{
    if (cat && p.category !== cat) return false;
    if (!q) return true;
    return (p.productName + ' ' + p.description + ' ' + p.category).toLowerCase().includes(q);
  });

  // If signed-in seller viewing, show only seller's own items
  if (role === 'seller' && currentUser && currentUser.type === 'seller') {
    const sellerId = currentUser.id;
    filtered = filtered.filter(p => p.sellerId === sellerId);
  }

  if (filtered.length === 0) { grid.innerHTML = '<p style="color:#999">No products found.</p>'; return; }

  filtered.forEach(p=>{
    const card = document.createElement('div'); card.className = 'card';
    const img = document.createElement('img'); img.src = p.image || getPlaceholder();
    const title = document.createElement('div'); title.className='title'; title.textContent = p.productName;
    const meta = document.createElement('div'); meta.className='meta'; meta.textContent = (p.sellerName||'') + (p.locationText ? ' • '+p.locationText : '');
    const price = document.createElement('div'); price.className='price'; price.textContent = '₹ ' + p.price;
    const btnRow = document.createElement('div'); btnRow.className='btnRow';
    const view = document.createElement('button'); view.className='smallBtn'; view.textContent='View'; view.onclick = ()=> openDetail(p.id);
    const contact = document.createElement('button'); contact.className='smallBtn'; contact.textContent='Contact'; contact.onclick = ()=> window.open(p.whatsapp || `tel:${p.contactNumber}`,'_blank');
    btnRow.appendChild(view); btnRow.appendChild(contact);
    card.appendChild(img); card.appendChild(title); card.appendChild(meta); card.appendChild(price); card.appendChild(btnRow);
    grid.appendChild(card);
  });
}

/* ---------------- product detail ---------------- */
function openDetail(id){
  const p = products.find(x=>x.id===id); if(!p) return;
  const imgEl = el('detailImage'); if(imgEl) imgEl.src = p.image || getPlaceholder();
  if(el('detailName')) el('detailName').textContent = p.productName || '';
  if(el('detailSeller')) el('detailSeller').textContent = (p.sellerName ? p.sellerName+' • ' : '') + (p.locationText||'');
  if(el('detailPrice')) el('detailPrice').textContent = '₹ ' + (p.price||0);
  if(el('detailDesc')) el('detailDesc').textContent = p.description || '';
  if(el('callBtn')) el('callBtn').onclick = ()=> window.open(`tel:${p.contactNumber}`);
  if(el('waBtn')) el('waBtn').onclick = ()=> window.open(p.whatsapp || `https://wa.me/${p.contactNumber}?text=Hi`, '_blank');
  showModal('detailModal');
}

/* ---------------- handle product form submit (saves sellerId when present) ---------------- */
async function handleFormSubmit(e){
  e.preventDefault();
  const f = e.target;
  const data = Object.fromEntries(new FormData(f));
  const file = f.imageFile ? f.imageFile.files[0] : null;
  let imgData = '';
  if (file && file.type && file.type.startsWith('image/')) {
    try { imgData = await readFileAsDataURL(file); } catch(err){ imgData = ''; }
  } else {
    imgData = '';
  }

  const current = currentUser || null;
  const item = {
    id: uid(),
    productName: data.productName || '',
    category: data.category || '',
    price: Number(data.price) || 0,
    description: data.description || '',
    image: imgData || '',
    sellerName: current ? (current.sellerName || current.displayName) : (data.sellerName || ''),
    sellerId: current ? current.id : '',
    contactNumber: data.contactNumber || '',
    locationText: data.locationText || '',
    latitude: data.latitude || '',
    longitude: data.longitude || '',
    whatsapp: data.contactNumber ? `https://wa.me/${data.contactNumber.replace(/\D/g,'')}` : ''
  };

  products.unshift(item);
  saveProducts();
  renderCategoryOptions();
  renderGrid(el('searchInput') ? el('searchInput').value : '');
  if(el('formMsg')) el('formMsg').classList.remove('hidden');
  setTimeout(()=> { if(el('formMsg')) el('formMsg').classList.add('hidden'); hideModal('formModal'); f.reset(); }, 900);
}

/* ---------------- helper to open product form prefilled for sellers ---------------- */
function openProductFormPrefilled(){
  const form = el('productForm');
  if (form && currentUser && currentUser.type === 'seller') {
    form.sellerName.value = currentUser.sellerName || currentUser.displayName || '';
    if (currentUser.contactNumber && !form.contactNumber.value) {
      form.contactNumber.value = currentUser.contactNumber;
    }
  }
  showModal('formModal');
}

/* ---------------- sign-in modal flow (lightweight with numeric seller ID gen) ---------------- */
function openSignIn(roleChoice='buyer'){
  const modal = el('signInModal'); if(!modal) return;
  el('signRole').value = roleChoice;
  el('signInTitle').textContent = roleChoice === 'seller' ? 'Seller sign in / Create account' : 'Buyer sign in / Create account';
  el('sellerFields').style.display = roleChoice === 'seller' ? 'block' : 'none';
  // prefill fields if current user exists
  if (currentUser){
    if(el('userId')) el('userId').value = currentUser.userId || '';
    if(el('displayName')) el('displayName').value = currentUser.displayName || '';
    if(el('sellerName')) el('sellerName').value = currentUser.sellerName || '';
  } else {
    if(el('userId')) el('userId').value = '';
    if(el('displayName')) el('displayName').value = '';
    if(el('sellerName')) el('sellerName').value = '';
  }
  modal.classList.remove('hidden');
}

/* ---------------- show signed-in UI (header) ---------------- */
function showSignedInUI(){
  const info = el('currentUserInfo');
  const signOutBtn = el('btnSignOut');
  if(!info) return;
  if (currentUser){
    info.textContent = currentUser.type==='seller' ? `${currentUser.displayName} (${currentUser.sellerName||''})` : currentUser.displayName;
    if(el('openSellerFormTop')) el('openSellerFormTop').style.display = currentUser.type==='seller' ? 'inline-block' : 'none';
    if (signOutBtn) signOutBtn.style.display = 'inline-block';
  } else {
    info.textContent = 'Not signed in';
    if(el('openSellerFormTop')) el('openSellerFormTop').style.display = 'none';
    if (signOutBtn) signOutBtn.style.display = 'none';
  }
}


/* ---------------- HOME handler ---------------- */
function bindHomeButton(){
  const homeBtn = el('tabHome');
  if (!homeBtn) return;
  homeBtn.addEventListener('click', ()=>{
    role = null;
    el('app').classList.add('hidden');
    el('roleScreen').classList.remove('hidden');
    window.scrollTo({top:0});
  });
}

/* ---------------- setRole: show/hide UI and protect add/register for buyers ---------------- */
function setRole(r){
  role = r;
  if (el('roleScreen')) el('roleScreen').classList.add('hidden');
  if (el('app')) el('app').classList.remove('hidden');

  // Add-button visibility: only for signed-in sellers
  if (r === 'buyer') {
    if (el('openSellerFormTop')) el('openSellerFormTop').style.display = 'none';
  } else {
    if (el('openSellerFormTop')) el('openSellerFormTop').style.display = 'inline-block';
  }

  // Disable the "Item Registration" tab for buyers
  const regTab = el('tabRegister');
  if (regTab) {
    if (r === 'buyer') {
      regTab.disabled = true;
      regTab.style.opacity = '0.5';
      regTab.style.pointerEvents = 'none';
    } else {
      regTab.disabled = false;
      regTab.style.opacity = '';
      regTab.style.pointerEvents = '';
    }
  }

  renderGrid();
  renderCategoryOptions();
  showSignedInUI();
}

/* ---------------- init: wire up handlers ---------------- */
function init(){
  loadProducts();
  renderCategoryOptions();

  // sign-in modal events
  const signForm = el('signInForm');
  if (signForm){
    signForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const f = ev.target;
      const roleSel = (f.role && f.role.value) || (el('signRole') && el('signRole').value) || 'buyer';
      const providedUserId = (f.userId && f.userId.value.trim()) || '';
      const displayName = (f.displayName && f.displayName.value.trim()) || 'User';
      const sellerNameInput = (f.sellerName && f.sellerName.value.trim()) || displayName;

      // load existing users list to avoid collisions for seller IDs
      const usersList = JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]');

      let userId = providedUserId;
      if (roleSel === 'seller') {
        // create S + 6 digits ID if not provided; ensure unique in usersList
        const makeId = ()=> 'S' + Math.floor(100000 + Math.random() * 900000).toString();
        if (!userId) {
          do { userId = makeId(); } while (usersList.some(u => u.userId === userId));
        }
      } else {
        if (!userId) userId = uid('u');
      }

      const user = { id: uid('u'), userId, displayName, type: roleSel, sellerName: roleSel==='seller' ? sellerNameInput : '' };

      // persist in users list for basic uniqueness checking
      usersList.push(user);
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(usersList));

      // set current user and proceed
      saveCurrentUser(user);
      if (el('signInModal')) el('signInModal').classList.add('hidden');
      setRole(roleSel);
      showSignedInUI();
      renderGrid();
    });
  }

  const closeSignIn = el('closeSignIn'); if (closeSignIn) closeSignIn.onclick = ()=> el('signInModal').classList.add('hidden');
  const signOutBtn = el('signOutBtn'); if (signOutBtn) signOutBtn.onclick = ()=> { clearCurrentUser(); showSignedInUI(); alert('Signed out'); };

  // role buttons
  const btnBuyer = el('btnBuyer'), btnSeller = el('btnSeller');
  if (btnBuyer) btnBuyer.onclick = ()=> { setRole('buyer'); };
  if (btnSeller) btnSeller.onclick = ()=> {
    if (currentUser && currentUser.type === 'seller'){ setRole('seller'); return; }
    openSignIn('seller');
  };

    // top + Add handler (requires seller) — now strict: no prompt fallback
  const topAdd = el('openSellerFormTop');
  if (topAdd) {
    topAdd.onclick = () => {
      // Only allow if currentUser exists AND is a seller
      if (!currentUser || currentUser.type !== 'seller') {
        alert('Only signed-in sellers can add items. Click "I\'m a Seller" and sign in first.');
        return;
      }
      // open product form prefilling seller info
      openProductFormPrefilled();
    };
    // Also ensure it's hidden for non-sellers on load
    if (!currentUser || currentUser.type !== 'seller') {
      topAdd.style.display = 'none';
    } else {
      topAdd.style.display = 'inline-block';
    }
  }

  // other bindings
  if (el('closeForm')) el('closeForm').onclick = ()=> hideModal('formModal');
  if (el('closeDetail')) el('closeDetail').onclick = ()=> hideModal('detailModal');
  if (el('productForm')) el('productForm').onsubmit = handleFormSubmit;
  if (el('searchInput')) el('searchInput').oninput = ()=> renderGrid(el('searchInput').value);
  if (el('categoryFilter')) el('categoryFilter').onchange = ()=> renderGrid(el('searchInput').value);

  // registration tab opens product form prefilled for sellers
  if (el('tabRegister')) el('tabRegister').onclick = ()=> {
    if (role === 'seller') openProductFormPrefilled();
    else alert('Choose a role first.');
  };

  if (el('tabProducts')) el('tabProducts').onclick = ()=> { if (role){ window.scrollTo({top:0,behavior:'smooth'}); if(el('searchInput')) el('searchInput').focus(); } else alert('Choose a role first.'); };

    // initial display logic
  // Always show the role selection screen first so user picks Buyer/Seller each session.
  // We still show signed-in user info in header (if any) but keep them on role selection.
  showSignedInUI();
  if (el('roleScreen')) el('roleScreen').classList.remove('hidden');
  // hide app until a role is chosen
  if (el('app')) el('app').classList.add('hidden');

// ----------------- STRICT top + Add protection (paste at end of init()) -----------------
(function enforceTopAddRules(){
  const topAdd = el('openSellerFormTop');
  if (!topAdd) return;

  // remove any existing onclick to be safe
  topAdd.onclick = null;
  topAdd.removeEventListener && topAdd.removeEventListener('click', ()=>{});

  // If current user is not a signed-in seller OR current selected role is buyer -> hide & block
  const notAllowed = !(currentUser && currentUser.type === 'seller' && role === 'seller');

  if (notAllowed) {
    // hide visually and prevent pointer events
    topAdd.style.display = 'none';
    topAdd.style.pointerEvents = 'none';
    topAdd.setAttribute('aria-hidden','true');
    // make absolutely sure clicking does nothing
    topAdd.addEventListener('click', (e)=>{ e.preventDefault(); e.stopImmediatePropagation(); alert("Only signed-in sellers can add items. Choose I'm a Seller and sign in first."); }, {capture:true});
  } else {
    // allowed: show and attach safe click handler that won't prompt for sign-up anymore
    topAdd.style.display = 'inline-block';
    topAdd.style.pointerEvents = '';
    topAdd.removeAttribute('aria-hidden');
    // remove any previous protective listeners (can't remove anonymous ones reliably but we set a simple handler)
    topAdd.onclick = ()=> { openProductFormPrefilled(); };
  }
})();

// Header sign-out button (clears current user and returns to role screen)
const headerSignOut = el('btnSignOut');
if (headerSignOut) {
  headerSignOut.addEventListener('click', () => {
    // clear signer info
    clearCurrentUser();
    // also hide any sign-in modal if open
    if (el('signInModal')) el('signInModal').classList.add('hidden');
    // reset UI state
    role = null;
    if (el('app')) el('app').classList.add('hidden');
    if (el('roleScreen')) el('roleScreen').classList.remove('hidden');
    // update header and controls
    showSignedInUI();
    // ensure add button is disabled/hidden for non-sellers
    const topAdd = el('openSellerFormTop');
    if (topAdd) { topAdd.style.display = 'none'; topAdd.style.pointerEvents = 'none'; }
    // also disable the registration tab visually
    const regTab = el('tabRegister');
    if (regTab) { regTab.disabled = true; regTab.style.opacity = '0.5'; regTab.style.pointerEvents = 'none'; }
    alert('You have been signed out.');
  });
}

  bindHomeButton();
}


/* Run init (script loaded with defer) */
init();

