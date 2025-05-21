import { InvoiceList } from './InvoiceList';

export interface InvoiceListResponse {
  success: boolean;
  data: {
    results: InvoiceList[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}
