import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { InvoiceData, InvoiceItem, OptionalFields } from '../types/invoice';

interface Props {
  initialData?: InvoiceData;
  onSubmit: (data: Omit<InvoiceData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const OPTIONAL_FIELDS = [
  { key: 'fiscalId', label: 'Fiscal Identification Number', exclusive: false },
  { key: 'staticId', label: 'Static Identification Number', exclusive: false },
  { key: 'artistCardNumber', label: 'Artist Card Number', exclusive: true },
  { key: 'bankAccount', label: 'Bank Account', exclusive: false },
  { key: 'phoneNumber', label: 'Phone Number', exclusive: false },
  { key: 'businessRegNumber', label: 'Business Register Number', exclusive: true },
] as const;

export default function InvoiceForm({ initialData, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<Omit<InvoiceData, 'id' | 'createdAt' | 'updatedAt'>>({
    invoiceNumber: initialData?.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    subject: initialData?.subject || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: initialData?.companyName || '',
    companyAddress: initialData?.companyAddress || '',
    companyFields: initialData?.companyFields || {},
    clientName: initialData?.clientName || '',
    clientAddress: initialData?.clientAddress || '',
    clientFields: initialData?.clientFields || {},
    items: initialData?.items || [{ id: uuidv4(), description: '', quantity: 1, unit: 'pcs', price: 0 }],
    taxRate: initialData?.taxRate ?? 19,
    notes: initialData?.notes || '',
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: uuidv4(), description: '', quantity: 1, unit: 'pcs', price: 0 }],
    });
  };

  const removeItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id),
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map(item => {
        if (item.id !== id) return item;
        
        if (field === 'quantity') {
          const quantity = parseInt(value.toString()) || 1;
          return { ...item, quantity: Math.max(1, quantity) };
        }
        if (field === 'price') {
          const price = parseFloat(value.toString()) || 0;
          return { ...item, price: Math.max(0, price) };
        }
        
        return { ...item, [field]: value };
      }),
    });
  };

  const addOptionalField = (entity: 'company' | 'client', fieldKey: keyof OptionalFields) => {
    const fieldName = entity === 'company' ? 'companyFields' : 'clientFields';
    const selectedField = OPTIONAL_FIELDS.find(f => f.key === fieldKey);
    
    if (selectedField?.exclusive) {
      // Remove other exclusive fields first
      const newFields = { ...formData[fieldName] };
      OPTIONAL_FIELDS.forEach(f => {
        if (f.exclusive && f.key !== fieldKey) {
          delete newFields[f.key as keyof OptionalFields];
        }
      });
      
      setFormData({
        ...formData,
        [fieldName]: {
          ...newFields,
          [fieldKey]: '',
        },
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: {
          ...formData[fieldName],
          [fieldKey]: '',
        },
      });
    }
  };

  const removeOptionalField = (entity: 'company' | 'client', fieldKey: keyof OptionalFields) => {
    const fieldName = entity === 'company' ? 'companyFields' : 'clientFields';
    const newFields = { ...formData[fieldName] };
    delete newFields[fieldKey];
    setFormData({
      ...formData,
      [fieldName]: newFields,
    });
  };

  const updateOptionalField = (entity: 'company' | 'client', field: keyof OptionalFields, value: string) => {
    const fieldName = entity === 'company' ? 'companyFields' : 'clientFields';
    setFormData({
      ...formData,
      [fieldName]: {
        ...formData[fieldName],
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({ ...formData, taxRate: Math.min(100, Math.max(0, value)) });
  };

  const renderOptionalFieldsSection = (entity: 'company' | 'client') => {
    const fields = entity === 'company' ? formData.companyFields : formData.clientFields;
    const availableFields = OPTIONAL_FIELDS.filter(({ key, exclusive }) => {
      if (!fields[key as keyof OptionalFields]) {
        // If the field is exclusive, check if any other exclusive field is already selected
        if (exclusive) {
          return !Object.keys(fields).some(
            k => OPTIONAL_FIELDS.find(f => f.key === k)?.exclusive
          );
        }
        return true;
      }
      return false;
    });

    return (
      <div className="space-y-4 mt-4">
        {Object.entries(fields).map(([key, value]) => {
          const field = OPTIONAL_FIELDS.find(f => f.key === key);
          return (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700">
                  {field?.label}
                  {field?.exclusive && (
                    <span className="ml-2 text-amber-600 text-xs">
                      (Exclusive)
                    </span>
                  )}
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateOptionalField(entity, key as keyof OptionalFields, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeOptionalField(entity, key as keyof OptionalFields)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {availableFields.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <select
              className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              onChange={(e) => addOptionalField(entity, e.target.value as keyof OptionalFields)}
              value=""
            >
              <option value="" disabled>Add optional field...</option>
              {availableFields.map(({ key, label, exclusive }) => (
                <option key={key} value={key}>
                  {label} {exclusive ? '(Exclusive)' : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const select = document.querySelector(`select`) as HTMLSelectElement;
                if (select.value) {
                  addOptionalField(entity, select.value as keyof OptionalFields);
                  select.value = '';
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Field
            </button>
          </div>
        )}

        {entity === 'company' && (
          <div className="flex items-start gap-2 text-sm text-amber-600 mt-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>Note: Business Register Number and Artist Card Number are mutually exclusive. You can only add one of them.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Address</label>
            <textarea
              value={formData.companyAddress}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              required
              rows={3}
            />
          </div>
          {renderOptionalFieldsSection('company')}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Address</label>
            <textarea
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              required
              rows={3}
            />
          </div>
          {renderOptionalFieldsSection('client')}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
        <input
          type="number"
          value={formData.taxRate.toString()}
          onChange={handleTaxRateChange}
          min="0"
          max="100"
          step="0.1"
          className="mt-1 block w-full sm:w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-medium">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Description</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Quantity</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Unit</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Price</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {formData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pl-4 pr-3 sm:pl-6">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Description"
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          required
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          placeholder="Qty"
                          min="1"
                          className="block w-full border-0 p-0 text-right text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          required
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          placeholder="Unit"
                          className="block w-full border-0 p-0 text-right text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          required
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          placeholder="Price"
                          min="0"
                          step="0.01"
                          className="block w-full border-0 p-0 text-right text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          required
                        />
                      </td>
                      <td className="py-3 pl-3 pr-4 text-right sm:pr-6">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={formData.items.length === 1}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          rows={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update Invoice' : 'Generate Invoice'}
        </button>
      </div>
    </form>
  );
}