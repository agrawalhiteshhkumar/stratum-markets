import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, Activity, ShieldAlert, BarChart2,
  Layers, Search, CheckCircle2, AlertTriangle, Smartphone, Monitor,
  Send, Bot, User, LogIn, FileCheck, ShieldCheck, X, Clock
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- INITIAL MOCK ASSETS ---
const INITIAL_ASSETS = [
  { symbol: 'XAU/USD', name: 'Gold / Spot US Dollar', category: 'Commodities', price: 2342.80, change: 0.84, bid: 2342.60, ask: 2343.00, spread: 0.40, high: 2355.10, low: 2330.40, decimals: 2 },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex', price: 1.0845, change: -0.21, bid: 1.0844, ask: 1.0846, spread: 0.0002, high: 1.0890, low: 1.0820, decimals: 4 },
  { symbol: 'GBP/USD', name: 'British Pound / USD', category: 'Forex', price: 1.2715, change: 0.15, bid: 1.2713, ask: 1.2717, spread: 0.0004, high: 1.2760, low: 1.2680, decimals: 4 },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'Crypto', price: 64820.00, change: 2.35, bid: 64810.00, ask: 64830.00, spread: 20.0, high: 65900.00, low: 63400.00, decimals: 2 },
  { symbol: 'SPX500', name: 'S&P 500 Index', category: 'Indices', price: 5430.20, change: 0.45, bid: 5429.80, ask: 5430.60, spread: 0.80, high: 5450.00, low: 5410.00, decimals: 2 },
  { symbol: 'NVDA', name: 'Nvidia Corporation', category: 'Stocks', price: 128.40, change: 3.12, bid: 128.35, ask: 128.45, spread: 0.10, high: 131.00, low: 125.80, decimals: 2 },
];

