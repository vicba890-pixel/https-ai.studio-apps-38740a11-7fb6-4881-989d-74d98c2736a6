import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Film, Send, Heart, MessageCircle, Share2, Award, 
  Coins, Sparkles, Shield, UserCheck, AlertCircle, Headphones, Video
} from 'lucide-react';
import { Contact, MediaPost, Transaction } from '../types';
import { translations, Language } from '../translations';
import { playChimeSuccess, playCashRegister, playScannerBeep, playKeyTap } from '../utils/sound';

interface SocialHubProps {
  balance: number;
  contacts: Contact[];
  transactions: Transaction[];
  onUpdateBalance: (newBalance: number) => void;
  onAddTransaction: (transaction: Transaction) => void;
  onAddLog: (action: string, category: 'security' | 'wallet' | 'system', detail: string) => void;
  onUpdateContacts: (updated: Contact[]) => void;
  lang: Language;
}

export default function SocialHub({
  balance,
  contacts,
  transactions,
  onUpdateBalance,
  onAddTransaction,
  onAddLog,
  onUpdateContacts,
  lang
}: SocialHubProps) {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'chats' | 'stream'>('chats');
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '1');
  const [chatMessageText, setChatMessageText] = useState('');
  
  // Simulated stream of popular posts
  const [streamPosts, setStreamPosts] = useState<MediaPost[]>([
    {
      id: 'post-1',
      author: 'TechNexus Reviews',
      avatar: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=150&q=80',
      description: 'Probando la optimización física de TrioSphere a 5MB. ¡Nuestros teléfonos Android vuelan libres de lag! ⚡🚀',
      mediaUrl: 'from-cyan-900 via-blue-900 to-indigo-950',
      mediaType: 'gradient',
      category: 'Tecnología',
      likes: 1242,
      comments: 322,
      shares: 98,
      tippedAmount: 12.00,
      hasLiked: false
    },
    {
      id: 'post-2',
      author: 'Lofi Ambient Beats',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80',
      description: 'Sonido espacial para programar relajado. Cero consumo de datos en streaming de audio local. 🎧✨ #Chill #Code',
      mediaUrl: 'from-fuchsia-900 via-pink-900 to-rose-950',
      mediaType: 'gradient',
      category: 'Música',
      likes: 890,
      comments: 114,
      shares: 45,
      tippedAmount: 5.00,
      hasLiked: true
    },
    {
      id: 'post-3',
      author: 'Chef Rodolfo',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80',
      description: 'Preparando la famosa Smash Burger que hoy puedes ordenar en la pestaña principal de GoDelivery. 🍔🔥 ¿Con papas o aros?',
      mediaUrl: 'from-amber-900 via-orange-900 to-yellow-950',
      mediaType: 'gradient',
      category: 'Cocina',
      likes: 2154,
      comments: 423,
      shares: 210,
      tippedAmount: 22.00,
      hasLiked: false
    }
  ]);

  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contacts, selectedContactId, activeSubTab]);

  const activeContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  // Send a Chat Message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    playKeyTap();
    const userMsgText = chatMessageText.trim();
    
    // Create new message for the active contact
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContactId) {
        const newMsg = {
          id: 'msg-' + Date.now(),
          sender: 'user' as const,
          text: userMsgText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        };
        return {
          ...c,
          lastMessage: userMsgText,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    onUpdateContacts(updatedContacts);
    setChatMessageText('');

    // Trigger mock interactive response
    setTimeout(() => {
      let replyText = '¡Interesante! Registré tu mensaje en el historial seguro-criptográfico.';
      
      if (selectedContactId === '1') { // Messi
        if (userMsgText.toLowerCase().includes('hola') || userMsgText.toLowerCase().includes('cómo')) {
          replyText = '¡Hola che! Todo de diez por acá preparando el próximo partido. Tremenda esta super app, anda muy fluido todo.';
        } else if (userMsgText.toLowerCase().includes('billetera') || userMsgText.toLowerCase().includes('wallet')) {
          replyText = '¡Mirá, la wallet está de primera! Mandame unos centavos para ver cómo viaja el hash seguro de Android.';
        } else {
          replyText = '¡Qué grande! Te mando un abrazo gigante. Gracias por el aguante de siempre.';
        }
      } else if (selectedContactId === '2') { // Elon
        if (userMsgText.toLowerCase().includes('hola') || userMsgText.toLowerCase().includes('cómo')) {
          replyText = 'Howdy! Extremely focused on Mars architecture. Love the low disk space overhead of this multi-app.';
        } else if (userMsgText.toLowerCase().includes('billetera') || userMsgText.toLowerCase().includes('wallet') || userMsgText.toLowerCase().includes('dinero')) {
          replyText = 'Micro-payments are key for interplanetary scaling. 5¢ per transaction is very efficient.';
        } else {
          replyText = 'Great feedback. Let us accelerate multi-app efficiency to 100%.';
        }
      } else if (selectedContactId === '3') { // Dev Team
        replyText = '¡Hola! Somos el equipo de TrioSphere. Tu saldo está resguardado localmente y el micro-payment de 5¢ nos ayuda a mantener los servidores activos de alta conectividad. ¡Gracias!';
      }

      const updatedWithReply = updatedContacts.map(c => {
        if (c.id === selectedContactId) {
          const replyMsg = {
            id: 'reply-' + Date.now(),
            sender: 'contact' as const,
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false
          };
          return {
            ...c,
            lastMessage: replyText,
            messages: [...c.messages, replyMsg]
          };
        }
        return c;
      });

      playScannerBeep(); // high-fidelity message arrival sound
      onUpdateContacts(updatedWithReply);
      onAddLog('Mensaje Recibido', 'system', `Respuesta automática de ${activeContact.name}`);
    }, 1500);
  };

  // Chat fast donation (Tipping $1.00 directly to the active contact with $0.05 fee)
  const handleTipContact = (contact: Contact) => {
    const tipAmount = 1.00;
    const totalDeduction = tipAmount + 0.05;

    if (totalDeduction > balance) {
      alert(`Saldo insuficiente en Wallet. Necesitas $${totalDeduction.toFixed(2)} ($1.00 tip + 5¢ micropago de uso). Tu saldo es $${balance.toFixed(2)}.`);
      return;
    }

    playCashRegister(); // play transaction chime
    const newBal = balance - totalDeduction;
    const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
    const newTx: Transaction = {
      id: txId,
      date: new Date().toLocaleString(),
      type: 'tip',
      description: `Tip Social enviado a ${contact.name}`,
      sender: 'Mi Wallet Nexus',
      receiver: contact.walletAddress,
      amount: tipAmount,
      devFee: 0.05,
      finalAmount: -totalDeduction,
      status: 'completed',
      securityHash: 'SHA256-TIP' + Math.floor(Math.random() * 1000000).toString(16).toUpperCase()
    };

    onUpdateBalance(newBal);
    onAddTransaction(newTx);
    onAddLog('Tip Social', 'wallet', `Enviada propina de $1.00 a ${contact.name}. Micropago de 5¢ aplicado.`);

    // Add a receipt notification directly inside the chat messages
    const updatedContacts = contacts.map(c => {
      if (c.id === contact.id) {
        const systemReceiptMsg = {
          id: 'receipt-' + Date.now(),
          sender: 'system' as const,
          text: `🪙 Enviaste propina de $1.00 USD (Costo dev: 5¢). ID trx: ${txId}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        };
        return {
          ...c,
          messages: [...c.messages, systemReceiptMsg]
        };
      }
      return c;
    });
    onUpdateContacts(updatedContacts);
    alert(`¡Propina de $1.00 enviada exitosamente a ${contact.name}! Se descontaron $1.05 de tu saldo.`);
  };

  // STREAM INTERACTION: LIKE POST
  const handleLikePost = (postId: string) => {
    setStreamPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likes: hasLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  // STREAM INTERACTION: SHARE POST
  const handleSharePost = (postAuthor: string) => {
    alert(`Enlace seguro de TrioSphere copiado. ¡Se simula el reenvío rápido optimizado a WhatsApp!`);
    onAddLog('Publicación Compartida', 'system', `Se compartió la publicación de "${postAuthor}"`);
  };

  // STREAM INTERACTION: COMMENT POST
  const handleAddComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;

    setStreamPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        };
      }
      return post;
    }));

    setCommentInput(prev => ({ ...prev, [postId]: '' }));
    alert('Comentario seguro enviado y verificado por hash.');
  };

  // STREAM INTERACTION: TIP POST ($1.00 deduction + $0.05 dev fee)
  const handleTipPost = (post: MediaPost) => {
    const tipAmount = 1.00;
    const totalDeduction = tipAmount + 0.05;

    if (totalDeduction > balance) {
      alert(`Saldo insuficiente para patrocinar. Requiere $1.05 en cuenta. Tu saldo: $${balance.toFixed(2)}.`);
      return;
    }

    const newBal = balance - totalDeduction;
    const txId = 'WTX' + Math.floor(Math.random() * 89999 + 10000);
    const newTx: Transaction = {
      id: txId,
      date: new Date().toLocaleString(),
      type: 'tip',
      description: `Patrocinio TokStream: @${post.author}`,
      sender: 'Mi Wallet Nexus',
      receiver: `@${post.author} Wallet`,
      amount: tipAmount,
      devFee: 0.05,
      finalAmount: -totalDeduction,
      status: 'completed',
      securityHash: 'SHA256-STRM' + Math.floor(Math.random() * 100000).toString(16).toUpperCase()
    };

    onUpdateBalance(newBal);
    onAddTransaction(newTx);
    onAddLog('Tip Creador Streaming', 'wallet', `Enviada propina de $1.00 a @${post.author}. Micropago de 5¢ aplicado.`);

    // Visually update post's tipped counter
    setStreamPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          tippedAmount: p.tippedAmount + tipAmount
        };
      }
      return p;
    }));

    alert(`¡Patrocinaste a @${post.author} con $1.00 USD! El historial detalla el desglose del micropago.`);
  };

  return (
    <div className="flex flex-col h-full space-y-3 pb-16">
      {/* Dynamic Sub headers to swap Chats vs Stream Feed */}
      <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-xl border border-slate-900 shrink-0">
        <button
          onClick={() => setActiveSubTab('chats')}
          className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'chats'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          InstaChat (WhatsApp)
        </button>
        <button
          onClick={() => setActiveSubTab('stream')}
          className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'stream'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          TokStream (TikTok)
        </button>
      </div>

      {/* SUB PANELS */}
      {activeSubTab === 'chats' ? (
        /* INSTACHAT MODULE */
        <div className="flex flex-col flex-1 min-h-0 bg-slate-900/60 rounded-xl border border-slate-850 overflow-hidden">
          {/* Contact Bar select */}
          <div className="flex gap-2 overflow-x-auto p-2 bg-slate-950 border-b border-indigo-950 shrink-0">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`py-1 px-2.5 rounded-full flex items-center gap-1.5 shrink-0 text-xs font-bold transition-all border ${
                  selectedContactId === contact.id
                    ? 'bg-indigo-950 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-900 border-transparent text-slate-450 hover:bg-slate-800'
                }`}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-indigo-200/20 text-indigo-300 text-[8px] font-bold rounded-full flex items-center justify-center">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.online && (
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full absolute -bottom-0.5 -right-0.5 border border-slate-950" />
                  )}
                </div>
                {contact.name}
              </button>
            ))}
          </div>

          {/* Active Contact Header */}
          <div className="p-2.5 bg-slate-950/80 border-b border-slate-900 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600/20 text-indigo-300 rounded-lg flex items-center justify-center text-xs font-bold font-mono">
                {activeContact?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                  {activeContact?.name}
                  {activeContact?.id === '3' && <UserCheck className="w-3 h-3 text-cyan-400" />}
                </h3>
                <p className="text-[9px] text-slate-500 font-mono italic truncate max-w-[140px]">
                  Wallet: {activeContact?.walletAddress}
                </p>
              </div>
            </div>

            {/* fast Tip / Donation Action */}
            <button
              onClick={() => handleTipContact(activeContact)}
              className="bg-pink-950/40 hover:bg-pink-900/40 border border-pink-500/30 text-pink-300 font-extrabold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              title="Donar propina de $1.00 de manera rápida"
            >
              <Coins className="w-3 h-3 text-pink-400" />
              Tip $1.00
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 bg-slate-950/20">
            {activeContact?.messages?.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="mx-auto max-w-[85%] text-center">
                    <span className="inline-block bg-slate-950 text-indigo-300 border border-indigo-950 text-[9px] py-0.5 px-2 rounded-md font-mono leading-relaxed">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-xl p-2.5 text-xs ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-slate-950 border border-slate-900 text-slate-200 rounded-tl-none'
                  }`}>
                    <p className="leading-snug break-words">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-70">
                      <span>{msg.time}</span>
                      {!isUser && <Shield className="w-2.5 h-2.5 text-emerald-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Footer Form input */}
          <form onSubmit={handleSendChatMessage} className="p-2 bg-slate-950 border-t border-slate-900 shrink-0 flex gap-1.5 items-center">
            <input
              type="text"
              placeholder={`Escribe a ${activeContact?.name}...`}
              value={chatMessageText}
              onChange={(e) => setChatMessageText(e.target.value)}
              className="flex-1 bg-slate-900 text-white placeholder-slate-500 rounded-lg border border-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!chatMessageText.trim()}
              className="bg-indigo-600 text-white hover:bg-indigo-500 p-1.5 rounded-lg transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* TOKSTREAM MODULE */
        <div className="flex flex-col flex-1 min-h-0 bg-slate-950/30 overflow-y-auto space-y-4 pr-1">
          {/* Stream posts generator */}
          {streamPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-slate-900/70 border border-slate-850 rounded-2xl overflow-hidden shadow-lg p-3 space-y-3"
            >
              {/* Creator Metadata */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-slate-700 overflow-hidden shrink-0">
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">@{post.author}</h4>
                    <span className="text-[8px] bg-slate-820 text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* fast tip amount sponsored */}
                <div className="text-right">
                  <span className="text-[9px] text-pink-400 font-mono block">Recaudado</span>
                  <span className="text-xs font-bold text-white font-mono">${post.tippedAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Feed Card representation */}
              <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${post.mediaUrl} border border-white/5 relative flex flex-col justify-between p-3.5`}>
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-black/40 backdrop-blur-md text-[8px] text-white/90 px-2 py-0.5 rounded font-mono flex items-center gap-1.5 border border-white/10">
                    <Video className="w-2.5 h-2.5 text-red-500" />
                    LIVE REC
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Sparkles className="w-20 h-20 text-white" />
                </div>

                <div className="mt-auto relative z-10 space-y-0.5 bg-black/40 backdrop-blur-sm p-1.5 rounded-lg border border-white/5">
                  <p className="text-[10px] text-slate-100 font-bold">Optimización Android</p>
                  <p className="text-[8px] text-slate-300 leading-normal">Carga asíncrona de buffer de video local.</p>
                </div>
              </div>

              {/* Text Description */}
              <p className="text-xs text-slate-200 leading-normal px-1">
                {post.description}
              </p>

              {/* Action and feedback row */}
              <div className="flex justify-between items-center px-1 border-t border-slate-950 pt-2 text-slate-400 text-xs">
                {/* Likes action */}
                <button
                  type="button"
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors font-bold ${post.hasLiked ? 'text-red-500 font-bold' : 'hover:text-white'}`}
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-[10px]">{post.likes}</span>
                </button>

                {/* Shares */}
                <button
                  type="button"
                  onClick={() => handleSharePost(post.author)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-[10px]">{post.shares}</span>
                </button>

                {/* Send coin tip */}
                <button
                  type="button"
                  onClick={() => handleTipPost(post)}
                  className="bg-gradient-to-r from-pink-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-[10px] px-3 py-1 rounded-xl flex items-center gap-1 transition-all"
                >
                  <Coins className="w-3.5 h-3.5 text-yellow-300" />
                  Donar $1.00
                </button>
              </div>

              {/* Simple comments input */}
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-900 items-center">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  value={commentInput[post.id] || ''}
                  onChange={(e) => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                  className="flex-1 bg-transparent text-[10px] text-white placeholder-slate-500 px-2.5 focus:outline-none"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  disabled={!(commentInput[post.id] || '').trim()}
                  className="bg-indigo-600/30 hover:bg-indigo-600 text-[9px] text-white font-bold py-1 px-3 rounded-md disabled:opacity-30 transition-colors"
                >
                  Opinar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
