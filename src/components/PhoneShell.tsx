import React, { useState, useEffect } from 'react';
import { 
  Wifi, Battery, BatteryCharging, Signal, ShieldAlert,
  Unlock, Lock, ArrowRight, RefreshCw, Cpu, Activity,
  Info, Database, AlertCircle, Trash2, FileText, Award
} from 'lucide-react';
import { SecurityState } from '../types';
import { translations, Language } from '../translations';

interface PhoneShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  security: SecurityState;
  onUpdateSecurity: (updates: Partial<SecurityState>) => void;
  logs: { id: string; time: string; action: string; category: 'security' | 'wallet' | 'system'; detail: string }[];
  onClearLogs: () => void;
  onDownloadAuditPDF: () => void;
  lang: Language;
}

export default function PhoneShell({
  children,
  activeTab,
  setActiveTab,
  security,
  onUpdateSecurity,
  logs,
  onClearLogs,
  onDownloadAuditPDF,
  lang
}: PhoneShellProps) {
  const t = translations[lang];
  // Battery simulation
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isCharging, setIsCharging] = useState(false);
  const [phoneLocked, setPhoneLocked] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [unlockPin, setUnlockPin] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  // Update mock time
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Battery slow drain simulation
  useEffect(() => {
    const drainInterval = setInterval(() => {
      if (!isCharging) {
        setBatteryLevel(prev => (prev > 1 ? prev - 1 : 1));
      } else {
        setBatteryLevel(prev => (prev < 100 ? prev + 1 : 100));
      }
    }, 12000); // changes slowly
    return () => clearInterval(drainInterval);
  }, [isCharging]);

  const handleUnlock = () => {
    if (security.pinSetup) {
      if (unlockPin === security.securityPin) {
        setPhoneLocked(false);
        setUnlockPin('');
        setUnlockError(false);
      } else {
        setUnlockError(true);
        // increment failed attempts
        const attempts = (security.failedAttempts || 0) + 1;
        if (attempts >= 3) {
          onUpdateSecurity({ failedAttempts: attempts, isLocked: true });
        } else {
          onUpdateSecurity({ failedAttempts: attempts });
        }
      }
    } else {
      setPhoneLocked(false);
    }
  };

  const handleLockPhone = () => {
    setPhoneLocked(true);
    setUnlockPin('');
    setUnlockError(false);
  };

  const handleResetLockout = () => {
    onUpdateSecurity({ isLocked: false, failedAttempts: 0 });
    setUnlockError(false);
    setUnlockPin('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      
      {/* LEFT COLUMN: Physical Android Emulator Shell */}
      <div className="md:col-span-7 flex justify-center">
        {/* Device Wrapper */}
        <div className="relative w-[340px] h-[670px] bg-[#1a1f2e] rounded-[44px] p-3 border-[6px] border-slate-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] select-none">
          
          {/* Top Speaker & Notch Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-700 rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-900 rounded-full mb-1" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full absolute right-4 mb-1 border border-slate-800" />
          </div>

          {/* Side Buttons (Vol +/- & Lock) */}
          <div className="absolute -left-[9px] top-[120px] w-1 h-12 bg-slate-600 rounded-l" />
          <div className="absolute -left-[9px] top-[180px] w-1 h-12 bg-slate-600 rounded-l" />
          <button 
            type="button"
            onClick={phoneLocked ? undefined : handleLockPhone}
            className="absolute -right-[9px] top-[140px] w-1.5 h-16 bg-slate-500 rounded-r active:bg-red-400 focus:outline-none"
            title={t.lockSidebarBtn}
          />

          {/* INNER CONTENT STREAM (Simulating high resolution screen) */}
          <div className="relative w-full h-[640px] bg-slate-950 rounded-[34px] overflow-hidden flex flex-col border border-slate-900">
            
            {/* 1. Android Status Bar */}
            <div className="h-7 px-5 pt-1.5 flex justify-between items-center text-[10px] text-slate-300 font-mono tracking-tight shrink-0 select-none bg-slate-950 z-20">
              <span className="font-bold">{currentTime}</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5 text-slate-300" />
                <Wifi className="w-3.5 h-3.5 text-slate-300" />
                <button 
                  onClick={() => setIsCharging(!isCharging)} 
                  className="flex items-center gap-0.5 hover:text-white"
                  title={isCharging ? (lang === 'en' ? 'Unplug charger' : lang === 'pt' ? 'Desconectar carregador' : 'Desenchufar cargador') : (lang === 'en' ? 'Connect charger' : lang === 'pt' ? 'Conectar carregador' : 'Simular enchufar cargador')}
                >
                  <span className="text-[9px]">{batteryLevel}%</span>
                  {isCharging ? (
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  ) : (
                    <Battery className={`w-3.5 h-3.5 ${batteryLevel < 15 ? 'text-rose-500 animate-bounce' : 'text-slate-300'}`} />
                  )}
                </button>
              </div>
            </div>

            {/* SCREEN SPACE */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              
              {/* LOCKSCREEN OVERLAY */}
              {phoneLocked ? (
                <div className="absolute inset-0 bg-slate-950/95 z-30 flex flex-col justify-between p-6 animate-fade-in">
                  <div className="mt-8 text-center space-y-2">
                    <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-wider font-mono">{t.lockscreenTitle}</h3>
                    <p className="text-[10px] text-slate-400">{t.lockscreenSub}</p>
                  </div>

                  {/* Unlock Logic Box */}
                  <div className="space-y-4 max-w-[210px] mx-auto text-center">
                    {security.isLocked ? (
                      <div className="space-y-3 bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                        <ShieldAlert className="w-6 h-6 text-rose-455 mx-auto" />
                        <p className="text-[10px] text-rose-200 leading-normal">
                          {t.deviceLockedByAttempts}
                        </p>
                        <button
                          onClick={handleResetLockout}
                          className="bg-rose-900 hover:bg-rose-800 text-white text-[10px] px-3 py-1 rounded-lg font-bold"
                        >
                          {t.resetSecurity}
                        </button>
                      </div>
                    ) : security.pinSetup ? (
                      <div className="space-y-3">
                        <label className="text-[10px] text-slate-400 block font-mono">{t.inputPinLabel}</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder={t.pinPlaceholder}
                          value={unlockPin}
                          onChange={(e) => {
                            setUnlockError(false);
                            setUnlockPin(e.target.value.replace(/\D/g, ''));
                          }}
                          className="w-full text-center bg-slate-900 text-white border border-slate-800 font-mono text-xl tracking-widest py-1.5 rounded-lg focus:outline-none focus:border-indigo-400"
                        />
                        {unlockError && (
                          <p className="text-[9px] text-rose-400 font-semibold">{t.pinIncorrect}</p>
                        )}
                        <button
                          onClick={handleUnlock}
                          className="w-full bg-indigo-650 text-white text-xs font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-indigo-500"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          {lang === 'en' ? 'Unlock' : lang === 'pt' ? 'Desbloquear' : 'Desbloquear'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-350 italic">{t.swipeUnlock}</p>
                        <button
                          onClick={() => setPhoneLocked(false)}
                          className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 hover:scale-105 transition-all"
                        >
                          {t.enterApp}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-[9px] text-slate-500 font-mono">{t.battery}: {batteryLevel}% • {isCharging ? t.charging : t.stable}</p>
                  </div>
                </div>
              ) : null}

              {/* CORE VIEWPORT APP */}
              <div className="flex-1 flex flex-col overflow-hidden px-4 pt-2">
                {children}
              </div>

              {/* 2. Soft Android Navigation Tabs */}
              <div className="h-14 bg-slate-950 border-t border-slate-900 flex items-center justify-around px-1 shrink-0 z-10">
                <button
                  onClick={() => setActiveTab('wallet')}
                  className={`flex flex-col items-center justify-center w-11 h-full transition-colors ${
                    activeTab === 'wallet' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span className="text-[7.5px] font-bold mt-0.5">Wallet</span>
                </button>

                <button
                  onClick={() => setActiveTab('social')}
                  className={`flex flex-col items-center justify-center w-11 h-full transition-colors ${
                    activeTab === 'social' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span className="text-[7.5px] font-bold mt-0.5">Social</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex flex-col items-center justify-center w-11 h-full transition-colors ${
                    activeTab === 'services' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span className="text-[7.5px] font-bold mt-0.5">Delivery</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex flex-col items-center justify-center w-11 h-full transition-colors ${
                    activeTab === 'security' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  <span className="text-[7.5px] font-bold mt-0.5">{lang === 'en' ? 'Security' : lang === 'pt' ? 'Segur.' : 'Segur.'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('licensing')}
                  className={`flex flex-col items-center justify-center w-11 h-full transition-colors ${
                    activeTab === 'licensing' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span className="text-[7.5px] font-bold mt-0.5">{lang === 'en' ? 'License' : lang === 'pt' ? 'Licença' : 'Licencia'}</span>
                </button>
              </div>

              {/* Bottom bar indicator gesture home pill */}
              <div className="h-1 bg-slate-950 flex justify-center pb-2 shrink-0">
                <div className="w-24 h-1 bg-slate-700 rounded-full" />
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Advanced Logs / System Operations Inspector */}
      <div className="md:col-span-5 space-y-4">
        
        {/* Android Spec Dashboard card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3 font-sans">
          <div className="flex gap-2 items-center">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              {t.inspectorTitle}
            </h3>
          </div>
          
          <p className="text-xs text-slate-400 leading-normal">
            {t.inspectorDesc}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span className="text-[9px] text-slate-500 block">{t.memStatus}</span>
              <span className="text-indigo-300 font-bold">{t.memValue}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-900">
              <span className="text-[9px] text-slate-500 block">{t.apkSize}</span>
              <span className="text-emerald-400 font-bold">{t.apkValue}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-900 col-span-2 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-500 block">{t.devSupportFee}</span>
                <span className="text-pink-400 font-bold">{t.devSupportValue}</span>
              </div>
              <div className="bg-pink-950/40 px-2 py-0.5 rounded text-pink-300 border border-pink-500/20 font-bold text-[9px]">
                {t.prefActive}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time event log timeline */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col h-[350px] min-h-[300px]">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                {t.auditTitle}
              </h3>
            </div>
            <button
              onClick={onClearLogs}
              disabled={logs.length === 0}
              className="text-slate-450 hover:text-rose-400 disabled:opacity-30 transition-colors"
              title={t.auditClear}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Log entries */}
          <div className="flex-1 overflow-y-auto mt-3 space-y-2 font-mono text-[9px] pr-1">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="bg-slate-950 p-2 rounded-lg border border-slate-900 space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className={`px-1 py-0.5 rounded text-[8px] uppercase font-bold leading-none ${
                    log.category === 'security' ? 'bg-rose-950 text-rose-300' :
                    log.category === 'wallet' ? 'bg-emerald-950 text-emerald-300' :
                    'bg-slate-900 text-slate-400'
                  }`}>
                    {log.category}
                  </span>
                  <span className="text-slate-500 text-[8px]">{log.time}</span>
                </div>
                <div>
                  <span className="text-slate-200 font-bold block">
                    {/* Translate common automated log categories */}
                    {log.action === 'Sistema Inicializado' && lang === 'en' ? 'System Initialized' : log.action === 'Sistema Inicializado' && lang === 'pt' ? 'Sistema Inicializado' :
                     log.action === 'Wallet Segura Enlazada' && lang === 'en' ? 'Secure Wallet Paired' : log.action === 'Wallet Segura Enlazada' && lang === 'pt' ? 'Carteira Segura Conectada' :
                     log.action === 'PIN Actualizado' && lang === 'en' ? 'PIN Configured' : log.action === 'PIN Actualizado' && lang === 'pt' ? 'PIN Atualizado' :
                     log.action === 'PIN Eliminado' && lang === 'en' ? 'PIN Wiped' : log.action === 'PIN Eliminado' && lang === 'pt' ? 'PIN Eliminado' :
                     log.action === 'Biometría Activada' && lang === 'en' ? 'Biometrics Active' : log.action === 'Biometría Activada' && lang === 'pt' ? 'Biometria Ativada' :
                     log.action === 'Biometría Desactivada' && lang === 'en' ? 'Biometrics Blocked' : log.action === 'Biometría Desactivada' && lang === 'pt' ? 'Biometria Desativada' :
                     log.action === 'Cifrado AES-256' && lang === 'en' ? 'AES-256 Cipher Active' : log.action === 'Cifrado AES-256' && lang === 'pt' ? 'Criptografia AES-256' :
                     log.action === 'Escudo Antílope' && lang === 'en' ? 'Network Shield Active' : log.action === 'Escudo Antílope' && lang === 'pt' ? 'Escudo Antílope Ativo' :
                     log.action === 'Reinicio de Parámetros' && lang === 'en' ? 'Parameters Reset' : log.action === 'Reinicio de Parámetros' && lang === 'pt' ? 'Configurações Reiniciadas' :
                     log.action}
                  </span>
                  <span className="text-slate-400 leading-normal block">
                    {/* Translate details for initial logs */}
                    {log.detail === 'Android Framework cargado. TrioSphere unificado en disco físico.' && lang === 'en' ? 'Android Framework loaded. TrioSphere unified on physical disk.' :
                     log.detail === 'Android Framework cargado. TrioSphere unificado en disco físico.' && lang === 'pt' ? 'Android Framework carregado. TrioSphere unificado no disco físico.' :
                     log.detail === 'Cuentas cargadas con saldo demo inicial de $50.00.' && lang === 'en' ? 'Accounts loaded with $50.00 mock demo balance.' :
                     log.detail === 'Cuentas cargadas con saldo demo inicial de $50.00.' && lang === 'pt' ? 'Contas carregadas com saldo demo inicial de $50.00.' :
                     log.detail}
                  </span>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <Info className="w-6 h-6 mb-1 opacity-40 text-indigo-400" />
                <p>{t.auditEmptyTitle}</p>
                <p className="text-[8px] px-4 mt-1">{t.auditEmptyP1}</p>
              </div>
            )}
          </div>

          {/* Download audit report PDF action */}
          <button
            type="button"
            onClick={onDownloadAuditPDF}
            disabled={logs.length === 0}
            className="mt-2.5 w-full bg-indigo-950/40 border border-indigo-500/25 hover:bg-indigo-900/60 hover:border-indigo-400 text-indigo-300 font-extrabold text-[9px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase cursor-pointer disabled:opacity-30 disabled:pointer-events-none shadow-md hover:scale-[1.01]"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            {t.downloadAuditPDF}
          </button>

          <div className="mt-2.5 bg-slate-950 p-2 rounded-lg text-slate-500 text-[8px] flex gap-1.5 items-start">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-tight">
              {t.auditDisclaimer}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
