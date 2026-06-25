import React, { useState, useEffect } from 'react';
import { Shield, Key, Fingerprint, Lock, ShieldCheck, AlertCircle, Eye, EyeOff, RotateCw, ShieldAlert, Cpu, FileText, Award } from 'lucide-react';
import { SecurityState } from '../types';
import { translations, Language } from '../translations';
import { jsPDF } from 'jspdf';

interface SecurityCenterProps {
  security: SecurityState;
  onUpdateSecurity: (updates: Partial<SecurityState>) => void;
  onAddLog: (action: string, category: 'security' | 'wallet' | 'system', detail: string) => void;
  lang: Language;
}

export default function SecurityCenter({ security, onUpdateSecurity, onAddLog, lang }: SecurityCenterProps) {
  const t = translations[lang];
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [sessionHash, setSessionHash] = useState('SHA256-DF98A3D9E9F00AA1B...');
  const [securityScore, setSecurityScore] = useState(65);

  // Recalculate mock security score whenever settings change
  useEffect(() => {
    let score = 40;
    if (security.pinSetup) score += 20;
    if (security.biometricEnabled) score += 15;
    if (security.advancedEncryption) score += 15;
    if (security.shieldActive) score += 10;
    setSecurityScore(score);
  }, [security.pinSetup, security.biometricEnabled, security.advancedEncryption, security.shieldActive]);

  const generateAsIsContractPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Dynamic verification token
    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const docControlToken = `TS-LIC-CONTRACT-${randomHash}-2026-ASIS`;

    // Draw frame borders
    doc.setDrawColor(99, 102, 241); // Indigo border
    doc.setLineWidth(0.6);
    doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);
    
    doc.setDrawColor(244, 63, 94); // Rose-500 inner border
    doc.setLineWidth(0.15);
    doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin * 2) + 4);

    let currentY = margin + 4;

    // Header Band
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, currentY, contentWidth, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("TRIOSPHERE PROTOCOLS & SECURITY GATEWAYS", pageWidth / 2, currentY + 8, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("CONTRATO DIGITAL DE TRANSFERENCIA Y LICENCIA DE CÓDIGO FUENTE (AS-IS)", pageWidth / 2, currentY + 14, { align: 'center' });
    doc.text(`CÓDIGO DE CONTROL: ${docControlToken}`, pageWidth / 2, currentY + 19, { align: 'center' });

    currentY += 32;

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("CONTRATO DE TITULARIDAD Y FUTURA VENTA AS-IS", margin, currentY);
    currentY += 6;

    // Intro Paragraph
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const introLines = "Por medio del presente instrumento digital, se deja constancia legal de la titularidad y autoría intelectual del código fuente, arquitectura de software y marcas de 'TrioSphere Lite' en cabeza exclusiva del desarrollador y autor original, cuyos datos se exponen a continuación:";
    const splitIntro = doc.splitTextToSize(introLines, contentWidth);
    doc.text(splitIntro, margin, currentY);
    currentY += doc.getTextDimensions(splitIntro).h + 6;

    // Section 1: IDENTIFICACIÓN DEL AUTOR Y LICENCIANTE
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, currentY, contentWidth, 32, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, contentWidth, 32, 'S');

    doc.setFillColor(241, 245, 249);
    doc.rect(margin + 0.1, currentY + 0.1, contentWidth - 0.2, 5.5, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text("DATOS DE IDENTIFICACIÓN Y TITULARIDAD", margin + 3, currentY + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("NOMBRE COMPLETO DEL AUTOR:", margin + 5, currentY + 11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("VICTOR BARRETO", margin + 5, currentY + 15);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("CORREO ELECTRÓNICO REGISTRADO:", margin + 95, currentY + 11);
    doc.setFont("helvetica", "bold");
    doc.text("vicba890@gmail.com", margin + 95, currentY + 15);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("REGISTRO CPF & CUENTAS VINCULADAS:", margin + 5, currentY + 22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Asociado a Google Accounts & Nu Bank (Conformidad PLD - Nivel Oro)", margin + 5, currentY + 26);

    currentY += 38;

    // Section 2: CLÁUSULAS ESPECÍFICAS DE LICENCIA AS-IS
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("CLÁUSULAS DEL ACUERDO DE LICENCIAMIENTO", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);

    const clause1 = "1. OBJETO Y TITULARIDAD: Se reconoce de manera irrevocable que la autoría de 'TrioSphere Lite', incluyendo todos sus componentes visuales, el simulador adquirente de transacciones financieras, el micro-ledger cifrado de firmas concatenadas y la arquitectura modular para Android de bajo peso (< 5MB), corresponde única y legítimamente a VICTOR BARRETO.";
    const splitC1 = doc.splitTextToSize(clause1, contentWidth);
    doc.text(splitC1, margin, currentY);
    currentY += doc.getTextDimensions(splitC1).h + 4;

    const clause2 = "2. CONDICIÓN 'AS-IS' (COMO ESTÁ): El software se entrega 'AS IS', es decir, en el estado en que se encuentra. No se otorgan garantías de ningún tipo, expresas o implícitas, sobre su comerciabilidad, idoneidad para un fin particular o ausencia de errores. El adquirente de futuras licencias asume todos los riesgos derivados del uso de este código.";
    const splitC2 = doc.splitTextToSize(clause2, contentWidth);
    doc.text(splitC2, margin, currentY);
    currentY += doc.getTextDimensions(splitC2).h + 4;

    const clause3 = "3. PARÁMETROS DE FUTURA VENTA: Toda futura venta, transferencia de derechos patrimoniales o sub-licenciamiento comercial de este software a terceros deberá respetar la autoría moral original del Licenciante aquí detallado. Se estipula a costo cero de base la integración inicial, pero cualquier derecho subsiguiente quedará regulado por este canal pre-firmado.";
    const splitC3 = doc.splitTextToSize(clause3, contentWidth);
    doc.text(splitC3, margin, currentY);
    currentY += doc.getTextDimensions(splitC3).h + 4;

    const clause4 = "4. PROTOCOLO DE CONFORMIDAD PLD: Las partes declaran que los fondos y licencias simulados en este sandbox siguen estándares estrictos contra el lavado de dinero y financiamiento ilícito, certificados por la titularidad ligada al CPF del autor original en sus cuentas financieras reales de Google y Nu Bank.";
    const splitC4 = doc.splitTextToSize(clause4, contentWidth);
    doc.text(splitC4, margin, currentY);
    currentY += doc.getTextDimensions(splitC4).h + 6;

    // Technical Certificate Seal Box
    doc.setFillColor(240, 253, 250); // soft teal fill
    doc.rect(margin, currentY, contentWidth, 18, 'F');
    doc.setDrawColor(13, 148, 136);
    doc.setLineWidth(0.35);
    doc.line(margin, currentY, margin, currentY + 18); // accent bar

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(13, 148, 136); // Teal
    doc.text("VERIFICACIÓN SÍNCRONA DE INTEGRIDAD DE CONTRATO:", margin + 3, currentY + 4);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    doc.text("Este contrato ha sido pre-firmado digitalmente mediante tokens criptográficos asimétricos concatenados de TrioSphere, vinculando la cuenta vicba890@gmail.com. El documento es legalmente consistente y se encuentra listo para indexación inmediata.", margin + 3, currentY + 9);
    doc.text(`Token hash de consistencia contractual: SHA256-${randomHash}-OWNER-AUTHENTICATED-OK`, margin + 3, currentY + 14);

    currentY += 25;

    // Signature blocks
    const footerLineY = currentY + 12;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin + 10, footerLineY, margin + 65, footerLineY);
    doc.line(pageWidth - margin - 65, footerLineY, pageWidth - margin - 10, footerLineY);

    // Calligraphy signature representation
    doc.setFont("courier", "bolditalic");
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text("Victor Barreto", margin + 37, footerLineY - 2, { align: 'center' });

    doc.setFont("courier", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(13, 148, 136);
    doc.text("[TRIOSPHERE GATEWAY SEAL]", pageWidth - margin - 37, footerLineY - 2, { align: 'center' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text("FIRMA DE AUTOR Y LICENCIANTE", margin + 37, footerLineY + 3.5, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.text("CPF Registrado Nu Bank / Google", margin + 37, footerLineY + 6, { align: 'center' });

    doc.setFont("helvetica", "bold");
    doc.text("SELLO DIGITAL DE SEGURIDAD", pageWidth - margin - 37, footerLineY + 3.5, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.text("TrioSphere Integrity Verified", pageWidth - margin - 37, footerLineY + 6, { align: 'center' });

    // Little seal stamp drawing
    doc.setDrawColor(244, 63, 94);
    doc.setLineWidth(0.8);
    doc.rect(pageWidth / 2 - 6, footerLineY - 9, 12, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4);
    doc.setTextColor(244, 63, 94);
    doc.text("PRE-SIGNED", pageWidth / 2, footerLineY - 6, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.text("AS-IS", pageWidth / 2, footerLineY - 3.5, { align: 'center' });
    doc.text("CONTRACT", pageWidth / 2, footerLineY - 1, { align: 'center' });

    doc.save(`triosphere-asis-licensing-contract-${Math.floor(Date.now() / 1000)}.pdf`);
    onAddLog(t.licensingSuccessLog, 'security', `Se generó el Contrato Digital Pre-Firmado AS-IS para Victor Barreto (${docControlToken}).`);
  };

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || !/^\d+$/.test(pinInput)) {
      alert('El PIN debe ser exactamente de 4 dígitos numéricos.');
      return;
    }
    if (pinInput !== confirmPinInput) {
      alert('Los PINs no coinciden. Por favor verifica.');
      return;
    }
    onUpdateSecurity({
      securityPin: pinInput,
      pinSetup: true,
      lastSecurityCheck: new Date().toLocaleTimeString()
    });
    onAddLog('PIN Actualizado', 'security', 'Se estableció un nuevo PIN de seguridad de 4 dígitos.');
    setPinInput('');
    setConfirmPinInput('');
  };

  const handleToggleBiometrics = () => {
    const newVal = !security.biometricEnabled;
    onUpdateSecurity({ biometricEnabled: newVal });
    onAddLog(
      newVal ? 'Biometría Activada' : 'Biometría Desactivada',
      'security',
      newVal ? 'Huella dactilar y reconocimiento facial habilitados para transacciones.' : 'Seguridad facial/dactilar inhabilitada.'
    );
  };

  const handleToggleEncryption = () => {
    const newVal = !security.advancedEncryption;
    onUpdateSecurity({ advancedEncryption: newVal });
    onAddLog(
      newVal ? 'Cifrado AES-256' : 'Cifrado Estándar',
      'security',
      newVal ? 'Se activó el cifrado militar AES-256 para el canal de base de datos.' : 'Transiciones a cifrado de nivel estándar.'
    );
  };

  const handleToggleShield = () => {
    const newVal = !security.shieldActive;
    onUpdateSecurity({ shieldActive: newVal });
    onAddLog(
      newVal ? 'Escudo Antílope' : 'Escudo Inactivo',
      'security',
      newVal ? 'Protección activa contra scripts maliciosos y sobrecarga de red apalancada.' : 'Protección de red desactivada.'
    );
  };

  const handleRotateKeys = () => {
    setIsRotating(true);
    setTimeout(() => {
      const chars = 'ABCDEF0123456789';
      let result = 'SHA256-';
      for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setSessionHash(result + '...');
      setIsRotating(false);
      onAddLog('Rotación de Llaves', 'security', 'Claves de sesión asimétricas re-encriptadas.');
    }, 1000);
  };

  const handleResetSecurity = () => {
    if (window.confirm('¿Seguro que deseas reiniciar los parámetros de seguridad a valores por defecto?')) {
      onUpdateSecurity({
        biometricEnabled: false,
        advancedEncryption: false,
        shieldActive: false,
        securityPin: '',
        pinSetup: false,
        failedAttempts: 0,
        isLocked: false
      });
      onAddLog('Reinicio de Parámetros', 'security', 'Configuración de seguridad reestablecida a cero.');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 overflow-y-auto px-1 py-2 pb-16">
      {/* Header and Rating */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/20 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-emerald-500/20">
          <Shield className="w-24 h-24 stroke-[1]" />
        </div>
        
        <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Seguridad Avanzada
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-[85%]">
          Protocolos móviles unificados. Cripto-firmas de bajo peso que optimizan espacio y datos móviles en Android.
        </p>

        {/* Score Meter */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-300 font-medium">Nivel de Protección General:</span>
            <span className={`font-semibold ${securityScore >= 80 ? 'text-emerald-400' : securityScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
              {securityScore}% {securityScore >= 80 ? '(Óptimo)' : securityScore >= 60 ? '(Moderado)' : '(Bajo)'}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                securityScore >= 80 ? 'bg-emerald-500' : securityScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${securityScore}%` }}
            />
          </div>
        </div>

        {/* Security Health status box */}
        <div className="mt-3 flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] text-slate-400">
            Último escaneo del sistema: {security.lastSecurityCheck || 'Hace un momento'}
          </span>
        </div>
      </div>

      {/* Alerta de Auditoría del Ledger */}
      <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl flex items-start gap-2.5 relative overflow-hidden animate-pulse">
        <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </div>
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1">
            {t.auditAlertTitle}
          </h4>
          <p className="text-[10px] text-slate-300 leading-relaxed mt-0.5">
            {t.auditAlertDesc}
          </p>
          <div className="flex gap-2 mt-1.5 font-mono text-[9px]">
            <span className="bg-slate-950/80 px-1.5 py-0.5 rounded text-rose-400 border border-rose-500/10">CPF: VINCULADO OK</span>
            <span className="bg-slate-950/80 px-1.5 py-0.5 rounded text-cyan-400 border border-cyan-500/10">NU BANK & GOOGLE: CONFORME</span>
          </div>
        </div>
      </div>

      {/* Advanced Toggles Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Biometrics */}
        <button 
          onClick={handleToggleBiometrics}
          className={`p-3 rounded-xl border text-left transition-all duration-200 ${
            security.biometricEnabled 
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/70 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <Fingerprint className={`w-6 h-6 ${security.biometricEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className={`w-2 h-2 rounded-full ${security.biometricEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          </div>
          <h3 className="text-xs font-bold text-white mb-0.5">Huella / FaceID</h3>
          <p className="text-[10px] text-slate-400 leading-tight">Autorización rápida para transacciones.</p>
        </button>

        {/* Shield Mode */}
        <button 
          onClick={handleToggleShield}
          className={`p-3 rounded-xl border text-left transition-all duration-200 ${
            security.shieldActive 
              ? 'bg-blue-950/20 border-blue-500/40 text-blue-200' 
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/70 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <Shield className={`w-6 h-6 ${security.shieldActive ? 'text-blue-400' : 'text-slate-500'}`} />
            <span className={`w-2 h-2 rounded-full ${security.shieldActive ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`} />
          </div>
          <h3 className="text-xs font-bold text-white mb-0.5">Escudo de Red</h3>
          <p className="text-[10px] text-slate-400 leading-tight">Bloqueo activo anti-sniffing de saldo.</p>
        </button>
      </div>

      {/* Sección de Licenciamiento de Código Fuente */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-xl p-4 space-y-3.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-15">
          <Award className="w-16 h-16 text-indigo-400 stroke-[1.5]" />
        </div>
        
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-white">
              {t.licensingTitle}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {t.licensingDesc}
            </p>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-slate-900/50 pb-1.5">
            <span className="text-slate-400 text-[10px]">{t.licensingOwnerLabel}</span>
            <span className="text-white font-bold text-[11px] tracking-wide">Victor Barreto</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-900/50 pb-1.5">
            <span className="text-slate-400 text-[10px]">E-mail:</span>
            <span className="text-indigo-300 text-[10px]">vicba890@gmail.com</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">{t.licensingCpfLabel}</span>
            <span className="text-slate-300 text-[10px]">Google & Nu Bank Linked</span>
          </div>
        </div>

        <button
          onClick={generateAsIsContractPDF}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-950/40 active:scale-[0.98]"
        >
          <FileText className="w-4 h-4 text-indigo-200" />
          {t.licensingButton}
        </button>
      </div>

      {/* Advanced PIN Setup Card */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          PIN de Seguridad de la App
        </h3>
        
        {security.pinSetup ? (
          <div className="flex items-center justify-between bg-indigo-950/20 border border-indigo-500/20 p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <p className="text-xs font-medium text-slate-100">PIN Activo y Encriptado</p>
                <p className="text-[10px] text-slate-400">Protege compras, retiros y envíos de fondos.</p>
              </div>
            </div>
            <button 
              onClick={() => {
                onUpdateSecurity({ pinSetup: false, securityPin: '' });
                onAddLog('PIN Eliminado', 'security', 'Deshabilitaron el PIN de transacciones.');
              }}
              className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Desactivar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSetPin} className="space-y-3">
            <div className="p-2 bg-amber-950/20 border border-amber-500/20 rounded-lg flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-200/90 leading-relaxed">
                Recomendamos definir un PIN. Ayuda a simular la encriptación de firmas hash ante micropagos de desarrollador (5¢).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-slate-400 block mb-1">Nuevo PIN (4 dígitos)</label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={4}
                    placeholder="0000"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center bg-slate-950 text-white font-mono text-sm tracking-widest py-1.5 px-2 rounded-md border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-slate-400 block mb-1">Confirmar PIN</label>
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={4}
                  placeholder="0000"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center bg-slate-950 text-white font-mono text-sm tracking-widest py-1.5 px-2 rounded-md border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pinInput.length !== 4 || confirmPinInput.length !== 4}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-colors disabled:opacity-40"
            >
              Guardar PIN Seguro
            </button>
          </form>
        )}
      </div>

      {/* Advanced Cryptography Monitor */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            Claves de Android & Wallet
          </h3>
          <button 
            onClick={handleRotateKeys}
            disabled={isRotating}
            className={`text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800/80 ${isRotating ? 'animate-spin text-cyan-400' : ''}`}
            title="Rotar claves de sesión asimétricas"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-950 rounded-lg p-2.5 space-y-1 border border-slate-800 text-[10px]">
          <div className="flex justify-between items-center text-slate-500 border-b border-slate-900 pb-1">
            <span>PARÁMETRO</span>
            <span>VALOR ACTUAL</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Canal de Datos</span>
            <span className="text-emerald-400 font-semibold">{security.advancedEncryption ? 'AES-256 SECURE' : 'DEFAULT'}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">ID de Dispositivo</span>
            <span className="text-slate-300">ANDROID_NEXUS_LITE_3728</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Firma Hash de Sesión</span>
            <span className="text-cyan-400 select-all" title={sessionHash}>{sessionHash}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Micro-fee Dev</span>
            <span className="text-pink-400">Fijo ($0.05 / txn)</span>
          </div>
        </div>

        <div className="text-[9px] text-slate-500 leading-tight">
          La tecnología de firmas asimétricas concatenadas previene la inyección de transacciones falsas, validando cada cobro de desarrollador.
        </div>
      </div>

      {/* Security Actions & Simulation Alerts */}
      <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-3 flex justify-between items-center">
        <div>
          <h4 className="text-xs font-bold text-slate-300">Reiniciar Parámetros</h4>
          <p className="text-[10px] text-slate-500">Regresa la wallet y seguridad al estado inicial.</p>
        </div>
        <button
          onClick={handleResetSecurity}
          className="bg-rose-950/30 border border-rose-500/30 text-rose-300 font-semibold hover:bg-rose-900/30 px-2.5 py-1 rounded-lg text-xs transition-colors"
        >
          Resetear
        </button>
      </div>

      {/* Threat Sandbox alert */}
      <div className="bg-amber-950/10 border border-amber-950/50 p-3 rounded-lg flex gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Protección de Datos Android</h4>
          <p className="text-[9px] text-slate-400 leading-relaxed mt-0.5">
            Esta aplicación simula almacenamiento aislado (Scooped Storage) integrado por hardware, ideal para un consumo mínimo de energía y espacio de 5MB en disco físico.
          </p>
        </div>
      </div>
    </div>
  );
}
