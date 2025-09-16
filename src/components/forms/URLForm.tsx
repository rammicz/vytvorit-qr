import React from 'react';
import { URLData } from '../../types';

interface URLFormProps {
  data: URLData;
  onChange: (data: URLData) => void;
}

export const URLForm: React.FC<URLFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof URLData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="mb-6">
      <label htmlFor="url" className="block text-xs text-slate-600 mb-1">
        URL adresa
      </label>
      <input
        id="url"
        type="url"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="https://example.com"
        value={data.url}
        onChange={(e) => handleChange('url', e.target.value)}
        required
      />
    </div>
  );
};
