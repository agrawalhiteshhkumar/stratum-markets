import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, Activity, ShieldAlert, BarChart2,
  Layers, Search, CheckCircle2, Smartphone, Monitor,
  Send, Bot, User, LogIn, FileCheck, ShieldCheck, X,
  Wallet, ArrowDownToLine, ArrowUpFromLine, Users, Gift,
  BookOpen, Sparkles, Award, ExternalLink, RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- MULTI-ASSET MARKET DATA ---
const INITIAL_ASSETS = [
  { symbol: 'XAU/USD', name: 'Spot Gold / USD', category: 'Commodities', price: 2342.80, change: 0.84, spread: 0.40, decimals: 2 },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex', price: 1.0845, change: -0.21, spread: 0.0002, decimals: 4 },
  { symbol: 'GBP/USD', name: 'British Pound / USD', category: 'Forex', price: 1.2715, change: 0.15, spread: 0.0004, decimals: 4 },
  { symbol: 'USO/USD', name: 'Crude Oil WTI', category: 'Commodities', price: 81.20, change: 1.15, spread: 0.04, decimals: 2 },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'Crypto', price: 64820.00, change: 2.35, spread: 20.0, decimals: 2 },
  { symbol: 'US30', name: 'Dow Jones Index', category: 'Indices', price: 39120.00, change: 0.32, spread: 2.0, decimals: 2 },
  { symbol: 'US100', name: 'Nasdaq 100 Index', category: 'Indices', price: 19840.00, change: 0.94, spread: 1.5, decimals: 2 }
];

// --- MANAGED POOLS / SMART PACKAGES ---
const STRATEGY_POOLS = [
  {
    id: 'POOL-1',
    name: 'Algorithmic Forex Alpha',
    asset: 'Forex Pairs (EUR/GBP/USD)',
    targetYield: '1.2% - 1.8% / wk (Simulated)',
    minDeposit: 500,
    lockWeeks: 40,
    risk: 'Moderate',
    subscribers: 1240,
    activeAllocation: 1250000
  },
  {
    id: 'POOL-2',
    name: 'Commodities Hedge & Gold Vault',
    asset: 'Gold (XAU) & Crude (USO)',
    targetYield: '1.5% - 2.2% / wk (Simulated)',
    minDeposit: 2000,
    lockWeeks: 30,
    risk: 'Low-Moderate',
    subscribers: 890,
    activeAllocation: 3400000
  },
  {
    id: 'POOL-3',
    name: 'Global High-Frequency Momentum',
    asset: 'Cross-Asset Indices & FX',
    targetYield: '2.0% - 2.8% / wk (Simulated)',
    minDeposit: 5000,
    lockWeeks: 20,
    risk: 'High',
    subscribers: 420,
    activeAllocation: 4800000
  }
];

