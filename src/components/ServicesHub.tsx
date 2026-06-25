import { useState, useEffect } from 'react';
import { 
  Car, Utensils, ShoppingBag, MapPin, Clock, Navigation, 
  CheckCircle, ArrowRight, ShieldCheck, X, AlertCircle, Sparkles, AlertOctagon,
  Coffee, Fuel, Truck, Wrench, Phone, Smartphone, Flame
} from 'lucide-react';
import { DeliveryService, Transaction } from '../types';
import { translations, Language } from '../translations';
import { playKeyTap, playRingTone } from '../utils/sound';

interface ServicesHubProps {
  balance: number;
  transactions: Transaction[];
  onUpdateBalance: (newBalance: number) => void;
  onAddTransaction: (transaction: Transaction) => void;
  onAddLog: (action: string, category: 'security' | 'wallet' | 'system', detail: string) => void;
  lang: Language;
}

export default function ServicesHub({
  balance,
  transactions,
  onUpdateBalance,
  onAddTransaction,
  onAddLog,
  lang
}: ServicesHubProps) {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<'all' | 'ride' | 'food' | 'grocery' | 'gasoline' | 'service'>('all');
  const [activeCallService, setActiveCallService] = useState<DeliveryService | null>(null);
  
  // Available list of pre-configured options
  const services: DeliveryService[] = [
    {
      id: 'srv-1',
      type: 'ride',
      name: 'Taxi Express',
      description: 'Viaje ágil de bajo costo. Conductor verificado por huella dactilar.',
      price: 5.50,
      timeEstimation: '8-12 min',
      distance: '3.4 km',
      iconName: 'car',
      phone: '*901-TAXI',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'srv-2',
      type: 'ride',
      name: 'Tesla Premium Eco',
      description: 'Vehículo eléctrico de alta gama con carga rápida integrada.',
      price: 12.00,
      timeEstimation: '4-7 min',
      distance: '3.6 km',
      iconName: 'car',
      phone: '*881-TESLA',
      imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'srv-3',
      type: 'food',
      name: 'Combo Smash Burger',
      description: 'Hamburguesa doble angus, papas fritas artesanales y bebida fría.',
      price: 7.50,
      timeEstimation: '15-20 min',
      distance: '1.2 km',
      iconName: 'utensils',
      phone: '+1 (555) 302-9988',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'srv-4',
      type: 'food',
      name: 'Ensalada Bowl Orgánica',
      description: 'Mix de hojas de huerto, quinoa, aguacate, aderezo de sésamo.',
      price: 6.20,
      timeEstimation: '20-25 min',
      distance: '2.5 km',
      iconName: 'utensils',
      phone: '+1 (555) 481-2233',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'srv-5',
      type: 'food',
      name: 'Cafetería Espresso Arábica',
      description: 'Café de grano selecto tostado al madero con muffin de arándano.',
      price: 3.20,
      timeEstimation: '5-10 min',
      distance: '0.8 km',
      iconName: 'coffee',
      phone: '+1 (555) 283-4122',
      imageUrl: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'srv-6',
      type: 'gasoline',
      name: 'Combustibles PetroNexus Estación',
      description: 'Gasolina Premium aditivada de alto octanaje para flotas y autos.',
      price: 32.50,
      timeEstimation: '10-15 min',
      distance: '5.1 km',
      iconName: 'fuel',
      phone: '*PETRO-74',
      imageUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'srv-7',
      type: 'grocery',
      name: 'Supermercado Central Mercosur',
      description: 'Canasta de víveres frescos esenciales (arroz, leche, pan, frutas).',
      price: 18.00,
      timeEstimation: '25-35 min',
      distance: '2.3 km',
      iconName: 'shopping-bag',
      phone: '+1 (555) 882-9911',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'srv-8',
      type: 'service',
      name: 'Logística de Fletes e Industrias',
      description: 'Transporte flete y traslados de gran porte totalmente resguardados.',
      price: 240.00,
      timeEstimation: '45-60 min',
      distance: '12.4 km',
      iconName: 'truck',
      phone: '*LOG-991',
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'srv-9',
      type: 'service',
      name: 'Soporte Técnico de Maquinaria',
      description: 'Servicio técnico especializado comercial, herrería y reparaciones.',
      price: 45.00,
      timeEstimation: '30-50 min',
      distance: '6.9 km',
      iconName: 'wrench',
      phone: '*TECH-INDUSTRY',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=120&q=80'
    }
  ];

  const handleInitiateCall = (service: DeliveryService) => {
    setActiveCallService(service);
    playRingTone();
    onAddLog('Llamada Directa', 'system', 'Llamando de forma segura y limpia a: ' + service.name + ' (' + service.phone + ')');
  };

  // Selected order state for active tracker simulation
  const [activeOrder, setActiveOrder] = useState<DeliveryService | null>(null);
  const [orderProgress, setOrderProgress] = useState(0); // 0 to 100
  const [orderStep, setOrderStep] = useState<string>(''); // description of step
  const [orderTxId, setOrderTxId] = useState('');

  // Simulating route tracking loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeOrder) {
      interval = setInterval(() => {
        setOrderProgress(prev => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            setOrderStep('Llegada / Entrega Realizada con Éxito 🎉');
            return 100;
          }
          if (next === 20) setOrderStep('Asignando repartidor / móvil en zona...');
          if (next === 40) setOrderStep('Conductor recolectando tu orden...');
          if (next === 70) setOrderStep('Vehículo en ruta hacia tu ubicación...');
          if (next === 90) setOrderStep('Arrivando a destino final en 1 minuto...');
          return next;
        });
      }, 3000); // changes every 3 seconds for fast-interactive presentation
    }
    return () => clearInterval(interval);
  }, [activeOrder]);

  const handleOrderService = (service: DeliveryService) => {
    if (activeOrder && orderProgress < 100) {
      alert('Ya tienes un servicio GoDelivery en curso. Espera a que finalice.');
      return;
    }

    const totalDeduction = service.price + 0.05;
    if (totalDeduction > balance) {
      alert(`Saldo insuficiente en tu Wallet para GoDelivery. Se requieren $${totalDeduction.toFixed(2)} (Monto: $${service.price.toFixed(2)} + Micropago: $0.05). Saldo actual: $${balance.toFixed(2)}.`);
      return;
    }

    if (window.confirm(`¿Confirmar orden de '${service.name}' por $${service.price.toFixed(2)} más el micropago de $0.05 de comisión?`)) {
      const newBal = balance - totalDeduction;
      const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
      const newTx: Transaction = {
        id: txId,
        date: new Date().toLocaleString(),
        type: 'delivery_payment',
        description: `GoDelivery: ${service.name}`,
        sender: 'Mi Wallet Nexus',
        receiver: 'GoDelivery Express Inc.',
        amount: service.price,
        devFee: 0.05,
        finalAmount: -totalDeduction,
        status: 'completed',
        securityHash: 'SHA256-DELV' + Math.floor(Math.random() * 999999).toString(16).toUpperCase()
      };

      onUpdateBalance(newBal);
      onAddTransaction(newTx);
      onAddLog('Compra Servicio', 'wallet', `Adquirido '${service.name}' por $${service.price.toFixed(2)} con micro-tasa de 5¢.`);

      // Set order as active to show the live map simulation
      setOrderStep('Iniciando pasarela de pago segura...');
      setOrderProgress(0);
      setOrderTxId(txId);
      setActiveOrder(service);

      setTimeout(() => {
        setOrderStep('Pago debitado y firmado por ID de seguridad.');
        setOrderProgress(10);
      }, 1500);
    }
  };

  const handleCancelOrder = () => {
    if (orderProgress >= 80) {
      alert('La orden ya está muy cerca de tu domicilio y no se puede cancelar.');
      return;
    }

    if (window.confirm('¿Seguro que deseas cancelar? Se reembolsará la base del servicio.')) {
      // Refund base amount (dev micropayment 5c remains non-refundable as it was processed by high-level gateway)
      const refundAmount = activeOrder ? activeOrder.price : 0;
      const newBal = balance + refundAmount;
      const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
      
      const refundTx: Transaction = {
        id: txId,
        date: new Date().toLocaleString(),
        type: 'refund',
        description: `Reembolso Cancelación: ${activeOrder?.name}`,
        sender: 'GoDelivery Express Inc.',
        receiver: 'Mi Wallet Nexus',
        amount: refundAmount,
        devFee: 0,
        finalAmount: refundAmount,
        status: 'completed',
        securityHash: 'SHA256-RFLD' + Math.floor(Math.random() * 999999).toString(16).toUpperCase()
      };

      onUpdateBalance(newBal);
      onAddTransaction(refundTx);
      onAddLog('Reembolso Servicio', 'wallet', `Cancelado '${activeOrder?.name}' - Reembolsado $${refundAmount.toFixed(2)}.`);
      
      setActiveOrder(null);
      setOrderProgress(0);
      alert(`Orden cancelada. Se han reembolsado $${refundAmount.toFixed(2)} a tu balance. El micropago del desarrollador de 5¢ no es reembolsable.`);
    }
  };

  const filteredServices = services.filter(
    s => activeCategory === 'all' ? true : s.type === activeCategory
  );

  return (
    <div className="flex flex-col h-full space-y-4 overflow-y-auto px-1 py-1 pb-16">
      {/* Active Trip Tracker Panel (Visual Progress Map Simulation) */}
      {activeOrder && (
        <div className="bg-slate-900 border border-indigo-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
          {/* Animated Glow in tracking state */}
          <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full animate-ping mt-4 mr-4" />
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">Servicio en Curso</span>
              <h3 className="text-sm font-bold text-white mt-0.5">{activeOrder.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono">ID de Transacción: {orderTxId}</p>
            </div>
            
            {orderProgress < 100 && (
              <button
                onClick={handleCancelOrder}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
              >
                Cancelar
              </button>
            )}
          </div>

          {/* Interactive CSS Progress animation representing the route */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
            {/* Map simulator graphic */}
            <div className="h-16 bg-slate-900 rounded-lg border border-slate-850 relative overflow-hidden flex items-center justify-between px-6">
              {/* Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-950/20 via-slate-950/60 to-black/90 pointer-events-none" />
              <div className="absolute inset-0 bg-grid line-y" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '100% 6px' }} />
              
              {/* Start point icon */}
              <div className="z-10 bg-slate-800 p-1 rounded border border-slate-700">
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>

              {/* Connected Route Line with actual driver position and progress value */}
              <div className="w-full mx-2 h-1 bg-slate-800 rounded relative">
                <div 
                  className="absolute bg-gradient-to-r from-emerald-500 to-indigo-500 h-1 transition-all duration-500"
                  style={{ width: `${orderProgress}%` }}
                />
                {/* Repartidor icon floating across the route */}
                <div 
                  className="absolute -top-2 bg-indigo-600 border border-indigo-400 text-white p-1 rounded-full text-xs shadow-lg transition-all duration-500 transform -translate-x-1/2"
                  style={{ left: `${orderProgress}%` }}
                >
                  <Navigation className="w-3 h-3 rotate-45 text-white fill-white" />
                </div>
              </div>

              {/* End point destination */}
              <div className="z-10 bg-indigo-950/70 p-1 rounded border border-indigo-500/45 animate-pulse">
                <MapPin className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            {/* Tracker Step Details */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400">Progreso de la Ruta:</span>
                <span className="text-xs font-bold text-white font-mono">{orderProgress}%</span>
              </div>
              <p className="text-xs text-indigo-300 font-extrabold flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                {orderStep}
              </p>
            </div>
          </div>

          {/* Complete completion button */}
          {orderProgress === 100 && (
            <button
              onClick={() => setActiveOrder(null)}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold py-2 rounded-xl transition-all"
            >
              Cerrar y Volver al Catálogo
            </button>
          )}
        </div>
      )}

      {/* GoDelivery Services List */}
      <div className="space-y-3">
        {/* Category Filters */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-900">
          <button
            onClick={() => setActiveCategory('all')}
            className={`py-1 rounded-lg text-[9px] font-bold transition-all ${
              activeCategory === 'all' ? 'bg-slate-850 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveCategory('ride')}
            className={`py-1 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeCategory === 'ride' ? 'bg-indigo-950 border border-indigo-500/30 text-indigo-300' : 'text-slate-400'
            }`}
          >
            <Car className="w-3 h-3" />
            Viajes
          </button>
          <button
            onClick={() => setActiveCategory('food')}
            className={`py-1 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeCategory === 'food' ? 'bg-indigo-950 border border-indigo-500/30 text-indigo-300' : 'text-slate-400'
            }`}
          >
            <Utensils className="w-3 h-3" />
            Comida
          </button>
          <button
            onClick={() => setActiveCategory('grocery')}
            className={`py-1 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeCategory === 'grocery' ? 'bg-indigo-950 border border-indigo-500/30 text-indigo-300' : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            Súper
          </button>
          <button
            onClick={() => setActiveCategory('gasoline')}
            className={`py-1 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeCategory === 'gasoline' ? 'bg-indigo-950 border border-indigo-500/30 text-indigo-300' : 'text-slate-400'
            }`}
          >
            <Fuel className="w-3 h-3" />
            Nafta
          </button>
          <button
            onClick={() => setActiveCategory('service')}
            className={`py-1 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeCategory === 'service' ? 'bg-indigo-950 border border-indigo-500/30 text-indigo-300' : 'text-slate-400'
            }`}
          >
            <Wrench className="w-3 h-3" />
            Svs/Indus
          </button>
        </div>

        {/* Catalog list */}
        <div className="space-y-2.5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-slate-900/40 border border-slate-850 p-3 rounded-2xl hover:bg-slate-900/70 transition-all flex gap-2 items-center justify-between"
            >
              <div className="space-y-1 flex items-start gap-2 max-w-[65%]">
                {/* Image Photo Thumbnail with icon overlay */}
                <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-slate-800 bg-slate-950">
                  {service.imageUrl ? (
                    <img 
                      src={service.imageUrl} 
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover brightness-95"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-indigo-400" />
                    </div>
                  )}
                  <div className="absolute top-0 left-0 bg-black/60 p-0.5 rounded-br-lg border-r border-b border-slate-800">
                    {service.iconName === 'car' && <Car className="w-2.5 h-2.5 text-cyan-400" />}
                    {service.iconName === 'utensils' && <Utensils className="w-2.5 h-2.5 text-orange-400" />}
                    {service.iconName === 'shopping-bag' && <ShoppingBag className="w-2.5 h-2.5 text-emerald-400" />}
                    {service.iconName === 'coffee' && <Coffee className="w-2.5 h-2.5 text-yellow-500" />}
                    {service.iconName === 'fuel' && <Fuel className="w-2.5 h-2.5 text-red-400" />}
                    {service.iconName === 'truck' && <Truck className="w-2.5 h-2.5 text-pink-400" />}
                    {service.iconName === 'wrench' && <Wrench className="w-2.5 h-2.5 text-blue-400" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1">
                    {service.name}
                    <span className="text-[7px] bg-slate-800 text-slate-400 px-1 rounded font-mono">
                      {service.distance}
                    </span>
                  </h3>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    {service.description}
                  </p>
                  
                  {/* Service parameters and Call Direct link */}
                  <div className="flex items-center gap-2 pt-1 font-mono text-[8px] text-slate-500">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {service.timeEstimation}
                    </span>
                    <span>•</span>
                    <button
                      onClick={() => handleInitiateCall(service)}
                      className="text-emerald-400 font-extrabold flex items-center gap-0.5 hover:underline"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      Llamar Directo
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing section and Order button */}
              <div className="text-right space-y-1 shrink-0">
                <p className="text-xs font-extrabold text-white font-mono">${service.price.toFixed(2)}</p>
                <p className="text-[8px] text-pink-400 leading-none">{t.includesFee}</p>
                <div className="flex items-center gap-1 pt-1 justify-end">
                  {/* VoIP button */}
                  <button
                    onClick={() => handleInitiateCall(service)}
                    className="p-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/80 rounded-lg transition-colors"
                    title="Llamada segura sin ruido"
                  >
                    <Phone className="w-3 h-3" />
                  </button>
                  {/* Order button */}
                  <button
                    onClick={() => handleOrderService(service)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] px-2 py-1 rounded-lg transition-colors flex items-center gap-0.5"
                  >
                    Pedir
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secure Direct Caller Overlay (with active voice noise filtration) */}
      {activeCallService && (
        <div className="fixed inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 z-50 animate-fade-in font-sans">
          <div className="text-center space-y-4 max-w-[280px]">
            {/* Pulsating caller circle */}
            <div className="mx-auto w-20 h-20 bg-indigo-950/50 rounded-full flex items-center justify-center border-2 border-emerald-500 animate-pulse relative">
              <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-40" />
              <Phone className="w-8 h-8 text-emerald-400" />
            </div>
            
            <div>
              <p className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Llamando con Filtro Cero-Ruido
              </p>
              <h4 className="text-sm font-extrabold text-white mt-1">{activeCallService.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{activeCallService.phone}</p>
            </div>

            {/* Hardware filter descriptors */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1.5 text-left text-[9px] text-slate-350 font-sans leading-normal">
              <div className="flex justify-between font-mono">
                <span>Supresión Dinámica:</span>
                <span className="text-emerald-400 font-bold">Activo • -35dB</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Estabilizador VoIP:</span>
                <span className="text-emerald-400 font-bold">Eco Rejection 99%</span>
              </div>
              <p className="border-t border-slate-850 pt-1 text-[8px] text-slate-500">
                Cancelación local adaptativa de barridos viales y electromagnéticos para optimizar llamadas en movimiento real.
              </p>
            </div>

            <button
              onClick={() => { setActiveCallService(null); playKeyTap(); }}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2 rounded-xl transition-all uppercase tracking-wider"
            >
              Colgar Llamada
            </button>
          </div>
        </div>
      )}

      {/* Micropayment clarity disclaimer */}
      <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl space-y-1.5">
        <h4 className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
          {t.micropayDetailsTitle}
        </h4>
        <p className="text-[9px] text-slate-500 leading-normal">
          {t.micropayDetailsText}
        </p>
      </div>
    </div>
  );
}
