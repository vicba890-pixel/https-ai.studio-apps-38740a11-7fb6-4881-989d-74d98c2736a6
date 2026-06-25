import { useState, useEffect } from 'react';
import { 
  DollarSign, ArrowUpRight, ArrowDownLeft, Send, History, CheckCircle, 
  Search, Shield, Layers, HelpCircle, User, Info, FileText, X, AlertOctagon, Heart, Coins,
  QrCode, Percent, RefreshCw, Smartphone, TrendingUp, Check, Building, Landmark, Sparkles
} from 'lucide-react';
import { Transaction, Contact, SecurityState, TransactionType } from '../types';
import { translations, Language } from '../translations';
import { playChimeSuccess, playCashRegister, playScannerBeep, playKeyTap } from '../utils/sound';
import PymeDashboard from './PymeDashboard';

interface WalletProps {
  balance: number;
  transactions: Transaction[];
  contacts: Contact[];
  security: SecurityState;
  onUpdateBalance: (newBalance: number) => void;
  onAddTransaction: (transaction: Transaction) => void;
  onAddLog: (action: string, category: 'security' | 'wallet' | 'system', detail: string) => void;
  lang: Language;
}

export default function Wallet({ 
  balance, 
  transactions, 
  contacts, 
  security, 
  onUpdateBalance, 
  onAddTransaction,
  onAddLog,
  lang
}: WalletProps) {
  const t = translations[lang];
  // Navigation within wallet
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'send' | 'withdraw' | 'history' | 'converter' | 'qr' | 'pyme' | 'creador' | 'licencia'>('all');
  
  // Forms inputs
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [customName, setCustomName] = useState('');

  // --- AWS Licensing states ---
  const [licenseeName, setLicenseeName] = useState('');
  const [licenseeCompany, setLicenseeCompany] = useState('');
  const [licenseeIndustry, setLicenseeIndustry] = useState('Tecnología & Finanzas');
  const [licenseeEmail, setLicenseeEmail] = useState('');
  const [loadingLicense, setLoadingLicense] = useState(false);
  const [generatedLicense, setGeneratedLicense] = useState<{
    contractTitle: string;
    licenseeDetails: string;
    licenseKey: string;
    securitySignature: string;
    contractBody: string;
    legalStipulations: string[];
    complianceChecklist: {
      awsStandard: string;
      esModuleBundled: string;
      ramFootprint: string;
    };
  } | null>(null);

  // --- Creator support states ---
  const [supportAmountPreset, setSupportAmountPreset] = useState<number | 'custom'>(0.25);
  const [supportCustomAmount, setSupportCustomAmount] = useState('');
  const [operatorRespChecked, setOperatorRespChecked] = useState(false);
  const [creatorSupportTotal, setCreatorSupportTotal] = useState<number>(() => {
    return parseFloat(localStorage.getItem('triosphere_creator_support_total') || '0.00');
  });

  useEffect(() => {
    localStorage.setItem('triosphere_creator_support_total', creatorSupportTotal.toString());
  }, [creatorSupportTotal]);
  
  // Security validation state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [pinError, setPinError] = useState(false);

  // Search in history
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Interactive Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // --- NEW ADVANCED STATES ---
  // Local tax jurisdiction state (Mercosur/BRL Pix, AR, US, EU, None)
  const [taxRegion, setTaxRegion] = useState<'br_pix' | 'ar_iva' | 'us_sales' | 'eu_vat' | 'none'>(() => {
    return (localStorage.getItem('triosphere_tax_region') as any) || 'br_pix';
  });

  useEffect(() => {
    localStorage.setItem('triosphere_tax_region', taxRegion);
  }, [taxRegion]);

  const getTaxRate = () => {
    switch (taxRegion) {
      case 'br_pix': return 0.005; // 0.5% (Pix SPI + IOF)
      case 'ar_iva': return 0.222; // 22.2% (IVA + Brutos)
      case 'us_sales': return 0.0825; // 8.25% (Sales Tax)
      case 'eu_vat': return 0.19; // 19.0% (EU standard VAT)
      default: return 0.0;
    }
  };

  const getTaxLabel = () => {
    switch (taxRegion) {
      case 'br_pix': return 'Pix SPI + IOF (0.5%)';
      case 'ar_iva': return 'IVA + Ingresos Brutos (22.2%)';
      case 'us_sales': return 'US Sales Tax (8.25%)';
      case 'eu_vat': return 'U.E. standard VAT (19.0%)';
      default: return 'No Tributario (0.0%)';
    }
  };

  // Currency Converter state
  const [convAmount, setConvAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'BRL' | 'EUR' | 'BTC' | 'ETH'>('USD');
  const [toCurrency, setToCurrency] = useState<'USD' | 'BRL' | 'EUR' | 'BTC' | 'ETH'>('BRL');

  const rates: Record<string, number> = {
    USD: 1.0,
    BRL: 5.45,
    EUR: 0.92,
    BTC: 0.000015,
    ETH: 0.00028,
  };

  const getConvertedAmount = () => {
    const amt = parseFloat(convAmount);
    if (isNaN(amt) || amt <= 0) return '0.00';
    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];
    const usdEquiv = amt / rateFrom;
    const finalVal = usdEquiv * rateTo;
    if (toCurrency === 'BTC' || toCurrency === 'ETH') {
      return finalVal.toFixed(6);
    }
    return finalVal.toFixed(2);
  };

  // QR Code Simulator state
  const [laserPulse, setLaserPulse] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setLaserPulse(p => !p);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // PyMe audits & personal bank node linking states
  const [pymeSales, setPymeSales] = useState<number>(() => {
    return parseFloat(localStorage.getItem('triosphere_pyme_sales') || '1480.00');
  });
  const [pymeTaxesPaid, setPymeTaxesPaid] = useState<number>(() => {
    return parseFloat(localStorage.getItem('triosphere_pyme_taxes_paid') || '148.50');
  });
  const [bankNodeLinked, setBankNodeLinked] = useState<boolean>(() => {
    return localStorage.getItem('triosphere_bank_linked') === 'true';
  });
  const [bankAccountNum, setBankAccountNum] = useState(() => {
    return localStorage.getItem('triosphere_bank_account') || 'BR-28192-SPI-PXR';
  });

  const handleLinkBankNode = () => {
    playChimeSuccess();
    const newLinked = !bankNodeLinked;
    setBankNodeLinked(newLinked);
    localStorage.setItem('triosphere_bank_linked', newLinked ? 'true' : 'false');
    if (newLinked) {
      onAddLog('Personal Bank Link', 'security', `Sincronización segura de nodo bancario personal clave: IP ${bankAccountNum}`);
    } else {
      onAddLog('Personal Bank Unlink', 'security', 'Se apagó la sincronización directa del banco personal.');
    }
  };

  // Helper to generate security hash simulator
  const generateHash = (type: string, amount: number) => {
    const chars = '0123456789ABCDEF';
    let checksum = 'TX' + type.substring(0, 2).toUpperCase();
    for (let i = 0; i < 12; i++) {
      checksum += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return checksum;
  };

  const handleActionWithSecurity = (action: () => void, description: string) => {
    // Check if locked
    if (security.isLocked) {
      alert('La billetera está bloqueada debido a intentos fallidos. Ve a Seguridad para reestablecer la configuración.');
      return;
    }

    if (security.pinSetup) {
      setPendingAction(() => action);
      setPinModalOpen(true);
      setEnteredPin('');
      setPinError(false);
    } else {
      // Execute directly
      action();
    }
  };

  const verifyPinAndExecute = () => {
    if (enteredPin === security.securityPin) {
      if (pendingAction) {
        pendingAction();
      }
      setPinModalOpen(false);
      setPendingAction(null);
      setEnteredPin('');
      setPinError(false);
    } else {
      setPinError(true);
      onAddLog('Intento de Fuga PIN', 'security', `Se ingresó un PIN erróneo en una transacción.`);
    }
  };

  // 1. DEPOSIT ACTION (No micro-fee for adding funds to promote user growth)
  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Por favor introduce un monto válido superior a $0.');
      return;
    }

    const action = () => {
      const newBal = balance + amt;
      const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
      const newTx: Transaction = {
        id: txId,
        date: new Date().toLocaleString(),
        type: 'deposit',
        description: 'Depósito en Efectivo Simulador',
        sender: 'Banco Externo',
        receiver: 'Mi Wallet Nexus',
        amount: amt,
        devFee: 0,
        finalAmount: amt,
        status: 'completed',
        securityHash: generateHash('deposit', amt)
      };

      playCashRegister();
      onUpdateBalance(newBal);
      onAddTransaction(newTx);
      onAddLog('Depósito Exitoso', 'wallet', `Carga de $${amt.toFixed(2)} sin costos dev.`);
      setDepositAmount('');
      setActiveTab('all');
      setSelectedReceipt(newTx);
    };

    action(); // Deposit doesn't need confidential confirmation unless specified
  };

  // 2. WITHDRAW ACTION (Deducts amount + 0.05 dev fee + Local Jurisdiction Tax)
  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Por favor introduce un monto de retiro válido.');
      return;
    }

    const taxAmt = amt * getTaxRate();
    const totalDeduction = amt + 0.05 + taxAmt;
    if (totalDeduction > balance) {
      alert(`Saldo insuficiente. Necesitas $${totalDeduction.toFixed(2)} (Monto: $${amt.toFixed(2)} + Micropago: $0.05 + Impuesto Local (${getTaxLabel()}): $${taxAmt.toFixed(2)}). Tu saldo actual es $${balance.toFixed(2)}.`);
      return;
    }

    if (security.transactionLimit > 0 && amt > security.transactionLimit) {
      alert(`La transacción supera el límite diario de seguridad establecido ($${security.transactionLimit.toFixed(2)}).`);
      return;
    }

    const execute = () => {
      const newBal = balance - totalDeduction;
      const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
      const newTx: Transaction = {
        id: txId,
        date: new Date().toLocaleString(),
        type: 'withdraw',
        description: `Retiro - Fiscal ${getTaxLabel()}`,
        sender: 'Mi Wallet Nexus',
        receiver: 'Cuenta de Banco Principal',
        amount: amt,
        devFee: 0.05,
        taxPaid: taxAmt,
        taxRate: getTaxRate(),
        finalAmount: -totalDeduction,
        status: 'completed',
        securityHash: generateHash('withdraw', amt)
      };

      playChimeSuccess();
      onUpdateBalance(newBal);
      onAddTransaction(newTx);
      
      // Update local PyMe fiscal accumulator (FIRST: Local taxes are separated)
      const newTaxesPaid = pymeTaxesPaid + taxAmt;
      setPymeTaxesPaid(newTaxesPaid);
      localStorage.setItem('triosphere_pyme_taxes_paid', newTaxesPaid.toFixed(2));

      // SECOND: 5 cents (0.05 USD) devFee is separated & transferred to creator's node/wallet balance
      setCreatorSupportTotal(prev => {
        const next = prev + 0.05;
        localStorage.setItem('triosphere_creator_support_total', next.toFixed(2));
        return next;
      });

      onAddLog('Retiro Exitoso', 'wallet', `Retiro de $${amt.toFixed(2)}: Impuesto Local $${taxAmt.toFixed(2)} separado primero, luego 5¢ ruteados a Creador.`);
      setWithdrawAmount('');
      setActiveTab('all');
      setSelectedReceipt(newTx);
    };

    handleActionWithSecurity(execute, `Retirar $${amt.toFixed(2)}`);
  };

  // 3. SEND ACTION (Deducts amount + 0.05 dev fee + Local Jurisdiction Tax)
  const handleSend = () => {
    const amt = parseFloat(sendAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Monto de transferencia inválido.');
      return;
    }

    const taxAmt = amt * getTaxRate();
    const totalDeduction = amt + 0.05 + taxAmt;
    if (totalDeduction > balance) {
      alert(`Saldo insuficiente. Necesitas $${totalDeduction.toFixed(2)} ($${amt.toFixed(2)} de envío + $0.05 de micropago + Impuesto Local (${getTaxLabel()}): $${taxAmt.toFixed(2)}).`);
      return;
    }

    if (security.transactionLimit > 0 && amt > security.transactionLimit) {
      alert(`Supera el límite diario configurado de $${security.transactionLimit.toFixed(2)}.`);
      return;
    }

    let recipientName = 'Destinatario Externo';
    let destination = customAddress || '0xSimulatedWalletAddress';

    if (selectedContactId) {
      const contact = contacts.find(c => c.id === selectedContactId);
      if (contact) {
        recipientName = contact.name;
        destination = contact.walletAddress;
      }
    } else if (customName) {
      recipientName = customName;
    }

    const execute = () => {
      const newBal = balance - totalDeduction;
      const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
      const newTx: Transaction = {
        id: txId,
        date: new Date().toLocaleString(),
        type: 'transfer',
        description: `Envío a ${recipientName}`,
        sender: 'Mi Wallet Nexus',
        receiver: destination,
        amount: amt,
        devFee: 0.05,
        taxPaid: taxAmt,
        taxRate: getTaxRate(),
        finalAmount: -totalDeduction,
        status: 'completed',
        securityHash: generateHash('transfer', amt)
      };

      playChimeSuccess();
      onUpdateBalance(newBal);
      onAddTransaction(newTx);

      // Update local PyMe fiscal accumulator (FIRST: Local taxes are separated)
      const newTaxesPaid = pymeTaxesPaid + taxAmt;
      setPymeTaxesPaid(newTaxesPaid);
      localStorage.setItem('triosphere_pyme_taxes_paid', newTaxesPaid.toFixed(2));

      // SECOND: 5 cents (0.05 USD) devFee is separated & transferred to creator's node/wallet balance
      setCreatorSupportTotal(prev => {
        const next = prev + 0.05;
        localStorage.setItem('triosphere_creator_support_total', next.toFixed(2));
        return next;
      });

      onAddLog('Envío de Fondos', 'wallet', `Enviados $${amt.toFixed(2)} a ${recipientName}. Impuesto Local $${taxAmt.toFixed(2)} priorizado primero, luego 5¢ separados al Creador.`);
      setSendAmount('');
      setSelectedContactId('');
      setCustomAddress('');
      setCustomName('');
      setActiveTab('all');
      setSelectedReceipt(newTx);
    };

    handleActionWithSecurity(execute, `Enviar $${amt.toFixed(2)} a ${recipientName}`);
  };

  // 3b. DIRECT CREATOR SUPPORT MICRO-PAYMENT
  const handleSendCreatorSupport = () => {
    const finalAmt = supportAmountPreset === 'custom' ? parseFloat(supportCustomAmount) : supportAmountPreset;
    
    if (isNaN(finalAmt) || finalAmt <= 0) {
      alert(lang === 'en' ? 'Please set a valid support amount.' : lang === 'pt' ? 'Insira um valor de apoio válido.' : 'Por favore ingresa un monto válido de micropago para apoyar.');
      return;
    }

    if (!operatorRespChecked) {
      alert(lang === 'en' ? 'You must accept the operator device safety responsibility.' : lang === 'pt' ? 'Você deve aceitar a responsabilidade de segurança do dispositivo.' : 'Debes confirmar que asumes total responsabilidad por la operación del celular y seguridad de tu dispositivo.');
      return;
    }

    if (finalAmt > balance) {
      alert(lang === 'en' ? 'Insufficient balance.' : lang === 'pt' ? 'Saldo insuficiente.' : `Saldo insuficiente. Tu saldo actual es de $${balance.toFixed(2)}.`);
      return;
    }

    const execute = () => {
      const newBal = balance - finalAmt;
      const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
      const newTx: Transaction = {
        id: txId,
        date: new Date().toLocaleString(),
        type: 'transfer',
        description: lang === 'en' ? 'Creator Support Micro-Payment' : lang === 'pt' ? 'Apoio Direto ao Criador' : 'Apoyo Solidario al Creador (VicBa890)',
        sender: 'Mi Wallet Nexus',
        receiver: '0xDEV777FFFAAA882E... (VicBa890)',
        amount: finalAmt,
        devFee: 0, // Direct support is exempt from developer micro-fee!
        finalAmount: -finalAmt,
        status: 'completed',
        securityHash: generateHash('support', finalAmt)
      };

      playChimeSuccess();
      onUpdateBalance(newBal);
      onAddTransaction(newTx);
      setCreatorSupportTotal(prev => prev + finalAmt);

      onAddLog('Apoyo Solidario', 'wallet', `Transferidos $${finalAmt.toFixed(2)} a la wallet del creador (VicBa890 / vicba890@gmail.com).`);
      
      setSupportCustomAmount('');
      setActiveTab('all');
      setSelectedReceipt(newTx);
    };

    handleActionWithSecurity(execute, `Apoyar con $${finalAmt.toFixed(2)}`);
  };

  // 3c. AWS COMMERCIAL LICENSING PORTAL CONTROLLER
  const handleGenerateLicense = async () => {
    if (!licenseeName.trim()) {
      alert(lang === 'en' ? 'Please enter a name for the licensee.' : 'Por favor ingresa un nombre para el adquirente de la licencia.');
      return;
    }
    setLoadingLicense(true);
    setGeneratedLicense(null);
    playKeyTap();
    
    try {
      const response = await fetch('/api/pyme/ai-licensing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: licenseeName,
          company: licenseeCompany,
          industry: licenseeIndustry,
          email: licenseeEmail,
          price: 2800,
          licenseType: 'No Exclusiva Standard (As-Is / AWS AMI)'
        })
      });
      
      if (!response.ok) {
        throw new Error('Error en servidor al compilar la licencia.');
      }
      
      const data = await response.json();
      setGeneratedLicense(data);
      onAddLog('Licenciamiento AWS', 'system', `Se compiló licencia comercial para ${licenseeName} (${licenseeCompany}) bajo firma SHA256.`);
      playChimeSuccess();
    } catch (err) {
      console.error(err);
      alert('Error al generar licencia con AI.');
    } finally {
      setLoadingLicense(false);
    }
  };

  // Filter transactions for Detailed History
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.receiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.securityHash.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && tx.type === filterType;
  });

  return (
    <div className="flex flex-col h-full space-y-4 overflow-y-auto px-1 py-1 pb-16">
      {/* 1. Main Premium Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-5 rounded-2xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
        {/* Decorative Light Glows */}
        <div className="absolute -top-1/2 -left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Android Nexus Wallet</span>
            <h2 className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight flex items-baseline">
              <span className="text-yellow-400 text-lg mr-1">$</span>
              {balance.toFixed(2)}
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Fondos Protegidos por Hardware
            </p>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <Coins className="w-6 h-6 text-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Developer Micropayment Info Box */}
        <div className="mt-4 bg-slate-950/60 p-2.5 rounded-xl border border-pink-500/20 relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 shrink-0 fill-pink-500/20" />
            <div>
              <p className="text-[10px] font-bold text-pink-300">Soporte Solidario de Desarrollador</p>
              <p className="text-[9px] text-slate-350 leading-normal">
                Aplica un micropago de <span className="text-pink-400 font-extrabold">5¢</span> por transacción.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setActiveTab('creador'); playKeyTap(); }}
            className="text-[9px] font-black uppercase text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 px-2 py-1 rounded-lg border border-pink-500/30 shrink-0 transition-all cursor-pointer"
          >
            {lang === 'en' ? 'Support' : lang === 'pt' ? 'Apoiar' : 'Apoyar'}
          </button>
        </div>

        {/* New Jurisdiction Tax Selector */}
        <div className="mt-2 text-left bg-slate-950/40 p-2.5 rounded-xl border border-slate-850 relative z-10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-orange-400" />
              Jurisdicción Contable Local
            </span>
            <span className="text-[8px] font-mono font-extrabold text-orange-400 bg-orange-400/10 px-1 rounded">
              {getTaxLabel()}
            </span>
          </div>
          <select
            value={taxRegion}
            onChange={(e) => {
              const val = e.target.value as any;
              setTaxRegion(val);
              playChimeSuccess();
              onAddLog('Jurisdicción Cambiada', 'system', 'Se migró el entorno mercantil fiscal a: ' + val);
            }}
            className="w-full bg-slate-900 border border-slate-850 text-slate-300 text-[10px] font-bold rounded-lg py-1 px-1.5 focus:outline-none"
          >
            <option value="br_pix">Brasil SPI Pix - Mercosur Tax (0.5% IOF)</option>
            <option value="ar_iva">Argentina Coparticipación - IVA / Brutos (22.2%)</option>
            <option value="us_sales">US Federal/State - Combined Sales Tax (8.25%)</option>
            <option value="eu_vat">U.E. Standard - Harmonized VAT Hub (19.0%)</option>
            <option value="none">Isla Offshore - Sin Impuestos Locales (0.0% Exempt)</option>
          </select>
        </div>
      </div>

      {/* 2. Quick Actions Tabs (2-Row Layout) */}
      <div className="space-y-1.5">
        {/* Row 1: Core Operations */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => { setActiveTab('all'); playKeyTap(); }}
            className={`py-1.5 rounded-xl text-[9px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border ${
              activeTab === 'all' 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Resumen
          </button>
          <button
            onClick={() => { setActiveTab('deposit'); setDepositAmount(''); playKeyTap(); }}
            className={`py-1.5 rounded-xl text-[9px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border ${
              activeTab === 'deposit' 
                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200' 
                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
            Cargar
          </button>
          <button
            onClick={() => { setActiveTab('send'); setSendAmount(''); setSelectedContactId(''); playKeyTap(); }}
            className={`py-1.5 rounded-xl text-[9px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border ${
              activeTab === 'send' 
                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200' 
                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-pink-400" />
            Enviar
          </button>
          <button
            onClick={() => { setActiveTab('withdraw'); setWithdrawAmount(''); playKeyTap(); }}
            className={`py-1.5 rounded-xl text-[9px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border ${
              activeTab === 'withdraw' 
                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200' 
                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-orange-400" />
            Retirar
          </button>
        </div>

        {/* Row 2: Digital & Business Tools */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => { setActiveTab('converter'); playKeyTap(); }}
            className={`py-1.5 rounded-xl text-[9px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border ${
              activeTab === 'converter' 
                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-250' 
                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            Divisas
          </button>
          <button
            onClick={() => { setActiveTab('qr'); playKeyTap(); }}
            className={`py-1.5 rounded-xl text-[9px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border ${
              activeTab === 'qr' 
                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-250' 
                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            Lector QR
          </button>
          <button
            onClick={() => { setActiveTab('pyme'); playKeyTap(); }}
            className={`py-1.5 rounded-xl text-[9px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border ${
              activeTab === 'pyme' 
                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-250' 
                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            PyME Hub
          </button>
          <button
            onClick={() => { setActiveTab('history'); playKeyTap(); }}
            className={`py-1.5 rounded-xl text-[9px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border ${
              activeTab === 'history' 
                ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-250' 
                : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-500" />
            Historial
          </button>
        </div>
        
        {/* Dual Callout Actions: P2P Support & AWS Licensing */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('creador'); playKeyTap(); }}
            className={`py-2 px-2.5 rounded-xl text-[9px] font-extrabold flex items-center justify-center gap-1.5 transition-all border shadow-sm cursor-pointer ${
              activeTab === 'creador'
                ? 'bg-pink-950/40 border-pink-500/50 text-pink-200 shadow-pink-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Heart className="w-3 h-3 text-pink-500 fill-pink-500/20" />
            {lang === 'en' ? 'Support Creator (P2P)' : lang === 'pt' ? 'Apoiar Criador' : 'Apoyo Creador (P2P)'}
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('licencia'); playKeyTap(); }}
            className={`py-2 px-2.5 rounded-xl text-[9px] font-extrabold flex items-center justify-center gap-1.5 transition-all border shadow-sm cursor-pointer ${
              activeTab === 'licencia'
                ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-indigo-500/10'
                : 'bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 border-indigo-500/20 text-indigo-300 hover:border-indigo-500/40 hover:brightness-110'
            }`}
          >
            <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
            {lang === 'en' ? 'AWS Marketplace Lic.' : lang === 'pt' ? 'Licença AWS ($2800)' : 'Licencia AWS ($2800)'}
          </button>
        </div>
      </div>

      {/* 3. Panel Container */}
      <div className="bg-slate-900/50 border border-slate-850 rounded-xl p-4 min-h-[160px] relative">
        
        {/* CASE ALL / OVERVIEW */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 tracking-wide uppercase flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                Últimos Movimientos
              </h3>
              <button 
                onClick={() => setActiveTab('history')}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300"
              >
                Ver Historial Completo
              </button>
            </div>

            <div className="space-y-2">
              {transactions.slice(0, 3).map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setSelectedReceipt(tx)}
                  className="w-full bg-slate-950/50 hover:bg-slate-950/90 p-2.5 rounded-lg border border-slate-900 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${
                      tx.type === 'deposit' ? 'bg-emerald-950 text-emerald-400' :
                      tx.type === 'transfer' ? 'bg-indigo-950 text-indigo-400' :
                      tx.type === 'withdraw' ? 'bg-orange-950 text-orange-400' :
                      'bg-pink-950 text-pink-400'
                    }`}>
                      {tx.type === 'deposit' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : 
                       tx.type === 'transfer' ? <Send className="w-3.5 h-3.5" /> :
                       tx.type === 'withdraw' ? <ArrowUpRight className="w-3.5 h-3.5" /> :
                       <Coins className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{tx.description}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{tx.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-xs font-bold font-mono ${tx.finalAmount > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {tx.finalAmount > 0 ? '+' : ''}${tx.amount.toFixed(2)}
                    </p>
                    {tx.devFee > 0 && (
                      <p className="text-[8px] text-pink-400 italic">Fee: $0.05</p>
                    )}
                  </div>
                </button>
              ))}

              {transactions.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Aún no hay transacciones en esta billetera.
                </div>
              )}
            </div>
          </div>
        )}

        {/* CASE DEPOSIT */}
        {activeTab === 'deposit' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white">Simular Entrada de Fondos</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Agrega saldo de un banco ficticio para probar otras funciones de la app.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] text-slate-400 block mb-1">MONTO EN USD</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="20.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-950 text-white pl-7 pr-3 py-2 rounded-lg border border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/20 p-2 rounded-lg flex gap-1.5 items-start">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[9px] text-emerald-300 leading-normal">
                  Los depósitos no pagan tasa de desarrollador. Recibes el 100% del monto ingresado.
                </p>
              </div>

              <button
                onClick={handleDeposit}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Cargar Saldo
              </button>
            </div>
          </div>
        )}

        {/* CASE WITHDRAW */}
        {activeTab === 'withdraw' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white">Retirar Efectivo</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 animate-pulse">Saca saldo a tu cuenta externa principal.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] text-slate-400 block mb-1">MONTO A RETIRAR (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="10.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-950 text-white pl-7 pr-3 py-2 rounded-lg border border-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Dev Fee Breakdown */}
              {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] space-y-1">
                  <div className="flex justify-between text-slate-450">
                    <span>Monto de Retiro:</span>
                    <span>${parseFloat(withdrawAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-pink-400">
                    <span>Micropago desarrolladores:</span>
                    <span>+$0.05</span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold border-t border-slate-900 pt-1">
                    <span>Total a deducir del saldo:</span>
                    <span>${(parseFloat(withdrawAmount) + 0.05).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleWithdraw}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Autorizar Retiro (incluye 5¢ fee)
              </button>
            </div>
          </div>
        )}

        {/* CASE SEND */}
        {activeTab === 'send' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white">Transferencias Seguras</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Envía dinero de forma inmediata a tus contactos o wallet.</p>
            </div>

            <div className="space-y-3">
              {/* Quick Contacts */}
              <div>
                <label className="text-[9px] text-slate-400 block mb-1">SELECCIONAR CONTACTO POPULAR</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setSelectedContactId(contact.id);
                        setCustomName('');
                        setCustomAddress('');
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold shrink-0 cursor-pointer flex items-center gap-1.5 border transition-all ${
                        selectedContactId === contact.id
                          ? 'bg-indigo-650 border-indigo-400 text-white'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      {contact.name}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedContactId('');
                      setCustomName('');
                      setCustomAddress('');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold shrink-0 cursor-pointer border transition-all ${
                      !selectedContactId
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-950 border-slate-850 text-slate-400'
                    }`}
                  >
                    Dirección Externa
                  </button>
                </div>
              </div>

              {/* In case of Custom address */}
              {!selectedContactId && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-0.5">Nombre Destinatario</label>
                    <input
                      type="text"
                      placeholder="Ej: Sophia López"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-slate-950 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 block mb-0.5">Wallet hash o celular</label>
                    <input
                      type="text"
                      placeholder="0x3fA9..."
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      className="w-full bg-slate-900/80 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-850 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Amount input */}
              <div>
                <label className="text-[9px] text-slate-400 block mb-1 font-bold">MONTO A ENVIAR (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="5.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full bg-slate-950 text-white pl-7 pr-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Fee Breakdown */}
              {sendAmount && parseFloat(sendAmount) > 0 && (
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Monto de Envío:</span>
                    <span>${parseFloat(sendAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-pink-400">
                    <span>micropago de uso:</span>
                    <span>+$0.05</span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold border-t border-slate-900 pt-0.5">
                    <span>Total Deducido:</span>
                    <span>${(parseFloat(sendAmount) + 0.05).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSend}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-bold py-1.5 rounded-lg hover:brightness-110 transition-all"
              >
                Enviar Dinero Seguro
              </button>
            </div>
          </div>
        )}

        {/* CASE HISTORIAL DETALLADO (COMPLETE HISTORY) */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Historial Detallado</h3>
              <button 
                onClick={() => setActiveTab('all')}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Volver
              </button>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre, ID o firma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-xs text-white pl-8 pr-2 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[9px] font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-1 rounded-md shrink-0 border ${
                  filterType === 'all' ? 'bg-indigo-950 border-indigo-400 text-white' : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('deposit')}
                className={`px-2 py-1 rounded-md shrink-0 border ${
                  filterType === 'deposit' ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                Depósitos
              </button>
              <button
                onClick={() => setFilterType('transfer')}
                className={`px-2 py-1 rounded-md shrink-0 border ${
                  filterType === 'transfer' ? 'bg-indigo-900/30 border-indigo-500/30 text-indigo-300' : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                Envíos
              </button>
              <button
                onClick={() => setFilterType('delivery_payment')}
                className={`px-2 py-1 rounded-md shrink-0 border ${
                  filterType === 'delivery_payment' ? 'bg-amber-900/30 border-amber-500/30 text-amber-300' : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                Servicios
              </button>
              <button
                onClick={() => setFilterType('tip')}
                className={`px-2 py-1 rounded-md shrink-0 border ${
                  filterType === 'tip' ? 'bg-pink-900/30 border-pink-500/30 text-pink-300' : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                Tips / Streaming
              </button>
            </div>

            {/* Timeline scroll container */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => setSelectedReceipt(tx)}
                  className="w-full bg-slate-950/60 hover:bg-slate-950 p-2 rounded-lg border border-slate-900/60 flex items-center justify-between text-left"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] px-1 py-0.5 rounded uppercase font-bold ${
                        tx.type === 'deposit' ? 'bg-emerald-950 text-emerald-400' :
                        tx.type === 'transfer' ? 'bg-indigo-950 text-indigo-400' :
                        tx.type === 'withdraw' ? 'bg-orange-950 text-orange-400' :
                        'bg-pink-950 text-pink-400'
                      }`}>
                        {tx.type}
                      </span>
                      <span className="text-[8px] text-slate-500 font-mono">ID: {tx.id}</span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1 leading-tight">{tx.description}</p>
                    <p className="text-[8px] text-indigo-400 font-mono mt-0.5 truncate max-w-[150px]">{tx.securityHash}</p>
                  </div>

                  <div className="text-right">
                    <p className={`text-xs font-mono font-bold ${tx.finalAmount > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {tx.finalAmount > 0 ? '+' : ''}${tx.amount.toFixed(2)}
                    </p>
                    {tx.devFee > 0 && <span className="text-[8px] text-pink-400 font-bold">Includes 5¢ Fee</span>}
                  </div>
                </button>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  No se encontraron registros de transacciones.
                </div>
              )}
            </div>
          </div>
        )}

        {/* CASE CONVERTER */}
        {activeTab === 'converter' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                Convertidor de Monedas Unificado
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Calcula conversiones en tiempo real para transacciones y transferencias Mercosur Pix / USD / Euros.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/65 p-3 rounded-xl border border-slate-850">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] text-slate-500 block mb-1">DE MONEDA</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg text-[10px] py-1 px-1.5 text-white font-bold"
                  >
                    <option value="USD">USD - Dólar US</option>
                    <option value="BRL">BRL - Real/Pix</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="ETH">ETH - Ethereum</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] text-slate-500 block mb-1">A MONEDA</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg text-[10px] py-1 px-1.5 text-white font-bold"
                  >
                    <option value="USD">USD - Dólar US</option>
                    <option value="BRL">BRL - Real/Pix</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="ETH">ETH - Ethereum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[8px] text-slate-500 block mb-1">MONTO INGRESADO</label>
                <input
                  type="number"
                  value={convAmount}
                  onChange={(e) => {
                    setConvAmount(e.target.value);
                    playKeyTap();
                  }}
                  placeholder="100.00"
                  className="w-full bg-slate-900 text-white border border-slate-800 text-xs font-mono font-bold py-1 px-2.5 rounded-lg focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-slate-400 block">MONTO CONVERTIDO ESTIMADO</span>
                  <p className="text-xs font-extrabold text-cyan-400 font-mono">
                    {getConvertedAmount()} {toCurrency}
                  </p>
                </div>
                <div className="text-right text-[8px] text-slate-500 font-mono leading-tight">
                  1 USD = {rates.BRL.toFixed(2)} BRL <br />
                  1 EUR = {rates.EUR.toFixed(2)} USD equiv
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE QR SCANNER */}
        {activeTab === 'qr' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                Lector de Código QR Inteligente
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Simula el escaneo de facturas o transferencias inmediatas Pix / Mercosur con reducción activa de ruidos.
              </p>
            </div>

            <div className="relative aspect-[16/8] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-3">
              {/* Fake Camera Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e1e40_1px,transparent_1px)] [background-size:16px_16px] opacity-35" />
              
              {/* Laser Scanning Bar */}
              <div 
                className={`absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] transition-all duration-1000 ${
                  laserPulse ? 'top-2' : 'top-[95%]'
                }`}
              />

              {/* Target bracket focus box */}
              <div className="w-20 h-20 border-2 border-indigo-500/80 rounded-lg relative flex items-center justify-center bg-indigo-500/5">
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-indigo-400" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-indigo-400" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-indigo-400" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-indigo-400" />
                <QrCode className="w-8 h-8 text-indigo-300/40 animate-pulse" />
              </div>

              <span className="text-[8px] font-mono text-indigo-400 m-2.5 uppercase tracking-wider animate-pulse">
                Auto-Filtro HD Activo (Crystalline Link)
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider">Simular Escaneo de Factura:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <button
                  onClick={() => {
                    playScannerBeep();
                    const amt = 3.50;
                    const taxAmt = amt * getTaxRate();
                    const totalDeduction = amt + 0.05 + taxAmt;
                    if (totalDeduction > balance) {
                      alert('Saldo insuficiente para pagar esta compra mediante QR.');
                      return;
                    }
                    const newBal = balance - totalDeduction;
                    const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
                    const newTx: Transaction = {
                      id: txId,
                      date: new Date().toLocaleString(),
                      type: 'transfer',
                      description: 'Pago QR - Cafetería Premium',
                      sender: 'Mi Wallet Nexus',
                      receiver: 'Gourmet Coffee Shop',
                      amount: amt,
                      devFee: 0.05,
                      taxPaid: taxAmt,
                      taxRate: getTaxRate(),
                      finalAmount: -totalDeduction,
                      status: 'completed',
                      securityHash: generateHash('transfer', amt)
                    };
                    onUpdateBalance(newBal);
                    onAddTransaction(newTx);
                    
                    const newTaxesPaid = pymeTaxesPaid + taxAmt;
                    setPymeTaxesPaid(newTaxesPaid);
                    localStorage.setItem('triosphere_pyme_taxes_paid', newTaxesPaid.toFixed(2));

                    // SECOND: 5 cents (0.05 USD) devFee is separated & transferred to creator's node/wallet balance
                    setCreatorSupportTotal(prev => {
                      const next = prev + 0.05;
                      localStorage.setItem('triosphere_creator_support_total', next.toFixed(2));
                      return next;
                    });

                    onAddLog('Pago QR Exitoso', 'wallet', `Compra QR Cafetería Express de $${amt.toFixed(2)}. Impuestos de $${taxAmt.toFixed(2)} reservados primero.`);
                    setSelectedReceipt(newTx);
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-2 rounded-lg text-slate-300 text-left font-bold transition-all"
                >
                  ☕ Café Gourmet ($3.50 + Tax)
                </button>
                <button
                  onClick={() => {
                    playScannerBeep();
                    const amt = 45.00;
                    const taxAmt = amt * getTaxRate();
                    const totalDeduction = amt + 0.05 + taxAmt;
                    if (totalDeduction > balance) {
                      alert('Saldo insuficiente para pagar esta compra de combustible.');
                      return;
                    }
                    const newBal = balance - totalDeduction;
                    const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
                    const newTx: Transaction = {
                      id: txId,
                      date: new Date().toLocaleString(),
                      type: 'transfer',
                      description: 'Compra QR - Estación de Combustible',
                      sender: 'Mi Wallet Nexus',
                      receiver: 'Combustibles Shell V-Power',
                      amount: amt,
                      devFee: 0.05,
                      taxPaid: taxAmt,
                      taxRate: getTaxRate(),
                      finalAmount: -totalDeduction,
                      status: 'completed',
                      securityHash: generateHash('transfer', amt)
                    };
                    onUpdateBalance(newBal);
                    onAddTransaction(newTx);
                    
                    const newTaxesPaid = pymeTaxesPaid + taxAmt;
                    setPymeTaxesPaid(newTaxesPaid);
                    localStorage.setItem('triosphere_pyme_taxes_paid', newTaxesPaid.toFixed(2));

                    // SECOND: 5 cents (0.05 USD) devFee is separated & transferred to creator's node/wallet balance
                    setCreatorSupportTotal(prev => {
                      const next = prev + 0.05;
                      localStorage.setItem('triosphere_creator_support_total', next.toFixed(2));
                      return next;
                    });

                    onAddLog('Pago QR Exitoso', 'wallet', `Carga QR de gasolina de $${amt.toFixed(2)}. Impuestos de $${taxAmt.toFixed(2)} retenidos primero.`);
                    setSelectedReceipt(newTx);
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-2 rounded-lg text-slate-300 text-left font-bold transition-all"
                >
                  ⛽ Gasolina ($45.00 + Tax)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CASE PYME COMPLIANCE */}
        {activeTab === 'pyme' && (
          <PymeDashboard 
            balance={balance}
            pymeSales={pymeSales}
            setPymeSales={setPymeSales}
            pymeTaxesPaid={pymeTaxesPaid}
            setPymeTaxesPaid={setPymeTaxesPaid}
            onUpdateBalance={onUpdateBalance}
            onAddTransaction={onAddTransaction}
            onAddLog={onAddLog}
            lang={lang}
          />
        )}

        {/* CASE CREATOR SUPPORT */}
        {activeTab === 'creador' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="flex justify-between items-start pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20 animate-pulse" />
                  {lang === 'en' ? 'Support Creator Node' : lang === 'pt' ? 'Apoio Direto ao Criador' : 'Apoyo Solidario al Creador'}
                </h3>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  {lang === 'en' ? 'Direct secure micropayments supporting system updates.' : lang === 'pt' ? 'Micropagamentos diretos para apoiar o desenvolvedor.' : 'Micropagos directos para respaldar el desarrollo libre de anuncios.'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => { setActiveTab('all'); playKeyTap(); }}
                className="text-[9px] bg-slate-950 hover:bg-slate-900 px-2 py-1 rounded-lg text-slate-400 hover:text-white border border-slate-850 font-bold transition-all cursor-pointer"
              >
                {lang === 'en' ? 'Back' : lang === 'pt' ? 'Voltar' : 'Volver'}
              </button>
            </div>

            {/* Interactive Creator Active Node */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-2 relative">
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-[8px] font-semibold text-emerald-400 uppercase font-mono tracking-tight">Conectado</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-pink-400 font-extrabold text-xs">
                  VB
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-white">VicBa890 (Creador del Sistema)</h4>
                  <p className="text-[8px] text-indigo-400 font-mono">vicba890@gmail.com</p>
                </div>
              </div>

              <div className="border-t border-slate-905 pt-1.5 flex justify-between items-center text-[8px] font-mono text-slate-500">
                <span>Wallet Destino:</span>
                <span className="text-slate-400 text-[9px]">0xDEV777FFFAAA882E...</span>
              </div>
            </div>

            {/* Amount Presets */}
            <div className="space-y-2">
              <label className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Seleccionar Monto de Apoyo (USD)</label>
              <div className="grid grid-cols-5 gap-1">
                {[0.05, 0.25, 1.00, 5.00].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setSupportAmountPreset(amt); playKeyTap(); }}
                    className={`py-1 rounded text-[9px] font-mono font-bold transition-all border cursor-pointer ${
                      supportAmountPreset === amt
                        ? 'bg-pink-955/40 border-pink-500 text-pink-300'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    ${amt.toFixed(2)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setSupportAmountPreset('custom'); playKeyTap(); }}
                  className={`py-1 rounded text-[9px] font-bold transition-all border cursor-pointer ${
                    supportAmountPreset === 'custom'
                      ? 'bg-pink-955/40 border-pink-500 text-pink-200'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  {lang === 'en' ? 'Custom' : lang === 'pt' ? 'Outro' : 'Otro'}
                </button>
              </div>

              {supportAmountPreset === 'custom' && (
                <div className="relative animate-slide-up">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xxs font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Monto personalizado"
                    value={supportCustomAmount}
                    onChange={(e) => setSupportCustomAmount(e.target.value)}
                    className="w-full bg-slate-950 text-white pl-6 pr-3 py-1 rounded-lg border border-slate-850 text-[10px] font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}
            </div>

            {/* Operator responsibility Warning agreement checkbox */}
            <div className="bg-rose-955/10 border border-rose-500/20 p-2.5 rounded-lg space-y-1.5 flex items-start gap-1.5">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={operatorRespChecked}
                  onChange={(e) => { setOperatorRespChecked(e.target.checked); playKeyTap(); }}
                  className="mt-0.5 rounded border-slate-800 text-pink-600 focus:ring-0 focus:ring-offset-0 bg-slate-150 w-3 h-3 cursor-pointer"
                />
                <span className="text-[8px] text-slate-350 leading-normal select-none">
                  {lang === 'en' 
                    ? 'I declare that device operation risks and safety are under my absolute responsibility as the phone operator.'
                    : lang === 'pt'
                    ? 'Declaro que o uso deste celular e segurança de dados são de minha única responsabilidade.'
                    : 'Entiendo que el uso de la app es bajo la exclusiva responsabilidad de quien opera el celular y soy gestor único de la seguridad de mi dispositivo.'}
                </span>
              </label>
            </div>

            {/* Action buttons and Statistics */}
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={handleSendCreatorSupport}
                className="grow bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] font-extrabold py-2 rounded-xl transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer"
              >
                <Heart className="w-3 h-3 fill-white/10" />
                {lang === 'en' ? 'Send Support Micropayment' : lang === 'pt' ? 'Enviar Micropagamento' : 'Enviar Micropago de Apoyo'}
              </button>

              <div className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-850 shrink-0 text-right min-w-[70px]">
                <span className="text-[7px] text-slate-500 font-mono block">TU APOYO</span>
                <span className="text-[9px] font-mono font-extrabold text-pink-400">${creatorSupportTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE AWS LICENSING PORTAL */}
        {activeTab === 'licencia' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="flex justify-between items-start pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-indigo-400" />
                  Portal de Licenciamiento AWS
                </h3>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Simulación de distribución directa "As-Is" de Prototipo TrioSphere Lite.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => { setActiveTab('all'); playKeyTap(); }}
                className="text-[9px] bg-slate-950 hover:bg-slate-900 px-2 py-1 rounded-lg text-slate-400 hover:text-white border border-slate-850 font-bold transition-all cursor-pointer"
              >
                Volver
              </button>
            </div>

            {/* AWS Product Metadata Card */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 space-y-2 relative">
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-[7px] font-semibold text-indigo-400 uppercase font-mono tracking-tight">AWS Direct AMI</span>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-white">TrioSphere Standard Licensed Prototype</h4>
                <p className="text-[8px] text-slate-400 mt-0.5">Distribución comercial portable sin exclusividad para adquirentes.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-900 pt-2 text-[8px] font-mono">
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-850/50">
                  <span className="text-slate-500 block text-[7px]">VALOR LICENCIA</span>
                  <span className="text-indigo-400 font-bold font-sans text-[11px]">$2,800.00 USD</span>
                  <span className="text-slate-500 block text-[6px]">(Impuestos Incluidos)</span>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-850/50">
                  <span className="text-slate-500 block text-[7px]">MODALIDAD</span>
                  <span className="text-emerald-400 font-bold text-[9px]">SaaS / On-Premise</span>
                  <span className="text-slate-500 block text-[6px]">Portable as-is</span>
                </div>
              </div>
            </div>

            {/* Interactive Form to Customize License with AI */}
            <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5 pb-1 border-b border-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <h4 className="text-[9px] font-bold text-white uppercase tracking-wider font-mono">Compilador de Licencia AI</h4>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[8px] text-slate-400 block uppercase font-mono font-bold">Nombre del Licenciatario</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={licenseeName}
                  onChange={(e) => setLicenseeName(e.target.value)}
                  className="w-full bg-slate-950 text-white px-2 py-1 rounded-lg border border-slate-850 text-[10px] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[8px] text-slate-400 block uppercase font-mono font-bold">Compañía / Razón Social</label>
                  <input
                    type="text"
                    placeholder="Ej: Inversiones Nexus S.A."
                    value={licenseeCompany}
                    onChange={(e) => setLicenseeCompany(e.target.value)}
                    className="w-full bg-slate-950 text-white px-2 py-1 rounded-lg border border-slate-850 text-[10px] focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] text-slate-400 block uppercase font-mono font-bold">Industria Principal</label>
                  <input
                    type="text"
                    placeholder="Ej: Fintech, SaaS, etc"
                    value={licenseeIndustry}
                    onChange={(e) => setLicenseeIndustry(e.target.value)}
                    className="w-full bg-slate-950 text-white px-2 py-1 rounded-lg border border-slate-850 text-[10px] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] text-slate-400 block uppercase font-mono font-bold">Correo de Contacto</label>
                <input
                  type="email"
                  placeholder="Ej: compras@compania.com"
                  value={licenseeEmail}
                  onChange={(e) => setLicenseeEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white px-2 py-1 rounded-lg border border-slate-850 text-[10px] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateLicense}
                disabled={loadingLicense}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold py-2 rounded-xl transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingLicense ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Compilando Contrato de Licencia...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Firmar & Generar Contrato Comercial</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Contract Display */}
            {generatedLicense && (
              <div className="bg-slate-950/90 border border-emerald-500/30 p-3.5 rounded-xl space-y-3 animate-slide-up">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-extrabold font-mono tracking-wider uppercase">LICENCIA EMITIDA CON ÉXITO</span>
                  </div>
                  <span className="text-[7px] bg-emerald-400/10 text-emerald-400 font-mono font-bold px-1 rounded uppercase">
                    Firmada Digitalmente
                  </span>
                </div>

                {/* Contract Meta & Signatures */}
                <div className="space-y-1.5 text-[8px] font-mono bg-slate-900/60 p-2 rounded border border-slate-850/50">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CONTRATO:</span>
                    <span className="text-slate-200 font-bold">{generatedLicense.contractTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">LLAVE LICENCIA:</span>
                    <span className="text-yellow-400 font-bold">{generatedLicense.licenseKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ADQUIRENTE:</span>
                    <span className="text-slate-300">{generatedLicense.licenseeDetails}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-t border-slate-900 pt-1 mt-1">
                    <span className="text-slate-500">SHA256 DIGITAL SECURITY HASH:</span>
                    <span className="text-indigo-400 text-[6px] select-all break-all">{generatedLicense.securitySignature}</span>
                  </div>
                </div>

                {/* Contract text viewport */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 max-h-[140px] overflow-y-auto space-y-2 text-[8px] font-sans leading-relaxed text-slate-300 select-text scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  <div className="whitespace-pre-line text-justify font-mono text-[7px] text-slate-400 leading-relaxed">
                    {generatedLicense.contractBody}
                  </div>
                </div>

                {/* Contract Stipulations checklist */}
                <div className="space-y-1 bg-slate-900/40 p-2 rounded border border-slate-850/40">
                  <span className="text-[7px] text-slate-500 font-mono font-bold block uppercase">Estipulaciones Clave:</span>
                  {generatedLicense.legalStipulations && generatedLicense.legalStipulations.map((stip: string, i: number) => (
                    <div key={i} className="flex items-start gap-1 text-[7px] text-slate-400">
                      <span className="text-indigo-400 font-bold mt-0.5">•</span>
                      <span>{stip}</span>
                    </div>
                  ))}
                </div>

                {/* AWS Direct Deploy Compliance Checklist */}
                <div className="space-y-1.5 bg-indigo-950/20 p-2.5 rounded border border-indigo-500/15">
                  <span className="text-[7px] text-indigo-400 font-mono font-bold block uppercase tracking-wide">Compatibilidad AWS Marketplace (AMI)</span>
                  <div className="grid grid-cols-3 gap-1.5 text-[7px] font-mono text-center">
                    <div className="bg-slate-950 p-1 rounded border border-slate-850">
                      <span className="text-slate-500 block">DEPLOY STATUS</span>
                      <span className="text-emerald-400 font-bold">100% LISTO</span>
                    </div>
                    <div className="bg-slate-950 p-1 rounded border border-slate-850">
                      <span className="text-slate-500 block">CJS BUNDLING</span>
                      <span className="text-emerald-400 font-bold">OK (esbuild)</span>
                    </div>
                    <div className="bg-slate-950 p-1 rounded border border-slate-850">
                      <span className="text-slate-500 block">PORT INGRESS</span>
                      <span className="text-emerald-400 font-bold">PORT 3000</span>
                    </div>
                  </div>
                  <div className="text-[6.5px] text-slate-400 leading-normal text-center mt-1">
                    Este prototipo cumple con la especificación de empaquetado Docker y esbuild de producción para ejecución instantánea en contenedores sin dependencias.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. PIN VALIDATION DEPOSIT DIALOG (MODAL) */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-950 border border-indigo-500/30 p-5 rounded-2xl w-full max-w-[280px] space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-950/40 rounded-full flex items-center justify-center border border-indigo-500/20">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Autorización con PIN</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Ingresa tu llave de 4 dígitos para firmar el micropago y ejecutar la transacción.</p>
            </div>

            <div className="space-y-2">
              <input
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => {
                  setPinError(false);
                  setEnteredPin(e.target.value.replace(/\D/g, ''));
                }}
                placeholder="••••"
                className="w-full text-center bg-slate-900 border border-slate-800 text-white font-mono text-xl tracking-widest py-2 rounded-lg focus:outline-none focus:border-indigo-400"
              />
              {pinError && (
                <p className="text-[9px] text-rose-400 font-semibold flex items-center justify-center gap-1">
                  <AlertOctagon className="w-3 h-3" />
                  PIN incorrecto. Reintenta.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setPinModalOpen(false);
                  setPendingAction(null);
                  setEnteredPin('');
                  setPinError(false);
                }}
                className="bg-slate-900 border border-slate-800 text-slate-400 text-xs py-1.5 rounded-lg hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={verifyPinAndExecute}
                className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-semibold py-1.5 rounded-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE TRANSACTION RECEIPT INVOICE/MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-40">
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl w-full max-w-[320px] relative font-mono text-xs text-slate-300">
            <button 
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1 mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-extrabold text-white">TRANSACCIÓN EXITOSA</h3>
              <p className="text-[9px] text-slate-500">Android Wallet Cripto-Receipt</p>
            </div>

            <div className="space-y-2 border-t border-dashed border-slate-800 pt-3">
              <div className="flex justify-between">
                <span>RECEPTOR:</span>
                <span className="text-white font-bold">{selectedReceipt.receiver}</span>
              </div>
              <div className="flex justify-between">
                <span>ORIGEN:</span>
                <span className="text-white">{selectedReceipt.sender}</span>
              </div>
              <div className="flex justify-between">
                <span>FECHA Y HORA:</span>
                <span className="text-slate-400 text-[10px]">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span>TIPO:</span>
                <span className="uppercase text-indigo-400">{selectedReceipt.type}</span>
              </div>
              <div className="flex justify-between border-t border-slate-900 pt-2 text-[10px]">
                <span>CÓDIGO ID:</span>
                <span className="text-slate-400 font-bold">{selectedReceipt.id}</span>
              </div>
            </div>

            {/* Micro fee receipt focus */}
            <div className="mt-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span>Monto Neto:</span>
                <span className="text-white font-bold">${selectedReceipt.amount.toFixed(2)}</span>
              </div>
              {selectedReceipt.taxPaid && selectedReceipt.taxPaid > 0 ? (
                <div className="flex justify-between text-[10px] text-orange-400">
                  <span>Impuesto Local ({((selectedReceipt.taxRate || 0) * 100).toFixed(2)}%):</span>
                  <span>+${selectedReceipt.taxPaid.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-[10px] text-pink-400">
                <span>Micro-tasa Dev (5¢):</span>
                <span>${selectedReceipt.devFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-slate-800 pt-1.5 text-yellow-400 font-extrabold">
                <span>Total Final:</span>
                <span>${(selectedReceipt.amount + selectedReceipt.devFee + (selectedReceipt.taxPaid || 0)).toFixed(2)}</span>
              </div>
            </div>

            {/* Visual Priority Execution Breakdown */}
            <div className="mt-3 bg-slate-900 border border-indigo-500/10 p-2 rounded-lg text-[8px] space-y-1">
              <span className="text-zinc-450 font-black flex items-center gap-1">🛡️ CONFORMIDAD DE FLUJO FISCAL</span>
              <div className="flex items-center gap-1 bg-slate-950 px-1 py-0.5 rounded border border-slate-850">
                <span className="text-emerald-405 font-bold">1°</span>
                <span className="text-slate-400 font-sans">Impuestos Locales Reservados:</span>
                <span className="ml-auto text-emerald-405 font-bold font-mono">${(selectedReceipt.taxPaid || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 px-1 py-0.5 rounded border border-slate-850">
                <span className="text-pink-405 font-bold">2°</span>
                <span className="text-slate-400 font-sans">Apoyo de 5¢ Ruteado a Creador:</span>
                <span className="ml-auto text-pink-405 font-bold font-mono">${selectedReceipt.devFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-dashed border-slate-800 pt-3 text-[9px] text-slate-500 leading-normal">
              <span className="font-bold text-slate-400 block mb-0.5">FIRMA DE SEGURIDAD (SHA256):</span>
              <span className="break-all">{selectedReceipt.securityHash}</span>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg text-center transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
