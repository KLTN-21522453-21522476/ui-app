export interface Item {
  id?: string;
  invoice_id?: string;
  item: string;
  price: number;
  quantity: number;
}

export interface InvoiceData {
  id?: string;
  invoice_number: string;
  group_id: string;
  model: string;
  address: string;
  file_name: string;
  store_name: string;
  status: string;
  approved_by: string;
  submitted_by: string;
  created_date: string;
  update_at: string;
  total_amount: number;
  image_url: string;
  items: Item[];
}
