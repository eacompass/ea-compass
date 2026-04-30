# E&A Compass — Product Vision & Build Roadmap
## Elizabeth and Albert (Pty) Ltd · Siyabonga Mazibuko
## Last updated: April 2026

---

## THE VISION

> "The thinking partner between your impulse and your money."

Not a tracker. Not a screener. Not another chart app.
A cognitive partner that knows your thesis, challenges your thinking,
remembers every decision, and tells you when you're about to make
an emotional trade.

Warren Buffett talks to Charlie Munger before every major decision.
Retail investors have nobody. Until now.

---

## WHAT'S LIVE (v23)

### Core
- Portfolio tracking — positions, P&L, tiers, cost basis
- Live prices — JSE + US, parallel proxy fetch (Vercel/Yahoo)
- 197 JSE stocks verified and Yahoo Finance mapped
- Split currency — ZAR + USD shown separately, never mixed
- FIFO-based CGT engine (sophisticated, rare in consumer apps)

### Thesis Layer
- Guided thesis builder (step-by-step questions)
- Expert mode (full valuation canvas — P/E, moat, MOS)
- Speed mode (4 quick-tap buttons — Growth/Value/Dividend/Defensive)
- Thesis history (full evolution tracked)
- Thesis score breakdown (✓ Strong · ~ Needs work · ✗ Missing)
- Conviction clock (thesis decay over time)
- Retroactive thesis nudge ("Strengthen when you have 2 minutes")

### Intelligence
- Devil's Advocate (AI thesis challenge — 3/month free)
- Drift detection (framework exists, needs Anthropic key)
- Sanity check (framework exists, needs Anthropic key)
- Anniversary review system

### Portfolio
- Benchmark badge (vs JSE Top 40)
- Habit streaks ("47 days without emotional trade")
- Price alerts (browser push notifications)
- Watchlist + buy-price targets
- Earnings calendar (approximate JSE windows)
- Graveyard (sold positions + verdict)
- Sector map
- Dividend tracking
- Rebalance calculator

