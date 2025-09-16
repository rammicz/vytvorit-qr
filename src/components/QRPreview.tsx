import React, { useEffect, useState } from 'react';
import { QRConfig, URLData, WiFiData, VCardData } from '../types';
import { generateQRData, generateQRCode } from '../utils/qrGenerator';

interface QRPreviewProps {
  type: string;
  data: URLData | WiFiData | VCardData;
  config: QRConfig;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ type, data, config }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generatePreview = async () => {
      if (!data || !type) return;

      setIsLoading(true);
      setError('');

      try {
        const qrData = generateQRData(type, data);
        const dataUrl = await generateQRCode(qrData, config);
        setQrDataUrl(dataUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Chyba při generování QR kódu');
        setQrDataUrl('');
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [type, data, config]);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Generování QR kódu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-red-800">Chyba při generování QR kódu</p>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!qrDataUrl) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center p-8">
            <p className="text-slate-600">Vyplňte formulář pro zobrazení náhledu</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Náhled QR kódu</h3>
      </div>
      <div className="p-6">
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded border">
            <img
              src={qrDataUrl}
              alt="QR kód"
              className="max-w-full h-auto"
              style={{ 
                width: `${config.size}px`,
                height: `${config.size}px`,
                maxWidth: '100%'
              }}
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Velikost: {config.size}px | Korekce chyb: {config.errorCorrectionLevel}
          </p>
        </div>
      </div>
    </div>
  );
};
