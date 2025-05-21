import { Item } from "./Item";

export interface InvoiceDetails {
    address: string;
    approved_by: string;
    created_date: string;
    created_date_formatted: string;
    file_name: string;
    group_id: string;
    id: string;
    image_url: string;
    invoice_number: string;
    item_count: number;
    items: Item[];
    model: string;
    status: string;
    status_display: string;
    store_name: string;
    submitted_by: string;
    total_amount: number;
    update_at: string;
}
