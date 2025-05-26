import axios from 'axios';
import { InvoiceData } from '../types/Invoice';
import { InvoiceList } from '../types/InvoiceList';
import { InvoiceDetails } from '../types/InvoiceDetails';
import { jwtUtils } from "../utils/jwtUtils";

export interface InvoiceListData {
  results: InvoiceList[];
  count: number;
  current_page: number;
  total_pages: number
}

export interface CreateInvoiceResponse {
  data: InvoiceDetails;
  success: boolean;
  message: string
}

export interface InvoiceListResponse {
  data: InvoiceListData;
  success: boolean;
}

export interface InvoiceDetailsResponse {
  data: InvoiceDetails;
  success: boolean;
}

export interface ApproveInvoiceResponse {
  data: InvoiceDetails;
  success: boolean;
  message: string
}

import { GROUP_ENDPOINT } from '../constants/api';

// API Endpoints
const getInvoiceListEndpoint = (groupId: string) => `${GROUP_ENDPOINT}/${groupId}/invoices`;
const getInvoiceDetailsEndpoint = (groupId: string, invoiceId: string) => `${GROUP_ENDPOINT}/${groupId}/invoices/${invoiceId}`;
const createInvoiceEndpoint = (groupId: string) => `${GROUP_ENDPOINT}/${groupId}/invoices`;
const deleteInvoiceEndpoint = (groupId: string, invoiceId: string) => `${GROUP_ENDPOINT}/${groupId}/invoices/${invoiceId}`;
const approveInvoiceEndpoint = (groupId: string, invoiceId: string) => `${GROUP_ENDPOINT}/${groupId}/invoices/${invoiceId}/approve`;
const rejectInvoiceEndpoint = (groupId: string, invoiceId: string) => `${GROUP_ENDPOINT}/${groupId}/invoices/${invoiceId}/reject`;
const updateInvoiceEndpoint = (groupId: string, invoiceId: string) => `${GROUP_ENDPOINT}/${groupId}/invoices/${invoiceId}`;
const submitInvoiceEndpoint = (groupId: string, invoiceId: string) => `${GROUP_ENDPOINT}/${groupId}/invoices/${invoiceId}/submit`;

// API Functions
const getInvoiceList = async (groupId: string): Promise<InvoiceListResponse> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await axios.get<InvoiceListResponse>(getInvoiceListEndpoint(groupId), {
      headers: {
        'Authorization': `Bearer ${token?.jwt}`
      },
    });
    console.log('[API] getInvoiceList response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice list:', error);
    throw error;
  }
};

const getInvoiceDetails = async (groupId: string, invoiceId: string): Promise<InvoiceDetailsResponse> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(getInvoiceDetailsEndpoint(groupId, invoiceId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      },
    });
    if (response.status !== 200) {
      const error = await response.text();
      throw new Error(`Failed to get invoice details: ${error}`);
    }
    const data: InvoiceDetailsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    throw error;
  }
};

const createInvoice = async (
  groupId: string,
  invoiceData: InvoiceData,
  imageFile: File
): Promise<InvoiceDetails> => {
  try {
    const token = jwtUtils.getTokens();
    const formData = new FormData();
    formData.append('data', JSON.stringify(invoiceData));
    formData.append('file', imageFile);

    const response = await fetch(createInvoiceEndpoint(groupId), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token?.jwt}`
      },
      body: formData
    });

    if (response.status !== 201) {
      const error = await response.text();
      throw new Error(`Failed to create invoice: ${error}`);
    }

    const data: CreateInvoiceResponse = await response.json();
    return data.data 

  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

const deleteInvoice = async (
  groupId: string,
  invoiceId: string
): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(deleteInvoiceEndpoint(groupId, invoiceId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      }
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete invoice: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};

const approveInvoice = async (
  groupId: string,
  invoiceId: string
): Promise<InvoiceDetails> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(approveInvoiceEndpoint(groupId, invoiceId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      }
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to approve invoice: ${response.status}`);
    }

    const data: CreateInvoiceResponse = await response.json();
    return data.data

  } catch (error) {
    console.error('Error approving invoice:', error);
    throw error;
  }
};

const rejectInvoice = async (
  groupId: string,
  invoiceId: string
): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(rejectInvoiceEndpoint(groupId, invoiceId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      }
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to reject invoice: ${response.status}`);
    }
  } catch (error) {
    console.error('Error rejecting invoice:', error);
    throw error;
  }
};

const updateInvoice = async (
  groupId: string,
  invoiceId: string,
  invoiceData: InvoiceData
): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(updateInvoiceEndpoint(groupId, invoiceId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      },
      body: JSON.stringify(invoiceData)
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update invoice: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

const submitInvoice = async (
  groupId: string,
  invoiceId: string
): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(submitInvoiceEndpoint(groupId, invoiceId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      }
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to submit invoice: ${response.status}`);
    }
  } catch (error) {
    console.error('Error submitting invoice:', error);
    throw error;
  }
};

// Export all functions as a namespace object
export const invoiceApi = {
  getInvoiceListEndpoint,
  getInvoiceDetailsEndpoint,
  createInvoiceEndpoint,
  deleteInvoiceEndpoint,
  approveInvoiceEndpoint,
  rejectInvoiceEndpoint,
  updateInvoiceEndpoint,
  submitInvoiceEndpoint,
  getInvoiceList,
  getInvoiceDetails,
  createInvoice,
  deleteInvoice,
  approveInvoice,
  rejectInvoice,
  updateInvoice,
  submitInvoice
};

export default invoiceApi;