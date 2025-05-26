// src/api/groupApi.ts
import axios from 'axios';
import { jwtUtils } from "../utils/jwtUtils";
import { GroupList } from "../types/GroupList";
import { GroupDetails } from "../types/GroupDetails";

export interface GroupListResponse {
  count: number;
  data: GroupList[];
  success: boolean;
}

export interface GroupDetailsResponse {
  data: GroupDetails;
  success: boolean;
}

const BASE_URL = import.meta.env.VITE_PROXY_ENDPOINT;
const GROUP_ENDPOINT = `${BASE_URL}/api/group`;
const GROUP_LIST_ENDPOINT = `${GROUP_ENDPOINT}/`;
const getGroupDetailEndpoint = (groupId: string) => `${GROUP_ENDPOINT}/${groupId}`;
const getGroupMemberEndpoint = (groupId: string) => `${GROUP_ENDPOINT}/${groupId}/members`;
const getGroupDeleteMemberEndpoint = (groupId: string, userId: string) => `${GROUP_ENDPOINT}/${groupId}/members/${userId}`;
const getGroupChangeRoleMemberEndpoint = (groupId: string, userId: string) => `${GROUP_ENDPOINT}/${groupId}/members/${userId}/roles`;

export const fetchGroupList = async (): Promise<GroupListResponse> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await axios.get<GroupListResponse>(GROUP_LIST_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${token?.jwt}`
        },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

export const fetchGroupDetails = async (groupId: string): Promise<GroupDetailsResponse> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(getGroupDetailEndpoint(groupId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token?.jwt}`
        },
    });
    const groups : GroupDetailsResponse = await response.json()

    return groups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

export const deleteGroup = async (groupId: string): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(getGroupDetailEndpoint(groupId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      },
    });
    
    if (response.status != 204) {
      throw new Error('Failed to delete group');
    }
    
    return;
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

export const createGroup = async (
  data: { name: string, description: string },
  onRefetch?: () => void
): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(`${GROUP_ENDPOINT}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      },
      body: JSON.stringify(data)
    });
    
    if (response.status != 201) {
      throw new Error('Failed to create group');
    }

    // Call refetch if provided
    onRefetch?.();
    
    return;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const renameGroup = async (data: { id: string, name: string }): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(getGroupDetailEndpoint(data.id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      },
      body: JSON.stringify({ name: data.name })
    });
    
    if (response.status != 200) {
      throw new Error('Failed to rename group');
    }
    
    return;
  } catch (error) {
    console.error('Error renaming group:', error);
    throw error;
  }
};

export const addGroupMember = async (
  groupId: string,
  userMail: string,
  roles: string[]
): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(getGroupMemberEndpoint(groupId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      },
      body: JSON.stringify({ user_mail : userMail, roles: roles })
    });
    
    if (response.status !== 201) {
      throw new Error('Failed to add member to group');
    }
    
    return;
  } catch (error) {
    console.error('Error adding member to group:', error);
    throw error;
  }
};

export const deleteGroupMember = async (
  groupId: string, 
  userId: string,
): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(getGroupDeleteMemberEndpoint(groupId, userId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      }
    });
    
    if (response.status !== 204) {
      throw new Error('Failed to delete member from group');
    }
    
    return;
  } catch (error) {
    console.error('Error deleting member from group:', error);
    throw error;
  }
};

export const updateGroupMemberRoles = async (
  groupId: string, 
  userId: string,
  roles: string[]
): Promise<void> => {
  try {
    const token = jwtUtils.getTokens();
    const response = await fetch(getGroupChangeRoleMemberEndpoint(groupId, userId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.jwt}`
      },
      body: JSON.stringify({ roles: roles })
    });
    
    if (response.status !== 200) {
      throw new Error('Failed to update member roles');
    }
    
    return;
  } catch (error) {
    console.error('Error updating member roles:', error);
    throw error;
  }
};
