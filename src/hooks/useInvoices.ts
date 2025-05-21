import { useState, useEffect } from 'react';
import { InvoiceData } from '../types/Invoice';
import { InvoiceListResponse } from '../types/InvoiceListResponse';
import { InvoiceList } from '../types/InvoiceList';
import { invoiceApi } from '../api/invoiceApi';
import { InvoiceDetails } from '../types/InvoiceDetails';

export const useInvoices = (groupId: string) => {
  const [currentGroupId, setcurrentGroupId] = useState<string>("")
  const [invoiceList, setInvoiceList] = useState<InvoiceList[]>([]);
  const [invoices, setInvoices] = useState<InvoiceList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async (groupId: string) => {
    try {
      setLoading(true);
      const response = await invoiceApi.getInvoiceList(groupId);
      if (response.success) {
        setInvoices(response.data.results);
        setError(null);
      } else {
        throw new Error('Failed to fetch invoices');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (groupId: string, invoiceData: InvoiceData, imageFile: File) => {
    try {
      await invoiceApi.createInvoice(groupId, invoiceData, imageFile);
      await fetchInvoices(groupId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add invoice');
      console.error(err);
      throw err;
    }
  };

  const updateInvoice = async (groupId: string, invoiceId: string, invoiceData: InvoiceData) => {
    try {
      await invoiceApi.updateInvoice(groupId, invoiceId, invoiceData);
      await fetchInvoices(groupId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update invoice');
      console.error(err);
      throw err;
    }
  };

  const deleteInvoice = async (groupId: string, invoiceId: string) => {
    try {
      await invoiceApi.deleteInvoice(groupId, invoiceId);
      await fetchInvoices(groupId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice');
      console.error(err);
      throw err;
    }
  };

  const submitInvoice = async (groupId: string, invoiceId: string) => {
    try {
      await invoiceApi.submitInvoice(groupId, invoiceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit invoice');
      console.error(err);
      throw err;
    }
  };

  const approveInvoice = async (groupId: string, invoiceId: string) => {
    try {
      await invoiceApi.approveInvoice(groupId, invoiceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve invoice');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    setcurrentGroupId(groupId);
    fetchInvoices(currentGroupId);
  },[])

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
