import { useState, useEffect } from 'react';
import { InvoiceData } from '../types/Invoice';
import { InvoiceList } from '../types/InvoiceList';
import { invoiceApi } from '../api/invoiceApi';
import { useAppSelector } from '../redux/hooks';


export const useInvoices = () => {
  const [currentGroupId, setcurrentGroupId] = useState<string>("")
  const [invoiceList, setInvoiceList] = useState<InvoiceList[]>([]);
  const [invoices, setInvoices] = useState<InvoiceList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const groupId = useAppSelector((state) => state.groups.selectedGroupId);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      if (groupId){
        const response = await invoiceApi.getInvoiceList(groupId);
        if (response.success) {
          setInvoices(response.data.results);
          setError(null);
        } else {
          throw new Error('Failed to fetch invoices');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: InvoiceData, imageFile: File) => {
    try {
      if (groupId){
        const invoice = await invoiceApi.createInvoice(groupId, invoiceData, imageFile);
        return invoice
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add invoice');
      console.error(err);
      throw err;
    }
  };

  const updateInvoice = async (invoiceId: string, invoiceData: InvoiceData) => {
    try {
      if (groupId){
        await invoiceApi.updateInvoice(groupId, invoiceId, invoiceData);
        await fetchInvoices();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update invoice');
      console.error(err);
      throw err;
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    try {
      if (groupId){
        await invoiceApi.deleteInvoice(groupId, invoiceId);
        await fetchInvoices();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice');
      console.error(err);
      throw err;
    }
  };

  const approveInvoice = async (invoiceId: string) => {
    try {
      if (groupId){
        await invoiceApi.approveInvoice(groupId, invoiceId);
        await fetchInvoices();
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve invoice');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    if (groupId){
      fetchInvoices();
    }
    
  },[])

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    approveInvoice
  };
};
