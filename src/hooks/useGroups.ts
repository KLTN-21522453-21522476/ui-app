// src/hooks/useGroups.ts
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchGroupListData } from '../redux/slices/groupSlice';

export const useGroups = () => {
  const dispatch = useAppDispatch();
  const { groupList, isLoading, error, totalCount, lastFetched } = useAppSelector(state => state.groups);
  
  const { user, isInitialized } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isInitialized && isAuthenticated && (!lastFetched || Date.now() - lastFetched > 5 * 60 * 1000)) {
      dispatch(fetchGroupListData());
    }
  }, [isInitialized, isAuthenticated, dispatch, lastFetched]);

  const refetch = () => {
    if (isAuthenticated) {
      dispatch(fetchGroupListData());
    }
  };

  return { 
    groupList, 
    loading: isLoading, 
    error, 
    totalCount, 
    refetch 
  };
};
