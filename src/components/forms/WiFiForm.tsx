import React from 'react';
import { WiFiData } from '../../types';

interface WiFiFormProps {
  data: WiFiData;
  onChange: (data: WiFiData) => void;
}

export const WiFiForm: React.FC<WiFiFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof WiFiData, value: string | boolean) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="grid grid-cols-2 gap-1">
        <div className="mb-4">
          <label htmlFor="ssid" className="block text-xs text-slate-600 mb-1">
            SSID
          </label>
          <input
            id="ssid"
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Název sítě"
            value={data.ssid}
            onChange={(e) => handleChange('ssid', e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-xs text-slate-600 mb-1">
            Heslo
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Heslo"
            value={data.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <div className="mb-4">
          <label htmlFor="security" className="block text-xs text-slate-600 mb-1">
            Zabezpečení
          </label>
          <select
            id="security"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={data.security}
            onChange={(e) => handleChange('security', e.target.value as 'WPA' | 'WEP' | 'nopass')}
          >
            <option value="WPA">WPA/WPA2/WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Bez hesla</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-slate-600 mb-1">
            Skrytá síť
          </label>
          <label className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={data.hidden}
              onChange={(e) => handleChange('hidden', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-xs text-slate-600">Skrytá</span>
          </label>
        </div>
      </div>
    </div>
  );
};
