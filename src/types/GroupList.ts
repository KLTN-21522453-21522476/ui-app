export interface GroupList {
    id: string;
    name: string;
    created_date: string | null; 
    created_by: string; 
    invoice_count: number;
    description: string,
    updated_date: string,
    updated_by: string,
    user_roles: string[]
}