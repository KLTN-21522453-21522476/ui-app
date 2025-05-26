import axios from 'axios';
import { BASE_URL } from '../constants/api';

export interface MarketShareResponse {
  data: Array<{
    amount: number;
    percentage: number;
    store: string;
  }>;
  message: string;
  success: boolean;
}

export interface TopProductsResponse {
  datasets: Array<{
    data: number[];
    label: string;
  }>;
  labels: string[];
  timeRange: {
    start_date: string;
    end_date: string;
  };
}

export interface MarketShareParams {
  group_id: string;
  start_date?: string;
  end_date?: string;
  min_percentage?: number;
  store_name?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface TopProductsParams {
  group_id: string;
  start_date: string;
  end_date: string;
  limit?: number;
}

export interface InvoiceStatisticsResponse {
  invoices: number;
  products: number;
  stores: number;
  total_spent: number;
}

export const statisticsApi = {
  getMarketShare: async (params: MarketShareParams): Promise<MarketShareResponse> => {
    const response = await axios.get<MarketShareResponse>(
      `${BASE_URL}/api/group/${params.group_id}/invoices/market-share`,
      {
        params: {
          ...params,
          start_date: params.start_date,
          end_date: params.end_date,
          min_percentage: params.min_percentage || 5,
        },
      }
    );
    return response.data;
  },

  getTopProducts: async (params: TopProductsParams): Promise<TopProductsResponse> => {
    const response = await axios.get<TopProductsResponse>(
      `${BASE_URL}/api/group/${params.group_id}/invoices/top-products`,
      {
        params: {
          start_date: params.start_date,
          end_date: params.end_date,
          limit: params.limit,
        },
      }
    );
    return response.data;
 },

  getInvoiceStatistics: async (groupId: string): Promise<InvoiceStatisticsResponse> => {
    const response = await axios.get<InvoiceStatisticsResponse>(
      `${BASE_URL}/api/group/${groupId}/invoices/statistic`
    );
    return response.data;
  },
};
