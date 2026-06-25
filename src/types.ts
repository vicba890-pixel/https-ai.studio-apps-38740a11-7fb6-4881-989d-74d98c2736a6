export type TransactionType = 'transfer' | 'deposit' | 'withdraw' | 'delivery_payment' | 'tip' | 'refund';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  sender: string;
  receiver: string;
  amount: number;
  devFee: number; // 0.05
  finalAmount: number; // total deducted or added
  status: 'completed' | 'pending' | 'failed';
  securityHash: string; // crypto checksum mockup
  taxPaid?: number;
  taxRate?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'contact' | 'system';
  text: string;
  time: string;
  isRead: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  phone: string;
  walletAddress: string;
  messages: ChatMessage[];
}

export interface MediaPost {
  id: string;
  author: string;
  avatar: string;
  description: string;
  mediaUrl: string; // fallback visual representation
  mediaType: 'image' | 'gradient';
  category: string;
  likes: number;
  comments: number;
  shares: number;
  tippedAmount: number;
  hasLiked: boolean;
}

export interface DeliveryService {
  id: string;
  type: 'ride' | 'food' | 'grocery' | 'cafe' | 'gasoline' | 'supermarket' | 'transport' | 'shop' | 'service';
  name: string;
  description: string;
  price: number; // in USD
  timeEstimation: string;
  distance: string;
  iconName: 'car' | 'utensils' | 'shopping-bag' | 'coffee' | 'fuel' | 'store' | 'truck' | 'wrench' | 'plane';
  phone?: string;
  imageUrl?: string;
}

export interface SecurityState {
  biometricEnabled: boolean;
  transactionLimit: number;
  advancedEncryption: boolean;
  shieldActive: boolean;
  securityPin: string; // 4 digits
  pinSetup: boolean;
  lastSecurityCheck: string;
  failedAttempts: number;
  isLocked: boolean;
}
