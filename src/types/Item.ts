export interface Item {
    id?: string;              // ID của mặt hàng (tự động tạo khi lưu vào DB)
    item: string;             // Tên mặt hàng
    price: number;            // Giá mặt hàng
    quantity: number;         // Số lượng
    total?: number;           // Tổng giá trị (price * quantity)
    description?: string;     // Mô tả thêm (tùy chọn)
    category?: string;        // Danh mục sản phẩm (tùy chọn)
}
  