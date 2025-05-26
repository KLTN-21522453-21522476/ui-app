import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchMarketShare,
  fetchTopProducts,
  fetchInvoiceStatistics
} from '../redux/slices/statisticsSlice';
import { RootState, AppDispatch } from '../redux/store';
import { MarketShareParams, TopProductsParams } from '../api/statisticsApi';

export const useStatistic = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { marketShare, topProducts, invoiceStats, loading, error } = useSelector(
    (state: RootState) => state.statistics
  );

  const getMarketShare = useCallback((params: MarketShareParams) => {
    dispatch(fetchMarketShare(params) as any);
  }, [dispatch]);

  const getTopProducts = useCallback((params: TopProductsParams) => {
    dispatch(fetchTopProducts(params) as any);
  }, [dispatch]);

  const getInvoiceStatistics = useCallback((groupId: string) => {
    dispatch(fetchInvoiceStatistics(groupId) as any);
  }, [dispatch]);

  return {
    marketShare,
    topProducts,
    invoiceStats,
    loading,
    error,
    getMarketShare,
    getTopProducts,
    getInvoiceStatistics,
  };
};
