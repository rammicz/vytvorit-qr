import React from 'react';

export const BankForm: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-1">
      {/* Recommendation message */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-sm text-blue-800">
          <strong>Doporučení:</strong> Pro vytvoření bankovního QR kódu doporučujeme použít aplikaci vaší banky, která zajistí správné formátování a bezpečnost.
        </p>
      </div>
    </div>
  );
};
