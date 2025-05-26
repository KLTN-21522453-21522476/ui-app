import { InvoiceData } from './Invoice';
import { ExtractionData } from './ExtractionData';

export const convertExtractionToInvoiceData = (data: ExtractionData): InvoiceData => ({
  invoice_number: data.fileName,
  group_id: '', // This might need to be set from context or passed as a parameter
  model: data.model,
  address: data.address,
  file_name: data.fileName,
  store_name: data.storeName,
  status: data.status,
  approved_by: data.approvedBy,
  submitted_by: data.submittedBy,
  created_date: data.createdDate,
  update_at: data.updateAt,
  total_amount: data.totalAmount,
  image_url: '', // This might need to be set from context or passed as a parameter
  items: data.items
});
