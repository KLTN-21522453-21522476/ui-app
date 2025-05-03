export interface Item {
  item: string | null;
  price: number | null;
  quantity: number | null;
}

export interface InvoiceData {
  model: string;
  address: string;
  fileName: string;
  storeName: string;
  createdDate: string;
  id: string;
  status: string;
  approvedBy: string;
  submittedBy: string;
  updateAt: string;
  items: Item[] | null;
  totalAmount: number;
}