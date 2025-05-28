// src/types/GroupDetails.ts
export interface Members {
    user_id: string;
    roles: string[];
    added_by: string;
    added_date: string;
    email: string;
    name: string;
  }
  
export interface GroupDetails {
    id: string;
    description: string;
    name: string;
    created_date: string | null; 
    invoice_count: number;
    members: Members[];
    created_by: string; 
}

export interface GroupModalState {
    delete: { show: boolean; group: GroupDetails | null; isProcessing: boolean };
    create: { show: boolean; name: string; description: string; isProcessing: boolean };
    rename: { show: boolean; group: GroupDetails | null; newName: string; isProcessing: boolean };
    leave: { show: boolean; group: GroupDetails | null; isProcessing: boolean };
  }