export default function App() {
  const [viewMode, setViewMode] = useState('mobile');
  const [mobileTab, setMobileTab] = useState('trade'); // 'markets' | 'trade' | 'positions' | 'ai' | 'risk' | 'kyc'
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState(INITIAL_ASSETS[0]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [timeframe, setTimeframe] = useState('15M');
  const [chartType, setChartType] = useState('candles');

  // Auth & Profile state
  const [user, setUser] = useState({
    name: 'Trader Account',
    email: 'trader@stratummarkets.com',
    isLoggedIn: true,
    kycStatus: 'pending' // 'unverified' | 'pending' | 'verified'
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authForm, setAuthForm] = useState({ email: '', password: '', fullName: '' });

  // KYC Submission Form state
  const [kycForm, setKycForm] = useState({
    docType: 'Passport',
    idNumber: 'A94821039',
    country: 'United States',
    submitted: false
  });

  // Trading state
  const [balance, setBalance] = useState(100000.00);
  const [orderSide, setOrderSide] = useState('BUY');
  const [units, setUnits] = useState(1.0);
  const [leverage, setLeverage] = useState(10);
  const [positions, setPositions] = useState([
    {
      id: 'POS-1049',
      symbol: 'XAU/USD',
      side: 'BUY',
      units: 2.0,
      leverage: 10,
      entryPrice: 2338.50,
      currentPrice: 2342.80,
      margin: 467.70,
      pnl: 8.60,
    }
  ]);

  // AI Copilot state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: 'Stratum Core AI™ initialized. "Trade Smarter. See Further." Ask any question regarding chart setups, macro catalysts, or risk controls.'
    }
  ]);

  // Real-time market ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          const deltaPct = (Math.random() - 0.495) * 0.0015;
          const newPrice = Math.max(0.0001, asset.price * (1 + deltaPct));
          const roundedPrice = Number(newPrice.toFixed(asset.decimals));
          return {
            ...asset,
            price: roundedPrice,
            bid: Number((roundedPrice - asset.spread / 2).toFixed(asset.decimals)),
            ask: Number((roundedPrice + asset.spread / 2).toFixed(asset.decimals)),
            change: Number((asset.change + deltaPct * 100).toFixed(2))
          };
        })
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updated = assets.find((a) => a.symbol === selectedAsset.symbol);
    if (updated) setSelectedAsset(updated);
  }, [assets, selectedAsset.symbol]);

  // Dynamic P&L recalculation
  const enrichedPositions = useMemo(() => {
    return positions.map((pos) => {
      const match = assets.find((a) => a.symbol === pos.symbol) || selectedAsset;
      const curPrice = match.price;
      const diff = pos.side === 'BUY' ? curPrice - pos.entryPrice : pos.entryPrice - curPrice;
      const floatingPnl = Number((diff * pos.units * pos.leverage).toFixed(2));
      return { ...pos, currentPrice: curPrice, pnl: floatingPnl };
    });
  }, [positions, assets, selectedAsset]);

  const totalFloatingPnl = useMemo(() => {
    return enrichedPositions.reduce((acc, p) => acc + p.pnl, 0);
  }, [enrichedPositions]);

  const equity = balance + totalFloatingPnl;
  const marginUsed = enrichedPositions.reduce((acc, p) => acc + p.margin, 0);
  const freeMargin = Math.max(0, equity - marginUsed);

  // Candlestick generator
  const candleData = useMemo(() => {
    const data = [];
    let base = selectedAsset.price * 0.985;
    for (let i = 0; i < 24; i++) {
      const open = base;
      const variation = (Math.random() - 0.48) * (selectedAsset.price * 0.004);
      const close = open + variation;
      const high = Math.max(open, close) + Math.random() * (selectedAsset.price * 0.002);
      const low = Math.min(open, close) - Math.random() * (selectedAsset.price * 0.002);
      data.push({ i, open, close, high, low });
      base = close;
    }
    data[data.length - 1].close = selectedAsset.price;
    return data;
  }, [selectedAsset.symbol]);

  // Order Placement
  const handleExecuteOrder = () => {
    const reqMargin = (selectedAsset.price * units) / leverage;
    if (reqMargin > freeMargin) {
      alert('Insufficient Free Margin for this position size & leverage.');
      return;
    }
    const newPos = {
      id: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      symbol: selectedAsset.symbol,
      side: orderSide,
      units: Number(units),
      leverage: Number(leverage),
      entryPrice: selectedAsset.price,
      currentPrice: selectedAsset.price,
      margin: Number(reqMargin.toFixed(2)),
      pnl: 0.00
    };
    setPositions([newPos, ...positions]);
  };

  const closePosition = (id) => {
    const pos = enrichedPositions.find((p) => p.id === id);
    if (!pos) return;
    setBalance((prev) => prev + pos.pnl);
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  // AI Prompting
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || aiPrompt;
    if (!query.trim()) return;

    setAiMessages((prev) => [...prev, { role: 'user', text: query }]);
    setAiPrompt('');
    setAiLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setTimeout(() => {
          setAiMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: `[Stratum Core AI] ${selectedAsset.symbol} shows consolidation around ${selectedAsset.price}. Immediate support lies at ${(selectedAsset.price * 0.995).toFixed(2)}. AI insights are purely educational.`
            }
          ]);
          setAiLoading(false);
        }, 600);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          systemInstruction: 'You are Stratum Core AI™, institutional market copilot. Tagline: Trade Smarter. See Further. Provide concise analytical insights with compliance disclaimers.'
        }
      });

      setAiMessages((prev) => [...prev, { role: 'assistant', text: response.text }]);
    } catch (err) {
      setAiMessages((prev) => [...prev, { role: 'assistant', text: 'Stratum AI Copilot unavailable. Please verify API key.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Authentication submit
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setUser({
      name: authMode === 'register' ? authForm.fullName || 'New Trader' : 'Authenticated Trader',
      email: authForm.email,
      isLoggedIn: true,
      kycStatus: 'unverified'
    });
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* TOP NAVIGATION & BRANDING HEADER */}
      <header className="bg-[#0e131f] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold tracking-wider text-slate-200">
            <span className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-blue-500/30">
              S
            </span>
            <div>
              <span className="font-extrabold text-sm tracking-wide text-white block leading-tight">STRATUM MARKETS</span>
              <span className="text-[9px] text-blue-400 tracking-wider font-semibold uppercase block">
                Trade Smarter. See Further.
              </span>
            </div>
          </div>
          <span className="hidden md:inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono">
            SIMULATED PAPER TRADING
          </span>
        </div>

        {/* Viewport switch and Auth Profile */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#161c2e] p-1 rounded-lg flex items-center gap-1 border border-slate-700/60">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition ${
                viewMode === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile App
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition ${
                viewMode === 'desktop' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop Pro
            </button>
          </div>

          {/* User Profile / KYC badge */}
          {user.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileTab('kyc');
                  if (viewMode === 'desktop') setViewMode('mobile');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                  user.kycStatus === 'verified'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : user.kycStatus === 'pending'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="capitalize">KYC: {user.kycStatus}</span>
              </button>
              <button
                onClick={() => setUser({ ...user, isLoggedIn: false })}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg text-xs"
                title="Log Out"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition shadow"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In / Register
            </button>
          )}
        </div>
      </header>

      {/* AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-slate-800 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mb-5">
              <span className="h-8 w-8 rounded-lg bg-blue-600 text-white font-black inline-flex items-center justify-center text-sm mb-2">
                S
              </span>
              <h2 className="text-base font-bold text-white">
                {authMode === 'login' ? 'Sign In to Stratum Markets' : 'Create Live / Paper Account'}
              </h2>
              <p className="text-xs text-blue-400 mt-1">Trade Smarter. See Further.</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={authForm.fullName}
                    onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                    className="w-full bg-[#161c2c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="trader@stratummarkets.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full bg-[#161c2c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-[#161c2c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg mt-2"
              >
                {authMode === 'login' ? 'Access Trading Terminal' : 'Register Account'}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-400">
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-blue-400 font-semibold underline">
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-blue-400 font-semibold underline">
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex justify-center items-stretch p-0 sm:p-4 md:p-6 overflow-x-hidden">
        {viewMode === 'mobile' ? (
          // ================= MOBILE PHONE VIEW =================
          <div className="w-full max-w-[420px] bg-[#0a0d14] rounded-none sm:rounded-[36px] border-0 sm:border-[8px] sm:border-slate-800 shadow-2xl flex flex-col h-[100dvh] sm:h-[840px] relative overflow-hidden">
            {/* Phone Notch & 5G Status */}
            <div className="bg-[#0e1320] pt-2 px-5 pb-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-white">9:41</span>
              <div className="h-4 w-28 bg-black/60 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>5G</span>
              </div>
            </div>

            {/* Mobile Virtual Balance Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-[#101726] p-3 border-b border-slate-800/80 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Virtual Equity</span>
                <span className="text-base font-bold font-mono text-white">
                  ${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Floating P&L</span>
                <span className={`text-xs font-mono font-bold ${totalFloatingPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalFloatingPnl >= 0 ? '+' : ''}${totalFloatingPnl.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Mobile Tab Content */}
            <div className="flex-1 overflow-y-auto pb-20 p-3 space-y-3">
              {/* TAB: MARKETS */}
              {mobileTab === 'markets' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search pairs, indices, stocks..."
                      className="w-full bg-[#121826] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                    {['ALL', 'Forex', 'Commodities', 'Indices', 'Crypto', 'Stocks'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                          activeCategory === cat ? 'bg-blue-600 text-white font-medium' : 'bg-[#121826] text-slate-400 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="divide-y divide-slate-800/60 rounded-xl bg-[#0f1422] border border-slate-800/80 overflow-hidden">
                    {assets
                      .filter((a) => activeCategory === 'ALL' || a.category === activeCategory)
                      .map((item) => (
                        <div
                          key={item.symbol}
                          onClick={() => {
                            setSelectedAsset(item);
                            setMobileTab('trade');
                          }}
                          className="p-3 flex items-center justify-between active:bg-blue-600/10 cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-xs text-white">{item.symbol}</div>
                            <div className="text-[10px] text-slate-400">{item.name}</div>
                          </div>
                          <div className="text-right font-mono">
                            <div className="text-xs font-semibold text-slate-100">{item.price.toFixed(item.decimals)}</div>
                            <div className={`text-[10px] ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {item.change >= 0 ? '+' : ''}{item.change}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB: TRADE */}
              {mobileTab === 'trade' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[#0f1422] p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{selectedAsset.symbol}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${selectedAsset.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{selectedAsset.name}</span>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-slate-100">{selectedAsset.price.toFixed(selectedAsset.decimals)}</div>
                      <div className="text-[10px] text-slate-500">Spr: {selectedAsset.spread}</div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="bg-[#0f1422] rounded-xl border border-slate-800/80 p-3 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex gap-1">
                        {['1M', '5M', '15M', '1H', '1D'].map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-2 py-0.5 rounded font-mono ${timeframe === tf ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setChartType(chartType === 'candles' ? 'line' : 'candles')}
                        className="text-slate-400 hover:text-white uppercase font-mono"
                      >
                        {chartType}
                      </button>
                    </div>

                    <div className="h-44 w-full relative pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 240 100" preserveAspectRatio="none">
                        <line x1="0" y1="25" x2="240" y2="25" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="0" y1="50" x2="240" y2="50" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="0" y1="75" x2="240" y2="75" stroke="#1e293b" strokeDasharray="3 3" />

                        {candleData.map((c, idx) => {
                          const minVal = Math.min(...candleData.map((d) => d.low));
                          const maxVal = Math.max(...candleData.map((d) => d.high));
                          const range = maxVal - minVal || 1;
                          const getY = (val) => 95 - ((val - minVal) / range) * 85;
                          const isGreen = c.close >= c.open;
                          const color = isGreen ? '#10b981' : '#ef4444';
                          const x = idx * 10 + 4;

                          return (
                            <g key={idx}>
                              <line x1={x + 3} y1={getY(c.high)} x2={x + 3} y2={getY(c.low)} stroke={color} strokeWidth="1" />
                              <rect
                                x={x}
                                y={Math.min(getY(c.open), getY(c.close))}
                                width="6"
                                height={Math.max(2, Math.abs(getY(c.open) - getY(c.close)))}
                                fill={color}
                                rx="1"
                              />
                            </g>
                          );
                        })}
                      </svg>
                      <div className="absolute right-1 top-1 bg-blue-950/80 border border-blue-500/40 text-[9px] font-mono px-1.5 py-0.5 rounded text-blue-300">
                        Live: {selectedAsset.price}
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="bg-[#0f1422] rounded-xl border border-slate-800/80 p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg">
                      <button
                        onClick={() => setOrderSide('BUY')}
                        className={`py-2 rounded-md font-bold text-xs transition ${
                          orderSide === 'BUY' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400'
                        }`}
                      >
                        BUY / LONG
                      </button>
                      <button
                        onClick={() => setOrderSide('SELL')}
                        className={`py-2 rounded-md font-bold text-xs transition ${
                          orderSide === 'SELL' ? 'bg-rose-600 text-white shadow' : 'text-slate-400'
                        }`}
                      >
                        SELL / SHORT
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Contract Units</label>
                        <input
                          type="number"
                          step="0.1"
                          value={units}
                          onChange={(e) => setUnits(Math.max(0.01, parseFloat(e.target.value) || 0.1))}
                          className="w-full bg-[#161c2c] border border-slate-700/80 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Leverage ({leverage}x)</label>
                        <select
                          value={leverage}
                          onChange={(e) => setLeverage(Number(e.target.value))}
                          className="w-full bg-[#161c2c] border border-slate-700/80 rounded-lg px-2 py-1.5 font-mono text-white text-xs focus:outline-none focus:border-blue-500"
                        >
                          <option value="1">1x (Spot Cash)</option>
                          <option value="5">5x Margin</option>
                          <option value="10">10x Dynamic</option>
                          <option value="25">25x High</option>
                          <option value="50">50x Prime</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleExecuteOrder}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-lg ${
                        orderSide === 'BUY'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      Instant Execute {orderSide}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: POSITIONS */}
              {mobileTab === 'positions' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Contracts ({enrichedPositions.length})</span>
                    <span className="text-[11px] font-mono text-slate-400">Free Margin: ${freeMargin.toFixed(0)}</span>
                  </div>

                  {enrichedPositions.length === 0 ? (
                    <div className="text-center py-10 bg-[#0f1422] rounded-xl border border-slate-800 text-slate-500 text-xs">
                      No active positions. Execute a trade in the Trade tab.
                    </div>
                  ) : (
                    enrichedPositions.map((pos) => (
                      <div key={pos.id} className="bg-[#0f1422] border border-slate-800 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pos.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                              {pos.side} {pos.leverage}x
                            </span>
                            <span className="font-bold text-xs text-white">{pos.symbol}</span>
                          </div>
                          <button
                            onClick={() => closePosition(pos.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] px-2 py-1 rounded font-medium"
                          >
                            Close
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                          <div>Units: <span className="text-slate-200">{pos.units}</span></div>
                          <div>Entry: <span className="text-slate-200">{pos.entryPrice}</span></div>
                          <div>Margin: <span className="text-slate-200">${pos.margin}</span></div>
                          <div>
                            P&L: <span className={`font-bold ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB: STRATUM CORE AI™ */}
              {mobileTab === 'ai' && (
                <div className="h-full flex flex-col space-y-2">
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-2.5 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-blue-200">Stratum Core AI™</div>
                      <div className="text-[10px] text-slate-400">Trade Smarter. See Further.</div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[360px] max-h-[460px]">
                    {aiMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-3 rounded-xl leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-blue-600 text-white ml-6'
                            : 'bg-[#121826] border border-slate-800 text-slate-200 mr-6'
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto py-1 text-[10px] scrollbar-none">
                    <button
                      onClick={() => handleSendMessage('Why is Gold moving today?')}
                      className="bg-[#121826] hover:bg-slate-800 border border-slate-700/80 px-2 py-1 rounded-full whitespace-nowrap text-slate-300"
                    >
                      Gold Catalysts?
                    </button>
                    <button
                      onClick={() => handleSendMessage('Explain RSI divergence on BTC')}
                      className="bg-[#121826] hover:bg-slate-800 border border-slate-700/80 px-2 py-1 rounded-full whitespace-nowrap text-slate-300"
                    >
                      Explain RSI?
                    </button>
                  </div>

                  <div className="relative pt-1">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask market intelligence..."
                      className="w-full bg-[#121826] border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="absolute right-2 top-3 text-blue-400 hover:text-blue-300"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: KYC / AML COMPLIANCE VERIFICATION */}
              {mobileTab === 'kyc' && (
                <div className="space-y-3">
                  <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-white">Identity Verification (KYC)</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        user.kycStatus === 'verified'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : user.kycStatus === 'pending'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        {user.kycStatus}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Tier 1 Verification unlocks unlimited deposits, automated institutional withdrawals, and margin access.
                    </p>

                    <div className="bg-[#121826] p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Document Type</label>
                        <select
                          value={kycForm.docType}
                          onChange={(e) => setKycForm({ ...kycForm, docType: e.target.value })}
                          className="w-full bg-[#182032] border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                        >
                          <option>International Passport</option>
                          <option>National Identity Card</option>
                          <option>Driver's License</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Document Number</label>
                        <input
                          type="text"
                          value={kycForm.idNumber}
                          onChange={(e) => setKycForm({ ...kycForm, idNumber: e.target.value })}
                          className="w-full bg-[#182032] border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setUser({ ...user, kycStatus: 'pending' });
                          alert('KYC Documents submitted for institutional review.');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs transition mt-1"
                      >
                        Submit Verification Documents
                      </button>
                    </div>

                    {/* Simulation Admin override */}
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                      <span>Simulator Compliance Override:</span>
                      <button
                        onClick={() => setUser({ ...user, kycStatus: user.kycStatus === 'verified' ? 'pending' : 'verified' })}
                        className="text-blue-400 font-semibold underline"
                      >
                        Toggle Status ({user.kycStatus === 'verified' ? 'Revoke' : 'Approve'})
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: RISK */}
              {mobileTab === 'risk' && (
                <div className="space-y-3">
                  <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Portfolio Risk Score</span>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                        STABLE (LOW)
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Margin Cushion:</span>
                        <span className="text-white font-bold">{((freeMargin / equity) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(freeMargin / equity) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>1-Day 95% VaR:</span>
                        <span className="text-amber-400 font-bold">$124.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM NAV BAR */}
            <nav className="absolute bottom-0 left-0 right-0 bg-[#0c101a]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex justify-around items-center z-40">
              {[
                { id: 'markets', label: 'Markets', icon: BarChart2 },
                { id: 'trade', label: 'Trade', icon: TrendingUp },
                { id: 'positions', label: 'Positions', icon: Layers, badge: enrichedPositions.length },
                { id: 'ai', label: 'Stratum AI', icon: Bot },
                { id: 'kyc', label: 'KYC Center', icon: ShieldAlert }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = mobileTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMobileTab(item.id)}
                    className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition relative ${
                      isActive ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="absolute top-0 right-2 bg-blue-600 text-white rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          // ================= DESKTOP PRO WORKSTATION =================
          <div className="w-full max-w-7xl bg-[#0a0d14] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-[#0d121e] border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-6">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Stratum Prime Workstation
                </span>
                <div className="flex items-center gap-4 font-mono text-slate-400">
                  <span>Balance: <strong className="text-white">${balance.toFixed(2)}</strong></span>
                  <span>Equity: <strong className="text-white">${equity.toFixed(2)}</strong></span>
                  <span>Free Margin: <strong className="text-emerald-400">${freeMargin.toFixed(2)}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-blue-400 font-medium">"Trade Smarter. See Further."</span>
                <span className="text-[11px] text-slate-500 font-mono">NY4 Cross-Connect</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-12 divide-x divide-slate-800 min-h-[580px]">
              {/* Watchlist */}
              <div className="col-span-3 flex flex-col bg-[#0b0f19]">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 uppercase">Market Screener</span>
                  <span className="text-[10px] text-slate-500 font-mono">{assets.length} Active</span>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                  {assets.map((asset) => (
                    <div
                      key={asset.symbol}
                      onClick={() => setSelectedAsset(asset)}
                      className={`p-3 cursor-pointer flex justify-between items-center transition ${
                        selectedAsset.symbol === asset.symbol ? 'bg-blue-600/10 border-l-2 border-blue-500' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{asset.symbol}</div>
                        <div className="text-[10px] text-slate-400">{asset.category}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs text-slate-200">{asset.price.toFixed(asset.decimals)}</div>
                        <div className={`text-[10px] ${asset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {asset.change >= 0 ? '+' : ''}{asset.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart & Positions */}
              <div className="col-span-6 flex flex-col bg-[#080b12]">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-white">{selectedAsset.symbol}</span>
                    <span className="text-xs text-slate-400">{selectedAsset.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-500">Spread: {selectedAsset.spread}</span>
                    <span className="text-white font-bold">{selectedAsset.price.toFixed(selectedAsset.decimals)}</span>
                  </div>
                </div>

                <div className="flex-1 p-4 relative min-h-[300px]">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160" preserveAspectRatio="none">
                    <line x1="0" y1="40" x2="400" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="0" y1="120" x2="400" y2="120" stroke="#1e293b" strokeDasharray="3 3" />

                    {candleData.map((c, idx) => {
                      const minVal = Math.min(...candleData.map((d) => d.low));
                      const maxVal = Math.max(...candleData.map((d) => d.high));
                      const range = maxVal - minVal || 1;
                      const getY = (val) => 150 - ((val - minVal) / range) * 135;
                      const isGreen = c.close >= c.open;
                      const color = isGreen ? '#10b981' : '#ef4444';
                      const x = idx * 16 + 8;

                      return (
                        <g key={idx}>
                          <line x1={x + 4} y1={getY(c.high)} x2={x + 4} y2={getY(c.low)} stroke={color} strokeWidth="1" />
                          <rect
                            x={x}
                            y={Math.min(getY(c.open), getY(c.close))}
                            width="8"
                            height={Math.max(2, Math.abs(getY(c.open) - getY(c.close)))}
                            fill={color}
                            rx="1"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="h-44 border-t border-slate-800 bg-[#0a0d17] p-3 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase">Open Positions ({enrichedPositions.length})</span>
                    <span className="text-xs font-mono text-slate-400">Total Floating: ${totalFloatingPnl.toFixed(2)}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="pb-1">ID</th>
                          <th className="pb-1">Symbol</th>
                          <th className="pb-1">Side</th>
                          <th className="pb-1">Units</th>
                          <th className="pb-1">Entry</th>
                          <th className="pb-1">P&L</th>
                          <th className="pb-1 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {enrichedPositions.map((p) => (
                          <tr key={p.id}>
                            <td className="py-1.5 text-slate-400">{p.id}</td>
                            <td className="py-1.5 font-bold text-white">{p.symbol}</td>
                            <td className={`py-1.5 font-bold ${p.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>{p.side} {p.leverage}x</td>
                            <td className="py-1.5">{p.units}</td>
                            <td className="py-1.5">{p.entryPrice}</td>
                            <td className={`py-1.5 font-bold ${p.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${p.pnl.toFixed(2)}</td>
                            <td className="py-1.5 text-right">
                              <button onClick={() => closePosition(p.id)} className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-white text-[10px]">
                                Close
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Order Deck & AI */}
              <div className="col-span-3 flex flex-col bg-[#0b0f19] divide-y divide-slate-800">
                <div className="p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase block">Trade Execution</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setOrderSide('BUY')}
                      className={`py-2 rounded font-bold text-xs ${orderSide === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      BUY
                    </button>
                    <button
                      onClick={() => setOrderSide('SELL')}
                      className={`py-2 rounded font-bold text-xs ${orderSide === 'SELL' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      SELL
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Contract Units</label>
                    <input
                      type="number"
                      value={units}
                      onChange={(e) => setUnits(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                      className="w-full bg-[#121826] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Leverage ({leverage}x)</label>
                    <select
                      value={leverage}
                      onChange={(e) => setLeverage(Number(e.target.value))}
                      className="w-full bg-[#121826] border border-slate-700 rounded px-2 py-1.5 font-mono text-xs text-white"
                    >
                      <option value="1">1x Cash</option>
                      <option value="5">5x Margin</option>
                      <option value="10">10x Dynamic</option>
                      <option value="25">25x High</option>
                      <option value="50">50x Prime</option>
                    </select>
                  </div>
                  <button
                    onClick={handleExecuteOrder}
                    className={`w-full py-2.5 rounded font-bold text-xs text-white shadow ${
                      orderSide === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                    }`}
                  >
                    Place {orderSide} Order
                  </button>
                </div>

                <div className="flex-1 p-3 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-blue-400">
                    <Bot className="w-4 h-4" />
                    Stratum Core AI™
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                    {aiMessages.map((m, idx) => (
                      <div key={idx} className={`p-2.5 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#121826] border border-slate-800 text-slate-300'}`}>
                        {m.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#07090e] border-t border-slate-800/80 px-4 py-3 text-[11px] text-slate-500 text-center flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto w-full gap-2">
        <div>
          <strong className="text-slate-400">Stratum Markets</strong> — Trade Smarter. See Further.
        </div>
        <p className="text-[10px]">
          Simulated trading platform. AI insights are educational and do not constitute financial advice.
        </p>
      </footer>
    </div>
  );
}
