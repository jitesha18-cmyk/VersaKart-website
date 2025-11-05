/* VersaKart — patched app.js (with seller-ID + prefills + buyer restrictions) */
const STORAGE_KEY = 'vk_products_v2';
const USER_KEY = 'vk_current_user';
const USERS_LIST_KEY = 'vk_users_v1';
const el = id => document.getElementById(id);

/* ---------------- sample data (used when localStorage empty) ---------------- */
const sampleData = [
  {
    id: 's1',
    productName: "Cotton Baggy Jeans",
    description: "Comfortable eco-friendly jeans made from 100% organic cotton.",
    price: 899,
    category: "Clothing",
    locationText: "Varanasi",
    sellerName: "Aarav Styles",
    contactNumber: "9876543210",
    image: "https://m.media-amazon.com/images/I/81WUvdlOb-L._AC_UY1100_.jpg"
  },
  {
    id: 's2',
    productName: "Handmade Jute Bag",
    description: "Stylish handwoven jute bag crafted by local artisans.",
    price: 450,
    category: "Accessories",
    locationText: "Kolkata",
    sellerName: "Crafts by Meera",
    contactNumber: "9876501234",
    image: "https://m.media-amazon.com/images/I/61lwM93JizL._AC_UY1100_.jpg"
  },
  {
    id: 's3',
    productName: "Organic Mango Jam",
    description: "Delicious homemade mango jam prepared with 100% organic fruits.",
    price: 280,
    category: "Food",
    locationText: "Lucknow",
    sellerName: "Nature’s Spoon",
    contactNumber: "9988776655",
    image: "https://m.media-amazon.com/images/I/61A3W-bcuNL._AC_UF894,1000_QL80_.jpg"
  },
  {
    id: 's4',
    productName: "Clay Diyas (Set of 8)",
    description: "Handcrafted clay diyas perfect for festive decoration.",
    price: 150,
    category: "Home Decor",
    locationText: "Jaipur",
    sellerName: "Terracotta Arts",
    contactNumber: "9876012345",
    image: "https://m.media-amazon.com/images/I/81fU1IO8vdL.jpg"
  },
  {
    id: 's5',
    productName: "Bamboo Toothbrush Set",
    description: "Eco-friendly bamboo toothbrushes with soft bristles — pack of 4.",
    price: 299,
    category: "Personal Care",
    locationText: "Pune",
    sellerName: "GreenLife Store",
    contactNumber: "9123456780",
    image: "https://m.media-amazon.com/images/I/91BclxyALRL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: 's6',
    productName: "Recycled Paper Notebook",
    description: "Notebook made from 100% recycled paper — ideal for students and journaling.",
    price: 120,
    category: "Stationery",
    locationText: "Delhi",
    sellerName: "PaperLeaf Co.",
    contactNumber: "9876012356",
    image: "https://m.media-amazon.com/images/I/817mFy4yYkL.jpg"
  },
  {
    id: 's7',
    productName: "Terracotta Water Bottle",
    description: "Natural clay bottle that keeps your water cool and fresh.",
    price: 350,
    category: "Home Utility",
    locationText: "Bhubaneswar",
    sellerName: "Matka House",
    contactNumber: "9786543210",
    image: "https://m.media-amazon.com/images/I/61jmqMDeMEL._AC_UF350,350_QL80_.jpg"
  },
  {
    id: 's8',
    productName: "Handmade Beaded Earrings",
    description: "Bright, colorful, and lightweight — crafted with care by local women.",
    price: 199,
    category: "Jewelry",
    locationText: "Hyderabad",
    sellerName: "Shine by Siya",
    contactNumber: "9812345678",
    image: "https://m.media-amazon.com/images/I/61FqK+EhTUL._AC_UY1100_.jpg"
  }
  ,
  {
    id: 's9',
    productName: "Handwoven Cotton Kurta, Men",
    description: "Lightweight traditional kurta made with breathable organic cotton fabric.",
    price: 999,
    category: "Clothing",
    locationText: "Ahmedabad",
    sellerName: "ThreadLine",
    contactNumber: "9898123456",
    image: "https://m.media-amazon.com/images/I/91Jx4PKkoLL._AC_UY1100_.jpg"
  },
  {
    id: 's10',
    productName: "Organic Strawberry Jam",
    description: "Delicious small-batch jam made from fresh farm-grown strawberries.",
    price: 320,
    category: "Food",
    locationText: "Nashik",
    sellerName: "Nature’s Spoon",
    contactNumber: "9988776655",
    image: "https://m.media-amazon.com/images/I/81OdJGr+rtL.jpg"
  },
  {
    id: 's11',
    productName: "Decorative Clay Lamp",
    description: "Artistic handcrafted clay lamp with intricate floral carvings.",
    price: 240,
    category: "Home Decor",
    locationText: "Jaipur",
    sellerName: "Terracotta Arts",
    contactNumber: "9876012345",
    image: "https://m.media-amazon.com/images/I/714K1Z3qR6L._AC_UF894,1000_QL80_.jpg"
  },
  {
    id: 's12',
    productName: "Recycled Paper Sketchbook",
    description: "Eco-friendly sketchbook perfect for artists and doodlers.",
    price: 180,
    category: "Stationery",
    locationText: "Delhi",
    sellerName: "PaperLeaf Co.",
    contactNumber: "9876012356",
    image: "https://m.media-amazon.com/images/I/71QoDRciY4L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: 's13',
    productName: "Natural Neem Wood Comb",
    description: "Sustainably made comb for healthier hair and scalp — anti-static & handmade.",
    price: 199,
    category: "Personal Care",
    locationText: "Pune",
    sellerName: "GreenLife Store",
    contactNumber: "9123456780",
    image: "https://m.media-amazon.com/images/I/71ASzXCy-SL.jpg"
  },
  {
    id: 's14',
    productName: "Beaded Necklace Set",
    description: "Vibrant handcrafted bead necklace with matching earrings.",
    price: 299,
    category: "Jewelry",
    locationText: "Hyderabad",
    sellerName: "Shine by Siya",
    contactNumber: "9812345678",
    image: "https://m.media-amazon.com/images/I/81Q-jyJH15L._AC_UY1100_.jpg"
  }

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
// ---------------- BUY modal handlers ----------------
function openBuyModal(product){
  if(!product) return;
  // set modal text and show
  const title = document.getElementById('buyTitle');
  const text = document.getElementById('buyProductText');
  title.textContent = `Buy: ${product.productName}`;
  text.innerHTML = `<strong>Seller:</strong> ${product.sellerName || 'N/A'}<br><strong>Price:</strong> ₹ ${product.price}`;

  // attach actions
  const upiBtn = document.getElementById('buyViaUpi');
  const waBtn = document.getElementById('buyViaWa');

  // remove old handlers (safe)
  upiBtn.onclick = null;
  waBtn.onclick = null;

  upiBtn.onclick = ()=> openMockPayment(product);
  waBtn.onclick = ()=> openWhatsAppOrder(product);

  showModal('buyModal');
}

// close buy modal button
if (document.getElementById('closeBuyModal')) {
  document.getElementById('closeBuyModal').onclick = ()=> hideModal('buyModal');
}

// Build and open WhatsApp order (prefilled message)
function openWhatsAppOrder(product){
  let phone = '';
  if (product.whatsapp && product.whatsapp.includes('wa.me')) {
    const m = product.whatsapp.match(/wa\.me\/([0-9]+)/);
    if (m) phone = m[1];
  }
  if (!phone && product.contactNumber) phone = product.contactNumber.replace(/\D/g,'');

  const msg = encodeURIComponent(`Hi ${product.sellerName || ''},\nI want to buy *${product.productName}* (₹ ${product.price}).\nPlease confirm availability and payment details.\nProduct ID: ${product.id || ''}`);
  if(phone){
    const waUrl = `https://wa.me/${phone}?text=${msg}`;
    window.open(waUrl, '_blank');
  } else {
    const waUrl = `https://api.whatsapp.com/send?text=${msg}`;
    window.open(waUrl, '_blank');
  }
  hideModal('buyModal');
}
// -------- MOCK PAYMENT (prototype) ----------

// Save an order (localStorage). orders[] with id, productId, productName, amount, createdAt, status
function saveOrderLocally(order){
  const key = 'vk_orders';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.unshift(order);
  localStorage.setItem(key, JSON.stringify(arr));
  return order;
}

// open mock payment modal for product
function openMockPayment(product){
  if(!product) return alert('Product missing');
  el('mockPayProduct').innerHTML = `<strong>${product.productName}</strong><br/><small>Seller: ${product.sellerName||'N/A'}</small>`;
  el('mockPayAmount').textContent = (Number(product.price||0)).toFixed(2);
  // reset UI
  el('mockPayStatus').style.display = 'none';
  el('mockPayMsg').textContent = 'Processing payment…';
  // show modal
  showModal('mockPayModal');

  // bind buttons
  const confirmBtn = el('confirmMockPay');
  const cancelBtn = el('cancelMockPay');
  confirmBtn.onclick = async () => {
    // disable while processing
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    el('mockPayStatus').style.display = 'block';
    el('mockPayMsg').textContent = 'Processing payment…';
    // simulate network/payment delay
    setTimeout(()=>{
      // mock success
      const orderId = 'ORD-' + Date.now().toString(36).toUpperCase().slice(0,8);
      const order = {
        orderId,
        productId: product.id || '',
        productName: product.productName || '',
        amount: Number(product.price||0),
        sellerId: product.sellerId || '',
        sellerName: product.sellerName || '',
        status: 'paid (mock)',
        createdAt: (new Date()).toISOString()
      };
      saveOrderLocally(order);
      el('mockPayMsg').textContent = `Payment successful — Order ID ${orderId}`;
      // show quick actions: WhatsApp to seller
      setTimeout(()=>{
        hideModal('mockPayModal');
        // after closing show an alert and offer to message seller
        if(confirm(`Mock payment successful!\nOrder ID: ${orderId}\n\nMessage seller on WhatsApp now?`)){
          // reuse existing wa order function if present
          if(typeof openWhatsAppOrder === 'function'){
            openWhatsAppOrder(product);
          } else {
            // fallback open wa link directly
            const phone = (product.contactNumber||'').replace(/\D/g,'');
            const msg = encodeURIComponent(`Hi ${product.sellerName||''}, I paid for ${product.productName} (Order ${orderId}). Please confirm.`);
            if(phone) window.open(`https://wa.me/${phone}?text=${msg}`,'_blank');
            else window.open(`https://api.whatsapp.com/send?text=${msg}`,'_blank');
          }
        }
      }, 200);
    }, 1300);
  };

  cancelBtn.onclick = ()=>{
    hideModal('mockPayModal');
  };
}

// wire close button (if DOM already loaded)
if (document.getElementById('closeMockPay')) {
  document.getElementById('closeMockPay').onclick = ()=> hideModal('mockPayModal');
}

// Build UPI deep link and open it (mobile)
function openUpiPayment(product){
  // check product for upi vpa field (product.upiVpa or product.sellerUpi)
  const vpa = product.upiVpa || product.sellerUpi || ''; // sellers can store sellerUpi in their listing
  if(!vpa){
    hideModal('buyModal');
    alert('Seller has not provided a UPI ID. Use WhatsApp to place the order.');
    return;
  }
  const name = encodeURIComponent(product.sellerName || '');
  const note = encodeURIComponent(`Payment for ${product.productName}`);
  const amount = Number(product.price || 0).toFixed(2);

  // UPI deep link
  const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${name}&tn=${note}&am=${amount}&cu=INR`;

  // Try opening UPI link (mobile)
  window.location.href = upiLink;

  // fallback: notify user (in case it doesn't open)
  setTimeout(()=> {
    hideModal('buyModal');
    alert('If UPI did not open, use the WhatsApp option to contact the seller to pay manually.');
  }, 1200);
}

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

// BUY button
const buyBtn = document.createElement('button');
buyBtn.className = 'smallBtn';
buyBtn.textContent = 'Buy';
buyBtn.onclick = () => openBuyModal(p);

btnRow.appendChild(view);
btnRow.appendChild(contact);
btnRow.appendChild(buyBtn);

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
    sellerUpi: data.sellerUpi || '',
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

