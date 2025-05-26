import { InvoiceData } from '../types/Invoice';
import { format, parse } from 'date-fns';


export const formatDateForAPI = (dateString: string) => {
  if (format(dateString, 'dd/MM/yyyy')){
    return dateString;
  }
  const date = parse(`${dateString}`, 'yyyy-MM-dd', new Date());
  const formatted = format(date, 'dd/MM/yyyy');
  return formatted;
};

export const formatInvoiceDatesForAPI = (invoice: InvoiceData): InvoiceData => {
  const formattedInvoice = { ...invoice };
  
  formattedInvoice.created_date = formatDateForAPI(formattedInvoice.created_date);
  
  return formattedInvoice;
};

export const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }
  
  const dateParts = dateString.split('-');
  if (dateParts.length === 3) {
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  }
  
  return dateString; 
};
