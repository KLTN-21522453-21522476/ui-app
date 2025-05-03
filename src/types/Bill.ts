export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  storeName: string;
  date: string;
  totalAmount: number;
  tax: number;
  items: InvoiceItem[];
  status: 'processed' | 'pending' | 'error';
  imageUrl?: string;
}
