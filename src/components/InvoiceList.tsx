import React from 'react';
import { FileEdit, Trash2, Plus, Eye } from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { useNavigate } from 'react-router-dom';

interface Props {
  invoices: InvoiceData[];
  onDelete: (id: string) => void;
}

export default function InvoiceList({ invoices, onDelete }: Props) {
  const navigate = useNavigate();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Invoices</h2>
        <button
          onClick={() => navigate('/create')}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No invoices yet. Create your first one!</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg">
          {/* Desktop view */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => navigate(`/invoice/${invoice.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/edit/${invoice.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FileEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">{invoice.clientName}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0))}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString()}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/invoice/${invoice.id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/edit/${invoice.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FileEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(invoice.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}