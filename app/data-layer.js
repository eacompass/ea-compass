// ============================================================
// PENTHESIS · DATA LAYER
// ============================================================
// Drop-in replacement for every localStorage call in the app.
// Routes reads/writes through Supabase when authed,
// or a demo portfolio (read-only) when not.
//
// Usage in app/index.html:
//   import { db } from './data-layer.js';
//   const trades = await db.trades.list();
//   await db.trades.add({ ticker: 'MTN', ... });
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---- CONFIG ----
const SUPABASE_URL = 'https://hjutbusvlxijovwaxhtv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_giMm6u3X8IyrJW31Wd1PqA_cKhc1iab';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

// ---- AUTH STATE ----
let _user = null;
let _profile = null;
let _portfolioId = null;
let _isDemo = true;

export const auth = {
  get user() { return _user; },
  get profile() { return _profile; },
  get portfolioId() { return _portfolioId; },
  get isDemo() { return _isDemo; },
  get isAuthed() { return !!_user; },

  async signUpEmail(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signInEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signInGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/app/' }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
    _user = null; _profile = null; _portfolioId = null; _isDemo = true;
  },

  onChange(callback) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        _user = session.user;
        _isDemo = false;
        await _loadProfile();
        callback({ event, user: _user, profile: _profile, isDemo: false });
      } else {
        _user = null; _profile = null; _portfolioId = null;
        _isDemo = true;
        callback({ event, user: null, profile: null, isDemo: true });
      }
    });
  }
};

async function _loadProfile() {
  if (!_user) return;
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', _user.id).single();
  _profile = profile;
  const { data: portfolio } = await supabase
    .from('portfolios').select('id').eq('user_id', _user.id).eq('is_default', true).single();
  _portfolioId = portfolio?.id;
}

// ============================================================
// DEMO DATA (shown when not authed)
// ============================================================
const DEMO_TRADES = [
  {
    id: 'demo-1', trade_date: '2026-01-15', ticker: 'MTN', company: 'MTN Group',
    asset_type: 'stock', action: 'BUY', currency: 'ZAR',
    price: 102.50, shares: 50, entry_value: 5125, tier: 1,
    thesis: 'Data revenue accelerating across Nigeria + SA, balance sheet repaired post-IHS settlement, fintech subsidiary spin-off creates value disclosure. Trading at 6.5x forward P/E vs 5-year avg of 9x.',
    exit_trigger: 'Data revenue growth drops below 12% YoY for two consecutive quarters, OR Nigeria FX losses exceed R8bn in a year.',
    pre_mortem: 'Imagine 2028: position is down 40%. Most likely cause = Nigerian naira collapse + inability to repatriate dividends. Secondary cause = mobile money regulation cracks down on fees.',
    kpi_metrics: 'Data revenue growth, fintech ARPU, Nigeria FX-adjusted EBITDA',
    is_tfsa: true, schema_version: 1,
    is_demo: true,
  },
  {
    id: 'demo-2', trade_date: '2025-08-22', ticker: 'NPN', company: 'Naspers',
    asset_type: 'stock', action: 'BUY', currency: 'ZAR',
    price: 3450, shares: 5, entry_value: 17250, tier: 2,
    thesis: 'Tencent discount widened to 35%+, share buyback program aggressive, food delivery (iFood, Swiggy) approaching profitability. Pure NAV play.',
    exit_trigger: 'Discount narrows to <15%, OR Tencent regulatory crisis returns.',
    pre_mortem: 'China regulator action on Tencent crushes underlying NAV.',
    kpi_metrics: 'NAV discount %, Tencent earnings growth, food delivery EBITDA margin',
    is_tfsa: false, schema_version: 1,
    is_demo: true,
  },
  {
    id: 'demo-3', trade_date: '2024-03-10', ticker: 'SOL', company: 'Sasol',
    asset_type: 'stock', action: 'BUY', currency: 'ZAR',
    price: 215.00, shares: 30, entry_value: 6450, tier: 1,
    thesis: 'Oil price recovery + chemical division turnaround.',
    exit_trigger: 'Brent below $60 for 6 months.',
    pre_mortem: '',
    kpi_metrics: '',
    is_tfsa: false, schema_version: 1,
    is_demo: true,
    is_zombie_demo: true, // 24 months old, demonstrates zombie detection
  },
  {
    id: 'demo-4', trade_date: '2025-11-05', ticker: 'STX40', company: 'Satrix Top 40 ETF',
    asset_type: 'etf', action: 'BUY', currency: 'ZAR',
    price: 78.50, shares: 100, entry_value: 7850, tier: 1,
    thesis: 'Core SA equity exposure. Low cost (0.10% TER). Cannot beat the market on broad SA so I rent it.',
    exit_trigger: 'Never. This is the foundation.',
    pre_mortem: 'SA macro collapse — rand at R30+, capital controls.',
    kpi_metrics: 'TER stays low, tracking error <0.5%',
    is_tfsa: true, schema_version: 1,
    is_demo: true,
  },
];

