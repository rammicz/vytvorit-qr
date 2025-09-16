export type QRType = 'url' | 'wifi' | 'vcard' | 'bank';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ExportFormat = 'png' | 'svg' | 'pdf';

export interface QRConfig {
  type: QRType;
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  quietZone: number;
  centerContent?: CenterContent;
}

export interface CenterContent {
  type: 'text' | 'image';
  content: string;
  size: number; // percentage of QR size (12-25%)
}

export interface URLData {
  url: string;
}

export interface WiFiData {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface BankData {
  accountNumber: string;
  bankCode: string;
  amount?: string;
  variableSymbol?: string;
  constantSymbol?: string;
  specificSymbol?: string;
  message?: string;
  currency: string;
}

export interface QRState {
  config: QRConfig;
  data: URLData | WiFiData | VCardData | BankData;
}

export interface ValidationWarning {
  type: 'contrast' | 'center-size' | 'quiet-zone' | 'error-correction';
  message: string;
  severity: 'warning' | 'error';
}
