import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InvoiceForm from '../components/InvoiceForm';
import { useInvoices } from '../hooks/useInvoices';
import type { InvoiceData } from '../types/invoice';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { saveInvoice } = useInvoices();

  const handleSubmit = (data: Omit<InvoiceData, 'id' | 'createdAt' | 'updatedAt'>) => {
    saveInvoice(data);
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="mt-2 text-gray-600">Fill in the details below to create a new invoice</p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <InvoiceForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </motion.div>
  );
}