// ============================================================
// TRADES
// ============================================================
export const trades = {
  async list() {
    if (_isDemo) return [...DEMO_TRADES];
    const { data, error } = await supabase
      .from('trades').select('*')
      .eq('user_id', _user.id).eq('portfolio_id', _portfolioId)
      .order('trade_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async add(trade) {
    if (_isDemo) throw new DemoError('add a trade');
    const row = { ...trade, user_id: _user.id, portfolio_id: _portfolioId, schema_version: 1 };
    const { data, error } = await supabase.from('trades').insert(row).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, patch) {
    if (_isDemo) throw new DemoError('edit a trade');
    const { data, error } = await supabase
      .from('trades').update(patch).eq('id', id).eq('user_id', _user.id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    if (_isDemo) throw new DemoError('delete a trade');
    const { error } = await supabase.from('trades').delete().eq('id', id).eq('user_id', _user.id);
    if (error) throw error;
  },
};

// ============================================================
// THESIS VERSIONS
// ============================================================
export const thesisVersions = {
  async list(ticker) {
    if (_isDemo) return [];
    const { data } = await supabase
      .from('thesis_versions').select('*')
      .eq('user_id', _user.id).eq('ticker', ticker)
      .order('created_at', { ascending: false });
    return data || [];
  },
  async add(v) {
    if (_isDemo) throw new DemoError('save a thesis version');
    const row = { ...v, user_id: _user.id, portfolio_id: _portfolioId };
    const { data, error } = await supabase.from('thesis_versions').insert(row).select().single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// WATCHLIST
// ============================================================
export const watchlist = {
  async list() {
    if (_isDemo) return [{ id: 'demo-w1', ticker: 'CPI', company: 'Capitec', buy_target: 2800, notes: 'Wait for pullback' }];
    const { data } = await supabase.from('watchlist').select('*').eq('user_id', _user.id);
    return data || [];
  },
  async add(item) {
    if (_isDemo) throw new DemoError('add to watchlist');
    const row = { ...item, user_id: _user.id };
    const { data, error } = await supabase.from('watchlist').insert(row).select().single();
    if (error) throw error;
    return data;
  },
  async remove(id) {
    if (_isDemo) throw new DemoError('remove from watchlist');
    await supabase.from('watchlist').delete().eq('id', id).eq('user_id', _user.id);
  },
};

// ============================================================
// SENTIMENT (Reaction Gate)
// ============================================================
export const sentiment = {
  async today() {
    if (_isDemo) return { sentiment: 'curious', log_date: new Date().toISOString().slice(0,10) };
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from('sentiment_log').select('*')
      .eq('user_id', _user.id).eq('log_date', today).maybeSingle();
    return data;
  },
  async log(mood) {
    if (_isDemo) throw new DemoError('log sentiment');
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('sentiment_log')
      .upsert({ user_id: _user.id, sentiment: mood, log_date: today }, { onConflict: 'user_id,log_date' })
      .select().single();
    if (error) throw error;
    return data;
  },
  async history(days = 30) {
    if (_isDemo) return [];
    const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const { data } = await supabase
      .from('sentiment_log').select('*')
      .eq('user_id', _user.id).gte('log_date', since)
      .order('log_date', { ascending: false });
    return data || [];
  },
};

// ============================================================
// GHOSTS · COOLING-OFF · PRICE ALERTS · AI ANALYSES
// (same pattern — demo returns [], authed hits Supabase)
// ============================================================
export const ghosts = {
  async list() {
    if (_isDemo) return [];
    const { data } = await supabase.from('ghosts').select('*').eq('user_id', _user.id);
    return data || [];
  },
  async add(g) {
    if (_isDemo) throw new DemoError('track a ghost');
    const { data, error } = await supabase.from('ghosts')
      .insert({ ...g, user_id: _user.id }).select().single();
    if (error) throw error;
    return data;
  },
};

export const coolingOff = {
  async active() {
    if (_isDemo) return [];
    const { data } = await supabase.from('cooling_off').select('*')
      .eq('user_id', _user.id).gt('locked_until', new Date().toISOString());
    return data || [];
  },
  async lock(ticker, reason, hours = 24) {
    if (_isDemo) throw new DemoError('use the cooling-off vault');
    const lockedUntil = new Date(Date.now() + hours * 3600000).toISOString();
    const { data, error } = await supabase.from('cooling_off')
      .insert({ user_id: _user.id, ticker, reason, locked_until: lockedUntil })
      .select().single();
    if (error) throw error;
    return data;
  },
};

export const priceAlerts = {
  async list() {
    if (_isDemo) return [];
    const { data } = await supabase.from('price_alerts').select('*')
      .eq('user_id', _user.id).eq('active', true);
    return data || [];
  },
  async add(a) {
    if (_isDemo) throw new DemoError('set a price alert');
    const { data, error } = await supabase.from('price_alerts')
      .insert({ ...a, user_id: _user.id }).select().single();
    if (error) throw error;
    return data;
  },
};

export const aiAnalyses = {
  async getCached(ticker, type = 'background') {
    if (_isDemo) return null;
    const { data } = await supabase.from('ai_analyses').select('*')
      .eq('user_id', _user.id).eq('ticker', ticker).eq('analysis_type', type)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    return data;
  },
  async store(ticker, type, body, verdict = null, costUsd = null) {
    if (_isDemo) return null;
    const { data, error } = await supabase.from('ai_analyses')
      .insert({ user_id: _user.id, ticker, analysis_type: type, body, verdict, cost_usd: costUsd })
      .select().single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// PROFILE
// ============================================================
export const profile = {
  get() { return _profile; },
  async update(patch) {
    if (_isDemo) throw new DemoError('update settings');
    const { data, error } = await supabase.from('profiles')
      .update(patch).eq('id', _user.id).select().single();
    if (error) throw error;
    _profile = data;
    return data;
  },
};

// ============================================================
// DEMO ERROR — caught by UI to show signup prompt
// ============================================================
export class DemoError extends Error {
  constructor(action) {
    super(`Sign up to ${action}`);
    this.name = 'DemoError';
    this.action = action;
    this.isDemoBlock = true;
  }
}

// ============================================================
// ONE EXPORT TO RULE THEM ALL
// ============================================================
export const db = {
  auth, trades, thesisVersions, watchlist, sentiment,
  ghosts, coolingOff, priceAlerts, aiAnalyses, profile,
  DemoError,
};

// usage:
//   import { db } from './data-layer.js';
//   const myTrades = await db.trades.list();
//   try { await db.trades.add(t); }
//   catch(e) { if (e.isDemoBlock) showSignupModal(e.action); else throw e; }
