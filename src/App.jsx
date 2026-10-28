import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, Activity, ShieldAlert, BarChart2,
  Layers, Search, CheckCircle2,
  Send, Bot, User, LogIn, FileCheck, ShieldCheck, X,
  Wallet, ArrowDownToLine, ArrowUpFromLine, Users, Gift,
  BookOpen, Sparkles, Award, ExternalLink, RefreshCw,
  Lock, Settings, UserCheck, UserX, Database, Sliders,
  LogOut, Eye, Shield, Globe, Clock, ChevronRight,
  TrendingDown, Check, ArrowRight, DollarSign, Building,
  PieChart, HelpCircle, Compass, Target, Zap, Download
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- COMMOFX EXACT PORTFOLIO ASSETS ---
const COMMOFX_ASSETS = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex', price: 1.0845, change: -0.21, spread: 0.0002, decimals: 4 },
  { symbol: 'GBP/USD', name: 'British Pound / USD', category: 'Forex', price: 1.2715, change: 0.15, spread: 0.0004, decimals: 4 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Forex', price: 154.20, change: 0.42, spread: 0.02, decimals: 2 },
  { symbol: 'AUD/USD', name: 'Australian Dollar / USD', category: 'Forex', price: 0.6540, change: -0.18, spread: 0.0003, decimals: 4 },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'Forex', price: 1.3780, change: 0.12, spread: 0.0003, decimals: 4 },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'Forex', price: 0.8920, change: -0.05, spread: 0.0003, decimals: 4 },
  { symbol: 'XAU/USD', name: 'Spot Gold / US Dollar', category: 'Commodities', price: 2342.80, change: 0.84, spread: 0.40, decimals: 2 },
  { symbol: 'XAG/USD', name: 'Spot Silver / US Dollar', category: 'Commodities', price: 29.40, change: 1.45, spread: 0.02, decimals: 2 },
  { symbol: 'USO/USD', name: 'WTI Crude Oil', category: 'Commodities', price: 81.20, change: 1.15, spread: 0.04, decimals: 2 },
  { symbol: 'NG/USD', name: 'Natural Gas Futures', category: 'Commodities', price: 2.74, change: -1.20, spread: 0.01, decimals: 2 },
  { symbol: 'US30', name: 'Dow Jones Industrial 30', category: 'Indices', price: 39120.00, change: 0.32, spread: 2.0, decimals: 2 },
  { symbol: 'US100', name: 'Nasdaq 100 Tech Index', category: 'Indices', price: 19840.00, change: 0.94, spread: 1.5, decimals: 2 }
];

// --- INITIAL REGISTERED CLIENTS DATABASE ---
const INITIAL_USERS_DB = [
  {
    id: 'CFX-101',
    name: 'Rahul Sharma',
    email: 'rahul@client.com',
    password: 'password123',
    role: 'customer',
    balance: 85400.00,
    allocatedInPools: 15000.00,
    kycStatus: 'verified',
    referralCode: 'CFX-RAHUL',
    referralEarnings: 2150.00,
    trades: [
      { id: 'TX-801', symbol: 'XAU/USD', side: 'BUY', units: 1.5, leverage: 10, entryPrice: 2335.20 },
      { id: 'TX-802', symbol: 'EUR/USD', side: 'BUY', units: 2.0, leverage: 20, entryPrice: 1.0820 }
    ],
    ledger: [
      { id: 'LED-01', date: '2026-10-20', type: 'Deposit', amount: 50000, method: 'National Wire', status: 'Approved' },
      { id: 'LED-02', date: '2026-10-25', type: 'Deposit', amount: 35400, method: 'USDT (TRC20)', status: 'Approved' }
    ]
  },
  {
    id: 'CFX-102',
    name: 'Pooja Patel',
    email: 'pooja@client.com',
    password: 'password123',
    role: 'customer',
    balance: 42000.00,
    allocatedInPools: 5000.00,
    kycStatus: 'pending',
    referralCode: 'CFX-POOJA',
    referralEarnings: 620.00,
    trades: [
      { id: 'TX-803', symbol: 'USO/USD', side: 'SELL', units: 3.0, leverage: 10, entryPrice: 82.50 }
    ],
    ledger: [
      { id: 'LED-03', date: '2026-10-22', type: 'Deposit', amount: 42000, method: 'Crypto Transfer', status: 'Approved' }
    ]
  },
  {
    id: 'CFX-103',
    name: 'Amit Deshmukh',
    email: 'amit@client.com',
    password: 'password123',
    role: 'customer',
    balance: 145000.00,
    allocatedInPools: 25000.00,
    kycStatus: 'verified',
    referralCode: 'CFX-AMIT',
    referralEarnings: 4800.00,
    trades: [
      { id: 'TX-804', symbol: 'US30', side: 'BUY', units: 1.0, leverage: 10, entryPrice: 38950.00 }
    ],
    ledger: [
      { id: 'LED-04', date: '2026-10-18', type: 'Deposit', amount: 145000, method: 'Prime Transfer', status: 'Approved' }
    ]
  }
];

