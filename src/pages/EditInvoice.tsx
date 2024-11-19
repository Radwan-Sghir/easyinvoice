import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import InvoiceForm from '../components/InvoiceForm';
import { useInvoices } from '../hooks/useInvoices';
import type { InvoiceData } from '../types/invoice';

export default function EditInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, updateInvoice } = useInvoices();
  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Invoice not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleSubmit = (data: Omit<InvoiceData, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateInvoice(invoice.id, data);
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Invoice</h1>
        <p className="mt-2 text-gray-600">Update the invoice details below</p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <InvoiceForm initialData={invoice} onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </motion.div>
  );
}