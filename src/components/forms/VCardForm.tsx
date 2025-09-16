import React from 'react';
import { VCardData } from '../../types';

interface VCardFormProps {
  data: VCardData;
  onChange: (data: VCardData) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof VCardData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="grid grid-cols-2 gap-1">
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-xs text-slate-600 mb-1">
            Jméno
          </label>
          <input
            id="firstName"
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Jan"
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-xs text-slate-600 mb-1">
            Příjmení
          </label>
          <input
            id="lastName"
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Novák"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <div className="mb-4">
          <label htmlFor="organization" className="block text-xs text-slate-600 mb-1">
            Společnost
          </label>
          <input
            id="organization"
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="AOX s.r.o."
            value={data.organization || ''}
            onChange={(e) => handleChange('organization', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-xs text-slate-600 mb-1">
            Pozice
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Vývojář"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <div className="mb-4">
          <label htmlFor="phone" className="block text-xs text-slate-600 mb-1">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+420 123 456 789"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-xs text-slate-600 mb-1">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="jan.novak@example.com"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <div className="mb-4">
          <label htmlFor="website" className="block text-xs text-slate-600 mb-1">
            Web
          </label>
          <input
            id="website"
            type="url"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-xs text-slate-600 mb-1">
            Adresa
          </label>
          <input
            id="address"
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Václavské náměstí 1"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
