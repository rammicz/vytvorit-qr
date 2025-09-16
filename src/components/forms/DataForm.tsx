import React from 'react';
import { QRType, URLData, WiFiData, VCardData, BankData } from '../../types';
import { URLForm } from './URLForm';
import { WiFiForm } from './WiFiForm';
import { VCardForm } from './VCardForm';
import { BankForm } from './BankForm';

interface DataFormProps {
  type: QRType;
  data: URLData | WiFiData | VCardData | BankData;
  onChange: (data: URLData | WiFiData | VCardData | BankData) => void;
}

export const DataForm: React.FC<DataFormProps> = ({ type, data, onChange }) => {
  const renderForm = () => {
    switch (type) {
      case 'url':
        return (
          <URLForm
            data={data as URLData}
            onChange={(newData) => onChange(newData)}
          />
        );
      case 'wifi':
        return (
          <WiFiForm
            data={data as WiFiData}
            onChange={(newData) => onChange(newData)}
          />
        );
      case 'vcard':
        return (
          <VCardForm
            data={data as VCardData}
            onChange={(newData) => onChange(newData)}
          />
        );
      case 'bank':
        return (
          <BankForm
            data={data as BankData}
            onChange={(newData) => onChange(newData)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6">
        {renderForm()}
      </div>
    </div>
  );
};
