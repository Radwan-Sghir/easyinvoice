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

export default function MinimalTemplate({ data }: Props) {
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
      <div className="text-sm text-gray-500 mt-2">
        {filledFields.map(({ key, label }) => (
          <p key={key}>
            <span className="font-medium">{label}:</span> {fields[key as keyof OptionalFields]}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      <div className="border-b pb-8 mb-8">
        <div className="flex justify-between items-baseline">
          <h1 className="text-3xl font-light tracking-tight">INVOICE</h1>
          <p className="text-xl text-gray-600">#{data.invoiceNumber}</p>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Date: {new Date(data.date).toLocaleDateString()}</p>
          <p>Due Date: {new Date(data.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xl mb-2">{data.subject}</p>
      </div>

      <div className="grid grid-cols-2 gap-16 mb-12">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">From</p>
          <div className="text-gray-800">
            <p className="font-medium">{data.companyName}</p>
            <p className="mt-1 whitespace-pre-line">{data.companyAddress}</p>
            {renderOptionalFields(data.companyFields)}
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-3">To</p>
          <div className="text-gray-800">
            <p className="font-medium">{data.clientName}</p>
            <p className="mt-1 whitespace-pre-line">{data.clientAddress}</p>
            {renderOptionalFields(data.clientFields)}
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b text-sm uppercase tracking-wide text-gray-500">
            <th className="text-left py-3">Description</th>
            <th className="text-right py-3">Quantity</th>
            <th className="text-right py-3">Unit</th>
            <th className="text-right py-3">Price</th>
            <th className="text-right py-3">Amount</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {data.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-4">{item.description}</td>
              <td className="text-right py-4">{item.quantity}</td>
              <td className="text-right py-4">{item.unit}</td>
              <td className="text-right py-4">{formatCurrency(item.price)}</td>
              <td className="text-right py-4">{formatCurrency(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-72">
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-gray-600">Tax ({data.taxRate}%)</span>
            <span>{formatCurrency(calculateTax())}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="font-medium">Total</span>
            <span className="font-medium">{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="text-gray-600 text-sm">
          <p className="text-gray-500 uppercase tracking-wide mb-2">Notes</p>
          <p className="whitespace-pre-line">{data.notes}</p>
        </div>
      )}
    </div>
  );
}