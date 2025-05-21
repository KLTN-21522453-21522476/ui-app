import axios from 'axios';
import { BASE_URL } from '../constants/api';

export interface MarketShareResponse {
  data: Array<{
    marketShare: number;
    name: string;
  }>;
  message: string;
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

export const statisticsApi = {
  getMarketShare: async (params: MarketShareParams): Promise<MarketShareResponse> => {
    const response = await axios.get<MarketShareResponse>(
      `${BASE_URL}/group/${params.group_id}/invoices/market-share`,
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
      `${BASE_URL}/group/${params.group_id}/invoices/top-products`,
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
};
