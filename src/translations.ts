export type Language = 'es' | 'pt' | 'en';

export interface TranslationDict {
  // Common App Layout
  version: string;
  restoreSeed: string;
  restoreConfirm: string;
  restoreSuccess: string;
  appDescription: string;
  bentoWalletTitle: string;
  bentoWalletDesc: string;
  bentoMicropayTitle: string;
  bentoMicropayDesc: string;
  bentoSecurityTitle: string;
  bentoSecurityDesc: string;
  footerTitle: string;
  footerApidoc: string;
  footerCodeWeight: string;

  // Phone Shell & System Lock
  lockscreenTitle: string;
  lockscreenSub: string;
  inputPinLabel: string;
  pinPlaceholder: string;
  pinIncorrect: string;
  swipeUnlock: string;
  enterApp: string;
  deviceLockedByAttempts: string;
  resetSecurity: string;
  charging: string;
  stable: string;
  battery: string;
  lockSidebarBtn: string;

  // Inspector Sidebar
  inspectorTitle: string;
  inspectorDesc: string;
  memStatus: string;
  memValue: string;
  apkSize: string;
  apkValue: string;
  devSupportFee: string;
  devSupportValue: string;
  prefActive: string;
  auditTitle: string;
  auditClear: string;
  auditEmptyTitle: string;
  auditEmptyP1: string;
  auditEmptyP2: string;
  auditDisclaimer: string;
  downloadAuditPDF: string;

  // Licensing translations
  licensingTitle: string;
  licensingDesc: string;
  licensingOwnerLabel: string;
  licensingCpfLabel: string;
  licensingButton: string;
  licensingSuccessLog: string;
  auditAlertTitle: string;
  auditAlertDesc: string;

  // Wallet main actions
  walletName: string;
  fundsProtected: string;
  solidaryTitle: string;
  solidaryDesc: string;
  tabSummary: string;
  tabDeposit: string;
  tabSend: string;
  tabWithdraw: string;
  latestMovements: string;
  fullHistoryBtn: string;
  noTransactions: string;

  // Wallet deposits
  depositTitle: string;
  depositSub: string;
  depositLabel: string;
  depositFeeInfo: string;
  depositActionBtn: string;

  // Wallet withdraws
  withdrawTitle: string;
  withdrawSub: string;
  withdrawLabel: string;
  feeDeveloper: string;
  withdrawTotalDeduction: string;
  withdrawActionBtn: string;

  // Wallet transfers
  sendTitle: string;
  sendSub: string;
  sendContactLabel: string;
  externalAddress: string;
  recipientName: string;
  recipientPlaceholder: string;
  walletHashOrPhone: string;
  sendAmountLabel: string;
  sendFeeDeveloper: string;
  sendTotalDeduc: string;
  sendActionBtn: string;

  // Wallet History tab
  historyDetailedTitle: string;
  historyBackBtn: string;
  historySearchPlaceholder: string;
  historyFilterAll: string;
  historyFilterDeposits: string;
  historyFilterSends: string;
  historyFilterServices: string;
  historyFilterTips: string;
  historyNoRecords: string;

  // PIN validation dialog inside Wallet
  verificationTitle: string;
  verificationSub: string;
  verificationIncorrectPin: string;
  verificationCancel: string;
  verificationConfirm: string;

  // Invoice Receipt Modal
  receiptTitle: string;
  receiptSuccess: string;
  receiptSub: string;
  receiptReceiver: string;
  receiptSender: string;
  receiptDateTime: string;
  receiptType: string;
  receiptCodeId: string;
  receiptNet: string;
  receiptMicrofee: string;
  receiptTotal: string;
  receiptSecuritySignature: string;
  receiptCloseBtn: string;

  // Social Hub Module
  instachatTab: string;
  tokstreamTab: string;
  tipQuickBtn: string;
  writeChatMessage: string;
  copiedStreamLink: string;
  commentSentSuccess: string;
  streamSponsored: string;
  recaudadoLabel: string;
  patrocinarAction: string;
  donarAction: string;
  opinarAction: string;
  writeCommentPlaceholder: string;

  // Services Hub (GoDelivery)
  categoryAll: string;
  categoryRides: string;
  categoryFood: string;
  categoryGrocery: string;
  activeOrderTitle: string;
  orderProgressLabel: string;
  orderCancelledOk: string;
  closeCatalog: string;
  pedirBtn: string;
  includesFee: string;
  micropayDetailsTitle: string;
  micropayDetailsText: string;

  // Security Center
  secCenterTitle: string;
  secCenterSub: string;
  secLevelLabel: string;
  secLevelOptimum: string;
  secLevelModerate: string;
  secLevelLow: string;
  secLastScan: string;
  secBiometricsTitle: string;
  secBiometricsDesc: string;
  secShieldTitle: string;
  secShieldDesc: string;
  secPinTitle: string;
  secPinActive: string;
  secPinActiveSub: string;
  secPinDeactivate: string;
  secWarningNoPin: string;
  secInputPinLabelNew: string;
  secInputPinLabelConfirm: string;
  secSavePinBtn: string;
  secKeysTitle: string;
  secKeysParam: string;
  secKeysValue: string;
  secKeysChannel: string;
  secKeysSecurityHash: string;
  secKeysDevice: string;
  secKeysMicrofee: string;
  secKeysDesc: string;
  secResetBtn: string;
  secResetConfirm: string;
  secAlertTitle: string;
  secAlertText: string;
}

