import { useState, useEffect } from 'react';
import { QRType, QRConfig, URLData, WiFiData, VCardData, BankData, QRState, ExportFormat } from './types';
import { DataForm } from './components/forms/DataForm';
import { QRPreview } from './components/QRPreview';
import { CustomizationPanel } from './components/CustomizationPanel';
import { generateQRData, generateQRCode, getDefaultErrorCorrectionLevel, validateQRConfig } from './utils/qrGenerator';
import { exportQRCode, copyToClipboard } from './utils/exportUtils';
import { saveStateToURL, loadStateFromURL } from './utils/permalinkUtils';
import { QrCode, Wifi, User, CreditCard, AlertTriangle, CheckCircle, Download, Copy, Share2 } from 'lucide-react';

const defaultConfig: QRConfig = {
  type: 'url',
  size: 512,
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'Q',
  quietZone: 4
};

const defaultData = {
  url: { url: 'https://www.aox.cz' } as URLData,
  wifi: { ssid: '', password: '', security: 'WPA' as const, hidden: false } as WiFiData,
  vcard: { firstName: '', lastName: '', organization: '', title: '', phone: '', email: '', website: '', address: '' } as VCardData,
  bank: { accountNumber: '', bankCode: '', amount: '', variableSymbol: '', constantSymbol: '', specificSymbol: '', message: '', currency: 'CZK' } as BankData
};

