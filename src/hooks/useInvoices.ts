import { useState, useEffect } from 'react';
import { invoiceApi } from '../api/invoiceApi';
import { InvoiceData } from '../types/Invoice';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceApi.getInvoices();
      setInvoices(data.results);
      setError(null);
    } catch (err) {
      setError('Failed to fetch invoices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const addInvoice = async (invoice: Omit<InvoiceData, 'id'>) => {
    try {
      const newInvoice = await invoiceApi.createInvoice(invoice);
      setInvoices([...invoices, newInvoice]);
      return newInvoice;
    } catch (err) {
      setError('Failed to add invoice');
      console.error(err);
      throw err;
    }
  };

  const updateInvoice = async (id: string, invoice: Partial<InvoiceData>) => {
    try {
      const updatedInvoice = await invoiceApi.updateInvoice(id, invoice);
      setInvoices(invoices.map(inv => inv.id === id ? updatedInvoice : inv));
      return updatedInvoice;
    } catch (err) {
      setError('Failed to update invoice');
      console.error(err);
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await invoiceApi.deleteInvoice(id);
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    } catch (err) {
      setError('Failed to delete invoice');
      console.error(err);
      throw err;
    }
  };

  const submitInvoice = async (invoice: InvoiceData) => {
    try {
      await invoiceApi.submitInvoice(invoice);
    } catch (err) {
      setError('Failed to submit invoice');
      console.error(err);
      throw err;
    }
  };

  const approveInvoice = async (invoice: InvoiceData) => {
    try {
      await invoiceApi.approveInvoice(invoice);
    } catch (err) {
      setError('Failed to approve invoice');
      console.error(err);
      throw err;
    }
  };

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    submitInvoice,
    approveInvoice
  };
};