export default function App() {
  const [viewMode, setViewMode] = useState('mobile');
  const [mobileTab, setMobileTab] = useState('trade'); // 'trade' | 'markets' | 'pools' | 'affiliate' | 'banking' | 'academy' | 'ai' | 'kyc'
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState(INITIAL_ASSETS[0]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [timeframe, setTimeframe] = useState('15M');

  // Balances & Paper Capital
  const [balance, setBalance] = useState(100000.00);
  const [allocatedInPools, setAllocatedInPools] = useState(15000.00);
  const [userPools, setUserPools] = useState([
    { poolId: 'POOL-2', name: 'Commodities Hedge & Gold Vault', amount: 15000, weeklyYield: '$255.00' }
  ]);

  // Auth & Profile
  const [user, setUser] = useState({
    name: 'Trader Account',
    email: 'trader@stratummarkets.com',
    isLoggedIn: true,
    kycStatus: 'verified', // 'unverified' | 'pending' | 'verified'
    referralCode: 'STRAT-9482',
    referralEarnings: 4250.00,
    referralCount: 14
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', fullName: '' });

  // Banking
  const [bankingAction, setBankingAction] = useState('deposit');
  const [bankingAmount, setBankingAmount] = useState('5000');
  const [bankingNotice, setBankingNotice] = useState('');

  // KYC Submission Form state
  const [kycForm, setKycForm] = useState({
    docType: 'International Passport',
    idNumber: 'A94821039'
  });

  // Trading state
  const [orderSide, setOrderSide] = useState('BUY');
  const [units, setUnits] = useState(1.0);
  const [leverage, setLeverage] = useState(10);
  const [positions, setPositions] = useState([
    { id: 'POS-101', symbol: 'XAU/USD', side: 'BUY', units: 2.0, leverage: 10, entryPrice: 2338.50, margin: 467.70 }
  ]);

  // Stratum Core AI
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to Stratum Core AI™. "Trade Smarter. See Further." How may I assist your market breakdown, portfolio risk audit, or smart package inquiries today?'
    }
  ]);

  // Live market price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          const deltaPct = (Math.random() - 0.495) * 0.0016;
          const newPrice = Math.max(0.0001, asset.price * (1 + deltaPct));
          const roundedPrice = Number(newPrice.toFixed(asset.decimals));
          return {
            ...asset,
            price: roundedPrice,
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

  // Enriched positions & P&L
  const enrichedPositions = useMemo(() => {
    return positions.map((pos) => {
      const match = assets.find((a) => a.symbol === pos.symbol) || selectedAsset;
      const curPrice = match.price;
      const diff = pos.side === 'BUY' ? curPrice - pos.entryPrice : pos.entryPrice - curPrice;
      const pnl = Number((diff * pos.units * pos.leverage).toFixed(2));
      return { ...pos, currentPrice: curPrice, pnl };
    });
  }, [positions, assets, selectedAsset]);

  const totalFloatingPnl = useMemo(() => enrichedPositions.reduce((acc, p) => acc + p.pnl, 0), [enrichedPositions]);
  const equity = balance + allocatedInPools + totalFloatingPnl;
  const marginUsed = enrichedPositions.reduce((acc, p) => acc + p.margin, 0);
  const freeMargin = Math.max(0, balance - marginUsed);

  // SVG Candlestick Data
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
      alert('Insufficient Free Margin in wallet.');
      return;
    }
    const newPos = {
      id: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      symbol: selectedAsset.symbol,
      side: orderSide,
      units: Number(units),
      leverage: Number(leverage),
      entryPrice: selectedAsset.price,
      margin: Number(reqMargin.toFixed(2))
    };
    setPositions([newPos, ...positions]);
  };

  const closePosition = (id) => {
    const pos = enrichedPositions.find((p) => p.id === id);
    if (!pos) return;
    setBalance((prev) => prev + pos.pnl);
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  // Banking simulation
  const handleBankingSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(bankingAmount);
    if (isNaN(amt) || amt <= 0) return;

    if (bankingAction === 'deposit') {
      setBalance((prev) => prev + amt);
      setBankingNotice(`Credited $${amt.toLocaleString()} USD to wallet.`);
    } else {
      if (amt > freeMargin) {
        setBankingNotice('Withdrawal rejected: Amount exceeds available free margin.');
        return;
      }
      setBalance((prev) => prev - amt);
      setBankingNotice(`Withdrawal request for $${amt.toLocaleString()} processed. Instant payout.`);
    }
    setTimeout(() => setBankingNotice(''), 4000);
  };

  // Invest in Managed Pool
  const handleJoinPool = (pool) => {
    if (balance < pool.minDeposit) {
      alert(`Minimum allocation for ${pool.name} is $${pool.minDeposit}.`);
      return;
    }
    setBalance((prev) => prev - pool.minDeposit);
    setAllocatedInPools((prev) => prev + pool.minDeposit);
    setUserPools((prev) => [
      ...prev,
      {
        poolId: pool.id,
        name: pool.name,
        amount: pool.minDeposit,
        weeklyYield: `~$${(pool.minDeposit * 0.015).toFixed(2)}`
      }
    ]);
    alert(`Successfully enrolled in ${pool.name} with $${pool.minDeposit} allocation!`);
  };

  // Stratum Core AI
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
              text: `[Stratum Core AI] ${selectedAsset.symbol} is trading at ${selectedAsset.price}. Momentum indicators suggest accumulation at support. Note: Educational intelligence only.`
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
          systemInstruction: 'You are Stratum Core AI™, market copilot for Stratum Markets. Tagline: Trade Smarter. See Further. Provide sharp, analytical insights on forex, commodities, and risk management with appropriate disclaimers.'
        }
      });

      setAiMessages((prev) => [...prev, { role: 'assistant', text: response.text }]);
    } catch (err) {
      setAiMessages((prev) => [...prev, { role: 'assistant', text: 'Stratum AI Copilot unavailable. Please verify API key.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setUser({
      name: authMode === 'register' ? authForm.fullName || 'New Trader' : 'Authenticated Trader',
      email: authForm.email,
      isLoggedIn: true,
      kycStatus: 'unverified',
      referralCode: 'STRAT-9482',
      referralEarnings: 0.00,
      referralCount: 0
    });
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* BRAND HEADER */}
      <header className="bg-[#0e131f] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-blue-500/30">
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
            MULTI-ASSET & LIQUIDITY ECOSYSTEM
          </span>
        </div>

        {/* Viewport switch and Quick Balance */}
        <div className="flex items-center gap-3">
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

          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px]">
            <span className="text-slate-400">Equity: <strong className="text-white">${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
            <span className={`px-2 py-0.5 rounded ${totalFloatingPnl >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {totalFloatingPnl >= 0 ? '+' : ''}${totalFloatingPnl.toFixed(2)}
            </span>
          </div>

          {user.isLoggedIn ? (
            <button
              onClick={() => setMobileTab('kyc')}
              className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium ${
                user.kycStatus === 'verified'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              KYC: {user.kycStatus}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 text-white px-2.5 py-1 rounded text-[11px] font-bold"
            >
              Sign In
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
                {authMode === 'login' ? 'Sign In to Stratum Markets' : 'Create Trading Account'}
              </h2>
              <p className="text-xs text-blue-400 mt-1">Trade Smarter. See Further.</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Trader Name"
                    value={authForm.fullName}
                    onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                    className="w-full bg-[#161c2c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
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
                  className="w-full bg-[#161c2c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
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
                  className="w-full bg-[#161c2c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg mt-2"
              >
                {authMode === 'login' ? 'Access Terminal' : 'Register Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex justify-center items-stretch p-0 sm:p-4 md:p-6 overflow-x-hidden">
        {viewMode === 'mobile' ? (
          // ================= MOBILE PHONE VIEWPORT =================
          <div className="w-full max-w-[420px] bg-[#0a0d14] rounded-none sm:rounded-[36px] border-0 sm:border-[8px] sm:border-slate-800 shadow-2xl flex flex-col h-[100dvh] sm:h-[840px] relative overflow-hidden">
            {/* Phone Notch */}
            <div className="bg-[#0e1320] pt-2 px-5 pb-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-white">9:41</span>
              <div className="h-4 w-28 bg-black/60 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>5G ULTRA</span>
              </div>
            </div>

            {/* Wallet Quick Summary */}
            <div className="bg-gradient-to-r from-slate-900 to-[#101726] p-3 border-b border-slate-800/80 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Total Equity</span>
                <span className="text-base font-bold font-mono text-white">
                  ${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMobileTab('banking')}
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <Wallet className="w-3 h-3" />
                  Wallet
                </button>
              </div>
            </div>

            {/* Sub-navigation Menu: Clean Compact Grid (Zero Scrollbars) */}
            <div className="grid grid-cols-3 gap-1 bg-[#0d121e] border-b border-slate-800 p-1.5 text-[10px]">
              {[
                { id: 'trade', label: 'Trade' },
                { id: 'markets', label: 'Markets' },
                { id: 'pools', label: 'Packages' },
                { id: 'affiliate', label: 'Affiliates' },
                { id: 'banking', label: 'Vault' },
                { id: 'academy', label: 'Academy' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMobileTab(t.id)}
                  className={`py-1.5 px-2 rounded-lg font-semibold transition text-center ${
                    mobileTab === t.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-[#131929] text-slate-400 hover:text-white border border-slate-800/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Mobile Tab Content */}
            <div className="flex-1 overflow-y-auto pb-20 p-3 space-y-3">
              {/* TAB 1: TRADE TERMINAL */}
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

                  {/* Candlestick Chart */}
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
                      <span className="text-[10px] text-slate-400 font-mono">EMA 20/50 Loaded</span>
                    </div>

                    <div className="h-40 w-full relative pt-2">
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
                    </div>
                  </div>

                  {/* Order Desk */}
                  <div className="bg-[#0f1422] rounded-xl border border-slate-800/80 p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg">
                      <button
                        onClick={() => setOrderSide('BUY')}
                        className={`py-2 rounded font-bold text-xs ${orderSide === 'BUY' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400'}`}
                      >
                        BUY / LONG
                      </button>
                      <button
                        onClick={() => setOrderSide('SELL')}
                        className={`py-2 rounded font-bold text-xs ${orderSide === 'SELL' ? 'bg-rose-600 text-white shadow' : 'text-slate-400'}`}
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
                          onChange={(e) => setUnits(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                          className="w-full bg-[#161c2c] border border-slate-700/80 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Leverage ({leverage}x)</label>
                        <select
                          value={leverage}
                          onChange={(e) => setLeverage(Number(e.target.value))}
                          className="w-full bg-[#161c2c] border border-slate-700/80 rounded-lg px-2 py-1.5 font-mono text-white text-xs"
                        >
                          <option value="1">1x Cash Spot</option>
                          <option value="10">10x Dynamic</option>
                          <option value="25">25x High</option>
                          <option value="50">50x Prime</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleExecuteOrder}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                        orderSide === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      Instant Execute {orderSide}
                    </button>
                  </div>

                  {/* Positions */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-400">
                      <span>Open Contracts ({enrichedPositions.length})</span>
                      <span className="font-mono">Floating: ${totalFloatingPnl.toFixed(2)}</span>
                    </div>
                    {enrichedPositions.map((p) => (
                      <div key={p.id} className="bg-[#0f1422] border border-slate-800 rounded-xl p-2.5 flex justify-between items-center text-xs font-mono">
                        <div>
                          <div className="font-bold text-white">{p.symbol} ({p.side})</div>
                          <div className="text-[10px] text-slate-400">Entry: {p.entryPrice} | Units: {p.units}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${p.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}
                          </div>
                          <button onClick={() => closePosition(p.id)} className="text-[10px] text-slate-400 hover:text-white underline">
                            Close
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: MARKETS */}
              {mobileTab === 'markets' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      className="w-full bg-[#121826] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="divide-y divide-slate-800 rounded-xl bg-[#0f1422] border border-slate-800 overflow-hidden">
                    {assets.map((item) => (
                      <div
                        key={item.symbol}
                        onClick={() => {
                          setSelectedAsset(item);
                          setMobileTab('trade');
                        }}
                        className="p-3 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer"
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

              {/* TAB 3: SMART PACKAGES */}
              {mobileTab === 'pools' && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-900/30 to-slate-900 border border-blue-500/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-1">
                      <Sparkles className="w-4 h-4" />
                      Managed Strategy Pools & Smart Packages
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Participate in multi-asset quantitative trading portfolios managed by algorithmic high-frequency models.
                    </p>
                  </div>

                  {STRATEGY_POOLS.map((pool) => (
                    <div key={pool.id} className="bg-[#0f1422] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-xs text-white">{pool.name}</div>
                          <div className="text-[10px] text-slate-400">{pool.asset}</div>
                        </div>
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20">
                          {pool.targetYield}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 bg-[#141a29] p-2 rounded-lg">
                        <div>Min Deposit: <strong className="text-white">${pool.minDeposit}</strong></div>
                        <div>Duration: <strong className="text-white">{pool.lockWeeks} Weeks</strong></div>
                        <div>Active Liquidity: <strong className="text-white">${(pool.activeAllocation / 1000000).toFixed(1)}M</strong></div>
                        <div>Risk Tier: <strong className="text-amber-400">{pool.risk}</strong></div>
                      </div>

                      <button
                        onClick={() => handleJoinPool(pool)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs transition"
                      >
                        Enroll with ${pool.minDeposit.toLocaleString()} Virtual
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: AFFILIATE */}
              {mobileTab === 'affiliate' && (
                <div className="space-y-3">
                  <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-blue-400" />
                        Affiliate & Community Rewards
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        Tier 1 Partner
                      </span>
                    </div>

                    <div className="bg-[#141a29] p-2.5 rounded-lg border border-slate-700/60 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Your Referral Code</span>
                        <span className="font-mono text-xs font-bold text-white tracking-wider">{user.referralCode}</span>
                      </div>
                      <button
                        onClick={() => alert(`Copied referral link: https://stratum-markets.vercel.app?ref=${user.referralCode}`)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-2.5 py-1 rounded font-bold"
                      >
                        Copy Link
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-[#121826] p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Referred Traders</span>
                        <span className="text-sm font-bold text-white">{user.referralCount}</span>
                      </div>
                      <div className="bg-[#121826] p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Commission Earned</span>
                        <span className="text-sm font-bold text-emerald-400">${user.referralEarnings.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-2 space-y-1.5 text-[11px]">
                      <span className="font-bold text-slate-300 block">Reward Tiers Breakdown:</span>
                      <div className="flex justify-between text-slate-400">
                        <span>Direct Referrals (Level 1):</span>
                        <span className="font-mono text-white font-bold">10% - 15%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Sub-Affiliate (Level 2):</span>
                        <span className="font-mono text-white font-bold">8% - 10%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Team Network (Level 3+):</span>
                        <span className="font-mono text-white font-bold">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: BANKING & VAULT */}
              {mobileTab === 'banking' && (
                <div className="space-y-3">
                  <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-blue-400" />
                        Treasury & Banking Gateway
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Available: ${freeMargin.toFixed(2)}</span>
                    </div>

                    {bankingNotice && (
                      <div className="p-2.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs">
                        {bankingNotice}
                      </div>
                    )}

                    <form onSubmit={handleBankingSubmit} className="space-y-2.5 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setBankingAction('deposit')}
                          className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1 ${
                            bankingAction === 'deposit' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                          Deposit Funds
                        </button>
                        <button
                          type="button"
                          onClick={() => setBankingAction('withdraw')}
                          className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1 ${
                            bankingAction === 'withdraw' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <ArrowUpFromLine className="w-3.5 h-3.5" />
                          Withdraw
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Transfer Amount (USD)</label>
                        <input
                          type="number"
                          value={bankingAmount}
                          onChange={(e) => setBankingAmount(e.target.value)}
                          className="w-full bg-[#161c2c] border border-slate-700 rounded-lg p-2 font-mono text-white text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
                      >
                        Confirm {bankingAction === 'deposit' ? 'Simulated Deposit' : 'Instant Withdrawal'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 6: ACADEMY */}
              {mobileTab === 'academy' && (
                <div className="space-y-3">
                  <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      Stratum Financial Academy
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="bg-[#141a29] p-2.5 rounded-lg border border-slate-700/60">
                        <div className="font-bold text-white">What is Forex?</div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                          Forex (Foreign Exchange) is a decentralized global market with over $6.6 Trillion daily turnover. Currencies are traded in pairs (e.g., EUR/USD).
                        </p>
                      </div>
                      <div className="bg-[#141a29] p-2.5 rounded-lg border border-slate-700/60">
                        <div className="font-bold text-white">Commodities & Gold (XAU/USD)</div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                          Commodities like Gold and Crude Oil act as macro hedges against inflation and dollar depreciation, driven by global supply and demand.
                        </p>
                      </div>
                      <div className="bg-[#141a29] p-2.5 rounded-lg border border-slate-700/60">
                        <div className="font-bold text-white">AI-Assisted Quantitative Execution</div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                          Machine learning algorithms scan real-time order books, identify candlestick patterns, and calculate real-time Value-at-Risk (VaR).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: KYC / AML COMPLIANCE */}
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
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}>
                        {user.kycStatus}
                      </span>
                    </div>

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
                        <label className="text-[10px] text-slate-400 block mb-1">Document ID Number</label>
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
                          alert('KYC submitted for review.');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs transition mt-1"
                      >
                        Submit Documents
                      </button>
                    </div>

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
            </div>

            {/* STICKY BOTTOM NAV BAR */}
            <nav className="absolute bottom-0 left-0 right-0 bg-[#0c101a]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex justify-around items-center z-40">
              {[
                { id: 'trade', label: 'Trade', icon: TrendingUp },
                { id: 'markets', label: 'Markets', icon: BarChart2 },
                { id: 'pools', label: 'Packages', icon: Layers },
                { id: 'affiliate', label: 'Affiliate', icon: Users },
                { id: 'banking', label: 'Wallet', icon: Wallet }
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
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          // ================= DESKTOP WORKSTATION =================
          <div className="w-full max-w-7xl bg-[#0a0d14] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-[#0d121e] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-6">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Stratum Multi-Asset Workstation
                </span>
                <div className="flex items-center gap-4 font-mono text-slate-400">
                  <span>Cash: <strong className="text-white">${balance.toFixed(2)}</strong></span>
                  <span>In Pools: <strong className="text-white">${allocatedInPools.toFixed(2)}</strong></span>
                  <span>Total Equity: <strong className="text-emerald-400">${equity.toFixed(2)}</strong></span>
                </div>
              </div>
              <span className="text-[11px] text-blue-400 font-medium">"Trade Smarter. See Further."</span>
            </div>

            <div className="flex-1 grid grid-cols-12 divide-x divide-slate-800 min-h-[580px]">
              {/* Screener */}
              <div className="col-span-3 flex flex-col bg-[#0b0f19]">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-300">
                  <span>Market Screener</span>
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

              {/* Chart & Intelligence */}
              <div className="col-span-6 flex flex-col bg-[#080b12]">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-white">{selectedAsset.symbol}</span>
                    <span className="text-xs text-slate-400">{selectedAsset.name}</span>
                  </div>
                  <div className="font-mono text-xs text-white font-bold">
                    {selectedAsset.price.toFixed(selectedAsset.decimals)}
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

                {/* Bottom Positions */}
                <div className="h-44 border-t border-slate-800 bg-[#0a0d17] p-3 flex flex-col">
                  <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-300">
                    <span>Active Contracts ({enrichedPositions.length})</span>
                    <span className="font-mono text-slate-400">Total Floating: ${totalFloatingPnl.toFixed(2)}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="pb-1">ID</th>
                          <th className="pb-1">Symbol</th>
                          <th className="pb-1">Side</th>
                          <th className="pb-1">Units</th>
                          <th className="pb-1">P&L</th>
                          <th className="pb-1 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {enrichedPositions.map((p) => (
                          <tr key={p.id}>
                            <td className="py-1.5 text-slate-400">{p.id}</td>
                            <td className="py-1.5 font-bold text-white">{p.symbol}</td>
                            <td className={`py-1.5 font-bold ${p.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>{p.side}</td>
                            <td className="py-1.5">{p.units}</td>
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

              {/* Execution & Copilot */}
              <div className="col-span-3 flex flex-col bg-[#0b0f19] divide-y divide-slate-800">
                <div className="p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase block">Trade Execution</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setOrderSide('BUY')} className={`py-2 rounded font-bold text-xs ${orderSide === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      BUY
                    </button>
                    <button onClick={() => setOrderSide('SELL')} className={`py-2 rounded font-bold text-xs ${orderSide === 'SELL' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
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
                  <button
                    onClick={handleExecuteOrder}
                    className={`w-full py-2 rounded font-bold text-xs text-white shadow ${
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
          Simulated trading, managed pool testing & market intelligence platform.
        </p>
      </footer>
    </div>
  );
}
