import QRCode from 'qrcode';
import { QRConfig, URLData, WiFiData, VCardData, BankData, ErrorCorrectionLevel } from '../types';

export function generateQRData(type: string, data: URLData | WiFiData | VCardData | BankData): string {
  switch (type) {
    case 'url':
      return (data as URLData).url;
    
    case 'wifi':
      const wifi = data as WiFiData;
      const security = wifi.security === 'nopass' ? 'nopass' : wifi.security;
      const hidden = wifi.hidden ? 'true' : 'false';
      return `WIFI:T:${security};S:${escapeWiFiString(wifi.ssid)};P:${escapeWiFiString(wifi.password)};H:${hidden};;`;
    
    case 'vcard':
      const vcard = data as VCardData;
      return generateVCard(vcard);
    
    case 'bank':
      const bank = data as BankData;
      return generateBankPayment(bank);
    
    default:
      throw new Error(`Unsupported QR type: ${type}`);
  }
}

function escapeWiFiString(str: string): string {
  // Escape special characters in WiFi SSID and password
  return str.replace(/[\\;,"]/g, '\\$&');
}

function generateVCard(data: VCardData): string {
  const lines: string[] = [];
  
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  
  // Name
  if (data.lastName || data.firstName) {
    lines.push(`N:${data.lastName || ''};${data.firstName || ''};;;`);
  }
  
  // Full name
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
  if (fullName) {
    lines.push(`FN:${fullName}`);
  }
  
  // Organization
  if (data.organization) {
    lines.push(`ORG:${data.organization}`);
  }
  
  // Title
  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }
  
  // Phone
  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`);
  }
  
  // Email
  if (data.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  }
  
  // Website
  if (data.website) {
    lines.push(`URL:${data.website}`);
  }
  
  // Address
  if (data.address) {
    lines.push(`ADR:;;${data.address};;;;`);
  }
  
  lines.push('END:VCARD');
  
  return lines.join('\r\n');
}

function generateBankPayment(data: BankData): string {
  // Český bankovní QR kód podle standardu SPAYD
  const parts: string[] = [];
  
  // Základní informace
  parts.push(`SPD*1.0*ACC:${data.bankCode}-${data.accountNumber}`);
  
  // Měna
  parts.push(`AM:${data.amount || ''}`);
  parts.push(`CC:${data.currency}`);
  
  // Symboly
  if (data.variableSymbol) {
    parts.push(`VS:${data.variableSymbol}`);
  }
  if (data.constantSymbol) {
    parts.push(`KS:${data.constantSymbol}`);
  }
  if (data.specificSymbol) {
    parts.push(`SS:${data.specificSymbol}`);
  }
  
  // Zpráva
  if (data.message) {
    parts.push(`MSG:${data.message}`);
  }
  
  return parts.join('*');
}

export async function generateQRCode(
  data: string,
  config: QRConfig
): Promise<string> {
  // Generate QR code with a base size first
  const baseSize = 256;
  const options = {
    width: baseSize,
    margin: config.quietZone,
    color: {
      dark: config.foregroundColor,
      light: config.backgroundColor,
    },
    errorCorrectionLevel: config.errorCorrectionLevel,
  };

  try {
    const qrDataUrl = await QRCode.toDataURL(data, options);
    
    // If there's center content, overlay it on the QR code
    if (config.centerContent) {
      return await addCenterContent(qrDataUrl, config, baseSize);
    }
    
    // Scale to desired size if different from base size
    if (config.size !== baseSize) {
      return await scaleQRCode(qrDataUrl, config.size, baseSize);
    }
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Nepodařilo se vygenerovat QR kód. Zkontrolujte prosím vstupní data.');
  }
}

async function scaleQRCode(qrDataUrl: string, targetSize: number, baseSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = targetSize;
      canvas.height = targetSize;
      
      // Use smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw QR code scaled to target size
      ctx.drawImage(img, 0, 0, baseSize, baseSize, 0, 0, targetSize, targetSize);
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => reject(new Error('Failed to load QR code image'));
    img.src = qrDataUrl;
  });
}

async function addCenterContent(qrDataUrl: string, config: QRConfig, baseSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = config.size;
      canvas.height = config.size;
      
      // Use smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw QR code scaled to target size
      ctx.drawImage(img, 0, 0, baseSize, baseSize, 0, 0, config.size, config.size);
      
      // Calculate center area
      const centerSize = (config.size * config.centerContent!.size) / 100;
      const centerX = (config.size - centerSize) / 2;
      const centerY = (config.size - centerSize) / 2;
      
      // Draw white background for center content
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(centerX, centerY, centerSize, centerSize);
      
      // Draw border around center
      ctx.strokeStyle = config.foregroundColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX, centerY, centerSize, centerSize);
      
      if (config.centerContent!.type === 'text') {
        // Draw text
        ctx.fillStyle = config.foregroundColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Calculate font size based on center size
        const fontSize = Math.max(12, centerSize / 8);
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        
        // Split text into lines and draw each line
        const lines = config.centerContent!.content.split('\n');
        const lineHeight = fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = (config.size - totalHeight) / 2 + lineHeight / 2;
        
        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.fillText(line, config.size / 2, y);
        });
      } else if (config.centerContent!.type === 'image') {
        // Draw image
        const centerImg = new Image();
        centerImg.onload = () => {
          const padding = centerSize * 0.1; // 10% padding
          ctx.drawImage(
            centerImg,
            centerX + padding,
            centerY + padding,
            centerSize - (padding * 2),
            centerSize - (padding * 2)
          );
          resolve(canvas.toDataURL('image/png'));
        };
        centerImg.onerror = () => reject(new Error('Failed to load center image'));
        centerImg.src = config.centerContent!.content;
        return;
      }
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => reject(new Error('Failed to load QR code image'));
    img.src = qrDataUrl;
  });
}

export function getDefaultErrorCorrectionLevel(hasCenterContent: boolean): ErrorCorrectionLevel {
  return hasCenterContent ? 'H' : 'Q';
}

export function validateQRConfig(config: QRConfig): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check contrast
  const contrast = getContrast(config.foregroundColor, config.backgroundColor);
  if (contrast < 3) {
    warnings.push('Nízký kontrast mezi barvami může snížit čitelnost QR kódu');
  }
  
  // Check center content size
  if (config.centerContent && config.centerContent.size > 25) {
    warnings.push('Velikost obsahu ve středu je příliš velká a může snížit čitelnost');
  }
  
  // Check quiet zone
  if (config.quietZone < 4) {
    warnings.push('Malá quiet zone může snížit čitelnost QR kódu');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

function getContrast(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
