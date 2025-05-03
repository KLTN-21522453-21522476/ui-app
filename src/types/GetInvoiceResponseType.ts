import { InvoiceData } from "./Invoice";

export interface GetInvoiceResponseType {
  count: number;
  next: boolean | string | null;
  previous: boolean | string | null;
  results: InvoiceData[];
}
