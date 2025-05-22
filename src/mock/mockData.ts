// src/mock/dashboardMockData.ts

export const mockGroupList = [
  {
      created_by: "1",
      created_date: "Wed, 14 May 2025 09:31:44 GMT",
      description: "Nhóm quản lý chiến dịch quảng cáo Q1",
      id: "68246300fc282c1bedead0cd",
      invoice_count: 3,
      name: "Marketing Team Q1",
      updated_by: "1",
      updated_date: "Wed, 14 May 2025 09:31:44 GMT",
      user_roles: ["admin", "editor"]
  },
  {
      created_by: "2",
      created_date: "Thu, 15 May 2025 10:15:22 GMT",
      description: "Nhóm phân tích dữ liệu thị trường",
      id: "68246303fc282c1bedead0d0",
      invoice_count: 5,
      name: "Data Analytics Team",
      updated_by: "2",
      updated_date: "Thu, 15 May 2025 10:15:22 GMT",
      user_roles: ["admin"]
  },
  {
      created_by: "3",
      created_date: "Fri, 16 May 2025 14:22:11 GMT",
      description: "Nhóm phát triển nội dung",
      id: "68246304fc282c1bedead0d3",
      invoice_count: 2,
      name: "Content Development",
      updated_by: "3",
      updated_date: "Fri, 16 May 2025 14:22:11 GMT",
      user_roles: ["editor", "viewer"]
  },
  {
      created_by: "1",
      created_date: "Sat, 17 May 2025 08:45:33 GMT",
      description: "Nhóm chiến dịch quảng cáo Q2",
      id: "68246306fc282c1bedead0d6",
      invoice_count: 4,
      name: "Marketing Team Q2",
      updated_by: "1",
      updated_date: "Sat, 17 May 2025 08:45:33 GMT",
      user_roles: ["admin", "editor"]
  },
  {
      created_by: "4",
      created_date: "Sun, 18 May 2025 11:10:55 GMT",
      description: "Nhóm quản lý sự kiện",
      id: "68246307fc282c1bedead0d9",
      invoice_count: 1,
      name: "Event Management",
      updated_by: "4",
      updated_date: "Sun, 18 May 2025 11:10:55 GMT",
      user_roles: ["admin"]
  },
  {
      created_by: "2",
      created_date: "Mon, 19 May 2025 09:20:00 GMT",
      description: "Nhóm nghiên cứu thị trường",
      id: "68246308fc282c1bedead0dc",
      invoice_count: 0,
      name: "Market Research",
      updated_by: "2",
      updated_date: "Mon, 19 May 2025 09:20:00 GMT",
      user_roles: ["viewer"]
  }
];

export const mockGroupDetails = {
  created_by: "1",
  created_date: "Wed, 14 May 2025 09:31:44 GMT",
  description: "Nhóm quản lý chiến dịch quảng cáo Q1",
  id: "68246300fc282c1bedead0cd",
  invoice_count: 3,
  members: [
      {
          added_by: "1",
          added_date: "Wed, 14 May 2025 09:31:44 GMT",
          email: "phihoangdiep2506@gmail.com",
          name: "Admin",
          roles: ["admin"],
          user_id: "1"
      },
      {
          added_by: "1",
          added_date: "Sat, 17 May 2025 07:43:15 GMT",
          email: "thanhan7801@gmail.com",
          name: "Test User",
          roles: ["editor"],
          user_id: "67ecf846000b208996fe"
      },
      {
          added_by: "2",
          added_date: "Thu, 15 May 2025 10:15:22 GMT",
          email: "nguyen.van.a@gmail.com",
          name: "Nguyen Van A",
          roles: ["viewer"],
          user_id: "67ecf847000b208996ff"
      },
      {
          added_by: "3",
          added_date: "Fri, 16 May 2025 14:22:11 GMT",
          email: "tran.thi.b@gmail.com",
          name: "Tran Thi B",
          roles: ["editor"],
          user_id: "67ecf848000b208996fg"
      }
  ],
  name: "Marketing Team Q1",
  updated_by: "1",
  updated_date: "Wed, 14 May 2025 09:31:44 GMT"
};

