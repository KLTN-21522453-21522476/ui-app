import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addGroupMember, deleteGroupMember, updateGroupMemberRoles, fetchGroupDetails } from '../../api/groupApi';
import { GroupDetails } from '../../types/GroupDetails';

interface MemberState {
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  groupDetails: Record<string, GroupDetails>;
}

const initialState: MemberState = {
  isLoading: false,
  error: null,
  lastFetched: null,
  groupDetails: {},
};

export const fetchGroupDetailsData = createAsyncThunk(
  'members/fetchGroupDetails',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await fetchGroupDetails(groupId);
      return {
        id: groupId,
        details: response.data
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải chi tiết nhóm');
    }
  }
);

export const addMember = createAsyncThunk(
  'members/addMember',
  async (data: { groupId: string; email: string; roles: string[] }, { rejectWithValue }) => {
    try {
      await addGroupMember(data.groupId, data.email, data.roles);
      return { groupId: data.groupId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể thêm thành viên');
    }
  }
);

export const removeMember = createAsyncThunk(
  'members/removeMember',
  async (data: { groupId: string; userId: string }, { rejectWithValue }) => {
    try {
      await deleteGroupMember(data.groupId, data.userId);
      return { groupId: data.groupId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể xóa thành viên');
    }
  }
);

export const updateMemberRoles = createAsyncThunk(
  'members/updateMemberRoles',
  async (data: { groupId: string; userId: string; roles: string[] }, { rejectWithValue }) => {
    try {
      await updateGroupMemberRoles(data.groupId, data.userId, data.roles);
      return { groupId: data.groupId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể cập nhật vai trò');
    }
  }
);

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch group details
    builder
      .addCase(fetchGroupDetailsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupDetailsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastFetched = Date.now();
        state.groupDetails[action.payload.id] = action.payload.details;
      })
      .addCase(fetchGroupDetailsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add member
    builder
      .addCase(addMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state) => {
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(addMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove member
    builder
      .addCase(removeMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state) => {
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update member roles
    builder
      .addCase(updateMemberRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMemberRoles.fulfilled, (state) => {
        state.isLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(updateMemberRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { } = memberSlice.actions;
export default memberSlice.reducer;
