import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { statisticsApi, MarketShareParams, TopProductsParams, InvoiceStatisticsResponse, MarketShareResponse, TopProductsResponse } from '../../api/statisticsApi';

interface StatisticsState {
  marketShare: MarketShareResponse | null;
  topProducts: TopProductsResponse | null;
  invoiceStats: InvoiceStatisticsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  marketShare: null,
  topProducts: null,
  invoiceStats: null,
  loading: false,
  error: null,
};

export const fetchMarketShare = createAsyncThunk(
  'statistics/fetchMarketShare',
  async (params: MarketShareParams, { rejectWithValue }) => {
    try {
      return await statisticsApi.getMarketShare(params);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch market share');
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  'statistics/fetchTopProducts',
  async (params: TopProductsParams, { rejectWithValue }) => {
    try {
      return await statisticsApi.getTopProducts(params);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch top products');
    }
  }
);

export const fetchInvoiceStatistics = createAsyncThunk(
  'statistics/fetchInvoiceStatistics',
  async (groupId: string, { rejectWithValue }) => {
    try {
      return await statisticsApi.getInvoiceStatistics(groupId);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch invoice statistics');
    }
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Market Share
      .addCase(fetchMarketShare.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketShare.fulfilled, (state, action) => {
        state.loading = false;
        state.marketShare = action.payload;
      })
      .addCase(fetchMarketShare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Top Products
      .addCase(fetchTopProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Invoice Statistics
      .addCase(fetchInvoiceStatistics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceStats = action.payload;
      })
      .addCase(fetchInvoiceStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default statisticsSlice.reducer;
