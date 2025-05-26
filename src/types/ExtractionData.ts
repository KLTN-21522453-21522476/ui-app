export interface Item {
  item: string;
  price: number;
  quantity: number;
}

export interface ExtractionData {
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
  items: Item[];
  totalAmount: number;
}
