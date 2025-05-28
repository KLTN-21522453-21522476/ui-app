import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { fetchGroupDetailsData, addMember, removeMember, updateMemberRoles, leaveGroup } from '../redux/slices/memberSlice';
import { useCallback } from 'react';

export const useMembers = (groupId: string | null) => {
  const dispatch = useAppDispatch();
  const { groupDetails, error, isLoading } = useAppSelector(state => state.member);

  const members = groupId ? groupDetails[groupId]?.members || [] : [];

  const addNewMember = async (email: string, roles: string[]) => {
    try {
      await dispatch(addMember({
        groupId: groupId || '',
        email,
        roles
      })).unwrap();
      await fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  const updateMember = async (userId: string, roles: string[]) => {
    try {
      await dispatch(updateMemberRoles({
        groupId: groupId || '',
        userId,
        roles
      })).unwrap();
      await fetchMembers();
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  };

  const removeMemberById = async (userId: string) => {
    try {
      await dispatch(removeMember({
        groupId: groupId || '',
        userId
      })).unwrap();
      await fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  };

  const fetchMembers = useCallback(async () => {
    if (groupId) {
      await dispatch(fetchGroupDetailsData(groupId));
    }
  }, [dispatch, groupId]);

  const leaveGroupByUser = async (groupId: string, userId: string) => {
    try {
      await dispatch(leaveGroup({ groupId: groupId || '', userId })).unwrap();
      await fetchMembers();
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  };


  return {
    members,
    isLoading,
    error,
    leaveGroupByUser,
    fetchMembers,
    addNewMember,
    updateMember,
    removeMemberById
  };
};
