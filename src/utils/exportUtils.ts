import jsPDF from 'jspdf';
import { QRConfig, ExportFormat } from '../types';

export async function exportQRCode(
  qrDataUrl: string,
  format: ExportFormat,
  config: QRConfig,
  filename?: string
): Promise<void> {
  const defaultFilename = `qr-code-${Date.now()}`;
  const finalFilename = filename || defaultFilename;

  switch (format) {
    case 'png':
      await exportAsPNG(qrDataUrl, finalFilename);
      break;
    case 'svg':
      await exportAsSVG(qrDataUrl, finalFilename);
      break;
    case 'pdf':
      await exportAsPDF(qrDataUrl, finalFilename, config);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

async function exportAsPNG(dataUrl: string, filename: string): Promise<void> {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function exportAsSVG(dataUrl: string, filename: string): Promise<void> {
  // Convert data URL to SVG
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const svgData = canvasToSVG(canvas);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = `${filename}.svg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      resolve();
    };
    
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function exportAsPDF(dataUrl: string, filename: string, _config: QRConfig): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const img = new Image();
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate size to fit on page with margins
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2);
      
      let imgWidth = img.width;
      let imgHeight = img.height;
      
      // Scale down if too large
      if (imgWidth > maxWidth || imgHeight > maxHeight) {
        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        imgWidth *= scale;
        imgHeight *= scale;
      }
      
      // Center on page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
      resolve();
    };
    
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function canvasToSVG(canvas: HTMLCanvasElement): string {
  const dataURL = canvas.toDataURL('image/png');
  const width = canvas.width;
  const height = canvas.height;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <image href="${dataURL}" width="${width}" height="${height}"/>
</svg>`;
}

export async function copyToClipboard(dataUrl: string): Promise<void> {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.ClipboardItem) {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      return;
    }
    
    // Fallback: create temporary link and copy to clipboard
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Convert to blob and create download link
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${Date.now()}.png`;
            
            // Try to copy the data URL to clipboard as text
            if (navigator.clipboard) {
              navigator.clipboard.writeText(dataUrl).then(() => {
                URL.revokeObjectURL(url);
                resolve();
              }).catch(() => {
                // If clipboard fails, trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                resolve();
              });
            } else {
              // No clipboard support, trigger download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              resolve();
            }
          } else {
            reject(new Error('Nepodařilo se vytvořit obrázek'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Nepodařilo se načíst obrázek'));
      img.src = dataUrl;
    });
    
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw new Error('Nepodařilo se zkopírovat do schránky');
  }
}
