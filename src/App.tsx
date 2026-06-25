import { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Heart, AlertCircle, RefreshCw, 
  Wallet as WalletIcon, Smartphone, Cpu, Shield
} from 'lucide-react';
import { Transaction, Contact, SecurityState } from './types';
import PhoneShell from './components/PhoneShell';
import Wallet from './components/Wallet';
import SocialHub from './components/SocialHub';
import ServicesHub from './components/ServicesHub';
import SecurityCenter from './components/SecurityCenter';
import LicensingTab from './components/LicensingTab';
import { translations, Language } from './translations';
import { jsPDF } from 'jspdf';

export default function App() {
  // Language configuration
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('triosphere_language');
    return (saved as Language) || 'es';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('triosphere_language', lang);
  }, [lang]);

  // Startup Warning Agreement State (Operator responsibility & device safety warning)
  const [showAgreement, setShowAgreement] = useState<boolean>(() => {
    return localStorage.getItem('triosphere_operator_agreement_v2') !== 'accepted';
  });

  // 1. Initial State for mock wallet balance
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('triosphere_balance');
    return saved ? parseFloat(saved) : 50.00; // starts with $50.00 to facilitate instant sandbox demo
  });

  // 2. Initial State or storage for transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('triosphere_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    // Return sample starter detailed logs
    const seed = [
      {
        id: 'WTX-LIC-001',
        date: new Date(Date.now() - 3600000 * 3).toLocaleString(),
        type: 'deposit' as const,
        description: 'Registro de Autoría y Titularidad de Licencia TrioSphere Lite (As-Is) - Titular: Victor Barreto (vicba890@gmail.com)',
        sender: 'TrioSphere Protocol Foundation',
        receiver: 'Victor Barreto (vicba890@gmail.com)',
        amount: 0.00,
        devFee: 0,
        finalAmount: 0.00,
        status: 'completed' as const,
        securityHash: 'SHA256-LIC-OWNER-VICTOR-BARRETO-2026-AS-IS'
      },
      {
        id: 'WTX83726',
        date: new Date(Date.now() - 3600000 * 2).toLocaleString(), // 2 hours ago
        type: 'deposit' as const,
        description: 'Bono Inicial de Bienvenida a TrioSphere',
        sender: 'TrioSphere Growth Fund',
        receiver: 'Mi Wallet Nexus',
        amount: 50.00,
        devFee: 0,
        finalAmount: 50.00,
        status: 'completed' as const,
        securityHash: 'SHA256-INIT837B9A2F9CE128E...'
      }
    ];
    return seed;
  });

  // 3. Simulated Contacts with realistic names for transfers & chats
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('triosphere_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: '1',
        name: 'Lionel Messi',
        avatar: '',
        online: true,
        lastMessage: '¿Qué hacés che? ¿Probaste mandar saldo?',
        phone: '+54 9 11 1010-1010',
        walletAddress: '0x3FB2A829D120AAECF...',
        messages: [
          { id: 'm1', sender: 'contact', text: '¡Hola! Qué buena está la velocidad de esta super app unificada che.', time: '11:15', isRead: true },
          { id: 'm2', sender: 'user', text: '¡Sí! Es sumamente ligera para la RAM.', time: '11:16', isRead: true },
          { id: 'm3', sender: 'contact', text: '¿Me tiras un tip de $1 de prueba por la wallet a ver cómo cobra la tasa de 5¢?', time: '11:17', isRead: true }
        ]
      },
      {
        id: '2',
        name: 'Elon Musk',
        avatar: '',
        online: false,
        lastMessage: 'Mars is ready. Sending hash codes...',
        phone: '+1 650 420-6969',
        walletAddress: '0x882EA7A912BA8EFCA...',
        messages: [
          { id: 'me1', sender: 'contact', text: 'TrioSphere unifies massive frameworks. Saving RAM in mobile spaces is great for Mars missions.', time: 'Yesterday', isRead: true }
        ]
      },
      {
        id: '3',
        name: 'Dev Team TrioSphere',
        avatar: '',
        online: true,
        lastMessage: 'Soporte solidario por transacción de salida: 5¢ + imp.',
        phone: '+1 800 555-TRIO',
        walletAddress: '0xDEV777FFFAAA882E...',
        messages: [
          { id: 'md1', sender: 'contact', text: '¡Bienvenido! Diseñamos TrioSphere pensando en el rendimiento en Android. Ofrecemos 3 apps unidas en una de 5MB.', time: 'Yesterday', isRead: true },
          { id: 'md2', sender: 'user', text: '¿Para qué sirve el micro-pago?', time: 'Yesterday', isRead: true },
          { id: 'md3', sender: 'contact', text: 'El soporte solidario contribuye con 5 centavos mas imp. para apoyar al creador del proyecto por transacción de salida. Ésto financia TrioSphere sin anuncios.', time: 'Yesterday', isRead: true }
        ]
      }
    ];
  });

  // 4. Security parameter hooks
  const [security, setSecurity] = useState<SecurityState>(() => {
    const saved = localStorage.getItem('triosphere_security');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      biometricEnabled: false,
      transactionLimit: 100.00,
      advancedEncryption: false,
      shieldActive: false,
      securityPin: '',
      pinSetup: false,
      lastSecurityCheck: new Date().toLocaleTimeString(),
      failedAttempts: 0,
      isLocked: false
    };
  });

  // 5. System terminal logs audit state
  const [logs, setLogs] = useState<{ id: string; time: string; action: string; category: 'security' | 'wallet' | 'system'; detail: string }[]>(() => {
    const saved = localStorage.getItem('triosphere_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'l0',
        time: new Date().toLocaleTimeString(),
        action: 'Autoría de Licencia Registrada',
        category: 'security' as const,
        detail: 'TrioSphere Lite vinculada al Autor original: Victor Barreto (vicba890@gmail.com). Licenciamiento As-Is registrado en el bloque inicial de transacciones.'
      },
      {
        id: 'l1',
        time: new Date().toLocaleTimeString(),
        action: 'Sistema Inicializado',
        category: 'system' as const,
        detail: 'Android Framework cargado. TrioSphere unificado en disco físico.'
      },
      {
        id: 'l2',
        time: new Date().toLocaleTimeString(),
        action: 'Wallet Segura Enlazada',
        category: 'wallet' as const,
        detail: 'Cuentas cargadas con saldo demo inicial de $50.00.'
      }
    ];
  });

  // Active view tab switcher
  const [activeTab, setActiveTab] = useState<string>('wallet');

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('triosphere_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('triosphere_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('triosphere_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('triosphere_security', JSON.stringify(security));
  }, [security]);

  useEffect(() => {
    localStorage.setItem('triosphere_logs', JSON.stringify(logs));
  }, [logs]);

  // General helper handlers
  const handleAddLog = (action: string, category: 'security' | 'wallet' | 'system', detail: string) => {
    const newLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      action,
      category,
      detail
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleUpdateSecurity = (updates: Partial<SecurityState>) => {
    setSecurity(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateContacts = (updated: Contact[]) => {
    setContacts(updated);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const generateAuditPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Dynamic wave-based math synchrony fluctuation for decoration
    const mathSynch = Math.sin((Date.now() % 3600000) / 3600000 * 2 * Math.PI) * 123.456;
    const computedIntegrityToken = `TS-INTEGRITY-${Math.abs(Math.round(mathSynch * 1000)).toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Draw stylish frame borders
    doc.setDrawColor(79, 70, 229); // Violet border
    doc.setLineWidth(0.6);
    doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);
    
    doc.setDrawColor(244, 63, 94); // Pink-500 inner border
    doc.setLineWidth(0.15);
    doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin * 2) + 4);

    let currentY = margin + 4;

    // Logo / Header Bar (Deep space dark background)
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, currentY, contentWidth, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TRIOSPHERE LITE - SYSTEM AUDIT & LEDGER REPORT", pageWidth / 2, currentY + 8, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("SECURITY PROTOCOL VERIFICATION & TRANSACTIONS CONFORMITY LEDGER", pageWidth / 2, currentY + 14, { align: 'center' });
    doc.text(`INTEGRITY HASH: ${computedIntegrityToken}`, pageWidth / 2, currentY + 19, { align: 'center' });

    currentY += 32;

    // Document Subtitle and Metadata Row
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(lang === 'en' ? "SECURITY AUDIT REPORT" : lang === 'pt' ? "RELATÓRIO DE AUDITORIA DE SEGURANÇA" : "REPORTE DE AUDITORÍA DE SEGURIDAD", margin, currentY);
    
    currentY += 6;
    
    // Technical credentials
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("LEDGER STATUS:", margin, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text("CONFORMANT & SECURED", margin + 25, currentY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("GENERATION TIME (LOCAL):", margin + 105, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(new Date().toLocaleString(), margin + 144, currentY);

    currentY += 6;

    // Thin separator
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 8;

    // SECTION 1: WALLET STATE GRID
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, currentY, contentWidth, 36, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, contentWidth, 36, 'S');

    // Box Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin + 0.1, currentY + 0.1, contentWidth - 0.2, 5.5, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(lang === 'en' ? "CURRENT WALLET LEDGER STATE" : lang === 'pt' ? "ESTADO ATUAL DA CARTEIRA" : "ESTADO ACTUAL DEL LEDGER DE WALLET", margin + 3, currentY + 4);

    // State parameters
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(lang === 'en' ? "TOTAL BALANCE (USD):" : lang === 'pt' ? "SALDO TOTAL (USD):" : "SALDO TOTAL DE WALLET (USD):", margin + 5, currentY + 11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text(`$ ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`, margin + 5, currentY + 15);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(lang === 'en' ? "WALLET DEVICE LINKED ADDRESS:" : lang === 'pt' ? "ENDEREÇO DA CARTEIRA VINCULADA:" : "DIRECCIÓN DE WALLET VINCULADA:", margin + 95, currentY + 11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("0xDEV777FFFAAA882E91024BCB3978", margin + 95, currentY + 15);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(lang === 'en' ? "ACTIVE SECURITY SHIELD:" : lang === 'pt' ? "ESCUDO DE SEGURANÇA ATIVO:" : "ESCUDO DE SEGURIDAD ACTIVO:", margin + 5, currentY + 22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(security.shieldActive ? 16 : 217, security.shieldActive ? 185 : 119, security.shieldActive ? 129 : 6);
    doc.text(security.shieldActive ? "ACTIVE (ANTILOPE-V2)" : "STANDARD (PROTECTION ACTIVE)", margin + 5, currentY + 26);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(lang === 'en' ? "BIOMETRICS / ENCRYPTION:" : lang === 'pt' ? "BIOMETRIA / CRIPTOGRAFIA:" : "BIOMETRÍA / ENTRADA CIFRADA:", margin + 95, currentY + 22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`Biometrics: ${security.biometricEnabled ? 'ENABLED' : 'DISABLED'} | AES-256: ${security.advancedEncryption ? 'HARDWARE' : 'SOFTWARE'}`, margin + 95, currentY + 26);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(lang === 'en' ? "TRANSACTION VOLUMETRICS:" : lang === 'pt' ? "VOLUME DE TRANSAÇÕES:" : "VOLUMETRÍA DE TRANSACCIONES:", margin + 5, currentY + 31);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`${transactions.length} ${lang === 'en' ? 'recorded items' : lang === 'pt' ? 'registros no ledger' : 'registros procesados'} | Max Limit: $ ${security.transactionLimit.toFixed(2)} USD`, margin + 5, currentY + 34);

    currentY += 42;

    // SECTION 2: RECENT BLOCKCHAIN/LEDGER TRANSACTIONS
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(lang === 'en' ? "1. CRYPTOGRAPHIC LEDGER TRANSACTIONS (MAX 5)" : lang === 'pt' ? "1. ÚLTIMAS TRANSAÇÕES NO LEDGER (MÁX 5)" : "1. HISTORIAL DE TRANSACCIONES FIRMADAS (MÁX 5)", margin, currentY);

    currentY += 4;
    
    // Draw Transactions Table
    const tableHeaderY = currentY;
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, tableHeaderY, contentWidth, 5.5, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(71, 85, 105);
    doc.text("ID / DATE", margin + 3, tableHeaderY + 3.8);
    doc.text("TYPE / DESCRIPTION", margin + 40, tableHeaderY + 3.8);
    doc.text("SENDER / RECEIVER", margin + 95, tableHeaderY + 3.8);
    doc.text("AMOUNT", margin + 145, tableHeaderY + 3.8);
    doc.text("SECURITY SIGNATURE", margin + 162, tableHeaderY + 3.8);

    let tableY = tableHeaderY + 5.5;
    const rowHeight = 7.5;
    
    // Take latest 5 transactions
    const topTxs = transactions.slice(0, 5);
    if (topTxs.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text("No transactions available in the local sandbox.", margin + 4, tableY + 5);
      tableY += 8;
    } else {
      topTxs.forEach((tx, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, tableY, contentWidth, rowHeight, 'F');
        }
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.25);
        doc.line(margin, tableY + rowHeight, pageWidth - margin, tableY + rowHeight);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6);
        doc.setTextColor(15, 23, 42);
        doc.text(tx.id || `TXN-${idx}`, margin + 3, tableY + 3);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5.5);
        doc.setTextColor(100, 116, 139);
        doc.text(tx.date || '', margin + 3, tableY + 5.5);

        // description
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6);
        doc.setTextColor(15, 23, 42);
        const splitDesc = doc.splitTextToSize(tx.description || '', 50);
        doc.text(splitDesc, margin + 40, tableY + 3);

        // sender / receiver
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`From: ${tx.sender || 'Unknown'}`, margin + 95, tableY + 3);
        doc.text(`To: ${tx.receiver || 'Unknown'}`, margin + 95, tableY + 5.5);

        // amount
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        if (tx.type === 'deposit') {
          doc.setTextColor(16, 185, 129);
          doc.text(`+ $ ${tx.amount.toFixed(2)}`, margin + 145, tableY + 4.5);
        } else {
          doc.setTextColor(244, 63, 94);
          doc.text(`- $ ${tx.amount.toFixed(2)}`, margin + 145, tableY + 4.5);
        }

        // security hash
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5.2);
        doc.setTextColor(100, 116, 139);
        const displayHash = tx.securityHash ? (tx.securityHash.length > 22 ? tx.securityHash.substring(0, 22) + '...' : tx.securityHash) : `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        doc.text(displayHash, margin + 162, tableY + 4.5);

        tableY += rowHeight;
      });
    }

    currentY = tableY + 6;

    // SECTION 3: SYSTEM AUDIT EVENTS TERMINAL LOGS
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(lang === 'en' ? "2. SYSTEM EVENT & AUDIT TELEMETRY LOGS (LATEST 10)" : lang === 'pt' ? "2. LOGS DE TELEMETRIA DO SISTEMA (ÚLTIMOS 10)" : "2. HISTORIAL COMPLETO DE LOGS DE TELEMETRÍA (ÚLTIMOS 10)", margin, currentY);

    currentY += 4;

    doc.setFillColor(15, 23, 42); // deep slate-900 terminal background
    const terminalHeight = 65;
    doc.rect(margin, currentY, contentWidth, terminalHeight, 'F');
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.4);
    doc.rect(margin, currentY, contentWidth, terminalHeight, 'S');

    doc.setFont("courier", "bold");
    doc.setFontSize(6);
    doc.setTextColor(34, 197, 94); // Light Green
    doc.text(" >_ TRIOSPHERE CONSOLE TERMINAL AUDIT LINES", margin + 4, currentY + 5);

    let logY = currentY + 10;
    const logRowHeight = 5.2;
    const topLogs = logs.slice(0, 10);

    if (topLogs.length === 0) {
      doc.setTextColor(148, 163, 184);
      doc.text("Console logs terminal is currently empty.", margin + 4, logY);
    } else {
      topLogs.forEach((log) => {
        // category badge text
        doc.setFont("courier", "bold");
        doc.setTextColor(147, 197, 253); // Light blue
        doc.text(`[${log.category.toUpperCase()}]`, margin + 4, logY);

        doc.setTextColor(156, 163, 175);
        doc.setFont("courier", "normal");
        doc.text(log.time || '', margin + 22, logY);

        doc.setFont("courier", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(log.action || '', margin + 40, logY);

        doc.setFont("courier", "normal");
        doc.setTextColor(209, 213, 219);
        const combinedDetail = log.detail || '';
        const displayDetail = combinedDetail.length > 70 ? combinedDetail.substring(0, 68) + "..." : combinedDetail;
        doc.text(displayDetail, margin + 85, logY);

        logY += logRowHeight;
      });
    }

    currentY += terminalHeight + 8;

    // Legal verification blockquote
    doc.setFillColor(254, 242, 242); // soft warm/red fill
    doc.rect(margin, currentY, contentWidth, 18, 'F');
    doc.setDrawColor(244, 63, 94);
    doc.setLineWidth(0.35);
    doc.line(margin, currentY, margin, currentY + 18); // accent bar

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(159, 18, 57); // Deep rose
    doc.text("DECLARACIÓN JURADA DE CONFORMIDAD AS-IS:", margin + 3, currentY + 4);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(6);
    doc.setTextColor(71, 85, 105);
    const disclaimerText = lang === 'en'
      ? "This document certifies that the local secure ledger conforms with strict criteria. All events logged above are signed cryptographically with simulated hardware signatures for diagnostic safety and operational testing."
      : lang === 'pt'
      ? "Este documento certifica que o livro-razão local seguro está em conformidade com critérios rigorosos de PLD. Todos os eventos listados são assinados criptograficamente com chaves de teste para validação de segurança."
      : "Este documento certifica que el ledger local y el simulador de adquirente TrioSphere cumplen de manera fidedigna con la política de seguridad estipulada. Cada evento aquí registrado está firmado digitalmente con firmas asimétricas simuladas.";
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, contentWidth - 6);
    doc.text(splitDisclaimer, margin + 3, currentY + 7.5);

    currentY += 24;

    // Footer signature block
    const footerLineY = currentY + 10;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin + 15, footerLineY, margin + 65, footerLineY);
    doc.line(pageWidth - margin - 65, footerLineY, pageWidth - margin - 15, footerLineY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    doc.text("TRIOSPHERE COMPLIANCE BOT", margin + 40, footerLineY + 3.5, { align: 'center' });
    doc.text("AUTOMATED SECURITY OFFICER", margin + 40, footerLineY + 6, { align: 'center' });

    doc.text(lang === 'en' ? "DEVICE OPERATOR" : lang === 'pt' ? "OPERADOR DO CELULAR" : "OPERADOR RESPONSABLE", pageWidth - margin - 40, footerLineY + 3.5, { align: 'center' });
    doc.text("SECURED & SIGNED CERTIFICATE", pageWidth - margin - 40, footerLineY + 6, { align: 'center' });

    // Seal box drawing
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(1.0);
    doc.rect(pageWidth / 2 - 5, footerLineY - 9, 10, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4);
    doc.text("SECURE", pageWidth / 2, footerLineY - 6, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.text("LEDGER", pageWidth / 2, footerLineY - 3.5, { align: 'center' });
    doc.text("PASSED", pageWidth / 2, footerLineY - 1, { align: 'center' });

    doc.save(`triosphere-audit-report-${Math.floor(Date.now() / 1000)}.pdf`);
    handleAddLog('Auditoría PDF Generada', 'system', `Se exportó el Reporte de Auditoría PDF de forma segura y certificada.`);
  };

  const handleResetApp = () => {
    if (window.confirm(t.restoreConfirm)) {
      localStorage.removeItem('triosphere_balance');
      localStorage.removeItem('triosphere_transactions');
      localStorage.removeItem('triosphere_contacts');
      localStorage.removeItem('triosphere_security');
      localStorage.removeItem('triosphere_logs');
      
      setBalance(50.00);
      setTransactions([
        {
          id: 'WTX-LIC-001',
          date: new Date().toLocaleString(),
          type: 'deposit',
          description: 'Registro de Autoría y Titularidad de Licencia TrioSphere Lite (As-Is) - Titular: Victor Barreto (vicba890@gmail.com)',
          sender: 'TrioSphere Protocol Foundation',
          receiver: 'Victor Barreto (vicba890@gmail.com)',
          amount: 0.00,
          devFee: 0,
          finalAmount: 0.00,
          status: 'completed',
          securityHash: 'SHA256-LIC-OWNER-VICTOR-BARRETO-2026-AS-IS'
        },
        {
          id: 'WTX83726',
          date: new Date().toLocaleString(),
          type: 'deposit',
          description: lang === 'en' ? 'Starter Welcome Bonus to TrioSphere' : lang === 'pt' ? 'Bônus de Boas-vindas para TrioSphere' : 'Bono Inicial de Bienvenida a TrioSphere',
          sender: 'TrioSphere Growth Fund',
          receiver: lang === 'en' ? 'My Nexus Wallet' : lang === 'pt' ? 'Minha Nexus Wallet' : 'Mi Wallet Nexus',
          amount: 50.00,
          devFee: 0,
          finalAmount: 50.00,
          status: 'completed',
          securityHash: 'SHA256-INIT837B9A2F9CE128E...'
        }
      ]);
      setSecurity({
        biometricEnabled: false,
        transactionLimit: 100.00,
        advancedEncryption: false,
        shieldActive: false,
        securityPin: '',
        pinSetup: false,
        lastSecurityCheck: new Date().toLocaleTimeString(),
        failedAttempts: 0,
        isLocked: false
      });
      setLogs([
        {
          id: 'l0',
          time: new Date().toLocaleTimeString(),
          action: 'Autoría de Licencia Registrada',
          category: 'security',
          detail: 'TrioSphere Lite vinculada al Autor original: Victor Barreto (vicba890@gmail.com). Licenciamiento As-Is registrado en el bloque inicial de transacciones.'
        },
        {
          id: 'l1',
          time: new Date().toLocaleTimeString(),
          action: lang === 'en' ? 'App Fully Reloaded' : lang === 'pt' ? 'App Totalmente Recarregado' : 'App Recargada Completamente',
          category: 'system',
          detail: lang === 'en' ? 'All parameters and variables returned to test seed values.' : lang === 'pt' ? 'Todos os parâmetros e variáveis retornados ao estado semente.' : 'Se regresaron todos los parámetros y variables a los valores semilla de prueba.'
        }
      ]);
      setActiveTab('wallet');
      alert(t.restoreSuccess);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 font-sans relative overflow-hidden">
      
      {showAgreement && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-[420px] space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-pink-400 to-rose-500" />
            
            <div className="mx-auto w-12 h-12 bg-indigo-950/60 rounded-full flex items-center justify-center border border-indigo-500/30">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            
            <div className="text-center space-y-1">
              <h2 className="text-xs uppercase tracking-widest font-black text-white">
                {lang === 'en' ? 'Operating & Device Safety Agreement' : lang === 'pt' ? 'Acordo de Operação & Segurança' : 'Acuerdo de Operación & Seguridad'}
              </h2>
              <p className="text-[10px] text-pink-400 font-mono font-bold uppercase tracking-wider">
                {lang === 'en' ? 'TrioSphere Legal Protection Sandbox' : lang === 'pt' ? 'TrioSphere Legal Sandbox' : 'TrioSphere Legal Sandbox Protegido'}
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 space-y-2.5 text-slate-300 text-[10.5px] leading-relaxed max-h-[220px] overflow-y-auto">
              <p className="font-bold flex items-center gap-1.5 text-slate-200">
                <AlertCircle className="w-4 h-4 text-pink-400 shrink-0" />
                {lang === 'en' ? 'Operating Responsibility Notice:' : lang === 'pt' ? 'Aviso de Responsabilidade:' : 'Aviso de Responsabilidad del Operador:'}
              </p>
              <p>
                {lang === 'en' 
                  ? 'The operation and execution of this mobile simulation suite is under the sole and absolute responsibility of the smartphone operator.'
                  : lang === 'pt'
                  ? 'A operação e o uso deste simulador móvel é de exclusiva responsabilidade de quem opera o dispositivo físico.'
                  : 'La operación y ejecución de este simulador móvil se realiza bajo la exclusiva y absoluta responsabilidad de quien opera este teléfono celular.'}
              </p>
              
              <p className="font-bold flex items-center gap-1.5 text-slate-200 border-t border-slate-900 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                {lang === 'en' ? 'Device & Ledger Security:' : lang === 'pt' ? 'Integridade do Dispositivo:' : 'Seguridad del Dispositivo & Integridad:'}
              </p>
              <p>
                {lang === 'en' 
                  ? 'The user is uniquely responsible for managing device access, keeping the 4-digit safety PIN private, safeguarding biometric options, and certifying secure cryptographic hashes on all transactions or creator micropayments.'
                  : lang === 'pt'
                  ? 'O usuário é o único responsável pela integridade física do celular, resguardo do PIN de 4 dígitos, biometria e as assinaturas digitais.'
                  : 'El usuario constituyé el responsable único de garantizar la seguridad física y digital de su dispositivo, el resguardo confidencial del PIN de 4 dígitos, la protección de accesos biométricos y la validez de las firmas criptográficas SHA-256 ante cualquier micropago o aporte solidario de salida.'}
              </p>
            </div>

            <div className="text-[8px] text-slate-500 text-center font-bold font-mono tracking-normal leading-normal uppercase">
              {lang === 'en' ? 'USE UNDER RESPONSIBLE USER POLICY' : lang === 'pt' ? 'USO SOB RESPONSABILIDADE ÚNICA' : 'USO BAJO RESPONSABILIDAD DE QUIEN OPERA EL CEL / SEGURIDAD DEL DISPOSITIVO'}
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.setItem('triosphere_operator_agreement_v2', 'accepted');
                setShowAgreement(false);
              }}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs py-2.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(219,39,119,0.2)]"
            >
              <ShieldCheck className="w-4 h-4" />
              {lang === 'en' ? 'Accept & Enter Suite' : lang === 'pt' ? 'Aceitar e Entrar' : 'Aceptar Términos & Entrar'}
            </button>
          </div>
        </div>
      )}

      {/* Absolute Decorative Background Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Outer Container */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center space-y-6">
        
        {/* Top Header Section (Elegant Visual Pairing) */}
        <div className="text-center md:text-left md:flex justify-between items-center pb-4 border-b border-slate-900">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text font-black text-2xl tracking-tight">
                TrioSphere Lite
              </span>
              <span className="text-[10px] bg-indigo-950 font-bold border border-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full">
                {t.version}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto md:mx-0">
              {t.appDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-center justify-center mt-3 md:mt-0">
            {/* Elegant Language Selector */}
            <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-[10px]" id="language-selector">
              <button
                id="lang-btn-es"
                onClick={() => setLang('es')}
                className={`px-2 py-1 rounded-lg transition-colors ${lang === 'es' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
                title="Español"
              >
                🇪🇸 ES
              </button>
              <button
                id="lang-btn-pt"
                onClick={() => setLang('pt')}
                className={`px-2 py-1 rounded-lg transition-colors ${lang === 'pt' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
                title="Português"
              >
                🇧🇷 PT
              </button>
              <button
                id="lang-btn-en"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition-colors ${lang === 'en' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
                title="English"
              >
                🇺🇸 EN
              </button>
            </div>

            <button
              id="reset-app-btn"
              onClick={handleResetApp}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 transition-colors"
              title={t.restoreSeed}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t.restoreSeed}
            </button>
          </div>
        </div>

        {/* Dynamic Body workspace containing Phone and Logs */}
        <PhoneShell
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          security={security}
          onUpdateSecurity={handleUpdateSecurity}
          logs={logs}
          onClearLogs={handleClearLogs}
          onDownloadAuditPDF={generateAuditPDF}
          lang={lang}
        >
          {/* Active app content injected depending on selected footer button */}
          {activeTab === 'wallet' && (
            <Wallet
              balance={balance}
              transactions={transactions}
              contacts={contacts}
              security={security}
              onUpdateBalance={handleUpdateBalance}
              onAddTransaction={handleAddTransaction}
              onAddLog={handleAddLog}
              lang={lang}
            />
          )}

          {activeTab === 'social' && (
            <SocialHub
              balance={balance}
              contacts={contacts}
              transactions={transactions}
              onUpdateBalance={handleUpdateBalance}
              onAddTransaction={handleAddTransaction}
              onAddLog={handleAddLog}
              onUpdateContacts={handleUpdateContacts}
              lang={lang}
            />
          )}

          {activeTab === 'services' && (
            <ServicesHub
              balance={balance}
              transactions={transactions}
              onUpdateBalance={handleUpdateBalance}
              onAddTransaction={handleAddTransaction}
              onAddLog={handleAddLog}
              lang={lang}
            />
          )}

          {activeTab === 'security' && (
            <SecurityCenter
              security={security}
              onUpdateSecurity={handleUpdateSecurity}
              onAddLog={handleAddLog}
              lang={lang}
            />
          )}

          {activeTab === 'licensing' && (
            <LicensingTab
              balance={balance}
              transactions={transactions}
              onAddLog={handleAddLog}
              onUpdateBalance={handleUpdateBalance}
              onAddTransaction={handleAddTransaction}
              lang={lang}
            />
          )}
        </PhoneShell>

        {/* Bottom Feature Bento-Row Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-900">
          
          <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900 space-y-1" id="bento-wallet">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-950/40 rounded-lg text-indigo-400">
                <WalletIcon className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">{t.bentoWalletTitle}</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.bentoWalletDesc}
            </p>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900 space-y-1" id="bento-micropay">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-950/40 rounded-lg text-pink-400">
                <Heart className="w-4 h-4 fill-pink-500/20" />
              </div>
              <h4 className="text-xs font-bold text-white">{t.bentoMicropayTitle}</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.bentoMicropayDesc}
            </p>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900 space-y-1" id="bento-security">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-950/40 rounded-lg text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white font-mono">{t.bentoSecurityTitle}</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.bentoSecurityDesc}
            </p>
          </div>

        </div>

      </div>

      {/* Humble Footer Section */}
      <footer className="text-center pt-8 text-[10px] text-slate-500 font-mono tracking-tight shrink-0 flex flex-col sm:flex-row justify-center items-center gap-1.5">
        <span>{t.footerTitle}</span>
        <span className="hidden sm:inline">•</span>
        <span>{t.footerApidoc}</span>
        <span className="hidden sm:inline">•</span>
        <span className="text-slate-400">{t.footerCodeWeight}</span>
      </footer>

    </div>
  );
}