export const mockInvoices = [
  {
      count: 10,
      current_page: 1,
      results: [
          {
              created_date: "2025-05-16T02:10:09.891000Z",
              created_date_formatted: "16/05/2025 02:10",
              group_id: "68246300fc282c1bedead0cd",
              id: "f0a7724e-ca96-401e-b08f-a18cc104b0dc",
              invoice_number: "INV001",
              item_count: 4,
              status: "pending",
              status_display: "Chờ xử lý",
              store_name: "Bách Hoá Xanh",
              total_amount: 15000
          },
          {
              created_date: "2025-05-17T03:20:12.123000Z",
              created_date_formatted: "17/05/2025 03:20",
              group_id: "68246300fc282c1bedead0cd",
              id: "f0a7724e-ca96-401e-b08f-a18cc104b0dd",
              invoice_number: "INV002",
              item_count: 2,
              status: "completed",
              status_display: "Hoàn thành",
              store_name: "Co.opmart",
              total_amount: 25000
          },
          {
              created_date: "2025-05-18T09:30:45.456000Z",
              created_date_formatted: "18/05/2025 09:30",
              group_id: "68246303fc282c1bedead0d0",
              id: "f0a7724e-ca96-401e-b08f-a18cc104b0de",
              invoice_number: "INV003",
              item_count: 5,
              status: "pending",
              status_display: "Chờ xử lý",
              store_name: "VinMart",
              total_amount: 35000
          },
          {
              created_date: "2025-05-19T11:15:22.789000Z",
              created_date_formatted: "19/05/2025 11:15",
              group_id: "68246304fc282c1bedead0d3",
              id: "f0a7724e-ca96-401e-b08f-a18cc104b0df",
              invoice_number: "INV004",
              item_count: 3,
              status: "cancelled",
              status_display: "Đã hủy",
              store_name: "Bách Hoá Xanh",
              total_amount: 18000
          },
          {
              created_date: "2025-05-20T14:25:33.321000Z",
              created_date_formatted: "20/05/2025 14:25",
              group_id: "68246306fc282c1bedead0d6",
              id: "f0a7724e-ca96-401e-b08f-a18cc104b0dg",
              invoice_number: "INV005",
              item_count: 6,
              status: "completed",
              status_display: "Hoàn thành",
              store_name: "Co.opmart",
              total_amount: 40000
          }
      ],
      total_pages: 2
  }
];

export const mockStatisticData = {
  totalInvoices: 15,
  totalProducts: 25,
  uniqueStores: 3,
  totalAmount: 145000
};

export const mockStoreChartData = {
  data: [
      { marketShare: 40, name: "Bách Hoá Xanh" },
      { marketShare: 35, name: "Co.opmart" },
      { marketShare: 25, name: "VinMart" }
  ],
  message: "Success"
};

export const mockProductChartData = {
  datasets: [
      {
          data: [10, 8, 5, 4, 3],
          label: "Số lượng mua"
      }
  ],
  labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
  timeRange: {
      start_date: "2025-01-01",
      end_date: "2025-05-20"
  }
};

export const mockInvoiceDetail = {
  "address": "123 Main St, City",
  "approved_by": "",
  "created_date": "2025-05-16T02:10:09.891000Z",
  "created_date_formatted": "16/05/2025 02:10",
  "file_name": "invoice_123.pdf",
  "group_id": "68246300fc282c1bedead0cd",
  "id": "f0a7724e-ca96-401e-b08f-a18cc104b0dc",
  "image_url": "https://cloud.appwrite.io/v1/storage/buckets/6822c485001fe4bcec98/files/c1fa4866-725d-4cd2-815e-fdb6393eb21c/view?project=67eca511000ac9411da3",
  "invoice_number": "str",
  "item_count": 4,
  "items": [
      {
          "id": "ca9d2a02-5da1-4f9b-ac3a-2bd047a99756",
          "invoice_id": "f0a7724e-ca96-401e-b08f-a18cc104b0dc",
          "item": "Product A",
          "price": 5000,
          "quantity": 2
      },
      {
          "id": "2ba17468-d18d-4c74-b057-3df4a3c2cdc2",
          "invoice_id": "f0a7724e-ca96-401e-b08f-a18cc104b0dc",
          "item": "Product B",
          "price": 5000,
          "quantity": 1
      },
      {
          "id": "3a81a08a-5610-4931-9294-543101ec0cae",
          "invoice_id": "f0a7724e-ca96-401e-b08f-a18cc104b0dc",
          "item": "Product A",
          "price": 5000,
          "quantity": 2
      },
      {
          "id": "3d075eca-5ec2-421d-98f1-769693da1d7e",
          "invoice_id": "f0a7724e-ca96-401e-b08f-a18cc104b0dc",
          "item": "Product B",
          "price": 5000,
          "quantity": 1
      }
  ],
  "model": "standard",
  "status": "pending",
  "status_display": "pending",
  "store_name": "Bách Hoá Xanh",
  "submitted_by": "1",
  "total_amount": 15000,
  "update_at": "2025-05-16T02:10:10.257000Z"
};