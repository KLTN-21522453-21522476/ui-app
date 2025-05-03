export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  frequency: number; // How many times this product appears across invoices
  totalSpent: number; // Total amount spent on this product
}
