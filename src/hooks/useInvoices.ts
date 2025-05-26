import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInvoiceList,
  fetchInvoiceDetails,
  createInvoice as createInvoiceThunk,
  deleteInvoice as deleteInvoiceThunk,
  approveInvoice as approveInvoiceThunk,
} from '../redux/slices/invoiceSlice';
import { RootState, AppDispatch } from '../redux/store';

export const useInvoices = (groupId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const invoices = useSelector((state: RootState) => state.invoices.invoiceList.invoices);
  const invoiceDetails = useSelector((state: RootState) => state.invoices.invoiceDetails);
  const loading = useSelector((state: RootState) => state.invoices.isLoading);
  const error = useSelector((state: RootState) => state.invoices.error);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchInvoiceList(groupId));
    }
  }, [dispatch, groupId]);

  // CRUD actions using Redux thunks
  const createInvoice = useCallback(
    async (invoiceData: any, imageFile: File) => {
      if (groupId) {
        return dispatch(createInvoiceThunk({ groupId, invoiceData, imageFile }));
      }
    },
    [dispatch, groupId]
  );


  const deleteInvoice = useCallback(
    async (invoiceId: string) => {
      if (groupId) {
        return dispatch(deleteInvoiceThunk({ groupId, invoiceId }));
      }
    },
    [dispatch, groupId]
  );

  const approveInvoice = useCallback(
    async (invoiceId: string) => {
      if (groupId) {
        return dispatch(approveInvoiceThunk({ groupId, invoiceId }));
      }
    },
    [dispatch, groupId]
  );

  // Fetch invoice detail
  const fetchInvoiceDetail = useCallback(
    async (invoiceId: string) => {
      if (!invoiceId || !groupId) return;
      if (invoiceDetails[invoiceId]) return; // Already fetched
      return dispatch(fetchInvoiceDetails({ groupId, invoiceId }));
    },
    [dispatch, groupId, invoiceDetails]
  );

  return {
    invoices,
    loading,
    error,
    deleteInvoice,
    approveInvoice,
    fetchInvoiceDetail,
    invoiceDetails,
    createInvoice
  };
};
