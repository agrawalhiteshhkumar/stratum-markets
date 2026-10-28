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
  PieChart, HelpCircle, Compass, Target, Zap, Download,
  UploadCloud, AlertTriangle, FileText, CreditCard, CheckCircle,
  IndianRupee, ArrowLeftRight
} from 'lucide-react';

// Live Pegged Exchange Rate (1 USD = 90 INR)
const USD_INR_RATE = 90.00;

// --- COMMOFX ASSETS ---
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

// Internal staff accounts
const STAFF_ACCOUNTS = [
  {
    id: 'STAFF-SUB',
    name: 'Compliance Officer',
    email: 'subadmin@commofx.com',
    password: 'subadminpass',
    role: 'subadmin'
  },
  {
    id: 'STAFF-SUPER',
    name: 'Root Administrator',
    email: 'admin@commofx.com',
    password: 'adminpass',
    role: 'admin'
  }
];

export default function App() {
  const [activeView, setActiveView] = useState('website'); // 'website' | 'signin' | 'register' | 'portal'

  // Persistent Client Database
  const [usersDb, setUsersDb] = useState(() => {
    try {
      const saved = localStorage.getItem('cfx_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Global Deposit Requests Queue
  const [depositRequests, setDepositRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('cfx_deposit_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cfx_registered_users', JSON.stringify(usersDb));
  }, [usersDb]);

  useEffect(() => {
    localStorage.setItem('cfx_deposit_requests', JSON.stringify(depositRequests));
  }, [depositRequests]);

  const [currentUser, setCurrentUser] = useState(null);

  // Authentication Fields
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');

  // Registration KYC Document States
  const [regDocType, setRegDocType] = useState('PAN Card');
  const [regDocNumber, setRegDocNumber] = useState('');
  const [regFileName, setRegFileName] = useState('');

  // Client Deposit Request Inputs (INR & USD Dual State)
  const [depositInr, setDepositInr] = useState('90000');
  const [paymentGateway, setPaymentGateway] = useState('UPI / Instant Transfer (BHIM, GPay, PhonePe)');
  const [txRefNumber, setTxRefNumber] = useState('');
  const [depositNotice, setDepositNotice] = useState('');

  // Converted USD based on INR input
  const convertedUsd = useMemo(() => {
    const val = parseFloat(depositInr) || 0;
    return (val / USD_INR_RATE).toFixed(2);
  }, [depositInr]);

  // Market & Trading State
  const [assets, setAssets] = useState(COMMOFX_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState(COMMOFX_ASSETS[6]);
  const [tradeUnits, setTradeUnits] = useState(1.0);
  const [tradeLeverage, setTradeLeverage] = useState(10);
  const [tradeSide, setTradeSide] = useState('BUY');

  const [customerTab, setCustomerTab] = useState('trade'); // 'trade' | 'deposit' | 'portfolio' | 'wallet'

  // PWA Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install CommoFx app on mobile: Tap your browser menu and choose "Add to Home screen".');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Live price fluctuations
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

  // Keep active user session in sync with updates made by Super Admin
  useEffect(() => {
    if (currentUser && currentUser.role === 'customer') {
      const updated = usersDb.find((u) => u.id === currentUser.id);
      if (updated) {
        if (updated.balance !== currentUser.balance || updated.kycStatus !== currentUser.kycStatus || updated.ledger?.length !== currentUser.ledger?.length) {
          setCurrentUser(updated);
        }
      }
    }
  }, [usersDb, currentUser]);

  // SVG Candlestick Generator
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

  // Single Sign-In Handler
  const handleUnifiedSignIn = (e) => {
    e.preventDefault();
    setAuthErrorMessage('');
    const emailClean = inputEmail.trim().toLowerCase();

    const staffMatch = STAFF_ACCOUNTS.find(
      (s) => s.email.toLowerCase() === emailClean && s.password === inputPassword
    );
    if (staffMatch) {
      setCurrentUser(staffMatch);
      setActiveView('portal');
      setInputEmail('');
      setInputPassword('');
      return;
    }

    const customerMatch = usersDb.find(
      (u) => u.email.toLowerCase() === emailClean && u.password === inputPassword
    );
    if (customerMatch) {
      setCurrentUser(customerMatch);
      setActiveView('portal');
      setInputEmail('');
      setInputPassword('');
      return;
    }

    setAuthErrorMessage('Invalid email or password. Please verify your credentials or register a new account.');
  };

  // Client Registration (Zero Balance Starting Point)
  const handleRegisterWithKyc = (e) => {
    e.preventDefault();
    setAuthErrorMessage('');
    const emailClean = inputEmail.trim().toLowerCase();

    if (usersDb.some((u) => u.email.toLowerCase() === emailClean) || STAFF_ACCOUNTS.some((s) => s.email.toLowerCase() === emailClean)) {
      setAuthErrorMessage('An account with this email already exists. Please Sign In.');
      return;
    }

    if (!regDocNumber.trim()) {
      setAuthErrorMessage('Please enter your document identification number.');
      return;
    }

    const newCustomer = {
      id: `CFX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: inputName.trim(),
      email: emailClean,
      password: inputPassword,
      role: 'customer',
      balance: 0.00,
      allocatedInPools: 0.00,
      kycStatus: 'pending',
      kycDocument: {
        type: regDocType,
        number: regDocNumber.trim(),
        filename: regFileName || `${regDocType.replace(/\s+/g, '_')}_Document.pdf`,
        submittedAt: new Date().toISOString().split('T')[0]
      },
      referralCode: `CFX-${Math.floor(10000 + Math.random() * 90000)}`,
      trades: [],
      ledger: [
        { id: `INIT-${Math.floor(100 + Math.random() * 900)}`, date: new Date().toISOString().split('T')[0], type: 'Account Opened', method: 'System Onboarding', amount: 0.00, status: 'Active (Zero Balance)' }
      ]
    };

    setUsersDb([newCustomer, ...usersDb]);
    setCurrentUser(newCustomer);
    setActiveView('portal');
    setInputEmail('');
    setInputPassword('');
    setInputName('');
    setRegDocNumber('');
    setRegFileName('');
  };

  // Client Submits Fund Request (Stores Both INR and USD)
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    setDepositNotice('');

    const inrVal = parseFloat(depositInr);
    const usdVal = parseFloat(convertedUsd);

    if (isNaN(inrVal) || inrVal <= 0) {
      alert('Please enter a valid deposit amount in INR.');
      return;
    }

    if (!txRefNumber.trim()) {
      alert('Please provide the Payment Reference / Transaction ID.');
      return;
    }

    const newRequest = {
      id: `DEP-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amountInr: inrVal,
      amountUsd: usdVal,
      gateway: paymentGateway,
      txRef: txRefNumber.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setDepositRequests([newRequest, ...depositRequests]);

    const pendingLedgerItem = {
      id: newRequest.id,
      date: newRequest.date,
      type: 'Deposit Request',
      method: `${paymentGateway} (₹${inrVal.toLocaleString('en-IN')})`,
      amount: usdVal,
      status: 'Pending Admin Approval'
    };

    const updatedUser = {
      ...currentUser,
      ledger: [pendingLedgerItem, ...(currentUser.ledger || [])]
    };

    setCurrentUser(updatedUser);
    setUsersDb(usersDb.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    setTxRefNumber('');
    setDepositNotice(`Deposit request of ₹${inrVal.toLocaleString('en-IN')} (Crediting $${usdVal.toLocaleString()} USD) submitted. Awaiting Super Admin approval.`);
  };

  // Admin ACCEPTS Deposit Request
  const handleAdminApproveDeposit = (requestId) => {
    const targetReq = depositRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setUsersDb((prev) =>
      prev.map((u) => {
        if (u.id === targetReq.userId) {
          const updatedLedger = (u.ledger || []).map((l) =>
            l.id === targetReq.id ? { ...l, status: 'Approved & Credited' } : l
          );
          return {
            ...u,
            balance: (u.balance || 0) + targetReq.amountUsd,
            ledger: updatedLedger
          };
        }
        return u;
      })
    );

    setDepositRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r))
    );
  };

  // Admin REJECTS Deposit Request
  const handleAdminRejectDeposit = (requestId) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return;

    const targetReq = depositRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setUsersDb((prev) =>
      prev.map((u) => {
        if (u.id === targetReq.userId) {
          const updatedLedger = (u.ledger || []).map((l) =>
            l.id === targetReq.id ? { ...l, status: `Rejected (${reason || 'Payment Unverified'})` } : l
          );
          return { ...u, ledger: updatedLedger };
        }
        return u;
      })
    );

    setDepositRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
  };

  // Trade Execution
  const handleExecuteTrade = () => {
    if (!currentUser || currentUser.role !== 'customer') return;

    if (currentUser.kycStatus !== 'verified') {
      alert('Trading Locked: Your KYC document verification is pending review. Buy & Sell orders will unlock once approved by compliance.');
      return;
    }

    if (currentUser.balance <= 0) {
      alert('Insufficient Wallet Balance: Your current balance is $0.00. Please deposit funds through the payment gateway to start trading.');
      return;
    }

    const reqMargin = (selectedAsset.price * tradeUnits) / tradeLeverage;
    if (reqMargin > currentUser.balance) {
      alert(`Insufficient margin: Required $${reqMargin.toFixed(2)}, Available $${currentUser.balance.toFixed(2)}. Please add funds.`);
      return;
    }

    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
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
      balance: currentUser.balance + 25.00,
      trades: filtered
    };
    setCurrentUser(updated);
    setUsersDb((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  // Administrative Actions
  const handleAdminModifyBalance = (userId) => {
    const val = prompt('Enter new balance for client (USD):');
    if (!val || isNaN(val)) return;
    setUsersDb(usersDb.map((u) => (u.id === userId ? { ...u, balance: parseFloat(val) } : u)));
  };

  const handleAdminToggleKyc = (userId, currentKyc) => {
    const nextStatus = currentKyc === 'verified' ? 'pending' : 'verified';
    setUsersDb(usersDb.map((u) => (u.id === userId ? { ...u, kycStatus: nextStatus } : u)));
  };

  const handleAdminDeleteUser = (userId) => {
    if (!confirm('Are you sure you want to remove this client?')) return;
    setUsersDb(usersDb.filter((u) => u.id !== userId));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <button onClick={() => setActiveView('website')} className="flex items-center gap-2.5 text-left group">
            <div className="h-9 w-9 rounded-xl bg-slate-900 border border-amber-400/40 flex items-center justify-center p-1 shadow-sm">
              <img
                src="/commofx-logo.png"
                alt="COMMOFX"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-blue-950 block leading-none">
                COMMOFX
              </span>
              <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest block mt-0.5">
                GLOBAL MARKETS
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleInstallClick}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="Install CommoFx app on this device"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Install App</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('portal')}
                  className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  {currentUser.role === 'customer' ? 'TRADING DESK' : `${currentUser.role.toUpperCase()} PANEL`}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Market Price Tape */}
        <div className="bg-slate-900 text-white py-1 px-4 overflow-x-auto text-[11px] font-mono border-t border-slate-800">
          <div className="max-w-6xl mx-auto flex items-center gap-7 whitespace-nowrap">
            <span className="text-blue-400 font-sans font-bold text-[10px] uppercase flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> CommoFx Live:
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
          <section className="bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-14 pb-14 border-b border-slate-200">
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-[11px] font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                COMMOFX • Client-First Financial Solutions
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Transforming the Global <br />
                <span className="text-blue-600">Forex & Commodities Landscape</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                Direct interbank access to G7 currencies, physical gold, silver, crude oil, and major equity indices with zero hidden costs.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  Open Client Account <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveView('signin')}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm border border-slate-300 transition shadow-sm"
                >
                  Access Trading Portal
                </button>
              </div>
            </div>
          </section>

          {/* 4-STEP PROCESS */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center space-y-1 mb-8">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Financial Discipline</span>
              <h2 className="text-2xl font-black text-slate-900">How CommoFx Powers Your Capital</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: '01', title: 'WE SPEND', desc: 'Prudent cash flow budgeting.' },
                { step: '02', title: 'WE SAVE', desc: 'Systematic liquidity reserves.' },
                { step: '03', title: 'WE UTILIZE', desc: 'Deploy capital into tools.' },
                { step: '04', title: 'WE INVEST', desc: 'High-conviction Forex & Metals.' }
              ].map((s) => (
                <div key={s.step} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center space-y-1 hover:border-blue-400 transition">
                  <span className="text-xs font-black font-mono text-blue-600">{s.step}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                  <p className="text-[11px] text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ASSETS */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Market Coverage</span>
              <h2 className="text-2xl font-black text-slate-900">Invest In Leading Global Assets</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-xs">Currencies (Forex)</h3>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">7 Majors</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {['EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'].map((c) => (
                    <span key={c} className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-semibold text-slate-800">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-xs">Commodities</h3>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded">Metals & Energy</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {['Spot Gold (XAU)', 'Silver (XAG)', 'Crude Oil (WTI)', 'Natural Gas'].map((cm) => (
                    <span key={cm} className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-semibold text-slate-800">
                      {cm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-xs">Major Indices</h3>
                  <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">Equities</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {['Dow Jones 30', 'Nasdaq 100'].map((ind) => (
                    <span key={ind} className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-semibold text-slate-800">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4 CORE TRUST BADGES */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-xl font-black text-blue-400 block">24 Hours</span>
                <span className="text-xs text-slate-300">Continuous Market Liquidity</span>
              </div>
              <div>
                <span className="text-xl font-black text-blue-400 block">Zero</span>
                <span className="text-xs text-slate-300">No Forced Liquidation</span>
              </div>
              <div>
                <span className="text-xl font-black text-emerald-400 block">On-Time</span>
                <span className="text-xs text-slate-300">Reliable Client Withdrawals</span>
              </div>
              <div>
                <span className="text-xl font-black text-amber-400 block">Client First</span>
                <span className="text-xs text-slate-300">Audited Fund Governance</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. UNIFIED SIGN-IN PAGE */}
      {activeView === 'signin' && (
        <div className="flex-1 flex items-center justify-center p-4 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Sign In</h2>
              <p className="text-xs text-slate-500">Enter your credentials to access your portal</p>
            </div>

            {authErrorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                {authErrorMessage}
              </div>
            )}

            <form onSubmit={handleUnifiedSignIn} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Password</label>
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
                Sign In
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              New client?{' '}
              <button onClick={() => { setActiveView('register'); setAuthErrorMessage(''); }} className="text-blue-600 font-bold hover:underline">
                Create an Account (KYC Required)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CLIENT REGISTRATION WITH KYC UPLOAD */}
      {activeView === 'register' && (
        <div className="flex-1 flex items-center justify-center p-4 py-12">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Create Client Account</h2>
              <p className="text-xs text-slate-500">Attach verification documents for regulatory compliance</p>
            </div>

            {authErrorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                {authErrorMessage}
              </div>
            )}

            <form onSubmit={handleRegisterWithKyc} className="space-y-4 text-xs">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  1. Personal & Login Details
                </span>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Smith"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* KYC Document Upload Section */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  2. Mandatory KYC Document Upload
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Document Type</label>
                    <select
                      value={regDocType}
                      onChange={(e) => setRegDocType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    >
                      <option value="PAN Card">PAN Card</option>
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">
                      {regDocType} Identification Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`Enter your ${regDocType} number`}
                      value={regDocNumber}
                      onChange={(e) => setRegDocNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Attach Document Proof (PDF / Image)</label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 text-center transition bg-slate-50/50 cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setRegFileName(e.target.files[0].name);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center justify-center gap-1">
                      <UploadCloud className="w-5 h-5 text-blue-600" />
                      <span className="text-[11px] font-bold text-slate-700">
                        {regFileName ? regFileName : 'Click to select file (PDF, PNG, JPG)'}
                      </span>
                      <span className="text-[10px] text-slate-400">Max size: 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    New accounts start with <strong>$0.00</strong> balance. Fund your wallet in INR or USD via the payment gateway.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/20 mt-2"
              >
                Submit Registration & Documents
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Already have an account?{' '}
              <button onClick={() => { setActiveView('signin'); setAuthErrorMessage(''); }} className="text-blue-600 font-bold hover:underline">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. WORKSPACES: CUSTOMER, SUB-ADMIN, ADMIN */}
      {activeView === 'portal' && currentUser && (
        <div className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
          {/* ======================================================== */}
          {/* CUSTOMER WORKSPACE                                       */}
          {/* ======================================================== */}
          {currentUser.role === 'customer' && (
            <div className="space-y-6">
              {/* Account Header with Status Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">Trader Account</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">{currentUser.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1">
                    <span>{currentUser.email}</span> • <span>ID: {currentUser.id}</span> •{' '}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      currentUser.kycStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      KYC: {currentUser.kycStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Wallet Equity (USD)</span>
                    <strong className="text-xl text-slate-900">${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      ≈ ₹{(currentUser.balance * USD_INR_RATE).toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Managed Pools</span>
                    <strong className="text-xl text-blue-600">${currentUser.allocatedInPools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>
              </div>

              {/* KYC LOCKED ALERT BANNER */}
              {currentUser.kycStatus !== 'verified' && (
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 bg-white p-4 rounded-xl shadow-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">
                      Trading Disabled: KYC Document Pending Verification
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Your document (<strong>{currentUser.kycDocument?.type}</strong>: {currentUser.kycDocument?.number}) is currently under review by compliance. Buy & Sell orders will unlock once approved.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold text-slate-600">
                {[
                  { id: 'trade', label: 'Trading Desk' },
                  { id: 'deposit', label: 'Deposit / Add Funds' },
                  { id: 'portfolio', label: `My Contracts (${currentUser.trades ? currentUser.trades.length : 0})` },
                  { id: 'wallet', label: 'Personal Ledger' }
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

              {/* TAB 1: TRADING DESK */}
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

                      {/* EXECUTION BUTTONS */}
                      <div className="flex items-end gap-2">
                        <button
                          onClick={() => { setTradeSide('BUY'); handleExecuteTrade(); }}
                          disabled={currentUser.kycStatus !== 'verified' || currentUser.balance <= 0}
                          className={`flex-1 font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1 ${
                            currentUser.kycStatus === 'verified' && currentUser.balance > 0
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {(currentUser.kycStatus !== 'verified' || currentUser.balance <= 0) && <Lock className="w-3 h-3" />}
                          BUY
                        </button>
                        <button
                          onClick={() => { setTradeSide('SELL'); handleExecuteTrade(); }}
                          disabled={currentUser.kycStatus !== 'verified' || currentUser.balance <= 0}
                          className={`flex-1 font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1 ${
                            currentUser.kycStatus === 'verified' && currentUser.balance > 0
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {(currentUser.kycStatus !== 'verified' || currentUser.balance <= 0) && <Lock className="w-3 h-3" />}
                          SELL
                        </button>
                      </div>
                    </div>

                    {/* ALERTS */}
                    {currentUser.kycStatus !== 'verified' && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Trading disabled: KYC approval required before placing orders.</span>
                      </div>
                    )}
                    {currentUser.kycStatus === 'verified' && currentUser.balance <= 0 && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px] flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-blue-600" />
                          Wallet balance is $0.00. Add funds to activate trading.
                        </span>
                        <button
                          onClick={() => setCustomerTab('deposit')}
                          className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-[10px]"
                        >
                          Deposit Now
                        </button>
                      </div>
                    )}
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

              {/* TAB 2: DEPOSIT IN INR WITH REAL-TIME USD REFLECTION */}
              {customerTab === 'deposit' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Deposit Funds Through Gateway</h3>
                      <p className="text-xs text-slate-500">
                        Enter amount in INR (₹). USD ($) trading credit is calculated automatically in real time.
                      </p>
                    </div>

                    {depositNotice && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{depositNotice}</span>
                      </div>
                    )}

                    <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="text-slate-600 block mb-1 font-semibold">Select Payment Gateway</label>
                        <select
                          value={paymentGateway}
                          onChange={(e) => setPaymentGateway(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold text-xs"
                        >
                          <option value="UPI / Instant Transfer (BHIM, GPay, PhonePe)">UPI / Instant Transfer (BHIM, GPay, PhonePe)</option>
                          <option value="National Bank Wire / IMPS / NEFT">National Bank Wire / IMPS / NEFT</option>
                          <option value="Crypto USDT (TRC-20)">Crypto Deposit — USDT (TRC-20 Network)</option>
                        </select>
                      </div>

                      {/* DUAL INR INPUT & USD REFLECTION BOX */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <div>
                          <label className="text-slate-700 block mb-1 font-bold flex items-center gap-1">
                            Deposit Amount (INR ₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              required
                              min="500"
                              step="500"
                              placeholder="90000"
                              value={depositInr}
                              onChange={(e) => setDepositInr(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-600 text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-700 block mb-1 font-bold flex items-center gap-1 text-emerald-700">
                            Reflected Wallet Credit (USD $)
                          </label>
                          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono flex items-center justify-between">
                            <span className="text-sm font-black text-emerald-700">${convertedUsd} USD</span>
                            <span className="text-[10px] text-slate-400">Rate: 1$ = ₹{USD_INR_RATE}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-600 block mb-1 font-semibold">
                          Payment Reference / UTR Number / UPI Ref ID
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. UPI Ref 3829104829 / UTR Number"
                          value={txRefNumber}
                          onChange={(e) => setTxRefNumber(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-mono text-xs uppercase"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/20"
                      >
                        Submit Deposit Request
                      </button>
                    </form>
                  </div>

                  {/* GATEWAY DETAILS BOX */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Gateway Information</span>
                      <h4 className="text-lg font-black mt-1">Official Deposit Channels</h4>
                      
                      <div className="space-y-3 mt-4 text-xs font-mono">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-sans block">UPI VPA Handle</span>
                          <strong className="text-amber-400 text-sm">commofx@institutional</strong>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-sans block">Bank Account (IMPS / NEFT)</span>
                          <span className="text-slate-200 block">Bank: HDFC Bank Ltd</span>
                          <span className="text-slate-200 block">A/C: 50200083920194</span>
                          <span className="text-slate-200 block">IFSC: HDFC0000240</span>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-sans block">Crypto USDT (TRC-20)</span>
                          <strong className="text-slate-200 text-[11px] break-all">TJX9bWkL4n2Y8qZvR7pM1wX3sA5c8E9Fd2</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 border-t border-white/10 pt-3">
                      Transfer in INR via UPI or Net Banking. Once submitted with reference ID, your wallet is credited in USD upon Super Admin approval.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PORTFOLIO */}
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
                                  Close Trade
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

              {/* TAB 4: WALLET & DEPOSIT LEDGER */}
              {customerTab === 'wallet' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Your Ledger History</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="p-3">Reference</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Method / Note</th>
                          <th className="p-3">Amount (USD)</th>
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
                              <td className={`p-3 text-right font-bold ${
                                l.status.includes('Approved')
                                  ? 'text-emerald-600'
                                  : l.status.includes('Pending')
                                  ? 'text-amber-600'
                                  : 'text-slate-600'
                              }`}>
                                {l.status}
                              </td>
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
            </div>
          )}

          {/* ======================================================== */}
          {/* SUB-ADMIN: AUDIT DESK                                    */}
          {/* ======================================================== */}
          {currentUser.role === 'subadmin' && (
            <div className="space-y-6">
              <div className="bg-white border border-amber-300 rounded-3xl shadow-xl p-8 space-y-6">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      CommoFx Compliance & Audit Desk (Sub-Admin)
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Client Accounts & Documents Queue</h2>
                    <p className="text-xs text-slate-500">Inspection mode only. Review submitted documentation and client funding records.</p>
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
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Document Details</th>
                        <th className="p-3.5">Balance</th>
                        <th className="p-3.5">KYC Status</th>
                        <th className="p-3.5 text-right">Trading Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersDb.length > 0 ? (
                        usersDb.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50">
                            <td className="p-3.5 text-slate-400">{u.id}</td>
                            <td className="p-3.5 font-bold text-slate-900 font-sans">{u.name}</td>
                            <td className="p-3.5 text-slate-600">{u.email}</td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-800 block">{u.kycDocument?.type || 'No Document'}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">Doc: {u.kycDocument?.number || 'N/A'}</span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">${u.balance.toLocaleString()}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.kycStatus === 'verified'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {u.kycStatus}
                              </span>
                            </td>
                            <td className="p-3.5 text-right font-sans font-semibold text-[11px]">
                              {u.kycStatus === 'verified' && u.balance > 0 ? (
                                <span className="text-emerald-600">Trading Active</span>
                              ) : (
                                <span className="text-rose-600">Locked</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="7" className="p-6 text-center text-slate-400 font-sans">No clients registered yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SUPER ADMIN: ACCEPT / REJECT DEPOSITS & KYC              */}
          {/* ======================================================== */}
          {currentUser.role === 'admin' && (
            <div className="space-y-6">
              {/* SECTION A: PENDING DEPOSIT REQUESTS QUEUE WITH ACCEPT / REJECT BUTTONS */}
              <div className="bg-white border border-blue-300 rounded-3xl shadow-xl p-8 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      Gateway Deposit Queue
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-1">Pending Client Deposit Requests</h2>
                    <p className="text-xs text-slate-500">
                      Verify transaction reference and choose Accept to credit balance or Reject to decline.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-xl">
                    {depositRequests.filter((r) => r.status === 'pending').length} Pending
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Request ID</th>
                        <th className="p-3.5">Client</th>
                        <th className="p-3.5">Gateway & Ref</th>
                        <th className="p-3.5">INR Deposited</th>
                        <th className="p-3.5">USD To Credit</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Decision Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {depositRequests.length > 0 ? (
                        depositRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50">
                            <td className="p-3.5 text-slate-400">{req.id}</td>
                            <td className="p-3.5 font-bold text-slate-900 font-sans">
                              {req.userName}
                              <span className="text-[10px] text-slate-400 font-mono block">{req.userEmail}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-800 block">{req.gateway}</span>
                              <span className="text-[10px] text-blue-600 block">Ref: {req.txRef}</span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-800">
                              ₹{(req.amountInr || req.amount * USD_INR_RATE).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3.5 font-black text-emerald-600 text-sm">
                              ${(req.amountUsd || req.amount).toLocaleString()} USD
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                req.status === 'accepted' || req.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : req.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              {req.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleAdminApproveDeposit(req.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition shadow-sm"
                                  >
                                    Accept (Credit)
                                  </button>
                                  <button
                                    onClick={() => handleAdminRejectDeposit(req.id)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-3 py-1 rounded-lg text-[10px] font-bold transition"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-slate-400 text-[10px] italic">Completed</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="7" className="p-6 text-center text-slate-400 font-sans">No deposit requests submitted yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION B: MASTER KYC CLEARANCE & BALANCES */}
              <div className="bg-white border border-purple-300 rounded-3xl shadow-xl p-8 space-y-6">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      Super Admin Root Terminal
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Master KYC Clearance & Client Accounts</h2>
                    <p className="text-xs text-slate-500">Approve client documents to unlock trading or manually adjust balances.</p>
                  </div>
                  <div className="bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200 text-xs font-semibold flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> Root Clearance
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Client</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Document Details</th>
                        <th className="p-3.5">Current Balance</th>
                        <th className="p-3.5">KYC Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersDb.length > 0 ? (
                        usersDb.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-bold text-slate-900 font-sans">{u.name}</td>
                            <td className="p-3.5 text-slate-600">{u.email}</td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-800 block">{u.kycDocument?.type || 'No Document'}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">Doc: {u.kycDocument?.number || 'N/A'}</span>
                              <span className="text-[10px] text-blue-600 font-mono block flex items-center gap-1">
                                <FileText className="w-3 h-3" /> {u.kycDocument?.filename || 'proof.pdf'}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">${u.balance.toLocaleString()}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.kycStatus === 'verified'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {u.kycStatus}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleAdminToggleKyc(u.id, u.kycStatus)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold text-white transition ${
                                  u.kycStatus === 'verified'
                                    ? 'bg-amber-600 hover:bg-amber-700'
                                    : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                              >
                                {u.kycStatus === 'verified' ? 'Revoke KYC (Lock)' : 'Approve KYC (Unlock)'}
                              </button>
                              <button
                                onClick={() => handleAdminModifyBalance(u.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
                              >
                                Edit Balance
                              </button>
                              <button
                                onClick={() => handleAdminDeleteUser(u.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-1 rounded-lg text-[10px] font-bold border border-rose-200"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="6" className="p-6 text-center text-slate-400 font-sans">No client records registered yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <strong className="text-slate-800 font-bold">COMMOFX</strong> — COMMO FOREX
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            24-Hour Interbank Liquidity & Commodities Infrastructure
          </div>
        </div>
      </footer>
    </div>
  );
}
