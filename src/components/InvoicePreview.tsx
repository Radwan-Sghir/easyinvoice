import React from 'react';
import { motion } from 'framer-motion';
import type { InvoiceData, OptionalFields } from '../types/invoice';

interface Props {
  data: InvoiceData;
}

const OPTIONAL_FIELDS = [
  { key: 'fiscalId', label: 'Fiscal ID' },
  { key: 'staticId', label: 'Static ID' },
  { key: 'artistCardNumber', label: 'Artist Card' },
  { key: 'bankAccount', label: 'Bank Account' },
  { key: 'phoneNumber', label: 'Phone' },
  { key: 'businessRegNumber', label: 'Business Reg.' },
] as const;

export default function InvoicePreview({ data }: Props) {
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto text-sm sm:text-base"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">INVOICE</h1>
          <p className="text-gray-600 mt-1">#{data.invoiceNumber}</p>
        </div>
        <div className="text-gray-600">
          <p className="font-medium">Date: {new Date(data.date).toLocaleDateString()}</p>
          <p className="font-medium">Due Date: {new Date(data.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Subject</h2>
        <p className="text-gray-700">{data.subject}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">From:</h2>
          <div className="text-gray-600">
            <p className="font-medium">{data.companyName}</p>
            <p className="whitespace-pre-line">{data.companyAddress}</p>
            {renderOptionalFields(data.companyFields)}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">To:</h2>
          <div className="text-gray-600">
            <p className="font-medium">{data.clientName}</p>
            <p className="whitespace-pre-line">{data.clientAddress}</p>
            {renderOptionalFields(data.clientFields)}
          </div>
        </div>
      </div>

      {/* Desktop view for items */}
      <div className="hidden sm:block overflow-x-auto mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-2">Description</th>
              <th className="text-right py-3 px-2">Quantity</th>
              <th className="text-right py-3 px-2">Unit</th>
              <th className="text-right py-3 px-2">Price</th>
              <th className="text-right py-3 px-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-2">{item.description}</td>
                <td className="text-right py-3 px-2">{item.quantity}</td>
                <td className="text-right py-3 px-2">{item.unit}</td>
                <td className="text-right py-3 px-2">{formatCurrency(item.price)}</td>
                <td className="text-right py-3 px-2">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view for items */}
      <div className="sm:hidden mb-8">
        <div className="space-y-4">
          {data.items.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-4">
              <p className="font-medium mb-2">{item.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-600">Quantity:</p>
                <p className="text-right">{item.quantity} {item.unit}</p>
                <p className="text-gray-600">Price:</p>
                <p className="text-right">{formatCurrency(item.price)}</p>
                <p className="text-gray-600">Amount:</p>
                <p className="text-right font-medium">{formatCurrency(item.quantity * item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrency(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax ({data.taxRate}%):</span>
            <span>{formatCurrency(calculateTax())}</span>
          </div>
          <div className="flex justify-between border-t-2 border-gray-300 pt-2 text-lg font-bold">
            <span>Total:</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Notes:</h3>
          <p className="text-gray-600 whitespace-pre-line">{data.notes}</p>
        </div>
      )}
    </motion.div>
  );
}