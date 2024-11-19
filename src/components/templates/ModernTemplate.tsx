import React from 'react';
import type { InvoiceData, OptionalFields } from '../../types/invoice';

const OPTIONAL_FIELDS = [
  { key: 'fiscalId', label: 'Fiscal ID' },
  { key: 'staticId', label: 'Static ID' },
  { key: 'artistCardNumber', label: 'Artist Card' },
  { key: 'bankAccount', label: 'Bank Account' },
  { key: 'phoneNumber', label: 'Phone' },
  { key: 'businessRegNumber', label: 'Business Reg.' },
] as const;

interface Props {
  data: InvoiceData;
}

export default function ModernTemplate({ data }: Props) {
  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (data.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(amount);
  };

  const renderOptionalFields = (fields: OptionalFields | undefined) => {
    if (!fields) return null;
    
    const filledFields = OPTIONAL_FIELDS.filter(({ key }) => fields[key as keyof OptionalFields]);
    
    if (filledFields.length === 0) return null;

    return (
      <div className="text-sm text-gray-600 mt-2">
        {filledFields.map(({ key, label }) => (
          <p key={key}>
            <span className="font-medium">{label}:</span> {fields[key as keyof OptionalFields]}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              INVOICE
            </h1>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">#{data.invoiceNumber}</p>
              <div className="mt-2 text-gray-600">
                <p>Date: {new Date(data.date).toLocaleDateString()}</p>
                <p>Due: {new Date(data.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Subject</h2>
          <p className="text-gray-700 text-lg">{data.subject}</p>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">From</h2>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">{data.companyName}</p>
              <p className="text-gray-600 whitespace-pre-line">{data.companyAddress}</p>
              {renderOptionalFields(data.companyFields)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">To</h2>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">{data.clientName}</p>
              <p className="text-gray-600 whitespace-pre-line">{data.clientAddress}</p>
              {renderOptionalFields(data.clientFields)}
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-500 font-medium">Description</th>
                <th className="text-right py-4 px-6 text-gray-500 font-medium">Quantity</th>
                <th className="text-right py-4 px-6 text-gray-500 font-medium">Unit</th>
                <th className="text-right py-4 px-6 text-gray-500 font-medium">Price</th>
                <th className="text-right py-4 px-6 text-gray-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 px-6">{item.description}</td>
                  <td className="text-right py-4 px-6">{item.quantity}</td>
                  <td className="text-right py-4 px-6">{item.unit}</td>
                  <td className="text-right py-4 px-6">{formatCurrency(item.price)}</td>
                  <td className="text-right py-4 px-6 font-medium">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-80 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax ({data.taxRate}%)</span>
              <span>{formatCurrency(calculateTax())}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>

        {data.notes && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Notes</h3>
            <p className="text-gray-600 whitespace-pre-line">{data.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}