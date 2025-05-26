// src/hooks/useGroups.ts
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  fetchGroupListData,
  fetchGroupDetailsData
} from '../redux/slices/groupSlice';

export const useGroups = () => {
  const dispatch = useAppDispatch();
  const { groupList, groupDetails, selectedGroupId, isLoading, error, totalCount, lastFetched } = useAppSelector(state => state.groups);
  
  const { user, isInitialized } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isInitialized && isAuthenticated && (!lastFetched || Date.now() - lastFetched > 5 * 60 * 1000)) {
      dispatch(fetchGroupListData());
    }
  }, [isInitialized, isAuthenticated, dispatch, lastFetched]);

  useEffect(() => {
    if (isAuthenticated && selectedGroupId) {
      dispatch(fetchGroupDetailsData(selectedGroupId));
    }
  }, [isAuthenticated, selectedGroupId, dispatch]);

  const refetch = () => {
    if (isAuthenticated) {
      dispatch(fetchGroupListData());
    }
  };

  // Get members of the currently selected group from groupDetails
  const members = (selectedGroupId && groupDetails[selectedGroupId]?.members) || [];

  return { 
    groupList, 
    groupDetails,
    selectedGroupId,
    members,
    loading: isLoading, 
    error, 
    totalCount, 
    refetch
  };
};
