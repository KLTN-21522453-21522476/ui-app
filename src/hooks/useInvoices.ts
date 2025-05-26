import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInvoiceList,
  fetchInvoiceDetails,
  createInvoice as createInvoiceThunk,
  deleteInvoice as deleteInvoiceThunk,
  approveInvoice as approveInvoiceThunk,
  rejectInvoice as rejectInvoiceThunk,
} from '../redux/slices/invoiceSlice';
import { RootState, AppDispatch } from '../redux/store';

export const useInvoices = (groupId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const invoices = useSelector((state: RootState) => state.invoices.invoiceList.invoices);
  const invoiceDetails = useSelector((state: RootState) => state.invoices.invoiceDetails);
  const isLoadingList = useSelector((state: RootState) => state.invoices.isLoadingList);
  const isLoadingDetail = useSelector((state: RootState) => state.invoices.isLoadingDetail);
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

  const rejectInvoice = useCallback(
    async (invoiceId: string) => {
      if (groupId) {
        return dispatch(rejectInvoiceThunk({ groupId, invoiceId }));
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

  /**
   * @returns {
   *   invoices: InvoiceList[],
   *   isLoadingList: boolean, // loading state for invoice list
   *   isLoadingDetail: { [invoiceId: string]: boolean }, // loading state for each invoice detail
   *   error: string | null,
   *   deleteInvoice: (invoiceId: string) => Promise<any>,
   *   approveInvoice: (invoiceId: string) => Promise<any>,
   *   fetchInvoiceDetail: (invoiceId: string) => Promise<any>,
   *   invoiceDetails: { [invoiceId: string]: InvoiceDetails },
   *   createInvoice: (invoiceData: any, imageFile: File) => Promise<any>,
   *   rejectInvoice: (invoiceId: string) => Promise<any>
   * }
   */
  return {
    invoices,
    isLoadingList, // loading state for invoice list
    isLoadingDetail, // loading state for each invoice detail
    error,
    deleteInvoice,
    approveInvoice,
    rejectInvoice,
    fetchInvoiceDetail,
    invoiceDetails,
    createInvoice
  };

};
