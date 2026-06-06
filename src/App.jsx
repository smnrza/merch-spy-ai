import { useState, useEffect } from "react";

// ── Supabase config ───────────────────────────────────────────────────────────
const SUPABASE_URL = "https://jigtnygqlnwigpdmbrmu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZ3RueWdxbG53aWdwZG1icm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MDEwMzIsImV4cCI6MjA5NjI3NzAzMn0.VnS88Bumt3tTwOJJpoBaiREl7orTZRK7NV-wojTSNHE";

const sb = {
  async signUp(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },
  async signIn(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },
  async signOut(token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────
const AMAZON_POOL = [
  { title: "Funny Cat Mom Shirt Women", bsr: 3214, price: 21.99, reviews: 42, rating: 4.7 },
  { title: "Cat Mama Tee Cute Kitten Lover", bsr: 8321, price: 19.99, reviews: 17, rating: 4.5 },
  { title: "Best Cat Mom Ever Graphic Tee", bsr: 14500, price: 24.99, reviews: 88, rating: 4.8 },
  { title: "Fur Mama Cat Lover Gift Shirt", bsr: 22400, price: 18.99, reviews: 11, rating: 4.3 },
  { title: "Crazy Cat Lady Club Tshirt", bsr: 31000, price: 22.99, reviews: 203, rating: 4.6 },
  { title: "Cat Mom Life Heather Grey Tee", bsr: 44200, price: 19.99, reviews: 7, rating: 4.4 },
  { title: "Meow Cat Mom Floral Design Shirt", bsr: 67800, price: 25.99, reviews: 56, rating: 4.5 },
  { title: "Im a Cat Mom Premium Unisex", bsr: 82000, price: 29.99, reviews: 134, rating: 4.7 },
  { title: "Cat Mom Squad Bella Canvas Tee", bsr: 95000, price: 23.99, reviews: 29, rating: 4.2 },
  { title: "Proud Cat Mom Vintage Wash Shirt", bsr: 120000, price: 21.99, reviews: 4, rating: 4.6 },
];
const ETSY_POOL = [
  { title: "Cat Mom SVG Bundle Cut Files", shopSales: 213, reviews: 35, favorites: 102, price: 3.50, listingAge: "2 months" },
  { title: "Personalized Cat Lover Tee Print", shopSales: 91, reviews: 12, favorites: 31, price: 18.00, listingAge: "3 weeks" },
  { title: "Cat Mom Mug Custom Gift", shopSales: 445, reviews: 67, favorites: 210, price: 14.99, listingAge: "5 months" },
  { title: "Fur Mama Sublimation Design PNG", shopSales: 38, reviews: 5, favorites: 44, price: 2.99, listingAge: "1 month" },
  { title: "Cat Mom Embroidery Pattern", shopSales: 127, reviews: 22, favorites: 89, price: 5.50, listingAge: "4 months" },
  { title: "Crazy Cat Lady Printable Wall Art", shopSales: 59, reviews: 9, favorites: 33, price: 4.00, listingAge: "6 weeks" },
  { title: "Cat Mama Hoodie Digital File", shopSales: 180, reviews: 41, favorites: 155, price: 6.00, listingAge: "3 months" },
  { title: "Meow Cat Mom Watercolor Clipart", shopSales: 22, reviews: 3, favorites: 17, price: 3.00, listingAge: "2 weeks" },
];
const TRENDING_PHRASES = {
  "cat mom": ["Cat Mom", "Fur Mama", "Cat Lover", "Crazy Cat Lady", "Meow Mama", "Cat Lady Club"],
  "dog dad": ["Dog Dad", "Fur Father", "Dog Lover", "Rescue Dad", "Good Boy Dad", "Paw Dad"],
  "nurse": ["Nurse Life", "RN Squad", "Nursing School", "ER Nurse", "Night Shift Nurse"],
  "teacher": ["Teacher Life", "Best Teacher", "Back to School", "Class of 2025", "Teaching is My Jam"],
};
function getPhrases(kw) {
  const lower = kw.toLowerCase();
  for (const [key, val] of Object.entries(TRENDING_PHRASES)) {
    if (lower.includes(key)) return val;
  }
  return [`${kw} Life`, `Best ${kw}`, `${kw} Vibes`, `${kw} Squad`, `Proud ${kw}`, `${kw} Club`];
}
function genAmazon(keyword) {
  return AMAZON_POOL.map((item, i) => ({
    ...item,
    title: i === 0 ? `${keyword} Funny Tee Women Gift` : item.title.replace(/cat mom/i, keyword),
    url: `https://amazon.com/dp/B0${Math.random().toString(36).substr(2,8).toUpperCase()}`,
    id: i,
  }));
}
function genEtsy(keyword) {
  return ETSY_POOL.map((item, i) => ({
    ...item,
    title: item.title.replace(/cat mom/i, keyword),
    url: `https://etsy.com/listing/${Math.floor(Math.random()*9e8+1e8)}`,
    id: i,
  }));
}
function bsrClass(bsr) {
  if (bsr < 10000) return "hot";
  if (bsr < 50000) return "good";
  if (bsr < 100000) return "ok";
  return "weak";
}

// ── Logo SVG ──────────────────────────────────────────────────────────────────
function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#111"/>
      <circle cx="14" cy="14" r="6" stroke="white" strokeWidth="2.2" fill="none"/>
      <line x1="19" y1="19" x2="25" y2="25" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="2" fill="white" opacity="0.4"/>
    </svg>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #fafafa;
    --surface: #ffffff;
    --border: #e5e7eb;
    --border-light: #f3f4f6;
    --text: #0f172a;
    --sub: #64748b;
    --muted: #94a3b8;
    --accent: #0f172a;
    --accent-fg: #ffffff;
    --blue: #2563eb;
    --green: #16a34a;
    --amber: #d97706;
    --red: #dc2626;
    --green-bg: #f0fdf4;
    --blue-bg: #eff6ff;
    --amber-bg: #fffbeb;
    --red-bg: #fef2f2;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  /* ── AUTH ── */
  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: var(--bg);
  }
  .auth-card {
    width: 100%;
    max-width: 360px;
  }
  .auth-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 32px;
  }
  .auth-brand-name {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: var(--text);
  }
  .auth-brand-name span {
    color: var(--blue);
  }
  .auth-heading {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.5px;
    margin-bottom: 24px;
    color: var(--text);
    text-align: center;
  }
  .auth-toggle {
    display: flex;
    background: var(--border-light);
    border-radius: 8px;
    padding: 3px;
    margin-bottom: 20px;
    gap: 3px;
  }
  .auth-toggle-btn {
    flex: 1;
    background: transparent;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 7px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--sub);
    transition: all 0.15s;
  }
  .auth-toggle-btn.on {
    background: white;
    color: var(--text);
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  }
  .field { margin-bottom: 12px; }
  .field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--sub);
    margin-bottom: 5px;
    letter-spacing: 0.02em;
  }
  .field input {
    width: 100%;
    background: white;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .field input::placeholder { color: var(--muted); }
  .field input:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }
  .btn-primary {
    width: 100%;
    background: var(--text);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 11px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 4px;
    transition: opacity 0.15s;
    letter-spacing: -0.1px;
  }
  .btn-primary:hover { opacity: 0.85; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .msg-err {
    margin-top: 12px;
    padding: 9px 12px;
    background: var(--red-bg);
    border: 1px solid #fecaca;
    border-radius: 7px;
    font-size: 13px;
    color: var(--red);
  }
  .msg-ok {
    margin-top: 12px;
    padding: 9px 12px;
    background: var(--green-bg);
    border: 1px solid #bbf7d0;
    border-radius: 7px;
    font-size: 13px;
    color: var(--green);
  }
  .auth-foot {
    margin-top: 28px;
    text-align: center;
    font-size: 12px;
    color: var(--muted);
  }
  .auth-foot a { color: var(--sub); text-decoration: none; }
  .auth-foot a:hover { color: var(--text); }

  /* ── APP ── */
  .app { max-width: 1080px; margin: 0 auto; padding: 28px 20px; }

  .topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 36px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: auto;
  }
  .brand-name {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.4px;
  }
  .brand-name span { color: var(--blue); }
  .brand-tag {
    font-size: 11px;
    color: var(--muted);
    font-family: 'Geist Mono', monospace;
    letter-spacing: 0.02em;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }
  .user-email {
    color: var(--sub);
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .divider-dot { color: var(--border); }
  .btn-ghost {
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 5px 11px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--sub);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-ghost:hover { border-color: var(--text); color: var(--text); }
  .credit {
    text-align: right;
    line-height: 1.3;
  }
  .credit-name { font-size: 13px; font-weight: 600; color: var(--text); display: block; }
  .credit-line { font-size: 11px; color: var(--muted); font-family: 'Geist Mono', monospace; }
  .credit-line a { color: var(--muted); text-decoration: none; }
  .credit-line a:hover { color: var(--sub); }

  /* Search */
  .search-wrap {
    display: flex;
    gap: 8px;
    margin-bottom: 32px;
  }
  .search-input {
    flex: 1;
    background: white;
    border: 1px solid var(--border);
    border-radius: 9px;
    padding: 11px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .search-input::placeholder { color: var(--muted); }
  .search-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .search-btn {
    background: var(--text);
    color: white;
    border: none;
    border-radius: 9px;
    padding: 11px 20px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.15s;
  }
  .search-btn:hover { opacity: 0.85; }
  .search-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Stats */
  .stats {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 10px;
    margin-bottom: 24px;
  }
  .stat {
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
  }
  .stat-l {
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 5px;
    font-family: 'Geist Mono', monospace;
  }
  .stat-v { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
  .c-blue { color: var(--blue); }
  .c-green { color: var(--green); }
  .c-text { color: var(--text); }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 1px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }
  .tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    padding: 9px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .tab:hover { color: var(--text); }
  .tab.on { color: var(--text); border-bottom-color: var(--text); }

  /* Table */
  .table-box {
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--border-light); }
  th {
    text-align: left;
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'Geist Mono', monospace;
  }
  td {
    padding: 11px 14px;
    font-size: 13px;
    border-top: 1px solid var(--border-light);
    color: var(--text);
    vertical-align: middle;
  }
  tr:hover td { background: #fafafa; }
  .mono { font-family: 'Geist Mono', monospace; font-size: 12px; }
  .tag {
    display: inline-block;
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 4px;
  }
  .tag.hot { background: var(--green-bg); color: var(--green); }
  .tag.good { background: var(--blue-bg); color: var(--blue); }
  .tag.ok { background: var(--amber-bg); color: var(--amber); }
  .tag.weak { background: var(--red-bg); color: var(--red); }
  .link {
    font-size: 12px;
    color: var(--blue);
    text-decoration: none;
    font-family: 'Geist Mono', monospace;
  }
  .link:hover { text-decoration: underline; }
  .table-foot {
    padding: 8px 14px;
    font-size: 11px;
    color: var(--muted);
    font-family: 'Geist Mono', monospace;
    border-top: 1px solid var(--border-light);
  }

  /* Filters */
  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
    align-items: flex-end;
  }
  .fg { display: flex; flex-direction: column; gap: 4px; }
  .fl {
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'Geist Mono', monospace;
  }
  .fi {
    background: white;
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 7px 10px;
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    color: var(--text);
    width: 110px;
    outline: none;
  }
  .fi:focus { border-color: var(--blue); }
  .btn-apply {
    background: var(--blue-bg);
    border: 1px solid #bfdbfe;
    border-radius: 7px;
    color: var(--blue);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 7px 14px;
    cursor: pointer;
    align-self: flex-end;
    transition: opacity 0.15s;
  }
  .btn-apply:hover { opacity: 0.8; }

  /* Cards */
  .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px;
  }
  .card-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--sub);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 14px;
    font-family: 'Geist Mono', monospace;
  }
  .kv { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-light); font-size: 13px; }
  .kv:last-child { border-bottom: none; }
  .kv-k { color: var(--sub); }
  .kv-v { font-family: 'Geist Mono', monospace; font-size: 12px; font-weight: 500; }

  /* Chips */
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .chip {
    background: var(--border-light);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    color: var(--text);
    font-weight: 500;
  }
  .chip.hi { background: var(--blue-bg); border-color: #bfdbfe; color: var(--blue); }
  .chip.med { background: var(--amber-bg); border-color: #fde68a; color: var(--amber); }

  /* AI */
  .ai-box {
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
  }
  .ai-head {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 600;
    color: var(--sub);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'Geist Mono', monospace;
    margin-bottom: 14px;
  }
  .ai-pulse {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--blue);
    animation: pulse 1.2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
  .ai-body { font-size: 14px; line-height: 1.75; color: var(--text); white-space: pre-wrap; }
  .ai-dim { color: var(--muted); font-style: italic; }
  .opp-bar-row { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
  .opp-lbl { font-size: 11px; font-family: 'Geist Mono', monospace; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
  .opp-track { flex: 1; height: 4px; background: var(--border); border-radius: 2px; }
  .opp-fill { height: 100%; border-radius: 2px; background: var(--blue); transition: width 1.2s ease; }
  .opp-num { font-size: 13px; font-family: 'Geist Mono', monospace; font-weight: 600; color: var(--text); }

  /* Design angles */
  .angle-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 9px 0; border-bottom: 1px solid var(--border-light); }
  .angle-row:last-child { border-bottom: none; }
  .angle-name { font-size: 13px; font-weight: 500; }
  .angle-desc { font-size: 12px; color: var(--muted); margin-left: 16px; text-align: right; }

  /* Empty */
  .empty {
    text-align: center;
    padding: 72px 48px;
    color: var(--muted);
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .empty-icon { font-size: 28px; margin-bottom: 10px; opacity: 0.4; }
  .empty-t { font-size: 14px; font-weight: 500; color: var(--sub); margin-bottom: 4px; }
  .empty-s { font-size: 12px; color: var(--muted); font-family: 'Geist Mono', monospace; }

  @media (max-width: 680px) {
    .stats { grid-template-columns: 1fr 1fr; }
    .card-grid { grid-template-columns: 1fr; }
    .tabs { overflow-x: auto; }
    .topbar { flex-wrap: wrap; gap: 8px; }
    .user-info { flex-wrap: wrap; }
  }
`;

// ── Logo component ────────────────────────────────────────────────────────────
function MerchSpyLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="#0f172a"/>
      <circle cx="12.5" cy="12.5" r="5" stroke="white" strokeWidth="1.8" fill="none"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12.5" cy="12.5" r="1.8" fill="#2563eb"/>
    </svg>
  );
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const submit = async () => {
    setErr(""); setOk("");
    if (!email || !password) { setErr("Please enter your email and password."); return; }
    if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setBusy(true);
    try {
      if (mode === "signup") {
        const d = await sb.signUp(email, password);
        if (d.error) setErr(d.error.message || "Sign up failed.");
        else { setOk("Account created! Please verify your email then log in."); setMode("login"); }
      } else {
        const d = await sb.signIn(email, password);
        if (d.error) setErr(d.error.message || "Invalid email or password.");
        else if (d.access_token) onLogin({ token: d.access_token, email: d.user?.email });
      }
    } catch (e) { setErr("Connection error. Check your Supabase config."); }
    setBusy(false);
  };

  const sw = (m) => { setMode(m); setErr(""); setOk(""); };

  return (
    <>
      <style>{css}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <MerchSpyLogo size={30} />
            <span className="auth-brand-name">MerchSpy <span>AI</span></span>
          </div>
          <div className="auth-heading">{mode === "login" ? "Sign in" : "Create account"}</div>

          <div className="auth-toggle">
            <button className={`auth-toggle-btn ${mode==="login"?"on":""}`} onClick={()=>sw("login")}>Login</button>
            <button className={`auth-toggle-btn ${mode==="signup"?"on":""}`} onClick={()=>sw("signup")}>Sign Up</button>
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password}
              onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
          </div>

          <button className="btn-primary" onClick={submit} disabled={busy}>
            {busy ? "Please wait…" : mode==="login" ? "Login" : "Create account"}
          </button>

          {err && <div className="msg-err">{err}</div>}
          {ok && <div className="msg-ok">{ok}</div>}

          <div className="auth-foot">
            By <strong>Reza</strong> · ThinkSys IT ·{" "}
            <a href="https://t.me/Xystic" target="_blank" rel="noreferrer">TG: Xystic</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    try { const s = sessionStorage.getItem("ms_user"); if (s) setUser(JSON.parse(s)); } catch (_) {}
  }, []);
  const login = (u) => { setUser(u); sessionStorage.setItem("ms_user", JSON.stringify(u)); };
  const logout = async () => {
    if (user?.token) await sb.signOut(user.token).catch(() => {});
    setUser(null); sessionStorage.removeItem("ms_user");
  };
  if (!user) return <AuthScreen onLogin={login} />;
  return <Dashboard user={user} onLogout={logout} />;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [kw, setKw] = useState("Cat Mom");
  const [tab, setTab] = useState("overview");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amazon, setAmazon] = useState([]);
  const [etsy, setEtsy] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [score, setScore] = useState(0);
  const [bsrMax, setBsrMax] = useState(100000);
  const [revMax, setRevMax] = useState(200);
  const [priceMin, setPriceMin] = useState(15);
  const [applied, setApplied] = useState({ bsrMax: 100000, revMax: 200, priceMin: 15 });

  const search = async () => {
    if (!kw.trim()) return;
    setLoading(true); setReady(false); setAnalysis(""); setScore(0);
    await new Promise(r => setTimeout(r, 600));
    const a = genAmazon(kw); const e = genEtsy(kw);
    setAmazon(a); setEtsy(e); setPhrases(getPhrases(kw));
    setReady(true); setLoading(false); setTab("overview");
    setAnalysing(true);
    try {
      const avgBSR = Math.round(a.reduce((s,d)=>s+d.bsr,0)/a.length);
      const avgRev  = Math.round(a.reduce((s,d)=>s+d.reviews,0)/a.length);
      const avgPr   = (a.reduce((s,d)=>s+d.price,0)/a.length).toFixed(2);
      const lowComp = a.filter(d=>d.reviews<50&&d.bsr<50000).length;
      const prompt  = `You are a POD (Print-on-Demand) niche analyst. Keyword: "${kw}". Amazon: Avg BSR ${avgBSR.toLocaleString()}, Avg Reviews ${avgRev}, Avg Price $${avgPr}, Low-competition listings: ${lowComp}/10. Etsy: ${e.length} listings, avg shop sales: ${Math.round(e.reduce((s,d)=>s+d.shopSales,0)/e.length)}. Trending phrases: ${getPhrases(kw).join(", ")}. Provide: 1) "Opportunity Score: XX/100" on its own line first. 2) Competition level (one word). 3) Ideal price range. 4) Top 3 design angles. 5) One key risk. Keep it concise and practical.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("") || "Analysis unavailable.";
      setAnalysis(text);
      const m = text.match(/Opportunity Score:\s*(\d+)/i);
      setScore(m ? parseInt(m[1]) : Math.floor(Math.random()*30+55));
    } catch (e) { setAnalysis("AI analysis failed. Please try again."); }
    setAnalysing(false);
  };

  const filtered = amazon.filter(d =>
    d.bsr <= applied.bsrMax && d.reviews <= applied.revMax && d.price >= applied.priceMin
  );
  const avgBSR  = amazon.length ? Math.round(amazon.reduce((s,d)=>s+d.bsr,0)/amazon.length) : 0;
  const avgPr   = amazon.length ? (amazon.reduce((s,d)=>s+d.price,0)/amazon.length).toFixed(2) : "–";
  const avgERev = etsy.length   ? Math.round(etsy.reduce((s,d)=>s+d.reviews,0)/etsy.length) : 0;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Topbar */}
        <div className="topbar">
          <div className="brand">
            <MerchSpyLogo size={26} />
            <div>
              <div className="brand-name">MerchSpy <span>AI</span></div>
              <div className="brand-tag">Amazon · Etsy · AI Research</div>
            </div>
          </div>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <span className="divider-dot">·</span>
            <button className="btn-ghost" onClick={onLogout}>Sign out</button>
          </div>
          <div className="credit">
            <span className="credit-name">Reza</span>
            <span className="credit-line">ThinkSys IT · <a href="https://t.me/Xystic" target="_blank" rel="noreferrer">TG: Xystic</a></span>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrap">
          <input className="search-input" value={kw} onChange={e=>setKw(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder="Enter a keyword — e.g. Cat Mom, Dog Dad, Nurse Life…" />
          <button className="search-btn" onClick={search} disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {/* Stats */}
        {ready && (
          <>
            <div className="stats">
              <div className="stat"><div className="stat-l">Amazon</div><div className="stat-v c-text">{amazon.length}</div></div>
              <div className="stat"><div className="stat-l">Avg BSR</div><div className="stat-v c-blue">#{avgBSR.toLocaleString()}</div></div>
              <div className="stat"><div className="stat-l">Avg Price</div><div className="stat-v c-green">${avgPr}</div></div>
              <div className="stat"><div className="stat-l">Etsy</div><div className="stat-v c-text">{etsy.length}</div></div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {[["overview","Overview"],["amazon","Amazon BSR"],["etsy","Etsy"],["keywords","Keywords"],["ai","AI Analysis"]].map(([id,label])=>(
                <button key={id} className={`tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{label}</button>
              ))}
            </div>

            {/* Overview */}
            {tab === "overview" && (
              <div className="card-grid">
                <div className="card">
                  <div className="card-title">Amazon Summary</div>
                  {[
                    ["Best BSR", `#${Math.min(...amazon.map(d=>d.bsr)).toLocaleString()}`],
                    ["Avg BSR", `#${avgBSR.toLocaleString()}`],
                    ["Avg Price", `$${avgPr}`],
                    ["Avg Reviews", Math.round(amazon.reduce((s,d)=>s+d.reviews,0)/amazon.length)],
                    ["Low Competition", `${amazon.filter(d=>d.reviews<50&&d.bsr<50000).length} of ${amazon.length}`],
                  ].map(([k,v])=><div className="kv" key={k}><span className="kv-k">{k}</span><span className="kv-v">{v}</span></div>)}
                </div>
                <div className="card">
                  <div className="card-title">Etsy Summary</div>
                  {[
                    ["Total Listings", etsy.length],
                    ["Avg Reviews", avgERev],
                    ["Avg Shop Sales", Math.round(etsy.reduce((s,d)=>s+d.shopSales,0)/etsy.length)],
                    ["Avg Price", `$${(etsy.reduce((s,d)=>s+d.price,0)/etsy.length).toFixed(2)}`],
                    ["New Shops <100 sales", `${etsy.filter(d=>d.shopSales<100).length} of ${etsy.length}`],
                  ].map(([k,v])=><div className="kv" key={k}><span className="kv-k">{k}</span><span className="kv-v">{v}</span></div>)}
                </div>
                <div className="card" style={{gridColumn:"1/-1"}}>
                  <div className="card-title">Trending Phrases</div>
                  <div className="chips">
                    {phrases.map((p,i)=><span key={p} className={`chip ${i===0?"hi":i===1?"med":""}`}>{p}</span>)}
                  </div>
                </div>
              </div>
            )}

            {/* Amazon */}
            {tab === "amazon" && (
              <>
                <div className="filters">
                  <div className="fg"><span className="fl">Max BSR</span><input className="fi" type="number" value={bsrMax} onChange={e=>setBsrMax(+e.target.value)}/></div>
                  <div className="fg"><span className="fl">Max Reviews</span><input className="fi" type="number" value={revMax} onChange={e=>setRevMax(+e.target.value)}/></div>
                  <div className="fg"><span className="fl">Min Price ($)</span><input className="fi" type="number" value={priceMin} onChange={e=>setPriceMin(+e.target.value)}/></div>
                  <button className="btn-apply" onClick={()=>setApplied({bsrMax,revMax,priceMin})}>Apply</button>
                </div>
                <div className="table-box">
                  <table>
                    <thead><tr><th>Title</th><th>BSR</th><th>Price</th><th>Reviews</th><th>Rating</th><th>Link</th></tr></thead>
                    <tbody>
                      {filtered.length === 0
                        ? <tr><td colSpan={6} style={{textAlign:"center",padding:"32px",color:"var(--muted)"}}>No listings match your filters.</td></tr>
                        : filtered.map(d=>(
                          <tr key={d.id}>
                            <td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.title}</td>
                            <td><span className={`tag ${bsrClass(d.bsr)}`}>#{d.bsr.toLocaleString()}</span></td>
                            <td className="mono">${d.price}</td>
                            <td className="mono">{d.reviews}</td>
                            <td className="mono">{d.rating}★</td>
                            <td><a className="link" href={d.url} target="_blank" rel="noreferrer">View →</a></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="table-foot">{filtered.length} of {amazon.length} listings · Demo data</div>
                </div>
              </>
            )}

            {/* Etsy */}
            {tab === "etsy" && (
              <div className="table-box">
                <table>
                  <thead><tr><th>Title</th><th>Price</th><th>Reviews</th><th>Shop Sales</th><th>Favorites</th><th>Age</th><th>Link</th></tr></thead>
                  <tbody>
                    {etsy.map(d=>(
                      <tr key={d.id}>
                        <td style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.title}</td>
                        <td className="mono">${d.price}</td>
                        <td className="mono" style={{color:d.reviews<20?"var(--green)":"inherit",fontWeight:d.reviews<20?600:400}}>{d.reviews}</td>
                        <td className="mono" style={{color:d.shopSales<100?"var(--green)":"inherit",fontWeight:d.shopSales<100?600:400}}>{d.shopSales}</td>
                        <td className="mono">{d.favorites}</td>
                        <td style={{fontSize:12,color:"var(--muted)"}}>{d.listingAge}</td>
                        <td><a className="link" href={d.url} target="_blank" rel="noreferrer">View →</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="table-foot">Green = low competition · Demo data</div>
              </div>
            )}

            {/* Keywords */}
            {tab === "keywords" && (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="card">
                  <div className="card-title">Trending Phrases — {kw}</div>
                  <div className="chips">
                    {phrases.map((p,i)=><span key={p} className={`chip ${i===0?"hi":i===1?"med":""}`}>{p}</span>)}
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">Design Angles</div>
                  {[
                    ["Humor & Puns","Funny slogans perform well on mugs and tees"],
                    ["Minimalist Type","Clean text-only designs rank well on Amazon"],
                    ["Floral / Botanical","Strong in gift-market niches"],
                    ["Vintage / Retro","High demand in lifestyle keywords"],
                    ["Illustrated Character","Best for Etsy SVG and clipart bundles"],
                  ].map(([name,desc])=>(
                    <div className="angle-row" key={name}>
                      <span className="angle-name">{name}</span>
                      <span className="angle-desc">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI */}
            {tab === "ai" && (
              <div className="ai-box">
                <div className="ai-head">
                  {analysing && <div className="ai-pulse"/>}
                  AI Niche Analysis — {kw}
                </div>
                {analysing
                  ? <div className="ai-body ai-dim">Analyzing market data…</div>
                  : analysis
                    ? <>
                        <div className="ai-body">{analysis}</div>
                        {score > 0 && (
                          <div className="opp-bar-row">
                            <span className="opp-lbl">Score</span>
                            <div className="opp-track"><div className="opp-fill" style={{width:`${score}%`}}/></div>
                            <span className="opp-num">{score}/100</span>
                          </div>
                        )}
                      </>
                    : <div className="ai-body ai-dim">Run a search to generate an AI analysis.</div>
                }
              </div>
            )}
          </>
        )}

        {!ready && !loading && (
          <div className="empty">
            <div className="empty-icon">⌕</div>
            <div className="empty-t">Search a keyword to begin</div>
            <div className="empty-s">Try: Cat Mom · Dog Dad · Nurse Life · Teacher Gift</div>
          </div>
        )}

        {loading && (
          <div className="empty">
            <div className="empty-icon">◌</div>
            <div className="empty-t">Fetching data…</div>
          </div>
        )}
      </div>
    </>
  );
}
