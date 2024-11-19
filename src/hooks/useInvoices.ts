import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceData } from '../types/invoice';

const STORAGE_KEY = 'invoices';

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
  }, []);

  const saveInvoice = (invoice: Omit<InvoiceData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newInvoice: InvoiceData = {
      ...invoice,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
    return newInvoice;
  };

  const updateInvoice = (id: string, invoice: Omit<InvoiceData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedInvoices = invoices.map((inv) =>
      inv.id === id
        ? {
            ...invoice,
            id,
            createdAt: inv.createdAt,
            updatedAt: new Date().toISOString(),
          }
        : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter((inv) => inv.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
  };

  return {
    invoices,
    saveInvoice,
    updateInvoice,
    deleteInvoice,
  };
}