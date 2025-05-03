import { InvoiceData } from '../types/Invoice';
import { GetInvoiceResponseType } from '../types/GetInvoiceResponseType';
import { formatInvoiceDatesForAPI } from '../utils/dateUtils';

import axios from "axios";


const BACKEND_URL = import.meta.env.VITE_PROXY_ENDPOINT;

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const  invoiceApi = {
  getInvoices: async (params?: { pageNumber?: number, pageSize?: number , id?: string}): Promise<GetInvoiceResponseType> => {
    try {
      const response = await axiosInstance.get('/invoice/', { params });
      return response.data;
    } catch (error) {
      console.error('Error get invoice:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error:', error.response.data);
          throw new Error(error.response.data.message || 'Failed to get invoice');
        } else if (error.request) {
          console.error('Network error:', error.request);
          throw new Error('No response received from server');
        } else {
          console.error('Error setting up request:', error.message);
          throw new Error('Error preparing invoice submission');
        }
      }
      
      throw error;
    }
  },
  
  getInvoiceById: async (id: string): Promise<InvoiceData> => {
    const response = await fetch(`${BACKEND_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch invoice with ID: ${id}`);
    }
    return response.json();
  },
  
  createInvoice: async (invoice: Omit<InvoiceData, 'id'>): Promise<InvoiceData> => {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }
    return response.json();
  },
  
  updateInvoice: async (id: string, invoice: Partial<InvoiceData>): Promise<InvoiceData> => {
    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) {
      throw new Error(`Failed to update invoice with ID: ${id}`);
    }
    return response.json();
  },
  
  deleteInvoice: async (id: string): Promise<void> => {
    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete invoice with ID: ${id}`);
    }
  },

  submitInvoice: async (invoiceData: InvoiceData): Promise<void> => {
    try {
      //const data = formatInvoiceDatesForAPI(invoiceData)
      const response = await axiosInstance.post('/submit/', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error submitting invoice:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error:', error.response.data);
          throw new Error(error.response.data.message || 'Failed to submit invoice');
        } else if (error.request) {
          console.error('Network error:', error.request);
          throw new Error('No response received from server');
        } else {
          console.error('Error setting up request:', error.message);
          throw new Error('Error preparing invoice submission');
        }
      }
      
      throw error;
    }
  },

  approveInvoice: async (invoiceData: InvoiceData): Promise<void> => {
    try {
      const data = formatInvoiceDatesForAPI(invoiceData)
      const response = await axiosInstance.post('/approve/', data);
      return response.data;
    } catch (error) {
      console.error('Error approving invoice:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server error:', error.response.data);
          throw new Error(error.response.data.message || 'Failed to approve invoice');
        } else if (error.request) {
          console.error('Network error:', error.request);
          throw new Error('No response received from server');
        } else {
          console.error('Error setting up request:', error.message);
          throw new Error('Error preparing invoice submission');
        }
      }
      
      throw error;
    }
  }
};
