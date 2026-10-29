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
  IndianRupee, ArrowLeftRight, Landmark, Briefcase, Award as MedalIcon
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

// Master Managed PAMM Strategies (Managed on behalf of passive clients)
const INITIAL_MANAGED_POOLS = [
  {
    id: 'POOL-ALPHA',
    name: 'Alpha Bull Forex Strategy',
    manager: 'CommoFx Quantitative Desk',
    focus: 'G7 Forex Majors (EUR, GBP, USD)',
    riskLevel: 'Low - Conservative',
    historicalReturn: '+12.4% / Month',
    winRate: '88.5%',
    totalAUM: 420000,
    minDeposit: 50
  },
  {
    id: 'POOL-TITAN',
    name: 'Titan Gold & Metals Reserve',
    manager: 'Senior Commodities Desk',
    focus: 'Spot Gold (XAU) & Silver (XAG)',
    riskLevel: 'Medium - Growth',
    historicalReturn: '+18.2% / Month',
    winRate: '84.1%',
    totalAUM: 780000,
    minDeposit: 100
  },
  {
    id: 'POOL-MACRO',
    name: 'Global Macro Balanced Fund',
    manager: 'Institutional Desk',
    focus: 'Commodities + Wall Street Indices',
    riskLevel: 'Moderate - Balanced',
    historicalReturn: '+15.6% / Month',
    winRate: '86.7%',
    totalAUM: 610000,
    minDeposit: 100
  }
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

  // Global Withdrawal Requests Queue
  const [withdrawalRequests, setWithdrawalRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('cfx_withdrawal_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Managed Pools State
  const [managedPools, setManagedPools] = useState(() => {
    try {
      const saved = localStorage.getItem('cfx_managed_pools');
      return saved ? JSON.parse(saved) : INITIAL_MANAGED_POOLS;
    } catch {
      return INITIAL_MANAGED_POOLS;
    }
  });

  useEffect(() => {
    localStorage.setItem('cfx_registered_users', JSON.stringify(usersDb));
  }, [usersDb]);

  useEffect(() => {
    localStorage.setItem('cfx_deposit_requests', JSON.stringify(depositRequests));
  }, [depositRequests]);

  useEffect(() => {
    localStorage.setItem('cfx_withdrawal_requests', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem('cfx_managed_pools', JSON.stringify(managedPools));
  }, [managedPools]);

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

  // Client Deposit Inputs (INR & USD)
  const [depositInr, setDepositInr] = useState('90000');
  const [paymentGateway, setPaymentGateway] = useState('UPI / Instant Transfer (BHIM, GPay, PhonePe)');
  const [txRefNumber, setTxRefNumber] = useState('');
  const [depositNotice, setDepositNotice] = useState('');

  // Client Withdrawal Request Inputs
  const [withdrawAmountUsd, setWithdrawAmountUsd] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('UPI Transfer (Instant INR)');
  const [withdrawBeneficiaryDetails, setWithdrawBeneficiaryDetails] = useState('');
  const [withdrawNotice, setWithdrawNotice] = useState('');

  // Managed Investment Allocation Inputs
  const [selectedPoolId, setSelectedPoolId] = useState('POOL-ALPHA');
  const [poolInvestAmountUsd, setPoolInvestAmountUsd] = useState('100');
  const [pammNotice, setPammNotice] = useState('');

  // Admin Master Trade Distribution States
  const [distributePoolId, setDistributePoolId] = useState('POOL-ALPHA');
  const [distributeProfitPct, setDistributeProfitPct] = useState('3.5');

  // Market & Self-Trading State
  const [assets, setAssets] = useState(COMMOFX_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState(COMMOFX_ASSETS[6]);
  const [allocatedMarginUsd, setAllocatedMarginUsd] = useState('50');
  const [tradeLeverage, setTradeLeverage] = useState(10);
  const [tradeSide, setTradeSide] = useState('BUY');

  const [customerTab, setCustomerTab] = useState('managed'); // 'managed' (PAMM) | 'trade' | 'deposit' | 'withdraw' | 'portfolio' | 'wallet'

  // Converted USD based on INR deposit input
  const convertedUsd = useMemo(() => {
    const val = parseFloat(depositInr) || 0;
    return (val / USD_INR_RATE).toFixed(2);
  }, [depositInr]);

  // Exact Fractional Lot Calculation down to 6 decimals based on dollar allocation
  const calculatedLots = useMemo(() => {
    const margin = parseFloat(allocatedMarginUsd) || 0;
    if (margin <= 0 || !selectedAsset.price) return '0.000000';
    const units = (margin * tradeLeverage) / selectedAsset.price;
    return units.toFixed(6);
  }, [allocatedMarginUsd, tradeLeverage, selectedAsset.price]);

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
        if (
          updated.balance !== currentUser.balance ||
          updated.allocatedInPools !== currentUser.allocatedInPools ||
          updated.kycStatus !== currentUser.kycStatus ||
          updated.ledger?.length !== currentUser.ledger?.length ||
          updated.poolHoldings?.length !== currentUser.poolHoldings?.length
        ) {
          setCurrentUser(updated);
        }
      }
    }
  }, [usersDb, currentUser]);

  // Candlestick SVG generator
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

  // Helper for computing live individual trade metrics
  const computeTradeMetrics = (trade) => {
    const liveAsset = assets.find((a) => a.symbol === trade.symbol);
    const currentPrice = liveAsset ? liveAsset.price : trade.entryPrice;
    const decimals = liveAsset ? liveAsset.decimals : 2;

    const priceDiff = trade.side === 'BUY'
      ? (currentPrice - trade.entryPrice)
      : (trade.entryPrice - currentPrice);

    const unrealizedPnL = priceDiff * trade.units;
    const pnlPercentage = trade.marginAllocated > 0
      ? (unrealizedPnL / trade.marginAllocated) * 100
      : 0;

    const currentValue = Math.max(0, trade.marginAllocated + unrealizedPnL);

    return { currentPrice, decimals, unrealizedPnL, pnlPercentage, currentValue };
  };

  // Total Open Portfolio Summary
  const portfolioSummary = useMemo(() => {
    if (!currentUser || !currentUser.trades || currentUser.trades.length === 0) {
      return { totalAllocated: 0, totalCurrentValue: 0, totalPnL: 0 };
    }

    let totalAllocated = 0;
    let totalCurrentValue = 0;

    currentUser.trades.forEach((t) => {
      const { currentValue } = computeTradeMetrics(t);
      totalAllocated += t.marginAllocated || 0;
      totalCurrentValue += currentValue;
    });

    const totalPnL = totalCurrentValue - totalAllocated;
    return { totalAllocated, totalCurrentValue, totalPnL };
  }, [currentUser?.trades, assets]);

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
      poolHoldings: [], // Stores PAMM investments
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

  // -------------------------------------------------------------
  // PAMM / MANAGED POOL OPERATIONS (AUTO-TRADING FOR NON-TRADERS)
  // -------------------------------------------------------------
  const handleJoinManagedPool = (e) => {
    e.preventDefault();
    setPammNotice('');

    if (currentUser.kycStatus !== 'verified') {
      alert('KYC Required: Please wait for compliance KYC approval before joining managed strategy pools.');
      return;
    }

    const amount = parseFloat(poolInvestAmountUsd);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid investment amount.');
      return;
    }

    if (amount > currentUser.balance) {
      alert(`Insufficient cash balance. You have $${currentUser.balance.toFixed(2)} available. Please deposit funds first.`);
      return;
    }

    const targetPool = managedPools.find((p) => p.id === selectedPoolId);
    if (!targetPool) return;

    if (amount < targetPool.minDeposit) {
      alert(`Minimum allocation for ${targetPool.name} is $${targetPool.minDeposit} USD.`);
      return;
    }

    const newHolding = {
      id: `HLD-${Math.floor(1000 + Math.random() * 9000)}`,
      poolId: targetPool.id,
      poolName: targetPool.name,
      investedAmount: amount,
      currentValue: amount,
      profitRealized: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - amount,
      allocatedInPools: (currentUser.allocatedInPools || 0) + amount,
      poolHoldings: [newHolding, ...(currentUser.poolHoldings || [])],
      ledger: [
        {
          id: `PAMM-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          type: 'Join Managed Fund',
          method: `${targetPool.name} Auto-Trade`,
          amount: -amount,
          status: 'Active In Strategy Pool'
        },
        ...(currentUser.ledger || [])
      ]
    };

    setCurrentUser(updatedUser);
    setUsersDb(usersDb.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setPammNotice(`Successfully allocated $${amount.toFixed(2)} to ${targetPool.name}. CommoFx Master Desk is now trading for your account.`);
  };

  // Exit PAMM Pool and return capital + profit back to Cash Balance
  const handleExitManagedPool = (holdingId) => {
    const targetHolding = (currentUser.poolHoldings || []).find((h) => h.id === holdingId);
    if (!targetHolding) return;

    const returnAmount = targetHolding.currentValue;

    const filteredHoldings = currentUser.poolHoldings.filter((h) => h.id !== holdingId);
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + returnAmount,
      allocatedInPools: Math.max(0, (currentUser.allocatedInPools || 0) - targetHolding.investedAmount),
      poolHoldings: filteredHoldings,
      ledger: [
        {
          id: `EXIT-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          type: 'Exit Managed Strategy',
          method: targetHolding.poolName,
          amount: returnAmount,
          status: `Capital & Profits Returned ($${returnAmount.toFixed(2)})`
        },
        ...(currentUser.ledger || [])
      ]
    };

    setCurrentUser(updatedUser);
    setUsersDb(usersDb.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    alert(`Successfully exited ${targetHolding.poolName}. $${returnAmount.toFixed(2)} USD credited back to your cash wallet.`);
  };

  // Super Admin: Post Master Trade Win & Distribute Proportional Profits to All Passive Investors
  const handleAdminDistributeMasterProfit = (e) => {
    e.preventDefault();
    const pct = parseFloat(distributeProfitPct);
    if (isNaN(pct) || pct <= 0) {
      alert('Please enter a valid profit percentage.');
      return;
    }

    let affectedInvestors = 0;
    let totalPaidOut = 0;

    const updatedUsers = usersDb.map((u) => {
      if (!u.poolHoldings || u.poolHoldings.length === 0) return u;

      let userGain = 0;
      const updatedHoldings = u.poolHoldings.map((h) => {
        if (h.poolId === distributePoolId) {
          const profit = (h.currentValue * pct) / 100;
          userGain += profit;
          return {
            ...h,
            currentValue: h.currentValue + profit,
            profitRealized: (h.profitRealized || 0) + profit
          };
        }
        return h;
      });

      if (userGain > 0) {
        affectedInvestors++;
        totalPaidOut += userGain;
        return {
          ...u,
          poolHoldings: updatedHoldings,
          ledger: [
            {
              id: `PROF-${Math.floor(1000 + Math.random() * 9000)}`,
              date: new Date().toISOString().split('T')[0],
              type: 'PAMM Strategy Profit Distribution',
              method: `Master Desk +${pct}% Yield`,
              amount: userGain,
              status: `Auto-Credited (+$${userGain.toFixed(2)})`
            },
            ...(u.ledger || [])
          ]
        };
      }
      return u;
    });

    setUsersDb(updatedUsers);
    alert(`Master Profit Distributed! Credited +${pct}% ($${totalPaidOut.toFixed(2)} total profit) across ${affectedInvestors} passive investors.`);
  };

  // Client Submits Fund Request
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

  // Client Submits Withdrawal Request
  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    setWithdrawNotice('');

    const requestedAmount = parseFloat(withdrawAmountUsd);
    if (isNaN(requestedAmount) || requestedAmount <= 0) {
      alert('Please enter a valid withdrawal amount.');
      return;
    }

    if (requestedAmount > currentUser.balance) {
      alert(`Insufficient funds. You can withdraw up to $${currentUser.balance.toFixed(2)} USD.`);
      return;
    }

    if (!withdrawBeneficiaryDetails.trim()) {
      alert('Please provide your beneficiary payout details (UPI ID or Bank Account Details).');
      return;
    }

    const newWithdrawal = {
      id: `WTH-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amountUsd: requestedAmount,
      amountInr: requestedAmount * USD_INR_RATE,
      method: withdrawMethod,
      beneficiary: withdrawBeneficiaryDetails.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setWithdrawalRequests([newWithdrawal, ...withdrawalRequests]);

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - requestedAmount,
      ledger: [
        {
          id: newWithdrawal.id,
          date: newWithdrawal.date,
          type: 'Withdrawal Request',
          method: `${withdrawMethod} (${withdrawBeneficiaryDetails.trim()})`,
          amount: -requestedAmount,
          status: 'Pending Admin Payout'
        },
        ...(currentUser.ledger || [])
      ]
    };

    setCurrentUser(updatedUser);
    setUsersDb(usersDb.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    setWithdrawAmountUsd('');
    setWithdrawBeneficiaryDetails('');
    setWithdrawNotice(`Withdrawal request for $${requestedAmount.toLocaleString()} USD (₹${(requestedAmount * USD_INR_RATE).toLocaleString('en-IN')} INR) submitted for processing.`);
  };

  // Super Admin: APPROVE Deposit
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

  // Super Admin: REJECT Deposit
  const handleAdminRejectDeposit = (requestId) => {
    const reason = prompt('Enter rejection reason:');
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

  // Super Admin: APPROVE Withdrawal
  const handleAdminApproveWithdrawal = (withdrawalId) => {
    const target = withdrawalRequests.find((w) => w.id === withdrawalId);
    if (!target) return;

    setUsersDb((prev) =>
      prev.map((u) => {
        if (u.id === target.userId) {
          const updatedLedger = (u.ledger || []).map((l) =>
            l.id === target.id ? { ...l, status: 'Processed & Transferred' } : l
          );
          return { ...u, ledger: updatedLedger };
        }
        return u;
      })
    );

    setWithdrawalRequests((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'completed' } : w))
    );
  };

  // Super Admin: REJECT Withdrawal
  const handleAdminRejectWithdrawal = (withdrawalId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;

    const target = withdrawalRequests.find((w) => w.id === withdrawalId);
    if (!target) return;

    setUsersDb((prev) =>
      prev.map((u) => {
        if (u.id === target.userId) {
          const updatedLedger = (u.ledger || []).map((l) =>
            l.id === target.id ? { ...l, status: `Rejected & Refunded (${reason || 'Invalid Details'})` } : l
          );
          return {
            ...u,
            balance: u.balance + target.amountUsd,
            ledger: updatedLedger
          };
        }
        return u;
      })
    );

    setWithdrawalRequests((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'rejected' } : w))
    );
  };

  // Fractional Self-Trade Execution
  const handleExecuteTrade = () => {
    if (!currentUser || currentUser.role !== 'customer') return;

    if (currentUser.kycStatus !== 'verified') {
      alert('Trading Locked: Your KYC document verification is pending review. Buy & Sell orders will unlock once approved by compliance.');
      return;
    }

    const marginToSpend = parseFloat(allocatedMarginUsd) || 0;
    if (marginToSpend <= 0) {
      alert('Please specify an investment amount greater than $0.00.');
      return;
    }

    if (marginToSpend > currentUser.balance) {
      alert(`Insufficient wallet balance. You have $${currentUser.balance.toFixed(2)} USD available.`);
      return;
    }

    const fractionalUnits = parseFloat(calculatedLots);

    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      symbol: selectedAsset.symbol,
      side: tradeSide,
      marginAllocated: marginToSpend,
      units: fractionalUnits,
      leverage: Number(tradeLeverage),
      entryPrice: selectedAsset.price
    };

    const updated = {
      ...currentUser,
      balance: currentUser.balance - marginToSpend,
      trades: [newTx, ...(currentUser.trades || [])]
    };

    setCurrentUser(updated);
    setUsersDb((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  // Close Self-Trade
  const handleCloseTrade = (tradeId) => {
    if (!currentUser || currentUser.role !== 'customer') return;
    const targetTrade = currentUser.trades.find((t) => t.id === tradeId);
    if (!targetTrade) return;

    const { currentValue, unrealizedPnL, currentPrice } = computeTradeMetrics(targetTrade);

    const filtered = currentUser.trades.filter((t) => t.id !== tradeId);
    const updated = {
      ...currentUser,
      balance: currentUser.balance + currentValue,
      trades: filtered,
      ledger: [
        {
          id: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          type: 'Close Trade & Realize Profit/Loss',
          method: `${targetTrade.symbol} (${targetTrade.side} ${targetTrade.units} Lots at ${currentPrice})`,
          amount: currentValue,
          status: unrealizedPnL >= 0
            ? `Realized Profit: +$${unrealizedPnL.toFixed(2)}`
            : `Realized Loss: -$${Math.abs(unrealizedPnL).toFixed(2)}`
        },
        ...(currentUser.ledger || [])
      ]
    };

    setCurrentUser(updated);
    setUsersDb((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  // Admin User Modifications
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
                  {currentUser.role === 'customer' ? 'CLIENT WORKSPACE' : `${currentUser.role.toUpperCase()} PANEL`}
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
                Hands-Free Wealth Building & <br />
                <span className="text-blue-600">Institutional Fund Management</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                Don't know how to trade? Our master desk trades for you in automated strategy pools with proportional daily profits and complete withdrawal freedom.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  Join Managed Fund <ArrowRight className="w-4 h-4" />
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

          {/* 4 CORE TRUST BADGES */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-xl font-black text-blue-400 block">PAMM / Copy Fund</span>
                <span className="text-xs text-slate-300">We trade, you share profits</span>
              </div>
              <div>
                <span className="text-xl font-black text-blue-400 block">Fractional Lots</span>
                <span className="text-xs text-slate-300">Start with any deposit size</span>
              </div>
              <div>
                <span className="text-xl font-black text-emerald-400 block">Instant INR/USD</span>
                <span className="text-xs text-slate-300">UPI & Bank Wire Payouts</span>
              </div>
              <div>
                <span className="text-xl font-black text-amber-400 block">Audited Results</span>
                <span className="text-xs text-slate-300">Transparent Fund Governance</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. UNIFIED SIGN-IN */}
      {activeView === 'signin' && (
        <div className="flex-1 flex items-center justify-center p-4 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Sign In</h2>
              <p className="text-xs text-slate-500">Enter your credentials to access your workspace</p>
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
              New investor?{' '}
              <button onClick={() => { setActiveView('register'); setAuthErrorMessage(''); }} className="text-blue-600 font-bold hover:underline">
                Create an Account (KYC Required)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. REGISTRATION */}
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

      {/* 4. WORKSPACES */}
      {activeView === 'portal' && currentUser && (
        <div className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
          {/* CUSTOMER WORKSPACE */}
          {currentUser.role === 'customer' && (
            <div className="space-y-6">
              {/* Account Header with Status Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">Investor Account</span>
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
                    <span className="text-slate-500 block text-[10px]">Available Cash (USD)</span>
                    <strong className="text-xl text-slate-900">${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      ≈ ₹{(currentUser.balance * USD_INR_RATE).toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Managed in Strategy Pools</span>
                    <strong className="text-xl text-blue-600">${(currentUser.allocatedInPools || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold text-slate-600 overflow-x-auto">
                {[
                  { id: 'managed', label: 'Managed Funds (We Trade For You)' },
                  { id: 'trade', label: 'Self Trading Desk' },
                  { id: 'deposit', label: 'Deposit (INR / USD)' },
                  { id: 'withdraw', label: 'Withdraw Funds' },
                  { id: 'portfolio', label: `My Positions (${currentUser.trades ? currentUser.trades.length : 0})` },
                  { id: 'wallet', label: 'Personal Ledger' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCustomerTab(t.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${customerTab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: MANAGED FUNDS / PAMM POOLS (FOR NON-TRADERS) */}
              {customerTab === 'managed' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 max-w-xl">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                        Automated Wealth Management
                      </span>
                      <h3 className="text-2xl font-black tracking-tight">CommoFx Master PAMM Strategies</h3>
                      <p className="text-xs text-blue-200 leading-relaxed">
                        Don't know trading? Our institutional desk executes the trades for you on a collective pool. Sit back and watch your daily proportional gains update automatically.
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center text-xs font-mono">
                      <span className="text-slate-300 block text-[10px]">Your Total Pool Assets</span>
                      <strong className="text-2xl font-black text-amber-400">
                        ${(currentUser.allocatedInPools || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                  {pammNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pammNotice}</span>
                    </div>
                  )}

                  {/* ACTIVE INVESTMENTS OVERVIEW */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-sm text-slate-900">Your Active Strategy Allocations</h4>
                    <div className="border border-slate-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 whitespace-nowrap">
                          <tr>
                            <th className="p-3">Holding ID</th>
                            <th className="p-3">Strategy Fund</th>
                            <th className="p-3">Capital Allocated</th>
                            <th className="p-3">Current Value</th>
                            <th className="p-3">Total Gains</th>
                            <th className="p-3">Joined Date</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentUser.poolHoldings && currentUser.poolHoldings.length > 0 ? (
                            currentUser.poolHoldings.map((h) => {
                              const gain = h.currentValue - h.investedAmount;
                              return (
                                <tr key={h.id} className="hover:bg-slate-50">
                                  <td className="p-3 text-slate-400">{h.id}</td>
                                  <td className="p-3 font-bold text-slate-900 font-sans">{h.poolName}</td>
                                  <td className="p-3 font-semibold text-slate-700">${h.investedAmount.toFixed(2)}</td>
                                  <td className="p-3 font-black text-slate-900">${h.currentValue.toFixed(2)}</td>
                                  <td className="p-3">
                                    <span className="font-bold text-emerald-600">
                                      +${gain.toFixed(2)} ({((gain / h.investedAmount) * 100).toFixed(2)}%)
                                    </span>
                                  </td>
                                  <td className="p-3 text-slate-500">{h.joinedDate}</td>
                                  <td className="p-3 text-right whitespace-nowrap">
                                    <button
                                      onClick={() => handleExitManagedPool(h.id)}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold transition"
                                    >
                                      Withdraw Capital & Profit
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr><td colSpan="7" className="p-6 text-center text-slate-400 font-sans">You have no active managed strategy allocations yet. Select a pool below to start earning hands-free.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* POOL SELECTION CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {managedPools.map((pool) => (
                      <div key={pool.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500 transition">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                              {pool.riskLevel}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                              {pool.historicalReturn}
                            </span>
                          </div>
                          <h4 className="font-black text-slate-900 text-base">{pool.name}</h4>
                          <p className="text-xs text-slate-500">{pool.focus}</p>

                          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs font-mono">
                            <div className="flex justify-between text-slate-600">
                              <span>Win Rate:</span>
                              <strong className="text-slate-900">{pool.winRate}</strong>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Total Capital Managed:</span>
                              <strong className="text-slate-900">${pool.totalAUM.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Min Deposit:</span>
                              <strong className="text-slate-900">${pool.minDeposit} USD</strong>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedPoolId(pool.id);
                            setPoolInvestAmountUsd(Math.max(pool.minDeposit, Math.min(currentUser.balance, 500)).toString());
                          }}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                            selectedPoolId === pool.id
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {selectedPoolId === pool.id ? 'Selected' : 'Select Strategy'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ONE CLICK ALLOCATION FORM */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-sm text-slate-900">
                      Allocate Funds to Selected Strategy ({managedPools.find((p) => p.id === selectedPoolId)?.name})
                    </h4>

                    <form onSubmit={handleJoinManagedPool} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
                      <div>
                        <label className="text-slate-600 block mb-1 font-semibold">
                          Investment Amount (USD $)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">$</span>
                          <input
                            type="number"
                            required
                            min="10"
                            step="any"
                            value={poolInvestAmountUsd}
                            onChange={(e) => setPoolInvestAmountUsd(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-600 font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPoolInvestAmountUsd(Math.floor(currentUser.balance * 0.50).toString())}
                          className="bg-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200"
                        >
                          50% Balance
                        </button>
                        <button
                          type="button"
                          onClick={() => setPoolInvestAmountUsd(currentUser.balance.toFixed(2))}
                          className="bg-blue-50 px-3 py-2 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-100"
                        >
                          Max Cash (${currentUser.balance.toFixed(2)})
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={currentUser.balance <= 0 || currentUser.kycStatus !== 'verified'}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                          currentUser.balance > 0 && currentUser.kycStatus === 'verified'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Start Hands-Free Trading
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: SELF TRADING DESK */}
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

                    {/* FRACTIONAL TRADE ORDER FORM */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">Order Allocation</span>
                        <div className="space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setAllocatedMarginUsd(Math.floor(currentUser.balance * 0.25).toString())}
                            className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] font-semibold text-slate-600 hover:text-blue-600"
                          >
                            25%
                          </button>
                          <button
                            type="button"
                            onClick={() => setAllocatedMarginUsd(Math.floor(currentUser.balance * 0.50).toString())}
                            className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] font-semibold text-slate-600 hover:text-blue-600"
                          >
                            50%
                          </button>
                          <button
                            type="button"
                            onClick={() => setAllocatedMarginUsd(currentUser.balance.toFixed(2))}
                            className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px] font-bold text-blue-700 hover:bg-blue-100"
                          >
                            Max (All In)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                            Amount to Invest (USD $)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              step="any"
                              min="1"
                              placeholder="100"
                              value={allocatedMarginUsd}
                              onChange={(e) => setAllocatedMarginUsd(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-1.5 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">Leverage Ratio</label>
                          <select
                            value={tradeLeverage}
                            onChange={(e) => setTradeLeverage(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                          >
                            <option value="1">1x Cash Spot</option>
                            <option value="10">10x Dynamic</option>
                            <option value="25">25x High</option>
                            <option value="50">50x Prime</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                            Computed Lots (Fractional)
                          </label>
                          <div className="bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-xs font-bold text-blue-700">
                            {calculatedLots} Lots
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => { setTradeSide('BUY'); handleExecuteTrade(); }}
                          disabled={currentUser.kycStatus !== 'verified' || currentUser.balance <= 0}
                          className={`flex-1 font-bold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1 ${
                            currentUser.kycStatus === 'verified' && currentUser.balance > 0
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {(currentUser.kycStatus !== 'verified' || currentUser.balance <= 0) && <Lock className="w-3.5 h-3.5" />}
                          BUY / LONG ({calculatedLots} Lots)
                        </button>
                        <button
                          onClick={() => { setTradeSide('SELL'); handleExecuteTrade(); }}
                          disabled={currentUser.kycStatus !== 'verified' || currentUser.balance <= 0}
                          className={`flex-1 font-bold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1 ${
                            currentUser.kycStatus === 'verified' && currentUser.balance > 0
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {(currentUser.kycStatus !== 'verified' || currentUser.balance <= 0) && <Lock className="w-3.5 h-3.5" />}
                          SELL / SHORT ({calculatedLots} Lots)
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

              {/* TAB 3: DEPOSIT */}
              {customerTab === 'deposit' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Deposit Funds Through Gateway</h3>
                      <p className="text-xs text-slate-500">
                        Enter amount in INR (₹). USD ($) trading credit is calculated automatically in real time[cite: 14].
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
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: WITHDRAW */}
              {customerTab === 'withdraw' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Withdraw Funds</h3>
                      <p className="text-xs text-slate-500">
                        Transfer your closed profits and cash equity directly to your bank account or UPI.
                      </p>
                    </div>

                    {withdrawNotice && (
                      <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{withdrawNotice}</span>
                      </div>
                    )}

                    <form onSubmit={handleWithdrawalSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="text-slate-600 block mb-1 font-semibold">Payout Destination</label>
                        <select
                          value={withdrawMethod}
                          onChange={(e) => setWithdrawMethod(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold text-xs"
                        >
                          <option value="UPI Transfer (Instant INR)">UPI Transfer (Instant INR via GPay, PhonePe, Paytm)</option>
                          <option value="National Bank Wire (NEFT/IMPS)">Bank Wire (NEFT / IMPS / RTGS)</option>
                          <option value="Crypto USDT (TRC-20)">Crypto Wallet Payout — USDT (TRC-20)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-slate-700 font-bold">Amount to Withdraw (USD $)</label>
                            <button
                              type="button"
                              onClick={() => setWithdrawAmountUsd(currentUser.balance.toFixed(2))}
                              className="text-[10px] text-blue-600 font-bold hover:underline"
                            >
                              Max ($ {currentUser.balance.toFixed(2)})
                            </button>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-2 font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              required
                              step="any"
                              min="10"
                              placeholder="500"
                              value={withdrawAmountUsd}
                              onChange={(e) => setWithdrawAmountUsd(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-600 text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-700 block mb-1 font-bold text-emerald-700">
                            Estimated Payout (INR ₹)
                          </label>
                          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono flex items-center justify-between">
                            <span className="text-sm font-black text-emerald-700">
                              ₹{((parseFloat(withdrawAmountUsd) || 0) * USD_INR_RATE).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-slate-400">Rate: ₹{USD_INR_RATE}/$</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-600 block mb-1 font-semibold">
                          Beneficiary Details (UPI VPA / Bank Account & IFSC / USDT Address)
                        </label>
                        <textarea
                          required
                          rows="3"
                          placeholder="e.g. UPI ID: username@oksbi OR Bank A/C: 123456789, IFSC: SBIN0001234, Name: Johnathan Smith"
                          value={withdrawBeneficiaryDetails}
                          onChange={(e) => setWithdrawBeneficiaryDetails(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-mono text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={currentUser.balance <= 0}
                        className={`w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition shadow-lg ${
                          currentUser.balance > 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                            : 'bg-slate-300 cursor-not-allowed text-slate-500'
                        }`}
                      >
                        Request Payout
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono">Payout Governance</span>
                      <h4 className="text-lg font-black text-slate-900 mt-1">Withdrawal Policy</h4>
                      <p className="text-xs text-slate-500 mt-1">Instant processing with full transparency.</p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 font-mono">
                      Available Cash: <strong>${currentUser.balance.toFixed(2)} USD</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SELF TRADING PORTFOLIO */}
              {customerTab === 'portfolio' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Your Open Self-Trade Positions</h3>
                      <p className="text-xs text-slate-500">Live prices update continuously with floating unrealized profit and loss.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Invested Margin</span>
                        <strong className="text-slate-800">${portfolioSummary.totalAllocated.toFixed(2)}</strong>
                      </div>
                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-[10px] text-slate-400 block font-sans">Current Value</span>
                        <strong className="text-slate-900">${portfolioSummary.totalCurrentValue.toFixed(2)}</strong>
                      </div>
                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-[10px] text-slate-400 block font-sans">Floating P&L</span>
                        <strong className={portfolioSummary.totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {portfolioSummary.totalPnL >= 0 ? '+' : ''}${portfolioSummary.totalPnL.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 whitespace-nowrap">
                        <tr>
                          <th className="p-3">Trade ID</th>
                          <th className="p-3">Asset</th>
                          <th className="p-3">Side</th>
                          <th className="p-3">Allocated Margin</th>
                          <th className="p-3">Fractional Units</th>
                          <th className="p-3">Entry Price</th>
                          <th className="p-3">Current Price</th>
                          <th className="p-3">Current Value</th>
                          <th className="p-3">Unrealized P&L</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentUser.trades && currentUser.trades.length > 0 ? (
                          currentUser.trades.map((t) => {
                            const { currentPrice, decimals, unrealizedPnL, pnlPercentage, currentValue } = computeTradeMetrics(t);
                            const isProfit = unrealizedPnL >= 0;

                            return (
                              <tr key={t.id} className="hover:bg-slate-50/70 transition">
                                <td className="p-3 text-slate-400">{t.id}</td>
                                <td className="p-3 font-bold text-slate-900">{t.symbol}</td>
                                <td className={`p-3 font-bold ${t.side === 'BUY' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {t.side} {t.leverage}x
                                </td>
                                <td className="p-3 font-semibold text-slate-800">${(t.marginAllocated || 0).toFixed(2)}</td>
                                <td className="p-3 text-blue-700 font-semibold">{t.units}</td>
                                <td className="p-3 text-slate-500">{t.entryPrice.toFixed(decimals)}</td>
                                <td className="p-3 font-bold text-slate-900">{currentPrice.toFixed(decimals)}</td>
                                <td className="p-3 font-black text-slate-900">${currentValue.toFixed(2)}</td>
                                <td className="p-3">
                                  <span className={`inline-flex items-center gap-1 font-black px-2 py-0.5 rounded text-[11px] ${
                                    isProfit
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    {isProfit ? '+' : ''}${unrealizedPnL.toFixed(2)} ({isProfit ? '+' : ''}{pnlPercentage.toFixed(2)}%)
                                  </span>
                                </td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => handleCloseTrade(t.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                                      isProfit
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                                    }`}
                                  >
                                    Close & Realize (${currentValue.toFixed(2)})
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr><td colSpan="10" className="p-6 text-center text-slate-400 font-sans">No open self-trades.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: WALLET */}
              {customerTab === 'wallet' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Your Complete Ledger History</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="p-3">Reference</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Method / Details</th>
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
                              <td className={`p-3 font-bold ${l.amount >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                                {l.amount >= 0 ? `+$${l.amount.toLocaleString()}` : `-$${Math.abs(l.amount).toLocaleString()}`}
                              </td>
                              <td className={`p-3 text-right font-bold ${
                                l.status.includes('Approved') || l.status.includes('Processed') || l.status.includes('Returned') || l.status.includes('Profit')
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
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Client Accounts, Deposits, Pools & Payouts</h2>
                    <p className="text-xs text-slate-500">Inspection mode only. Review submitted documentation, deposit requests, and withdrawal holds.</p>
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
                        <th className="p-3.5">Wallet Balance</th>
                        <th className="p-3.5">Managed in Pools</th>
                        <th className="p-3.5">KYC Status</th>
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
                            <td className="p-3.5 font-bold text-blue-600">${(u.allocatedInPools || 0).toLocaleString()}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.kycStatus === 'verified'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {u.kycStatus}
                              </span>
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
          {/* SUPER ADMIN: MASTER POOL TRADING, DEPOSITS, PAYOUTS     */}
          {/* ======================================================== */}
          {currentUser.role === 'admin' && (
            <div className="space-y-6">
              {/* SECTION 1: MASTER STRATEGY POOL TRADING & PROFIT DISTRIBUTION */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl shadow-xl p-8 space-y-5 border border-blue-800">
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      Master Desk Operations
                    </span>
                    <h2 className="text-xl font-black text-white mt-1">Master Trade Profit Distribution</h2>
                    <p className="text-xs text-blue-200">
                      Post a winning trade for a managed strategy pool. Profits automatically distribute across all enrolled investors proportionally.
                    </p>
                  </div>
                  <Briefcase className="w-6 h-6 text-amber-400" />
                </div>

                <form onSubmit={handleAdminDistributeMasterProfit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Select Strategy Pool</label>
                    <select
                      value={distributePoolId}
                      onChange={(e) => setDistributePoolId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold text-xs"
                    >
                      {managedPools.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.riskLevel})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Master Trade Profit Percentage (%)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-bold text-emerald-400">+</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="3.5"
                        value={distributeProfitPct}
                        onChange={(e) => setDistributeProfitPct(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-white font-mono font-bold text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
                  >
                    Distribute Profit to Pool
                  </button>
                </form>
              </div>

              {/* SECTION 2: INCOMING DEPOSITS */}
              <div className="bg-white border border-blue-300 rounded-3xl shadow-xl p-8 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      Gateway Deposit Queue
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-1">Pending Client Deposit Requests</h2>
                    <p className="text-xs text-slate-500">
                      Verify transaction reference and choose Accept to credit balance or Reject to decline[cite: 14].
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

              {/* SECTION 3: WITHDRAWAL PAYOUT QUEUE */}
              <div className="bg-white border border-emerald-300 rounded-3xl shadow-xl p-8 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      Payout & Disbursal Queue
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-1">Client Withdrawal Requests</h2>
                    <p className="text-xs text-slate-500">
                      Transfer funds to investor's bank/UPI and approve payout to complete transaction.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl">
                    {withdrawalRequests.filter((w) => w.status === 'pending').length} Pending Payouts
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Withdrawal ID</th>
                        <th className="p-3.5">Client</th>
                        <th className="p-3.5">Destination & Beneficiary</th>
                        <th className="p-3.5">USD Payout</th>
                        <th className="p-3.5">INR Disbursal</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Disbursal Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {withdrawalRequests.length > 0 ? (
                        withdrawalRequests.map((wth) => (
                          <tr key={wth.id} className="hover:bg-slate-50">
                            <td className="p-3.5 text-slate-400">{wth.id}</td>
                            <td className="p-3.5 font-bold text-slate-900 font-sans">
                              {wth.userName}
                              <span className="text-[10px] text-slate-400 font-mono block">{wth.userEmail}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-800 block">{wth.method}</span>
                              <span className="text-[10px] text-slate-600 block break-all font-sans">{wth.beneficiary}</span>
                            </td>
                            <td className="p-3.5 font-black text-slate-900 text-sm">
                              ${wth.amountUsd.toFixed(2)} USD
                            </td>
                            <td className="p-3.5 font-bold text-emerald-700">
                              ₹{wth.amountInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                wth.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : wth.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {wth.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              {wth.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleAdminApproveWithdrawal(wth.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition shadow-sm"
                                  >
                                    Approve & Mark Paid
                                  </button>
                                  <button
                                    onClick={() => handleAdminRejectWithdrawal(wth.id)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-3 py-1 rounded-lg text-[10px] font-bold transition"
                                  >
                                    Reject (Refund)
                                  </button>
                                </>
                              ) : (
                                <span className="text-slate-400 text-[10px] italic">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="7" className="p-6 text-center text-slate-400 font-sans">No withdrawal requests placed yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 4: MASTER KYC CLEARANCE & BALANCES */}
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
                        <th className="p-3.5">Cash Balance</th>
                        <th className="p-3.5">Pool Investments</th>
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
                            <td className="p-3.5 font-bold text-blue-600">${(u.allocatedInPools || 0).toLocaleString()}</td>
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
                        <tr><td colSpan="7" className="p-6 text-center text-slate-400 font-sans">No client records registered yet.</td></tr>
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
