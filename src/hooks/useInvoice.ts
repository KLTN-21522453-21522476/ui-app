import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchInvoiceList } from '../redux/slices/invoiceSlice';

export const useInvoice = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoiceList, isLoading, error, lastFetched } = useSelector((state: RootState) => state.invoices);

  const getInvoices = useCallback((groupId: string) => {
    dispatch(fetchInvoiceList(groupId) as any);
  }, [dispatch]);

  return {
    invoices: invoiceList.items,
    isLoading,
    error,
    lastFetched,
    getInvoices,
  };
};