function App() {
  const [qrType, setQrType] = useState<QRType>('url');
  const [data, setData] = useState<URLData | WiFiData | VCardData | BankData>(defaultData.url);
  const [config, setConfig] = useState<QRConfig>(defaultConfig);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState<string>('');

  // Load state from URL on mount
  useEffect(() => {
    const savedState = loadStateFromURL();
    if (savedState) {
      setQrType(savedState.config.type);
      setData(savedState.data);
      setConfig(savedState.config);
    }
  }, []);

  // Generate QR code when data or config changes
  useEffect(() => {
    const generateQR = async () => {
      if (!data || !qrType) return;

      try {
        const qrData = generateQRData(qrType, data);
        const dataUrl = await generateQRCode(qrData, config);
        setQrDataUrl(dataUrl);

        // Validate configuration
        const validation = validateQRConfig(config);
        setValidationWarnings(validation.warnings);

        // Save state to URL
        const state: QRState = { config, data };
        saveStateToURL(state);
      } catch (error) {
        console.error('Error generating QR code:', error);
        setQrDataUrl('');
      }
    };

    generateQR();
  }, [qrType, data, config]);

  const handleTypeChange = (newType: QRType) => {
    setQrType(newType);
    setData(defaultData[newType]);
    setConfig({
      ...config,
      type: newType,
      errorCorrectionLevel: getDefaultErrorCorrectionLevel(!!config.centerContent)
    });
  };

  const handleDataChange = (newData: URLData | WiFiData | VCardData | BankData) => {
    setData(newData);
  };


  const handleExport = async (format: ExportFormat) => {
    if (!qrDataUrl) return;

    try {
      await exportQRCode(qrDataUrl, format, config);
      setShowSuccess(`QR kód byl úspěšně stažen jako ${format.toUpperCase()}`);
      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Chyba při exportu QR kódu');
    }
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;

    try {
      await copyToClipboard(qrDataUrl);
      setShowSuccess('QR kód byl zkopírován do schránky nebo stažen');
      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      console.error('Copy failed:', error);
      setShowSuccess('Nepodařilo se zkopírovat - zkuste stáhnout jako PNG');
      setTimeout(() => setShowSuccess(''), 3000);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowSuccess('Odkaz byl zkopírován do schránky');
      setTimeout(() => setShowSuccess(''), 3000);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowSuccess('Odkaz byl zkopírován do schránky');
      setTimeout(() => setShowSuccess(''), 3000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QR kód',
        text: 'Podívejte se na tento QR kód',
        url: window.location.href
      });
    } else {
      handleCopyLink();
    }
  };

  const getTypeIcon = (type: QRType) => {
    switch (type) {
      case 'url': return <QrCode className="w-3 h-3" />;
      case 'wifi': return <Wifi className="w-3 h-3" />;
      case 'vcard': return <User className="w-3 h-3" />;
      case 'bank': return <CreditCard className="w-3 h-3" />;
    }
  };

  const getTypeLabel = (type: QRType) => {
    switch (type) {
      case 'url': return 'URL';
      case 'wifi': return 'Wi-Fi';
      case 'vcard': return 'vCard';
      case 'bank': return 'Bank';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Vytvořte QR kód za 1 sekundu</h1>
            <p className="text-slate-600">Stačí vložit data a stáhnout vytvořený QR kód.</p>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            {showSuccess}
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">Upozornění na čitelnost:</p>
                <ul className="mt-2 list-disc list-inside text-yellow-700">
                  {validationWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form and QR Side by Side */}
          <div className="space-y-4">
            {/* Type Selector and Data Form */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {(['url', 'wifi', 'vcard', 'bank'] as QRType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeChange(type)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          qrType === type 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        {getTypeIcon(type)}
                        <span>{getTypeLabel(type)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <DataForm
                  type={qrType}
                  data={data}
                  onChange={handleDataChange}
                />
              </div>
            </div>

            {/* Quick Customization */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-900">Rychlé nastavení</h3>
                
                {/* Colors */}
                <div className="mb-3">
                  <label className="text-xs text-slate-600 mb-2 block">Barvy</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600">Popředí</label>
                      <div className="grid grid-cols-6 gap-1 mt-1">
                        {['#000000', '#1e3a8a', '#dc2626', '#166534', '#7c2d12', '#7c3aed', '#0891b2', '#be123c', '#059669', '#d97706', '#1f2937', '#374151'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setConfig({...config, foregroundColor: color})}
                            className={`w-6 h-6 rounded border-2 ${
                              config.foregroundColor === color ? 'border-blue-500' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600">Pozadí</label>
                      <div className="grid grid-cols-6 gap-1 mt-1">
                        {['#ffffff', '#f8fafc', '#dbeafe', '#fecaca', '#bbf7d0', '#f3e8ff', '#fef3c7', '#d1fae5', '#fce7f3', '#e0e7ff', '#f1f5f9', '#f9fafb'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setConfig({...config, backgroundColor: color})}
                            className={`w-6 h-6 rounded border-2 ${
                              config.backgroundColor === color ? 'border-blue-500' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Content */}
                <div className="mb-3">
                  <label className="text-xs text-slate-600 mb-1 block">Obsah ve středu</label>
                  <textarea
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="AOX.cz"
                    rows={3}
                    value={config.centerContent?.type === 'text' ? config.centerContent.content : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setConfig({...config, centerContent: {
                          type: 'text',
                          content: e.target.value,
                          size: 15
                        }});
                      } else {
                        setConfig({...config, centerContent: undefined});
                      }
                    }}
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">Velikost</label>
                  <select
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={config.size}
                    onChange={(e) => setConfig({...config, size: parseInt(e.target.value)})}
                  >
                    <option value={256}>256px</option>
                    <option value={512}>512px</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Settings - Moved under left form */}
            <CustomizationPanel
              config={config}
              onConfigChange={setConfig}
            />
          </div>

          {/* Right Column - QR Preview and Actions */}
          <div className="space-y-4">
            {/* QR Preview */}
            <QRPreview
              type={qrType}
              data={data as URLData | WiFiData | VCardData}
              config={config}
            />

            {/* Actions */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-900">Stažení a sdílení</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleExport('png')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={!qrDataUrl}
                  >
                    <Download className="w-4 h-4" />
                    PNG
                  </button>
                  <button
                    onClick={() => handleExport('svg')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={!qrDataUrl}
                  >
                    <Download className="w-4 h-4" />
                    SVG
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={!qrDataUrl}
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={handleCopyImage}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={!qrDataUrl}
                  >
                    <Copy className="w-4 h-4" />
                    Kopírovat QR
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-transparent border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={!qrDataUrl}
                  >
                    <Copy className="w-4 h-4" />
                    Kopírovat odkaz
                  </button>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-transparent border border-green-600 rounded-lg hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={!qrDataUrl}
                  >
                    <Share2 className="w-4 h-4" />
                    Sdílet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2024 AOX.cz - Vytvořte QR kód za 10 sekund</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