export const translations: Record<Language, TranslationDict> = {
  es: {
    version: 'v1.0.0 Estable',
    restoreSeed: 'Restaurar Valores Semilla',
    restoreConfirm: '¿Seguro que deseas restaurar la super-app? Se reestablecerá tu saldo a $50.00 y se limpiará el historial de compras.',
    restoreSuccess: 'TrioSphere reestablecida con éxito.',
    appDescription: 'La súper aplicación unificada diseñada para Android. Une 3 plataformas masivas (Chat, Streaming, Delivery) en un paquete compacto de alto rendimiento con Wallet y seguridad de vanguardia.',
    bentoWalletTitle: 'Wallet Inteligente Unificada',
    bentoWalletDesc: 'Consolida la pasarela de pagos. Cada acción (Donar a creadores, ordenar taxis o comida) deduce directamente tu saldo, manteniendo todo sincronizado.',
    bentoMicropayTitle: 'Micropago Solidario Integrado',
    bentoMicropayDesc: 'Soporte solidario contribuye con 5 centavos mas imp. para apoyar al creador del proyecto por transacción de salida, garantizando una experiencia libre de publicidad.',
    bentoSecurityTitle: 'Hardware Security Sandbox',
    bentoSecurityDesc: 'Simulación avanzada de llaves de cifrado AES de 256 bits, biometría de bloqueo corporal (huella) y confirmación de firmas hash ante cada cargo de red.',
    footerTitle: 'TrioSphere Super-App Multi-Functional Suite • Creado por V.S',
    footerApidoc: 'Optimizada para Android API 34+',
    footerCodeWeight: 'Desarrollado con Código Limpio de 5MB',

    lockscreenTitle: 'TrioSphere Lock',
    lockscreenSub: 'Protección del entorno aislado de Android.',
    inputPinLabel: 'INGRESA TU PIN SEGURO',
    pinPlaceholder: '••••',
    pinIncorrect: 'PIN incorrecto. Reintenta.',
    swipeUnlock: 'Sin PIN activo. Desliza seguro para entrar.',
    enterApp: 'Entrar en TrioSphere',
    deviceLockedByAttempts: 'Dispositivo bloqueado por reiterados intentos incorrectos de PIN.',
    resetSecurity: 'Reestablecer Seguridad',
    charging: 'Cargando...',
    stable: 'Estable',
    battery: 'Batería',
    lockSidebarBtn: 'Botón de Bloqueo',

    inspectorTitle: 'Android Terminal Inspector',
    inspectorDesc: 'Esta sección lee la telemetría del simulador móvil en tiempo real. Soporte solidario contribuye con 5 centavos mas imp. para apoyar al creador del proyecto por transacción de salida.',
    memStatus: 'ESTADO MEMORIA',
    memValue: '128MB / 1.2GB Free',
    apkSize: 'TAMAÑO PAQUETE (APK)',
    apkValue: '4.8 MB (Unificado)',
    devSupportFee: 'SOPORTE SOLIDARIO GENERAL',
    devSupportValue: '$0.05 + imp. por txn',
    prefActive: 'Preferencia Activa',
    auditTitle: 'Auditoría de Eventos & Firmas',
    auditClear: 'Borrar consola',
    auditEmptyTitle: 'Historial de auditoría limpio.',
    auditEmptyP1: 'Haz transacciones, envía dinero o cambia la seguridad para registrar firmas.',
    auditEmptyP2: '(Vacío)',
    auditDisclaimer: 'Los registros generados están auditados con un token simétrico simulado para testear integridad bancaria local.',
    downloadAuditPDF: 'Descargar Reporte de Auditoría (PDF)',

    licensingTitle: 'Titularidad & Licenciamiento de Código',
    licensingDesc: 'Detalles de propiedad intelectual del creador y autor de la arquitectura de TrioSphere Lite.',
    licensingOwnerLabel: 'Autor & Titular:',
    licensingCpfLabel: 'CPF Registrado:',
    licensingButton: 'Generar Contrato Digital As-Is (PDF)',
    licensingSuccessLog: 'Contrato Digital As-Is de Código Fuente generado con éxito.',
    auditAlertTitle: 'Alerta de Auditoría del Ledger',
    auditAlertDesc: 'Verificación activa de firmas criptográficas. El ledger local de transacciones está sincronizado y validado con cuentas bancarias en línea.',

    walletName: 'Android Nexus Wallet',
    fundsProtected: 'Fondos Protegidos por Hardware',
    solidaryTitle: 'Soporte Solidario de Desarrollador',
    solidaryDesc: 'Soporte solidario contribuye con 5 centavos mas imp. para apoyar al creador del proyecto por transacción de salida, libre de avisos ni banners molestos.',
    tabSummary: 'Resumen',
    tabDeposit: 'Cargar',
    tabSend: 'Enviar',
    tabWithdraw: 'Retirar',
    latestMovements: 'Últimos Movimientos',
    fullHistoryBtn: 'Ver Historial Completo',
    noTransactions: 'Aún no hay transacciones en esta billetera.',

    depositTitle: 'Simular Entrada de Fondos',
    depositSub: 'Agrega saldo de un banco ficticio para probar otras funciones de la app.',
    depositLabel: 'MONTO EN USD',
    depositFeeInfo: 'Los depósitos no pagan tasa de desarrollador. Recibes el 100% del monto ingresado.',
    depositActionBtn: 'Cargar Saldo',

    withdrawTitle: 'Retirar Efectivo',
    withdrawSub: 'Saca saldo a tu cuenta externa principal.',
    withdrawLabel: 'MONTO A RETIRAR (USD)',
    feeDeveloper: 'Micropago desarrolladores',
    withdrawTotalDeduction: 'Total a deducir del saldo',
    withdrawActionBtn: 'Autorizar Retiro (incluye 5¢ fee)',

    sendTitle: 'Transferencias Seguras',
    sendSub: 'Envía dinero de forma inmediata a tus contactos o wallet.',
    sendContactLabel: 'SELECCIONAR CONTACTO POPULAR',
    externalAddress: 'Dirección Externa',
    recipientName: 'Nombre Destinatario',
    recipientPlaceholder: 'Ej: Sophia López',
    walletHashOrPhone: 'Wallet hash o celular',
    sendAmountLabel: 'MONTO A ENVIAR (USD)',
    sendFeeDeveloper: 'micropago de uso',
    sendTotalDeduc: 'Total Deducido',
    sendActionBtn: 'Enviar Dinero Seguro',

    historyDetailedTitle: 'Historial Detallado',
    historyBackBtn: 'Volver',
    historySearchPlaceholder: 'Buscar por nombre, ID o firma...',
    historyFilterAll: 'Todos',
    historyFilterDeposits: 'Depósitos',
    historyFilterSends: 'Envíos',
    historyFilterServices: 'Servicios',
    historyFilterTips: 'Tips / Streaming',
    historyNoRecords: 'No se encontraron registros de transacciones.',

    verificationTitle: 'Autorización con PIN',
    verificationSub: 'Ingresa tu llave de 4 dígitos para firmar el micropago y ejecutar la transacción.',
    verificationIncorrectPin: 'PIN incorrecto. Reintenta.',
    verificationCancel: 'Cancelar',
    verificationConfirm: 'Confirmar',

    receiptTitle: 'TRANSACCIÓN EXITOSA',
    receiptSuccess: 'TRANSACCIÓN EXITOSA',
    receiptSub: 'Android Wallet Cripto-Receipt',
    receiptReceiver: 'RECEPTOR:',
    receiptSender: 'ORIGEN:',
    receiptDateTime: 'FECHA Y HORA:',
    receiptType: 'TIPO:',
    receiptCodeId: 'CÓDIGO ID:',
    receiptNet: 'Monto Neto:',
    receiptMicrofee: 'Micro-tasa Dev (5¢):',
    receiptTotal: 'Total Final:',
    receiptSecuritySignature: 'FIRMA DE SEGURIDAD (SHA256):',
    receiptCloseBtn: 'Listo',

    instachatTab: 'InstaChat (WhatsApp)',
    tokstreamTab: 'TokStream (TikTok)',
    tipQuickBtn: 'Tip $1.00',
    writeChatMessage: 'Escribe a...',
    copiedStreamLink: 'Enlace seguro de TrioSphere copiado. ¡Se simula el reenvío rápido optimizado a WhatsApp!',
    commentSentSuccess: 'Comentario seguro enviado y verificado por hash.',
    streamSponsored: '¡Patrocinaste a @{author} con $1.00 USD! El historial detalla el desglose del micropago.',
    recaudadoLabel: 'Recaudado',
    patrocinarAction: 'Donar $1.00',
    donarAction: 'Tip $1.00',
    opinarAction: 'Opinar',
    writeCommentPlaceholder: 'Escribe un comentario...',

    categoryAll: 'Todos',
    categoryRides: 'Viajes',
    categoryFood: 'Comida',
    categoryGrocery: 'Súper',
    activeOrderTitle: 'Servicio en Curso',
    orderProgressLabel: 'Progreso de la Ruta:',
    orderCancelledOk: 'Orden cancelada. Se han reembolsado a tu balance. El micropago del desarrollador de 5¢ no es reembolsable.',
    closeCatalog: 'Cerrar y Volver al Catálogo',
    pedirBtn: 'Pedir',
    includesFee: 'Incluye micro-tasa (5¢)',
    micropayDetailsTitle: 'Explicación del Micropago',
    micropayDetailsText: 'TrioSphere es un paquete unificado de 5MB sin suscripciones premium ni anuncios. El soporte solidario contribuye con 5 centavos mas imp. para apoyar al creador del proyecto por transacción de salida (órdenes de comida, viajes en taxi o envíos de fondos), manteniendo libre de basura tus datos.',

    secCenterTitle: 'Seguridad Avanzada',
    secCenterSub: 'Protocolos móviles unificados. Cripto-firmas de bajo peso que optimizan espacio y datos móviles en Android.',
    secLevelLabel: 'Nivel de Protección General:',
    secLevelOptimum: '(Óptimo)',
    secLevelModerate: '(Moderado)',
    secLevelLow: '(Bajo)',
    secLastScan: 'Último escaneo del sistema:',
    secBiometricsTitle: 'Huella / FaceID',
    secBiometricsDesc: 'Autorización rápida para transacciones.',
    secShieldTitle: 'Escudo de Red',
    secShieldDesc: 'Bloqueo activo anti-sniffing de saldo.',
    secPinTitle: 'PIN de Seguridad de la App',
    secPinActive: 'PIN Activo y Encriptado',
    secPinActiveSub: 'Protece compras, retiros y envíos de fondos.',
    secPinDeactivate: 'Desactivar',
    secWarningNoPin: 'Recomendamos definir un PIN. Ayuda a simular la encriptación de firmas hash ante micropagos de desarrollador (5¢).',
    secInputPinLabelNew: 'Nuevo PIN (4 dígitos)',
    secInputPinLabelConfirm: 'Confirmar PIN',
    secSavePinBtn: 'Guardar PIN Seguro',
    secKeysTitle: 'Claves de Android & Wallet',
    secKeysParam: 'PARÁMETRO',
    secKeysValue: 'VALOR ACTUAL',
    secKeysChannel: 'Canal de Datos',
    secKeysSecurityHash: 'Firma Hash de Sesión',
    secKeysDevice: 'ID de Dispositivo',
    secKeysMicrofee: 'Micro-fee Dev',
    secKeysDesc: 'La tecnología de firmas asimétricas concatenadas previene la inyección de transacciones falsas, validando cada cobro de desarrollador.',
    secResetBtn: 'Resetear',
    secResetConfirm: '¿Seguro que deseas reiniciar los parámetros de seguridad a valores por defecto?',
    secAlertTitle: 'Protección de Datos Android',
    secAlertText: 'Esta aplicación simula almacenamiento aislado (Scooped Storage) integrado por hardware, ideal para un consumo mínimo de energía y espacio de 5MB en disco físico.'
  },
  pt: {
    version: 'v1.0.0 Estável',
    restoreSeed: 'Restaurar Valores Semente',
    restoreConfirm: 'Tem certeza que deseja restaurar a super-app? Seu saldo será redefinido para $50.00 e o histórico de compras será limpo.',
    restoreSuccess: 'TrioSphere restaurado com sucesso.',
    appDescription: 'A super aplicação unificada projetada para Android. Une 3 plataformas massivas (Chat, Streaming, Delivery) em um pacote compacto de alto desempenho com Wallet e segurança de última geração.',
    bentoWalletTitle: 'Wallet Inteligente Unificada',
    bentoWalletDesc: 'Consolida o gateway de pagamentos. Cada ação (Doar a criadores, pedir táxis ou comida) deduz diretamente o seu saldo, mantendo tudo sincronizado.',
    bentoMicropayTitle: 'Micropagamento Solidário Integrado',
    bentoMicropayDesc: 'O suporte solidário contribui com 5 centavos mais impostos para apoiar o criador do projeto por transação de saída, garantindo uma experiência livre de anúncios.',
    bentoSecurityTitle: 'Hardware Security Sandbox',
    bentoSecurityDesc: 'Simulação avançada de chaves de criptografia AES de 256 bits, biometria de bloqueio físico (impressão digital) e confirmação de assinaturas hash para cada transação.',
    footerTitle: 'TrioSphere Super-App Multi-Functional Suite • Criado por V.S',
    footerApidoc: 'Otimizado para Android API 34+',
    footerCodeWeight: 'Desenvolvido com Código Limpo de 5MB',

    lockscreenTitle: 'TrioSphere Lock',
    lockscreenSub: 'Proteção do ambiente isolado do Android.',
    inputPinLabel: 'INSIRA SEU PIN SEGURO',
    pinPlaceholder: '••••',
    pinIncorrect: 'PIN incorreto. Tente novamente.',
    swipeUnlock: 'Sem PIN ativo. Deslize seguro para entrar.',
    enterApp: 'Entrar no TrioSphere',
    deviceLockedByAttempts: 'Dispositivo bloqueado devido a várias tentativas incorretas de PIN.',
    resetSecurity: 'Redefinir Segurança',
    charging: 'Carregando...',
    stable: 'Estável',
    battery: 'Bateria',
    lockSidebarBtn: 'Botão de Bloqueio',

    inspectorTitle: 'Android Terminal Inspector',
    inspectorDesc: 'Esta seção lê a telemetria do simulador móvel em tempo real. O suporte solidário contribui com 5 centavos mais impostos para apoiar o criador do projeto por transação de saída.',
    memStatus: 'ESTADO DA MEMÓRIA',
    memValue: '128MB / 1.2GB Livre',
    apkSize: 'TAMANHO DO PACOTE (APK)',
    apkValue: '4.8 MB (Unificado)',
    devSupportFee: 'SUPORTE SOLIDÁRIO GERAL',
    devSupportValue: '$0.05 + imp. por txn',
    prefActive: 'Preferência Ativa',
    auditTitle: 'Auditoria de Eventos e Assinaturas',
    auditClear: 'Limpar console',
    auditEmptyTitle: 'Histórico de auditoria limpo.',
    auditEmptyP1: 'Faça transações, envie dinheiro ou altere as configurações para registrar assinaturas.',
    auditEmptyP2: '(Vazio)',
    auditDisclaimer: 'Os registros gerados são auditados com um token simétrico simulado para testar integridade bancária local.',
    downloadAuditPDF: 'Baixar Relatório de Auditoria (PDF)',

    licensingTitle: 'Titularidade & Licenciamento de Código',
    licensingDesc: 'Detalhes de propriedade intelectual do criador e autor da arquitetura do TrioSphere Lite.',
    licensingOwnerLabel: 'Autor & Titular:',
    licensingCpfLabel: 'CPF Registrado:',
    licensingButton: 'Gerar Contrato Digital As-Is (PDF)',
    licensingSuccessLog: 'Contrato Digital As-Is de Código Fonte gerado com sucesso.',
    auditAlertTitle: 'Alerta de Auditoria do Livro-Razão',
    auditAlertDesc: 'Verificação ativa de assinaturas criptográficas. O livro-razão local de transações está sincronizado e validado com contas bancárias online.',

    walletName: 'Android Nexus Wallet',
    fundsProtected: 'Fundos Protegidos por Hardware',
    solidaryTitle: 'Suporte Solidário do Desenvolvedor',
    solidaryDesc: 'O suporte solidário contribui com 5 centavos mais impostos para apoiar o criador do projeto por transação de saída, livre de anúncios ou banners chatos!',
    tabSummary: 'Resumo',
    tabDeposit: 'Carregar',
    tabSend: 'Enviar',
    tabWithdraw: 'Retirar',
    latestMovements: 'Últimos Movimentos',
    fullHistoryBtn: 'Ver Histórico Completo',
    noTransactions: 'Ainda não há transações nesta carteira.',

    depositTitle: 'Simular Entrada de Fundos',
    depositSub: 'Adicione saldo de um banco fictício para testar outras funções do aplicativo.',
    depositLabel: 'VALOR EM USD',
    depositFeeInfo: 'Os depósitos não cobram taxa de desenvolvedor. Você recebe 100% do valor inserido.',
    depositActionBtn: 'Carregar Saldo',

    withdrawTitle: 'Retirar Dinheiro',
    withdrawSub: 'Retire o saldo para sua conta externa principal.',
    withdrawLabel: 'VALOR A RETIRAR (USD)',
    feeDeveloper: 'Micropagamento desenvolvedores',
    withdrawTotalDeduction: 'Total a deduzir do saldo',
    withdrawActionBtn: 'Autorizar Retirada (inclui taxa de 5¢)',

    sendTitle: 'Transferências Seguras',
    sendSub: 'Envie dinheiro instantaneamente para seus contatos ou carteira.',
    sendContactLabel: 'SELECIONAR CONTATO POPULAR',
    externalAddress: 'Endereço Externo',
    recipientName: 'Nome do Destinatário',
    recipientPlaceholder: 'Ex: Sophia Lopes',
    walletHashOrPhone: 'Hash da carteira ou celular',
    sendAmountLabel: 'VALOR A ENVIAR (USD)',
    sendFeeDeveloper: 'micropagamento de uso',
    sendTotalDeduc: 'Total Deduzido',
    sendActionBtn: 'Enviar Dinheiro Seguro',

    historyDetailedTitle: 'Histórico Detalhado',
    historyBackBtn: 'Voltar',
    historySearchPlaceholder: 'Buscar por nome, ID ou assinatura...',
    historyFilterAll: 'Todos',
    historyFilterDeposits: 'Depósitos',
    historyFilterSends: 'Envios',
    historyFilterServices: 'Serviços',
    historyFilterTips: 'Tips / Streaming',
    historyNoRecords: 'Nenhum registro de transação encontrado.',

    verificationTitle: 'Autorização com PIN',
    verificationSub: 'Insira o seu PIN de 4 dígitos para assinar o micropagamento e executar a transação.',
    verificationIncorrectPin: 'PIN incorreto. Tente novamente.',
    verificationCancel: 'Cancelar',
    verificationConfirm: 'Confirmar',

    receiptTitle: 'TRANSAÇÃO CONCLUÍDA',
    receiptSuccess: 'TRANSAÇÃO CONCLUÍDA',
    receiptSub: 'Android Wallet Cripto-Receipt',
    receiptReceiver: 'RECEBEDOR:',
    receiptSender: 'ORIGEM:',
    receiptDateTime: 'DATA E HORA:',
    receiptType: 'TIPO:',
    receiptCodeId: 'CÓDIGO ID:',
    receiptNet: 'Valor Líquido:',
    receiptMicrofee: 'Taxa Desenvolvedor (5¢):',
    receiptTotal: 'Total Final:',
    receiptSecuritySignature: 'ASSINATURA DE SEGURANÇA (SHA256):',
    receiptCloseBtn: 'Concluído',

    instachatTab: 'InstaChat (WhatsApp)',
    tokstreamTab: 'TokStream (TikTok)',
    tipQuickBtn: 'Doar $1.00',
    writeChatMessage: 'Escrever para...',
    copiedStreamLink: 'Link seguro do TrioSphere copiado. O aplicativo simula o redirecionamento rápido para o WhatsApp!',
    commentSentSuccess: 'Comentário seguro enviado e validado por hash.',
    streamSponsored: 'Você patrocinou @{author} com $1.00 USD! O histórico detalha o detalhamento do micropagamento.',
    recaudadoLabel: 'Arrecadado',
    patrocinarAction: 'Doar $1.00',
    donarAction: 'Doar $1.00',
    opinarAction: 'Opinar',
    writeCommentPlaceholder: 'Escreva um comentário...',

    categoryAll: 'Todos',
    categoryRides: 'Viagens',
    categoryFood: 'Comida',
    categoryGrocery: 'Mercado',
    activeOrderTitle: 'Serviço em Andamento',
    orderProgressLabel: 'Progresso do Percurso:',
    orderCancelledOk: 'Pedido cancelado. O valor base foi reembolsado para o seu saldo. O micropagamento de 5¢ do desenvolvedor não é reembolsável.',
    closeCatalog: 'Fechar e Voltar ao Catálogo',
    pedirBtn: 'Pedir',
    includesFee: 'Inclui Taxa de 5¢',
    micropayDetailsTitle: 'Sobre o Micropagamento',
    micropayDetailsText: 'TrioSphere é um pacote unificado de 5MB sem assinaturas premium ou anúncios chatos. O suporte solidário contribui com 5 centavos mais impostos para apoiar o criador do projeto por transação de saída (pedidos de comida, viagens de táxi ou transferências de saldo), garantindo o desenvolvimento limpo.',

    secCenterTitle: 'Segurança Avançada',
    secCenterSub: 'Protocolos móveis unificados. Assinaturas de criptografia de baixo peso que otimizam o espaço e dados móveis no Android.',
    secLevelLabel: 'Nível Geral de Proteção:',
    secLevelOptimum: '(Ótimo)',
    secLevelModerate: '(Moderado)',
    secLevelLow: '(Baixo)',
    secLastScan: 'Última varredura do sistema:',
    secBiometricsTitle: 'Digital / FaceID',
    secBiometricsDesc: 'Autorização rápida para suas transações.',
    secShieldTitle: 'Escudo de Rede',
    secShieldDesc: 'Bloqueio ativo contra vazamento de saldo.',
    secPinTitle: 'PIN de Segurança da App',
    secPinActive: 'PIN Ativo e Criptografado',
    secPinActiveSub: 'Protege compras, saques e transferências de saldo.',
    secPinDeactivate: 'Desativar',
    secWarningNoPin: 'Recomendamos definir um PIN. Ajuda a simular as assinaturas criptográficas para as taxas de 5¢.',
    secInputPinLabelNew: 'Novo PIN (4 dígitos)',
    secInputPinLabelConfirm: 'Confirmar PIN',
    secSavePinBtn: 'Salvar PIN Seguro',
    secKeysTitle: 'Chaves do Android & Wallet',
    secKeysParam: 'PARÂMETRO',
    secKeysValue: 'VALOR ATUAL',
    secKeysChannel: 'Canal de Dados',
    secKeysSecurityHash: 'Assinatura Hash de Sessão',
    secKeysDevice: 'ID do Dispositivo',
    secKeysMicrofee: 'Micropagamento Dev',
    secKeysDesc: 'A tecnologia de assinaturas asimétricas impede transações fraudulentas, validando cada contribuição ao desenvolvedor.',
    secResetBtn: 'Reiniciar',
    secResetConfirm: 'Tem certeza de que deseja redefinir os parâmetros de segurança para os padrões?',
    secAlertTitle: 'Proteção de Dados Android',
    secAlertText: 'Este aplicativo simula Armazenamento Isolado (Scooped Storage) integrado por hardware, ideal para baixíssimo consumo de bateria e tamanho fixo de 5MB em disco.'
  },
  en: {
    version: 'v1.0.0 Stable',
    restoreSeed: 'Restore Seed Values',
    restoreConfirm: 'Are you sure you want to restore the super-app? Your balance will be reset to $50.00 and transaction history will be cleared.',
    restoreSuccess: 'TrioSphere successfully restored.',
    appDescription: 'The unified super-app designed for Android. Bundles 3 massive platforms (Chat, Streaming, Delivery) into a compact high-performance 5MB footprint with an integrated Secure Wallet & cutting-edge security.',
    bentoWalletTitle: 'Unified Intelligent Wallet',
    bentoWalletDesc: 'Consolidates the payment gateway. Every action (Tipping creators, ordering rides or food) directly deduces your balance, keeping everything synced.',
    bentoMicropayTitle: 'Integrated Solidary Micro-Fee',
    bentoMicropayDesc: 'Solidary support contributes 5 cents plus tax to support the project creator per outgoing transaction, ensuring a premium environment free of ads.',
    bentoSecurityTitle: 'Hardware Security Sandbox',
    bentoSecurityDesc: 'Advanced emulation of 256-bit AES encryption keys, physical device biometrics (fingerprint), and secure hash-signature confirmation.',
    footerTitle: 'TrioSphere Super-App Multi-Functional Suite • Created by V.S',
    footerApidoc: 'Optimized for Android API 34+',
    footerCodeWeight: 'Built with Clean Code under 5MB',

    lockscreenTitle: 'TrioSphere Lock',
    lockscreenSub: 'Android secure sandbox protection.',
    inputPinLabel: 'ENTER SECURITY PIN',
    pinPlaceholder: '••••',
    pinIncorrect: 'Incorrect PIN. Try again.',
    swipeUnlock: 'No active PIN. Swipe securely to enter.',
    enterApp: 'Enter TrioSphere',
    deviceLockedByAttempts: 'Device locked due to multiple incorrect PIN attempts.',
    resetSecurity: 'Reset Security Settings',
    charging: 'Charging...',
    stable: 'Stable',
    battery: 'Battery',
    lockSidebarBtn: 'Trigger Power Key',

    inspectorTitle: 'Android Terminal Inspector',
    inspectorDesc: 'This panel showcases real-time device telemetry. Solidary support contributes 5 cents plus tax to support the project creator per outgoing transaction.',
    memStatus: 'MEMORY ACCESSED',
    memValue: '128MB / 1.2GB Free',
    apkSize: 'PACKAGE SIZE (APK)',
    apkValue: '4.8 MB (Unified)',
    devSupportFee: 'SOLIDARY DEV FEE',
    devSupportValue: '$0.05 + tax per txn',
    prefActive: 'Active Preference',
    auditTitle: 'Events & Signed Signatures logs',
    auditClear: 'Clear console',
    auditEmptyTitle: 'Audit logs are currently clean.',
    auditEmptyP1: 'Perform wallet operations, dispatch funds, or configure biometrics to initiate signed lines.',
    auditEmptyP2: '(Empty)',
    auditDisclaimer: 'Operations are signed with an audited mock symmetric token securing local ledger consistency.',
    downloadAuditPDF: 'Download System Audit Report (PDF)',

    licensingTitle: 'Code Ownership & Licensing',
    licensingDesc: 'Intellectual property ownership and authorship details for the TrioSphere Lite architecture.',
    licensingOwnerLabel: 'Author & Owner:',
    licensingCpfLabel: 'Registered CPF:',
    licensingButton: 'Generate Pre-Signed As-Is Contract (PDF)',
    licensingSuccessLog: 'Source Code Digital As-Is Contract generated successfully.',
    auditAlertTitle: 'Ledger Audit Alert',
    auditAlertDesc: 'Active cryptographic signature verification. The local transaction ledger is synchronized and validated with online bank accounts.',

    walletName: 'Android Nexus Wallet',
    fundsProtected: 'Hardware Protected Balance',
    solidaryTitle: 'Developer Solidary Micro-Fee',
    solidaryDesc: 'Solidary support contributes 5 cents plus tax to support the project creator per outgoing transaction, keeping the application light and free of banners!',
    tabSummary: 'Summary',
    tabDeposit: 'Deposit',
    tabSend: 'Send Cash',
    tabWithdraw: 'Withdraw',
    latestMovements: 'Recent Activity',
    fullHistoryBtn: 'View Detailed Ledger',
    noTransactions: 'No transaction history detected in this session.',

    depositTitle: 'Simulate Incoming Funds',
    depositSub: 'Add mock funds from a test account to experience the integrated ecosystem.',
    depositLabel: 'AMOUNT IN USD',
    depositFeeInfo: 'Incoming deposits do not incur the developer micro-fee. You receive 100% of the loaded funds.',
    depositActionBtn: 'Deposit Funds',

    withdrawTitle: 'Secure Cash Out',
    withdrawSub: 'Retrieve wallet balances back to your primary bank node.',
    withdrawLabel: 'WITHDRAWAL AMOUNT (USD)',
    feeDeveloper: 'Developer support fee',
    withdrawTotalDeduction: 'Total Balance Deducted',
    withdrawActionBtn: 'Authorize Withdrawal (includes 5¢ fee)',

    sendTitle: 'Secure Peer-to-Peer Transfer',
    sendSub: 'Dispatch instant tokens asymmetrically to contacts or custom targets.',
    sendContactLabel: 'SELECT POPULAR CONTACT',
    externalAddress: 'External Node',
    recipientName: 'Recipient Display Name',
    recipientPlaceholder: 'e.g. Sophia Lopez',
    walletHashOrPhone: 'Wallet hash key or cellular phone',
    sendAmountLabel: 'AMOUNT TO DISPATCH (USD)',
    sendFeeDeveloper: 'solidary micro-fee',
    sendTotalDeduc: 'Total Deducted Amount',
    sendActionBtn: 'Transfer Funds Securely',

    historyDetailedTitle: 'Detailed Ledger History',
    historyBackBtn: 'Back',
    historySearchPlaceholder: 'Search by receiver, hash signature, ID...',
    historyFilterAll: 'All Moving',
    historyFilterDeposits: 'Deposits',
    historyFilterSends: 'Transfers',
    historyFilterServices: 'Deliveries',
    historyFilterTips: 'Creator Tips',
    historyNoRecords: 'No matched transaction signatures in storage.',

    verificationTitle: 'PIN Ledger Access',
    verificationSub: 'Type in your 4-digit token pin to sign the dev support micro-payment and complete this operation.',
    verificationIncorrectPin: 'Invalid security PIN. Access denied.',
    verificationCancel: 'Cancel',
    verificationConfirm: 'Confirm',

    receiptTitle: 'TRANSACTION SIGNED',
    receiptSuccess: 'TRANSACTION SIGNED',
    receiptSub: 'Android Secure Wallet Receipt',
    receiptReceiver: 'RECIPIENT:',
    receiptSender: 'ORIGIN:',
    receiptDateTime: 'DATE & TIME:',
    receiptType: 'TYPE:',
    receiptCodeId: 'LEDGER ID:',
    receiptNet: 'Net Amount:',
    receiptMicrofee: 'Solidary Micro-Fee (5¢):',
    receiptTotal: 'Total Balance Out:',
    receiptSecuritySignature: 'SHA256 DIGITAL KEY-SIGNATURE:',
    receiptCloseBtn: 'Dismiss',

    instachatTab: 'InstaChat (WhatsApp)',
    tokstreamTab: 'TokStream (TikTok)',
    tipQuickBtn: 'Tip $1.00',
    writeChatMessage: 'Message contact...',
    copiedStreamLink: 'Secured TrioSphere link copied to clipboard. Android direct fast-share dispatch simulated.',
    commentSentSuccess: 'Secured feedback comment submitted and validated by network hash.',
    streamSponsored: 'Sponsored @{author} with $1.00 USD! Micro-payment trace annotated in your receipt ledger.',
    recaudadoLabel: 'Sponsored',
    patrocinarAction: 'Tip $1.00',
    donarAction: 'Tip $1.00',
    opinarAction: 'Comment',
    writeCommentPlaceholder: 'Add a helpful comment...',

    categoryAll: 'All Delivery',
    categoryRides: 'Rides',
    categoryFood: 'Food',
    categoryGrocery: 'Grocery',
    activeOrderTitle: 'Live Dispatch Tracker',
    orderProgressLabel: 'En Route Dispatch progress:',
    orderCancelledOk: 'Service revoked successfully. Base amount returned. The developer 5¢ gateway fee is non-refundable.',
    closeCatalog: 'Dismiss to Main Index',
    pedirBtn: 'Order',
    includesFee: 'Incl. 5¢ Fee',
    micropayDetailsTitle: 'Transparent Micro-fee',
    micropayDetailsText: 'TrioSphere is a unified 5MB package without premium walls or ads. Solidary support contributes 5 cents plus tax to support the project creator per outgoing transaction (food orders, taxi rides, or fund transfers), keeping your app clean and secure.',

    secCenterTitle: 'Advanced Safety Suite',
    secCenterSub: 'Unified mobile defense protocols. Lightweight asymmetrical cryptographic hashes ensuring premium battery-life on Android hardware.',
    secLevelLabel: 'System Vulnerability Meter:',
    secLevelOptimum: '(Optimum Armor)',
    secLevelModerate: '(Moderate Coverage)',
    secLevelLow: '(Insufficient Shields)',
    secLastScan: 'Last telemetry diagnostic check:',
    secBiometricsTitle: 'Biometrics / FaceID',
    secBiometricsDesc: 'Enable biometric scanning triggers to sign transfers seamlessly.',
    secShieldTitle: 'Active Anti-Snoop Shield',
    secShieldDesc: 'Inhibit active scanner listeners on shared hotspots.',
    secPinTitle: 'Application Locking PIN',
    secPinActive: 'Cryptographic PIN Armor is Active',
    secPinActiveSub: 'Protecing outgoing transfers, withdrawals, and key exports.',
    secPinDeactivate: 'Revoke PIN',
    secWarningNoPin: 'We strongly recommend adding a custom lock PIN. Helps validate your cryptographic signatures on 5¢ developer fee dispatches.',
    secInputPinLabelNew: 'Set New PIN (4 digits)',
    secInputPinLabelConfirm: 'Confirm Password PIN',
    secSavePinBtn: 'Activate Secure Lock',
    secKeysTitle: 'Android Secured Core Specs',
    secKeysParam: 'PARAMETER',
    secKeysValue: 'ACTIVE INSTANCE KEY',
    secKeysChannel: 'Secure Tunnel Protocol',
    secKeysSecurityHash: 'Session Cryptography Signature',
    secKeysDevice: 'Virtual Device ID',
    secKeysMicrofee: 'Fixed Microservice Fee',
    secKeysDesc: 'Asymmetric hashing chains validate each developer solidary micropayment automatically before executing outgoing payloads.',
    secResetBtn: 'Clear Configuration',
    secResetConfirm: 'Are you sure you want to restore security attributes to clean presets? All pin configurations will be wiped.',
    secAlertTitle: 'Hardware Integrity Level',
    secAlertText: 'This application simulates sandboxed isolation storage (Scooped Storage) standard in Android API 34, minimizing disk overhead to under 5MB.'
  }
};
