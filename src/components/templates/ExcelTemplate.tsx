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

export default function ExcelTemplate({ data }: Props) {
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
      <div className="text-sm mt-2">
        {filledFields.map(({ key, label }) => (
          <p key={key}>
            <span className="font-bold">{label}:</span> {fields[key as keyof OptionalFields]}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-8 max-w-4xl mx-auto shadow-xl" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">INVOICE</h1>
        <p className="text-xl">#{data.invoiceNumber}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-bold border-b-2 border-gray-400 mb-2">From:</h2>
          <div>
            <p className="font-bold">{data.companyName}</p>
            <p className="whitespace-pre-line">{data.companyAddress}</p>
            {renderOptionalFields(data.companyFields)}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold border-b-2 border-gray-400 mb-2">To:</h2>
          <div>
            <p className="font-bold">{data.clientName}</p>
            <p className="whitespace-pre-line">{data.clientAddress}</p>
            {renderOptionalFields(data.clientFields)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p><span className="font-bold">Date:</span> {new Date(data.date).toLocaleDateString()}</p>
          <p><span className="font-bold">Due Date:</span> {new Date(data.dueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p><span className="font-bold">Subject:</span> {data.subject}</p>
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">Description</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-right">Quantity</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-right">Unit</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-right">Price</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-400 p-2">{item.description}</td>
                <td className="border border-gray-400 p-2 text-right">{item.quantity}</td>
                <td className="border border-gray-400 p-2 text-right">{item.unit}</td>
                <td className="border border-gray-400 p-2 text-right">{formatCurrency(item.price)}</td>
                <td className="border border-gray-400 p-2 text-right">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="border border-gray-400 p-2 text-right font-bold">Subtotal:</td>
              <td className="border border-gray-400 p-2 text-right">{formatCurrency(calculateSubtotal())}</td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-gray-400 p-2 text-right font-bold">
                Tax ({data.taxRate}%):
              </td>
              <td className="border border-gray-400 p-2 text-right">{formatCurrency(calculateTax())}</td>
            </tr>
            <tr className="bg-gray-100">
              <td colSpan={4} className="border border-gray-400 p-2 text-right font-bold">Total:</td>
              <td className="border border-gray-400 p-2 text-right font-bold">{formatCurrency(calculateTotal())}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {data.notes && (
        <div className="border-t-2 border-gray-400 pt-4">
          <h3 className="text-lg font-bold mb-2">Notes:</h3>
          <p className="whitespace-pre-line">{data.notes}</p>
        </div>
      )}
    </div>
  );
}