### UX
- Onboarding quiz (3 questions → sets mode/currency/defaults)
- Mobile bottom nav (Log · Portfolio · Watch · Insights · More)
- Shareable thesis card (score + P&L + hold time)
- Refer a friend (Settings → Share Compass)
- Tier reset for testing (Settings → Beta Access Code)
- Session persistence (refresh doesn't lock you out)
- PIN unlock (bulletproof string+integer comparison)

### Data
- Google Drive MCP connected (ready for silent sync)
- Manual backup/restore (JSON export/import)
- Beta access codes (EABETA2026, EAELITE2026, ELIZABETHALBERT etc.)

---

## WHAT'S HALF-BUILT (needs Anthropic key)

- SENS filing alerts (code exists, needs api/sens.js)
- Fundamental data (sector only, no P/E or yield yet)
- Intelligence Brief (UI exists, needs key)
- Background AI analysis worker (architecture ready)
- Annual report upload + analysis (not started)

---

## DEPLOYMENT

```
Live URL:        ea-compass.vercel.app/app
GitHub:          github.com/eacompass/ea-compass
Deploy:          Push to GitHub → Vercel auto-deploys (30 seconds)
Proxy:           ea-compass.vercel.app/api/price (Yahoo Finance)
Current file:    EA_Compass_v23.html → paste to app/index.html
```

---

## BETA ACCESS CODES (PRIVATE)

```
Pro tier:     EABETA2026 · EAPRO2026 · COMPASSPRO
Student:      EASTUDENT
Elite:        EAELITE2026 · COMPASSELITE
Fund:         EAFUND2026 · ELIZABETHALBERT (founder)
```
Settings → Beta Access Code → Redeem
Settings → "Reset to Free tier" for testing tier switching

---

## TIER SYSTEM

```
Free      10 positions · live prices · 3 Devil's Advocates/month
Student   R9.99 · Full Pro · .ac.za email
Pro       R29 · Unlimited · expert mode · full AI · CGT · dividends
Elite     R79 · Pro + Intelligence Brief
Fund      R299 · Elite + multi-portfolio + team
```

---

## NEXT WEEK SPRINT (Full week — highest priority)

### MONDAY — Quick fixes + Behavioral guardrails
```
Quick fixes first (from Perplexity audit):
  [ ] Guided→Expert mode loses draft — sync on toggle (30 min)
  [ ] AI usage warning — progress bar before hitting limit (1 hour)
  [ ] Stale price toast — "Using cached price from X hours ago" (30 min)
  [ ] CSV import preview — show importable count before import (1 hour)

New features:
  [ ] Schema freeze — document v1 data structure
  [ ] Pre-Mortem field on Log Trade
      "Imagine it's 2028 and this collapsed. Most likely reason?"
  [ ] Pre-sell inertia check
      "You are ending a Tier 1 thesis. Has the business changed
       or are you just bored/anxious?"
  [ ] 24-hour emotional lock on bored/anxious sell
      Button transforms to "Set Reminder" — not just greyed out
  [ ] Zombie Position detector
      Tier 2 positions past expiry → binary choice: Sell or Promote
  [ ] Thesis Seepage gauge on position card
      Visual progress bar filling toward expiry date
```

### TUESDAY — AI goes live
```
  [ ] Anthropic key integration (paste key → everything unlocks)
  [ ] Background AI intelligence worker
      Runs silently on portfolio open
      Analyses each position against thesis + exit trigger
      Stores result in localStorage
      Shows as Intelligence note on position card
  [ ] KPI Matchmaker
      "North Star Metrics" field on Log Trade
      "Data revenue growth > 15%, margin > 30%"
      Background worker checks for divergence
      Alert: "Market expects 11% — your thesis needs 15%"
  [ ] Thesis Drift AI detection
      Original vs updated thesis side by side
      AI flags: "Evolution of logic or moving goalposts?"
      Drift penalty lowers conviction score automatically
  [ ] CGT friction cost at sell decision
      "After CGT you have R72,160 — not R82,000
       New opportunity needs 13.7% just to break even"
```

### WEDNESDAY — Data + payments + sync
```
  [ ] Google Drive silent sync
      Every trade commit → encrypted incremental backup to Drive
      App becomes immortal — re-hydrates on new device
      Timestamp-based conflict resolution
      Union merge on trades array
  [ ] Ghost Tracking in Graveyard
      Track sold positions for 12 months
      Anniversary: "You sold MTN at R180. It's now R240.
                    Was your exit correct?"
  [ ] Reaction Gate
      Portfolio P&L blurred on open
      User selects sentiment (Disciplined/Anxious/Impatient)
      Unblurs data — logs emotional state
      Over time: "You open anxious when ZAR weakens >2%"
  [ ] Cash / Dry Powder bucket
      Sell proceeds flow in automatically
      "You are 22% cash — opportunity cost: R4,200/month"
      Cash as a benchmark — are you beating cash + inflation?
  [ ] PayFast integration (payment rails)
```

### THURSDAY — React Native begins
```
  [ ] Expo + React Native setup on Windows
  [ ] Android emulator running
  [ ] Data migration function
      migrate(data) — maps v0 (HTML) schema to v1 (Native)
      schema_version: 1 key added to root JSON
  [ ] Core portfolio screen rendered natively
  [ ] Bottom nav working natively
```

### FRIDAY — Consolidate + deploy
```
  [ ] Deploy updated web app with all new features
  [ ] Test with real data
  [ ] Fix what broke
  [ ] First native build on phone (whatever state it's in)
  [ ] Share with 5 beta testers
```

---

## FEATURE BACKLOG (May onwards)

### High priority
- Steinhoff Reveal / Humility Log
  JSE case studies: Steinhoff, African Bank, Tongaat, Abil, EOH
  Blind financials → user decides → reveal
  Saved to Investment Autobiography
- Anti-correlation check
  "Adding this makes your portfolio 60% software — single factor bet"
- Blind Decision Simulator
  Strip ticker + name — evaluate the business, not the brand
- Weekly digest email (needs backend)
- Dual-currency real return
  "AAPL: Local +28% · ZAR-adjusted +41% (11% was rand weakness)"

### Medium priority
- SENS filing alerts (api/sens.js — JSE RSS feed)
- Fundamental data cards (P/E, yield, EPS on ticker select)
- Annual report upload → AI analysis
- Investment Autobiography (multi-year letter archive)
- Thesis Expiry Clock with hard stop date

### Infrastructure (May)
- Supabase backend + proper auth
- Replace localStorage with Supabase
- Founder hardcode → proper auth flag
- PayFast → subscription management
- React Native iOS build (needs Mac)

---

## REACT NATIVE ROADMAP

```
June (Windows)
  Android app — Google Play (R450 one-time)
  Expo + React Native
  Reuses all JS logic from web
  Real push notifications
  Offline support

July (Mac arrives)
  iOS build — App Store ($99/year)
  Both platforms live

August
  Full native feature parity
  In-app upgrades
  Elizabeth and Albert Fund R100k deployed
```

---

## FINANCIAL ROADMAP

```
April 2026    R33k stokvel → debt free
May 2026      Beta launch + PayFast live
              First paying users
              MacBook purchase (business expense)
June 2026     R12k/month free
              React Native Android on Play Store
August 2026   Both app stores live
October 2026  Elizabeth and Albert Fund R100k deployed
2027          Compass reaches quit-job revenue
              1,200 Pro users × R29 = R34,800/month
2030          R1,000,000 portfolio target
```

---

## THE NUMBERS THAT MATTER

```
SA retail investors active:    ~2.5 million
EasyEquities users:            ~1 million
Target addressable:            ~500,000 serious investors

1% conversion:    5,000 users × R29 = R145,000/month
0.1% conversion:  500 users × R29  = R14,500/month
Quit-job number:  1,200 users × R29 = R34,800/month
That's 0.24% of the market.
```

---

## AI STACK

```
Primary builder:      Claude (architecture + code)
Architecture review:  Gemini 2.5 Pro (second opinion)
Research:             Perplexity (market + competitors)
Code editor:          Cursor AI (VS Code + Claude — get this)
In-app AI:            Anthropic API (claude-sonnet-4-20250514)
                      $5 = ~500 full portfolio analyses
                      R0.05 per analysis
                      R1.50/month/user at daily cadence
```

---

## COMPETITOR CONTEXT

```
Vexton.ai          Portfolio tracker + AI summaries
                   No thesis layer
                   No behavioral guardrails
                   No conviction clock
                   No graveyard

Bloomberg Terminal  Data rich, behavior blind
                   R500k+/year
                   Not for retail

EasyEquities        Broker, not thinking layer
                   Our partner not competitor

Nobody has:
  ✓ Mandatory thesis before buy
  ✓ Conviction decay clock
  ✓ Graveyard with post-mortem
  ✓ AI that knows YOUR thesis
  ✓ Behavioral guardrails (cooling off, inertia check)
  ✓ Background thinking partner
```

---

## OUTSTANDING BUGS (from Perplexity audit)

```
CRITICAL (fix Monday before new features):
  [ ] Guided→Expert draft sync — loses thesis on mode switch
  [ ] AI usage no warning — hits 3/3 without user knowing
  [ ] Silent price failures — no toast when using stale cache
  [ ] CSV import mid-flow block — no preview of importable count

MEDIUM:
  [ ] Partial close preview in sell modal
  [ ] Modal scroll lock on mobile (MutationObserver incomplete)
  [ ] Drive sync conflict resolver UI

LOW:
  [ ] localStorage quota handling (checkStorageHealth exists)
  [ ] Founder hardcode → env flag (fine for now, fix in Supabase)
```

---

## DATA SCHEMA v1 (to freeze Monday)

```javascript
// Position object
{
  ticker: String,
  company: String,
  asset_type: 'stock' | 'bond' | 'property' | 'crypto',
  action: 'BUY' | 'SELL',
  currency: 'ZAR' | 'USD',
  price: Number,
  shares: Number,
  entry_value: Number,
  tier: 1 | 2,
  thesis: String,
  exit_trigger: String,
  pre_mortem: String,          // NEW Monday
  north_star_metrics: String,  // NEW Tuesday
  is_tfsa: Boolean,
  entry_date: String,          // ISO date
  expert: Object | null,
  schema_version: 1            // NEW Monday
}

// Trade object (raw log)
{
  date: String,
  ticker: String,
  company: String,
  asset_type: String,
  action: String,
  currency: String,
  price: Number,
  shares: Number,
  entry_value: Number,
  tier: Number,
  thesis: String,
  exit_trigger: String,
  sell_reason: String | null,
  is_tfsa: Boolean,
  schema_version: 1
}
```

---

## KEY DECISIONS MADE

```
Pricing         No free trial — generous free tier hooks better
                10 positions + live prices + 3 Devils free
                Limit hits when portfolio grows = earned upgrade

Currency        Never convert ZAR↔USD — thesis is about business
                Split display always — two separate buckets

Thesis          Speed mode still requires thesis
                "Log fast" not "skip thinking"
                Template fills — edit before logging

Architecture    Web first → React Native together
                Android first (80% SA market)
                iOS when Mac arrives in May

Database        localStorage now → Supabase in May
                Google Drive silent sync as bridge
                Privacy-first always

AI              Anthropic API only
                ~R0.05 per analysis
                Background worker — proactive not reactive
```

---

## IN MEMORY

*This product is built in memory of Elizabeth and Albert.*
*May it help a generation of South African investors*
*think before they act, and build wealth that lasts.*

🧭