const STAFF_ACCOUNTS = [
  {
    id: 'STAFF-AUDIT',
    name: 'Compliance Sub-Admin',
    email: 'subadmin@commofx.com',
    password: 'subadminpass',
    role: 'subadmin'
  },
  {
    id: 'STAFF-ADMIN',
    name: 'Managing Director & Super Admin',
    email: 'admin@commofx.com',
    password: 'adminpass',
    role: 'admin'
  }
];

export default function App() {
  const [activeView, setActiveView] = useState('website'); // 'website' | 'signin' | 'register' | 'portal'
  const [usersDb, setUsersDb] = useState(INITIAL_USERS_DB);
  const [currentUser, setCurrentUser] = useState(null);

  const [selectedRole, setSelectedRole] = useState('customer');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');

  const [assets, setAssets] = useState(COMMOFX_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState(COMMOFX_ASSETS[6]);
  const [tradeUnits, setTradeUnits] = useState(1.0);
  const [tradeLeverage, setTradeLeverage] = useState(10);
  const [tradeSide, setTradeSide] = useState('BUY');

  const [customerTab, setCustomerTab] = useState('trade');

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install CommoFx app on your phone, open your browser menu and tap "Add to Home screen".');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => {
          const delta = (Math.random() - 0.495) * 0.0016;
          const newPrice = Number((a.price * (1 + delta)).toFixed(a.decimals));
          return {
            ...a,
            price: newPrice,
            change: Number((a.change + delta * 100).toFixed(2))
          };
        })
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fresh = assets.find((a) => a.symbol === selectedAsset.symbol);
    if (fresh) setSelectedAsset(fresh);
  }, [assets, selectedAsset.symbol]);

  const candleData = useMemo(() => {
    const points = [];
    let base = selectedAsset.price * 0.985;
    for (let i = 0; i < 20; i++) {
      const open = base;
      const variation = (Math.random() - 0.48) * (selectedAsset.price * 0.004);
      const close = open + variation;
      const high = Math.max(open, close) + Math.random() * (selectedAsset.price * 0.002);
      const low = Math.min(open, close) - Math.random() * (selectedAsset.price * 0.002);
      points.push({ i, open, close, high, low });
      base = close;
    }
    points[points.length - 1].close = selectedAsset.price;
    return points;
  }, [selectedAsset.symbol]);

  const handleSignIn = (e) => {
    e.preventDefault();
    setAuthErrorMessage('');

    if (selectedRole === 'admin' || selectedRole === 'subadmin') {
      const staff = STAFF_ACCOUNTS.find(
        (s) => s.email.toLowerCase() === inputEmail.toLowerCase() && s.password === inputPassword && s.role === selectedRole
      );
      if (staff) {
        setCurrentUser(staff);
        setActiveView('portal');
        return;
      }
      setAuthErrorMessage(`Invalid ${selectedRole.toUpperCase()} credentials.`);
      return;
    }

    const customer = usersDb.find(
      (u) => u.email.toLowerCase() === inputEmail.toLowerCase() && u.password === inputPassword
    );
    if (customer) {
      setCurrentUser(customer);
      setActiveView('portal');
      return;
    }

    setAuthErrorMessage('Invalid Customer Email or Password.');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthErrorMessage('');

    if (usersDb.some((u) => u.email.toLowerCase() === inputEmail.toLowerCase())) {
      setAuthErrorMessage('An account with this email is already registered.');
      return;
    }

    const newClient = {
      id: `CFX-${Math.floor(100 + Math.random() * 900)}`,
      name: inputName || 'Valued Trader',
      email: inputEmail,
      password: inputPassword,
      role: 'customer',
      balance: 100000.00,
      allocatedInPools: 0.00,
      kycStatus: 'pending',
      referralCode: `CFX-${Math.floor(1000 + Math.random() * 9000)}`,
      referralEarnings: 0.00,
      trades: [],
      ledger: []
    };

    setUsersDb([newClient, ...usersDb]);
    setCurrentUser(newClient);
    setActiveView('portal');
  };

  const handleExecuteTrade = () => {
    if (!currentUser || currentUser.role !== 'customer') return;
    const reqMargin = (selectedAsset.price * tradeUnits) / tradeLeverage;
    if (reqMargin > currentUser.balance) {
      alert('Insufficient wallet margin.');
      return;
    }

    const newTx = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      symbol: selectedAsset.symbol,
      side: tradeSide,
      units: Number(tradeUnits),
      leverage: Number(tradeLeverage),
      entryPrice: selectedAsset.price
    };

    const updated = {
      ...currentUser,
      balance: currentUser.balance - 2.0,
      trades: [newTx, ...(currentUser.trades || [])]
    };

    setCurrentUser(updated);
    setUsersDb((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const handleCloseTrade = (tradeId) => {
    if (!currentUser || currentUser.role !== 'customer') return;
    const filtered = currentUser.trades.filter((t) => t.id !== tradeId);
    const updated = {
      ...currentUser,
      balance: currentUser.balance + 35.00,
      trades: filtered
    };
    setCurrentUser(updated);
    setUsersDb((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const handleAdminModifyBalance = (userId) => {
    const val = prompt('Enter new balance for client (USD):');
    if (!val || isNaN(val)) return;
    setUsersDb((prev) => prev.map((u) => (u.id === userId ? { ...u, balance: parseFloat(val) } : u)));
  };

  const handleAdminToggleKyc = (userId, currentKyc) => {
    const toggled = currentKyc === 'verified' ? 'pending' : 'verified';
    setUsersDb((prev) => prev.map((u) => (u.id === userId ? { ...u, kycStatus: toggled } : u)));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* NAVBAR WITH ELEVATED BRAND EMBLEM */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Framed Pill Emblem (Eliminates the raw rectangle look) */}
          <button onClick={() => setActiveView('website')} className="flex items-center gap-3 text-left group">
            <div className="h-10 px-2 py-1 bg-slate-900 border border-amber-400/40 rounded-xl flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:border-amber-400 transition">
              <img
                src="/commofx-logo.png"
                alt="COMMOFX"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-blue-950 block leading-none">
                COMMOFX
              </span>
              <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest block mt-0.5">
                CLIENT-FIRST FINANCIAL SOLUTIONS
              </span>
            </div>
          </button>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <button onClick={() => setActiveView('website')} className="hover:text-blue-600 transition">About CommoFx</button>
            <button onClick={() => setActiveView('website')} className="hover:text-blue-600 transition">Why We Earn</button>
            <button onClick={() => setActiveView('website')} className="hover:text-blue-600 transition">Currencies & Metals</button>
            <button onClick={() => setActiveView('website')} className="hover:text-blue-600 transition">How FX Works</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleInstallClick}
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Install App</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('portal')}
                  className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  {currentUser.role.toUpperCase()} WORKSPACE
                </button>
                <button
                  onClick={() => { setCurrentUser(null); setActiveView('website'); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setActiveView('signin'); setAuthErrorMessage(''); }}
                  className="text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveView('register'); setAuthErrorMessage(''); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm shadow-blue-500/20"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Market Price Tape */}
        <div className="bg-slate-900 text-white py-1 px-4 overflow-x-auto text-[11px] font-mono border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center gap-7 whitespace-nowrap">
            <span className="text-blue-400 font-sans font-bold text-[10px] uppercase flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> CommoFx Feed:
            </span>
            {assets.slice(0, 8).map((item) => (
              <span key={item.symbol} className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-200">{item.symbol}</span>
                <span className="text-slate-400">{item.price.toFixed(item.decimals)}</span>
                <span className={`text-[10px] ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* 1. PUBLIC WEBSITE */}
      {activeView === 'website' && (
        <div className="flex-1 space-y-16 pb-20">
          {/* HERO SECTION WITH POLISHED SHIELD EMBLEM */}
          <section className="bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-10 pb-16 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
              
              {/* Framed Glowing Card (Seamless Integration) */}
              <div className="inline-block p-2 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-400/30 shadow-2xl shadow-blue-900/15">
                <img
                  src="/commofx-logo.png"
                  alt="COMMOFX"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="h-28 sm:h-36 w-auto object-contain rounded-2xl"
                />
              </div>

              <div>
                <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
                  COMMOFX • CLIENT-FIRST FINANCIAL SOLUTIONS
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
                Transforming the Global <br />
                <span className="text-blue-600">Forex & Commodities Landscape</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Empowering individuals and institutions with high-liquidity currency pairs, gold, crude oil, and transparent margin execution.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-500/25 flex items-center gap-2"
                >
                  Open Client Account <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveView('signin')}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm border border-slate-300 transition shadow-sm"
                >
                  Access Trading Portal
                </button>
              </div>
            </div>
          </section>

          {/* WHY WE EARN & WHAT WE DO */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Financial Purpose</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Why We Earn?</h2>
                  <p className="text-xs text-slate-500 mt-1">The fundamental drivers behind modern wealth building.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: 'Better Future', desc: 'Long-term security and multi-generational family stability.' },
                    { title: 'Financial Freedom', desc: 'Independence from single-income debt cycles.' },
                    { title: 'Basic Needs', desc: 'Secure housing, education, and essential living comfort.' },
                    { title: 'Lifestyle & Travel', desc: 'Enjoying life, world holiday travel, and personal experiences.' },
                    { title: 'Health & Wellness', desc: 'High-standard healthcare and physical peace of mind.' },
                    { title: 'Capital Growth', desc: 'Strategic capital compounding across global assets.' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.title}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Our Strategic Lifecycle</span>
                  <h2 className="text-2xl font-black mt-1">WHAT WE DO?</h2>
                  <p className="text-xs text-blue-200 mt-1">A structured four-step journey to convert income into sustainable market equity.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { step: '01', title: 'WE SPEND', desc: 'Prudent budgeting and essential cash flow control.' },
                    { step: '02', title: 'WE SAVE', desc: 'Systematic liquidity reserves for emergency readiness.' },
                    { step: '03', title: 'WE UTILIZE', desc: 'Capital deployment into productive tools and infrastructure.' },
                    { step: '04', title: 'WE INVEST', desc: 'Strategic high-conviction allocations in Forex and Commodities.' }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-white/10 border border-white/10 p-4 rounded-2xl space-y-1 backdrop-blur-sm">
                      <span className="text-blue-300 text-xs font-black font-mono">{s.step}</span>
                      <h3 className="font-bold text-sm tracking-wide">{s.title}</h3>
                      <p className="text-[11px] text-blue-100 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-blue-200 border-t border-white/10 pt-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  CommoFx delivers client-first fund management with institutional risk parameters.
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT COMMOFX */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Corporate Profile</span>
                <h2 className="text-3xl font-extrabold text-slate-900">About COMMOFX</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  At <strong>COMMOFX</strong>, we are committed to transforming the investment landscape with our client-first approach and innovative financial solutions. Our team of experienced professionals leverages cutting-edge technology and in-depth market insights to maximize returns and drive sustainable growth.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We prioritize integrity, transparency, and excellence in every aspect of our operations, ensuring that our clients' financial goals are met and exceeded. Join us at CommoFx, where your financial future is our mission.
                </p>
              </div>
              <div className="lg:col-span-4 bg-blue-50 rounded-2xl p-6 border border-blue-200 text-center space-y-3">
                <div className="text-5xl">🐂</div>
                <h3 className="font-bold text-slate-900 text-sm">Institutional Liquidity</h3>
                <p className="text-xs text-slate-500">
                  Continuous multi-asset market making across Forex majors and physical commodities.
                </p>
              </div>
            </div>
          </section>

          {/* VISION & MISSION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                  <Compass className="w-4 h-4" /> Strategic Horizon
                </div>
                <h3 className="text-2xl font-black text-slate-900">Our Vision</h3>
                <div className="space-y-3 pt-2">
                  {[
                    'To be the most trusted and preferred fund management platform worldwide.',
                    'Delivering unparalleled service and tailored solutions to meet our clients\' unique financial goals.',
                    'Upholding the highest standards of ethics and accountability in all our financial operations.'
                  ].map((v, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-slate-600">
                      <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4" /> Operational Mandate
                </div>
                <h3 className="text-2xl font-black text-slate-900">Our Mission</h3>
                <div className="space-y-3 pt-2">
                  {[
                    'Strategically manage investments to achieve optimal financial performance for our clients.',
                    'Continuously enhance our services through cutting-edge technology and market insights.',
                    'Foster trust and loyalty by prioritizing client needs and delivering consistent results.'
                  ].map((m, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-slate-600">
                      <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* COMMODITIES & CURRENCIES */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">CommoFx Instrument Registry</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Assets Invested Through COMMOFX</h2>
              <p className="text-xs text-slate-500 max-w-xl mx-auto">
                Direct portfolio exposure into G7 currencies, physical precious metals, energy futures, and benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">Currencies (Forex)</h3>
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">7 Majors</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                  {[
                    { code: 'EUR', name: 'European Euro' },
                    { code: 'USD', name: 'United States Dollar' },
                    { code: 'CAD', name: 'Canadian Dollar' },
                    { code: 'AUD', name: 'Australian Dollar' },
                    { code: 'JPY', name: 'Japanese Yen' },
                    { code: 'CHF', name: 'Swiss Franc' },
                    { code: 'GBP', name: 'Great British Pound' }
                  ].map((c) => (
                    <div key={c.code} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900">{c.code}</span>
                      <span className="text-slate-500 text-[11px] font-sans">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">Commodities</h3>
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">Metals & Energy</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                  {[
                    { symbol: 'XAUUSD', name: 'Spot Gold' },
                    { symbol: 'XAGUSD', name: 'Spot Silver' },
                    { symbol: 'USOUSD', name: 'Crude Oil (WTI)' },
                    { symbol: 'NG', name: 'Natural Gas Futures' }
                  ].map((cm) => (
                    <div key={cm.symbol} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-900">{cm.symbol}</span>
                      <span className="text-slate-500 text-[11px] font-sans">{cm.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">Indices & Features</h3>
                  <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Wall Street</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <strong className="text-slate-900">US 30</strong>
                    <span className="text-slate-500 font-sans">Dow Jones Industrial</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <strong className="text-slate-900">US 100</strong>
                    <span className="text-slate-500 font-sans">Nasdaq Tech Index</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                  <strong className="text-slate-800 block">Key Trading Features:</strong>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> 24 Hours Active Market</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> No Forced Liquidation</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> On-Time Account Withdrawals</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600" /> Macro Economic Events Driven</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. SIGN IN PAGE */}
      {activeView === 'signin' && (
        <div className="flex-1 flex items-center justify-center p-4 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block p-1.5 rounded-2xl bg-slate-950 border border-amber-400/30">
                <img
                  src="/commofx-logo.png"
                  alt="CommoFx"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="h-14 w-auto mx-auto object-contain"
                />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Portal Login</h2>
              <p className="text-xs text-slate-500">Sign in to your designated workspace</p>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`py-2 rounded-lg text-center transition ${selectedRole === 'customer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('subadmin')}
                className={`py-2 rounded-lg text-center transition ${selectedRole === 'subadmin' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-amber-600'}`}
              >
                Sub-Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 rounded-lg text-center transition ${selectedRole === 'admin' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-600'}`}
              >
                Super Admin
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1.5">
              <span className="font-bold text-slate-600 block">Click to Auto-fill Demo Credentials:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => { setSelectedRole('customer'); setInputEmail('rahul@client.com'); setInputPassword('password123'); }}
                  className="bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-600 font-semibold"
                >
                  Customer (Rahul)
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole('customer'); setInputEmail('pooja@client.com'); setInputPassword('password123'); }}
                  className="bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-600 font-semibold"
                >
                  Customer (Pooja)
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole('subadmin'); setInputEmail('subadmin@commofx.com'); setInputPassword('subadminpass'); }}
                  className="bg-white border border-slate-200 px-2 py-0.5 rounded text-amber-600 font-semibold"
                >
                  Sub-Admin
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole('admin'); setInputEmail('admin@commofx.com'); setInputPassword('adminpass'); }}
                  className="bg-white border border-slate-200 px-2 py-0.5 rounded text-purple-600 font-semibold"
                >
                  Super Admin
                </button>
              </div>
            </div>

            {authErrorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                {authErrorMessage}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">
                  {selectedRole === 'customer' ? 'Customer Email Address' : `${selectedRole.toUpperCase()} Staff Email`}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@commofx.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Security Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition shadow-lg ${
                  selectedRole === 'admin'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                    : selectedRole === 'subadmin'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                Enter {selectedRole.toUpperCase()} Portal
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              New to CommoFx?{' '}
              <button onClick={() => setActiveView('register')} className="text-blue-600 font-bold hover:underline">
                Create a Free Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. REGISTER PAGE */}
      {activeView === 'register' && (
        <div className="flex-1 flex items-center justify-center p-4 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block p-1.5 rounded-2xl bg-slate-950 border border-amber-400/30">
                <img
                  src="/commofx-logo.png"
                  alt="CommoFx"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="h-14 w-auto mx-auto object-contain"
                />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Create CommoFx Account</h2>
              <p className="text-xs text-slate-500">Instant access to $100,000 simulated capital</p>
            </div>

            {authErrorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                {authErrorMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Choose Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/20"
              >
                Register & Enter Platform
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Already have an account?{' '}
              <button onClick={() => setActiveView('signin')} className="text-blue-600 font-bold hover:underline">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. WORKSPACES: CUSTOMER, SUB-ADMIN, ADMIN */}
      {activeView === 'portal' && currentUser && (
        <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
          {currentUser.role === 'customer' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">CommoFx Client Account</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">{currentUser.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1">
                    <span>{currentUser.email}</span> • <span>ID: {currentUser.id}</span> •{' '}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${currentUser.kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      KYC: {currentUser.kycStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Wallet Equity</span>
                    <strong className="text-xl text-slate-900">${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Managed PAMM</span>
                    <strong className="text-xl text-blue-600">${currentUser.allocatedInPools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold text-slate-600">
                {[
                  { id: 'trade', label: 'Trade Execution' },
                  { id: 'portfolio', label: `My Open Trades (${currentUser.trades ? currentUser.trades.length : 0})` },
                  { id: 'wallet', label: 'Wallet & Ledger' },
                  { id: 'affiliate', label: 'Referral & Partner Code' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCustomerTab(t.id)}
                    className={`px-4 py-2 rounded-lg transition ${customerTab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {customerTab === 'trade' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-lg font-black text-slate-900">{selectedAsset.symbol}</span>
                        <span className="text-xs text-slate-500 ml-2">{selectedAsset.name}</span>
                      </div>
                      <div className="font-mono text-sm font-bold text-slate-900">
                        {selectedAsset.price.toFixed(selectedAsset.decimals)}{' '}
                        <span className={selectedAsset.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          ({selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change}%)
                        </span>
                      </div>
                    </div>

                    <div className="h-56 w-full bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                        <line x1="0" y1="30" x2="300" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1="0" y1="60" x2="300" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1="0" y1="90" x2="300" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" />
                        {candleData.map((c, idx) => {
                          const min = Math.min(...candleData.map((d) => d.low));
                          const max = Math.max(...candleData.map((d) => d.high));
                          const range = max - min || 1;
                          const getY = (val) => 110 - ((val - min) / range) * 95;
                          const isGreen = c.close >= c.open;
                          const color = isGreen ? '#16a34a' : '#dc2626';
                          const x = idx * 15 + 4;
                          return (
                            <g key={idx}>
                              <line x1={x + 3} y1={getY(c.high)} x2={x + 3} y2={getY(c.low)} stroke={color} strokeWidth="1" />
                              <rect x={x} y={Math.min(getY(c.open), getY(c.close))} width="6" height={Math.max(2, Math.abs(getY(c.open) - getY(c.close)))} fill={color} rx="1" />
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="text-[11px] text-slate-500 font-semibold block mb-1">Contract Units</label>
                        <input
                          type="number"
                          step="0.1"
                          value={tradeUnits}
                          onChange={(e) => setTradeUnits(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-semibold block mb-1">Leverage</label>
                        <select
                          value={tradeLeverage}
                          onChange={(e) => setTradeLeverage(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        >
                          <option value="1">1x Cash Spot</option>
                          <option value="10">10x Dynamic</option>
                          <option value="25">25x High</option>
                          <option value="50">50x Prime</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          onClick={() => { setTradeSide('BUY'); handleExecuteTrade(); }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs"
                        >
                          BUY / LONG
                        </button>
                        <button
                          onClick={() => { setTradeSide('SELL'); handleExecuteTrade(); }}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg text-xs"
                        >
                          SELL / SHORT
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm mb-3">CommoFx Instrument Picker</h3>
                      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                        {assets.map((a) => (
                          <div
                            key={a.symbol}
                            onClick={() => setSelectedAsset(a)}
                            className={`p-2.5 flex justify-between items-center cursor-pointer rounded-lg transition ${selectedAsset.symbol === a.symbol ? 'bg-blue-50 border-l-2 border-blue-600' : 'hover:bg-slate-50'}`}
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900">{a.symbol}</div>
                              <div className="text-[10px] text-slate-400">{a.name}</div>
                            </div>
                            <div className="text-right font-mono text-xs">
                              <div className="text-slate-900 font-semibold">{a.price.toFixed(a.decimals)}</div>
                              <div className={`text-[10px] ${a.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{a.change}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {customerTab === 'portfolio' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Your Open Position Contracts</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="p-3">Trade ID</th>
                          <th className="p-3">Asset</th>
                          <th className="p-3">Side</th>
                          <th className="p-3">Units</th>
                          <th className="p-3">Entry Price</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentUser.trades && currentUser.trades.length > 0 ? (
                          currentUser.trades.map((t) => (
                            <tr key={t.id}>
                              <td className="p-3 text-slate-400">{t.id}</td>
                              <td className="p-3 font-bold text-slate-900">{t.symbol}</td>
                              <td className={`p-3 font-bold ${t.side === 'BUY' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.side} {t.leverage}x</td>
                              <td className="p-3">{t.units}</td>
                              <td className="p-3">{t.entryPrice}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleCloseTrade(t.id)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs font-bold"
                                >
                                  Close
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="6" className="p-6 text-center text-slate-400 font-sans">No open trades.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {customerTab === 'wallet' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Your Treasury Ledger</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="p-3">Reference</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Method</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentUser.ledger && currentUser.ledger.length > 0 ? (
                          currentUser.ledger.map((l) => (
                            <tr key={l.id}>
                              <td className="p-3 text-slate-400">{l.id}</td>
                              <td className="p-3">{l.date}</td>
                              <td className="p-3 font-bold">{l.type}</td>
                              <td className="p-3">{l.method}</td>
                              <td className="p-3 font-bold text-slate-900">${l.amount.toLocaleString()}</td>
                              <td className="p-3 text-right text-emerald-600 font-bold">{l.status}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="6" className="p-6 text-center text-slate-400 font-sans">No ledger transactions yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {customerTab === 'affiliate' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Your Referral Partner Dashboard</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-sans block mb-1">Your Unique Referral Code</span>
                      <strong className="text-lg text-blue-600">{currentUser.referralCode}</strong>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-sans block mb-1">Total Commission Earned</span>
                      <strong className="text-lg text-emerald-600">${currentUser.referralEarnings.toFixed(2)} USD</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentUser.role === 'subadmin' && (
            <div className="bg-white border border-amber-300 rounded-3xl shadow-xl p-8 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                    CommoFx Sub-Admin Audit Desk
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Client Accounts Registry (Read-Only)</h2>
                  <p className="text-xs text-slate-500">Inspection mode only. Sub-admin privileges do not authorize records modification or balance updates.</p>
                </div>
                <div className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-semibold flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Non-Editable Mode
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">User ID</th>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Wallet Balance</th>
                      <th className="p-3.5">PAMM Pool</th>
                      <th className="p-3.5">KYC</th>
                      <th className="p-3.5 text-right">Privilege</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersDb.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3.5 text-slate-400">{u.id}</td>
                        <td className="p-3.5 font-bold text-slate-900 font-sans">{u.name}</td>
                        <td className="p-3.5 text-slate-600">{u.email}</td>
                        <td className="p-3.5 font-bold text-slate-900">${u.balance.toLocaleString()}</td>
                        <td className="p-3.5 text-blue-600">${u.allocatedInPools.toLocaleString()}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            {u.kycStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right text-slate-400 font-sans italic text-[11px]">
                          Locked
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentUser.role === 'admin' && (
            <div className="bg-white border border-purple-300 rounded-3xl shadow-xl p-8 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                    Super Admin Root Terminal
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Master Platform Governance</h2>
                  <p className="text-xs text-slate-500">Root administrative authority to mutate balances, clear KYC verifications, and manage users.</p>
                </div>
                <div className="bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200 text-xs font-semibold flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Root Privileges Active
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4">
                  <span className="text-[10px] text-purple-600 block uppercase font-bold">Total Clients Registered</span>
                  <span className="text-2xl font-black font-mono text-purple-950">{usersDb.length}</span>
                </div>
                <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4">
                  <span className="text-[10px] text-blue-600 block uppercase font-bold">Total Client Equity</span>
                  <span className="text-2xl font-black font-mono text-blue-950">
                    ${usersDb.reduce((acc, u) => acc + u.balance, 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
                  <span className="text-[10px] text-emerald-600 block uppercase font-bold">PAMM Managed Funds</span>
                  <span className="text-2xl font-black font-mono text-emerald-950">
                    ${usersDb.reduce((acc, u) => acc + u.allocatedInPools, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex justify-between items-center">
                  <span>Client Balance & KYC Manager</span>
                  <span className="text-[11px] text-purple-600 font-medium">Click buttons below to edit live records</span>
                </div>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Balance</th>
                      <th className="p-3.5">KYC</th>
                      <th className="p-3.5 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersDb.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900 font-sans">{u.name}</td>
                        <td className="p-3.5 text-slate-600">{u.email}</td>
                        <td className="p-3.5 font-bold text-slate-900">${u.balance.toLocaleString()}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            {u.kycStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleAdminModifyBalance(u.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
                          >
                            Edit Balance
                          </button>
                          <button
                            onClick={() => handleAdminToggleKyc(u.id, u.kycStatus)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
                          >
                            {u.kycStatus === 'verified' ? 'Revoke KYC' : 'Approve KYC'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="h-8 px-2 py-1 bg-slate-900 border border-amber-400/40 rounded-lg flex items-center justify-center">
              <img
                src="/commofx-logo.png"
                alt="COMMOFX"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="h-5 w-auto object-contain"
              />
            </div>
            <div>
              <strong className="text-slate-800 font-bold">COMMOFX</strong> — COMMO FOREX
              <p className="text-[11px] text-slate-400">Direct Interbank Liquidity & Commodities Fund Management</p>
            </div>
          </div>
          <div className="text-center sm:text-right text-[10px] text-slate-400">
            24-hour financial market infrastructure. Client-centric fund management.
          </div>
        </div>
      </footer>
    </div>
  );
}
