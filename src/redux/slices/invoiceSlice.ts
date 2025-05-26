// src/redux/slices/invoiceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import invoiceApi from '../../api/invoiceApi';
import { InvoiceData } from '../../types/Invoice';
import { InvoiceList } from '../../types/InvoiceList';
import { InvoiceDetails } from '../../types/InvoiceDetails';

interface InvoiceState {
  invoiceList: {
    invoices: InvoiceList[];
    count: number;
    currentPage: number;
    totalPages: number;
  };
  invoiceDetails: { [invoiceId: string]: InvoiceDetails };

  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  currentInvoice: InvoiceDetails | null; // <-- Added for current invoice
}

const initialState: InvoiceState = {
  invoiceList: {
    invoices: [],
    count: 0,
    currentPage: 1,
    totalPages: 1
  },
  invoiceDetails: {},
  isLoading: false,
  error: null,
  lastFetched: null,
  currentInvoice: null, // <-- Added for current invoice
};

// Fetch invoice list for a specific group
export const fetchInvoiceList = createAsyncThunk(
  'invoices/fetchInvoiceList',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.getInvoiceList(groupId);
            
      if (response.data.results) {
        return {
          invoices: response.data.results || [],
          count: response.data.count || 0,
          currentPage: response.data.current_page || 1,
          totalPages: response.data.total_pages || 1
        };
      } 
      
      return {
        invoices: [],
        count: 0,
        currentPage: 1,
        totalPages: 1
      };
    } catch (error) {
      console.error('Error fetching invoice list:', error);
      return rejectWithValue('Không thể tải danh sách hóa đơn');
    }
  }
);


export const fetchInvoiceDetails = createAsyncThunk(
  'invoices/fetchInvoiceDetails',
  async ({ groupId, invoiceId }: { groupId: string; invoiceId: string }, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.getInvoiceDetails(groupId, invoiceId);
      return { invoiceId, data: response.data };
    } catch (error) {
      return rejectWithValue('Không thể tải chi tiết hóa đơn');
    }
  }
);

// Create new invoice
export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async ({ 
    groupId, 
    invoiceData, 
    imageFile 
  }: { 
    groupId: string; 
    invoiceData: InvoiceData; 
    imageFile: File 
  }, { rejectWithValue }) => {
    try {
      await invoiceApi.createInvoice(groupId, invoiceData, imageFile);
      // Sau khi tạo thành công, fetch lại danh sách để cập nhật
      const response = await invoiceApi.getInvoiceList(groupId);
      return response.data; // Return the full response data
    } catch (error) {
      return rejectWithValue('Không thể tạo hóa đơn mới');
    }
  }
);

// Delete invoice
export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async ({ 
    groupId, 
    invoiceId 
  }: { 
    groupId: string; 
    invoiceId: string 
  }, { rejectWithValue }) => {
    try {
      await invoiceApi.deleteInvoice(groupId, invoiceId);
      // Sau khi xóa thành công, fetch lại danh sách để cập nhật
      const response = await invoiceApi.getInvoiceList(groupId);
      return { 
        invoiceId,
        updatedList: response.data // The response is already the data we need
      };
    } catch (error) {
      return rejectWithValue('Không thể xóa hóa đơn');
    }
  }
);

// Approve invoice
export const approveInvoice = createAsyncThunk(
  'invoices/approveInvoice',
  async ({ 
    groupId, 
    invoiceId 
  }: { 
    groupId: string; 
    invoiceId: string 
  }, { rejectWithValue }) => {
    try {
      await invoiceApi.approveInvoice(groupId, invoiceId);
      // Sau khi phê duyệt thành công, fetch lại chi tiết để cập nhật
      const response = await invoiceApi.getInvoiceDetails(groupId, invoiceId);
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể phê duyệt hóa đơn');
    }
  }
);

// Reject invoice
export const rejectInvoice = createAsyncThunk(
  'invoices/rejectInvoice',
  async ({ 
    groupId, 
    invoiceId 
  }: { 
    groupId: string; 
    invoiceId: string 
  }, { rejectWithValue }) => {
    try {
      await invoiceApi.rejectInvoice(groupId, invoiceId);
      // Sau khi từ chối thành công, fetch lại chi tiết để cập nhật
      const response = await invoiceApi.getInvoiceDetails(groupId, invoiceId);
      return response.data;
    } catch (error) {
      return rejectWithValue('Không thể từ chối hóa đơn');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearCurrentInvoice: (state) => {
      state.invoiceDetails = {};
    },
    clearInvoiceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoice List
      .addCase(fetchInvoiceList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoiceList = {
          invoices: action.payload.invoices,
          count: action.payload.count,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages
        };
        state.lastFetched = Date.now();
      })
      .addCase(fetchInvoiceList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Invoice Details
      .addCase(fetchInvoiceDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceDetails.fulfilled, (state, action) => {
        if (action.payload && action.payload.invoiceId) {
          state.invoiceDetails[action.payload.invoiceId] = action.payload.data;
        }
        state.isLoading = false;
      })
      .addCase(fetchInvoiceDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoiceList = {
          invoices: action.payload.results,
          count: action.payload.count,
          currentPage: action.payload.current_page,
          totalPages: action.payload.total_pages
        };
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        // Cập nhật danh sách sau khi xóa
        state.invoiceList = {
          invoices: action.payload.updatedList.results,
          count: action.payload.updatedList.count,
          currentPage: action.payload.updatedList.current_page,
          totalPages: action.payload.updatedList.total_pages
        };
        // Nếu đang xem chi tiết của hóa đơn vừa xóa, reset currentInvoice
        if (state.currentInvoice && state.currentInvoice.id === action.payload.invoiceId) {
          state.currentInvoice = null;
        }
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Approve Invoice
      .addCase(approveInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveInvoice.fulfilled, (state, action) => {
        if (action.payload && action.meta && action.meta.arg && action.meta.arg.invoiceId) {
          state.invoiceDetails[action.meta.arg.invoiceId] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(approveInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Reject Invoice
      .addCase(rejectInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectInvoice.fulfilled, (state, action) => {
        if (action.payload && action.meta && action.meta.arg && action.meta.arg.invoiceId) {
          state.invoiceDetails[action.meta.arg.invoiceId] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(rejectInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentInvoice, clearInvoiceError } = invoiceSlice.actions;
export default invoiceSlice.reducer;
