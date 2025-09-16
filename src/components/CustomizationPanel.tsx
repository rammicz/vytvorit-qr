import React from 'react';
import { QRConfig } from '../types';

interface CustomizationPanelProps {
  config: QRConfig;
  onConfigChange: (config: QRConfig) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  config,
  onConfigChange
}) => {
  const handleConfigChange = (field: keyof QRConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };


  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Pokročilé nastavení</h3>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Korekce chyb</label>
          <select
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={config.errorCorrectionLevel}
            onChange={(e) => handleConfigChange('errorCorrectionLevel', e.target.value)}
          >
            <option value="L">L (7%)</option>
            <option value="M">M (15%)</option>
            <option value="Q">Q (25%)</option>
            <option value="H">H (30%)</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiet zone: {config.quietZone} modulů
          </label>
          <input
            type="range"
            min="4"
            max="8"
            value={config.quietZone}
            onChange={(e) => handleConfigChange('quietZone', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-slate-600">
            <span>4</span>
            <span>8</span>
          </div>
        </div>
      </div>
    </div>
  );
};
