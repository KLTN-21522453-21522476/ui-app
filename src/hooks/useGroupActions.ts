// src/hooks/useGroupActions.ts
import { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { deleteGroupData, createGroupData, renameGroupData, fetchGroupDetailsData, fetchGroupListData } from '../redux/slices/groupSlice';
import { GroupDetails, GroupModalState } from '../types/GroupDetails';

export const useGroupActions = () => {
  const dispatch = useAppDispatch();
  const [modalState, setModalState] = useState<GroupModalState>({
    delete: { show: false, group: null, isProcessing: false },
    create: { show: false, name: '', isProcessing: false },
    rename: { show: false, group: null, newName: '', isProcessing: false }
  });

  // Các hàm xử lý modal
  const openDeleteModal = (group: GroupDetails) => {
    setModalState(prev => ({
      ...prev,
      delete: { ...prev.delete, show: true, group }
    }));
  };

  const openCreateModal = () => {
    setModalState(prev => ({
      ...prev,
      create: { ...prev.create, show: true }
    }));
  };

  const openRenameModal = (group: GroupDetails) => {
    setModalState(prev => ({
      ...prev,
      rename: { ...prev.rename, show: true, group, newName: group.name }
    }));
  };

  const closeAllModals = () => {
    setModalState({
      delete: { show: false, group: null, isProcessing: false },
      create: { show: false, name: '', isProcessing: false },
      rename: { show: false, group: null, newName: '', isProcessing: false }
    });
  };

  // Các hàm xử lý action
  const handleDeleteGroup = async () => {
    if (!modalState.delete.group) return;
    
    setModalState(prev => ({
      ...prev,
      delete: { ...prev.delete, isProcessing: true }
    }));
    
    try {
      await dispatch(deleteGroupData(modalState.delete.group.id)).unwrap();
      console.log('Đã xoá nhóm thành công');
      dispatch(fetchGroupListData());
    } catch (error) {
      console.error(`Lỗi khi xoá nhóm: ${error}`);
    } finally {
      closeAllModals();
    }
  };

  const handleCreateGroup = async () => {
    const { name } = modalState.create;
    if (!name.trim()) return;
    
    setModalState(prev => ({
      ...prev,
      create: { ...prev.create, isProcessing: true }
    }));
    
    try {
      await dispatch(createGroupData({ name: name.trim() })).unwrap();
      console.log('Đã tạo nhóm thành công');
      dispatch(fetchGroupListData());
    } catch (error) {
      console.error(`Lỗi khi tạo nhóm: ${error}`);
    } finally {
      closeAllModals();
    }
  };

  const handleRenameGroup = async () => {
    const { group, newName } = modalState.rename;
    if (!group || !newName.trim() || newName === group.name) return;
    
    setModalState(prev => ({
      ...prev,
      rename: { ...prev.rename, isProcessing: true }
    }));
    
    try {
      await dispatch(renameGroupData({ id: group.id, name: newName.trim() })).unwrap();
      console.log('Đã đổi tên nhóm thành công');
      
      // Cập nhật cả danh sách groups và chi tiết của group vừa được đổi tên
      dispatch(fetchGroupListData());
      dispatch(fetchGroupDetailsData(group.id));
    } catch (error) {
      console.error(`Lỗi khi đổi tên nhóm: ${error}`);
    } finally {
      closeAllModals();
    }
  };

  // Các hàm cập nhật state
  const updateCreateGroupName = (name: string) => {
    setModalState(prev => ({
      ...prev,
      create: { ...prev.create, name }
    }));
  };

  const updateRenameGroupName = (newName: string) => {
    setModalState(prev => ({
      ...prev,
      rename: { ...prev.rename, newName }
    }));
  };

  return {
    modalState,
    openDeleteModal,
    openCreateModal,
    openRenameModal,
    closeAllModals,
    handleDeleteGroup,
    handleCreateGroup,
    handleRenameGroup,
    updateCreateGroupName,
    updateRenameGroupName
  };
};
