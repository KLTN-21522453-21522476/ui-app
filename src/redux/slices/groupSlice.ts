// src/redux/slices/groupSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteGroup, createGroup, renameGroup, fetchGroupList, fetchGroupDetails } from '../../api/groupApi';
import { GroupList } from "../../types/GroupList";
import { GroupDetails } from '../../types/GroupDetails';

interface GroupState {
  groupList: GroupList[];
  groupDetails: Record<string, GroupDetails>;
  selectedGroupId: string | null; 
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  totalGroupListCount: number;
  lastFetched: number | null;
  lastGroupListFetched: number | null;
}


const initialState: GroupState = {
  groupList: [],
  groupDetails: {},
  selectedGroupId: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  totalGroupListCount: 0,
  lastFetched: null,
  lastGroupListFetched: null,
};

// Thêm async thunk để fetch group list
export const fetchGroupListData = createAsyncThunk(
  'groups/fetchGroupList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchGroupList();
      return {
        data: response.data || [],
        count: response.count || 0
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải danh sách nhóm');
    }
  }
);

export const fetchGroupDetailsData = createAsyncThunk(
  'groups/fetchGroupDetails',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await fetchGroupDetails(groupId);
      return {
        id: groupId,
        data: response.data
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải chi tiết nhóm');
    }
  }
);

export const createGroupData = createAsyncThunk(
  'groups/createGroup',
  async (data: { name: string }, { rejectWithValue }) => {
    try {
      await createGroup(data);
      return; // Không cần trả về data vì API trả về 201 không có body
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteGroupData = createAsyncThunk(
  'groups/deleteGroup',
  async (groupId: string, { rejectWithValue }) => {
    try {
      await deleteGroup(groupId);
      return groupId; // Trả về ID để có thể xử lý trong reducer nếu cần
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const renameGroupData = createAsyncThunk(
  'groups/renameGroup',
  async (data: { id: string, name: string }, { rejectWithValue }) => {
    try {
      await renameGroup(data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    // Thêm reducers nếu cần
    clearGroupList: (state) => {
      state.groupList = [];
      state.totalGroupListCount = 0;
    },
    setSelectedGroupId: (state, action) => {
      state.selectedGroupId = action.payload;
    },
    clearGroupDetails: (state, action) => {
      if (action.payload) {
        const { [action.payload]: _, ...rest } = state.groupDetails;
        state.groupDetails = rest;
      } else {
        state.groupDetails = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder      
      // Xử lý fetchGroupListData
      .addCase(fetchGroupListData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupListData.fulfilled, (state, action) => {
        state.groupList = action.payload.data;
        state.totalGroupListCount = action.payload.count;
        state.isLoading = false;
        state.lastGroupListFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchGroupListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Xử lý fetchGroupDetailsData
      .addCase(fetchGroupDetailsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupDetailsData.fulfilled, (state, action) => {
        state.groupDetails[action.payload.id] = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchGroupDetailsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Xử lý deleteGroupData
      .addCase(deleteGroupData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGroupData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteGroupData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý createGroupData
      .addCase(createGroupData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGroupData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createGroupData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý renameGroupData
      .addCase(renameGroupData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(renameGroupData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(renameGroupData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGroupList, clearGroupDetails, setSelectedGroupId } = groupSlice.actions;
export default groupSlice.reducer;
