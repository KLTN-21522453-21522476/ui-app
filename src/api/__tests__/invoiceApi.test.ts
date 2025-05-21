import { getInvoiceList, getInvoiceDetails, createInvoice, deleteInvoice, approveInvoice, rejectInvoice } from '../invoiceApi';
import { jwtUtils } from '../../utils/jwtUtils';
import { InvoiceData, Item } from '../../types/Invoice';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

// Mock jwtUtils
jest.mock('../../utils/jwtUtils', () => ({
  getTokens: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Invoice API', () => {
  const mockGroupId = 'test-group';
  const mockInvoiceId = 'test-invoice';
  const mockToken = 'test-token';
  const mockItem: Item = {
    item: 'Test Item',
    price: 100,
    quantity: 1
  };

  const mockInvoiceData: InvoiceData = {
    invoice_number: 'INV-123',
    group_id: mockGroupId,
    model: 'Test Model',
    address: 'Test Address',
    file_name: 'test.pdf',
    store_name: 'Test Store',
    status: 'pending',
    approved_by: '',
    submitted_by: 'test-user',
    created_date: '2025-05-21',
    update_at: '2025-05-21',
    total_amount: 100,
    image_url: 'test-url',
    items: [mockItem]
  };
  const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

  // Helper function to create the base URL
  const createBaseUrl = () => {
    return `${import.meta.env.VITE_PROXY_ENDPOINT}/api/group`;
  };

  // Helper function to create full endpoint URLs
  const createEndpoint = (endpoint: string) => {
    return `${createBaseUrl()}/${mockGroupId}${endpoint}`;
  };

  describe('getInvoiceList', () => {
    it('should fetch invoice list successfully', async () => {
      const mockResponse = {
        data: {
          results: [{ id: mockInvoiceId }],
          count: 1,
          current_page: 1,
          total_pages: 1
        },
        success: true
      };

      mockFetch.mockResolvedValue({
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      const result = await getInvoiceList(mockGroupId);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(createEndpoint('/invoice'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        }
      });
    });

    it('should handle invalid token', async () => {
      mockFetch.mockResolvedValue({
        status: 401,
        text: () => Promise.resolve('Unauthorized')
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: undefined });

      await expect(getInvoiceList(mockGroupId))
        .rejects
        .toThrow('Failed to get invoice: Unauthorized');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(getInvoiceList(mockGroupId))
        .rejects
        .toThrow('Network error');
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValue({
        status: 400,
        text: () => Promise.resolve('Bad Request')
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(getInvoiceList(mockGroupId)).rejects.toThrow('Failed to get invoice: Bad Request');
    });
  });

  describe('createInvoice', () => {
    it('should create invoice successfully', async () => {
      mockFetch.mockResolvedValue({
        status: 201
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await createInvoice(mockGroupId, mockInvoiceData, mockFile);
      expect(mockFetch).toHaveBeenCalledWith(createEndpoint('/invoice'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockToken}`
        },
        body: expect.any(FormData)
      });
    });

    it('should validate invoice data', async () => {
      const invalidData = {} as InvoiceData;
      mockFetch.mockResolvedValue({
        status: 400,
        text: () => Promise.resolve('Invalid invoice data')
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(createInvoice(mockGroupId, invalidData, mockFile))
        .rejects
        .toThrow('Failed to create invoice: Invalid invoice data');
    });

    it('should throw error when creation fails', async () => {
      mockFetch.mockResolvedValue({
        status: 400,
        text: () => Promise.resolve('Bad Request')
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(createInvoice(mockGroupId, mockInvoiceData, mockFile))
        .rejects.toThrow('Failed to create invoice: Bad Request');
    });
  });

  describe('getInvoiceDetails', () => {
    it('should fetch invoice details successfully', async () => {
      const mockResponse = {
        data: {
          id: mockInvoiceId,
          amount: 100,
          date: '2025-05-21',
          vendor: 'Test Vendor'
        },
        success: true
      };

      mockFetch.mockResolvedValue({
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      const result = await getInvoiceDetails(mockGroupId, mockInvoiceId);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(`${mockGroupId}/invoice/${mockInvoiceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        }
      });
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValue({
        status: 404,
        text: () => Promise.resolve('Not Found')
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(getInvoiceDetails(mockGroupId, mockInvoiceId))
        .rejects.toThrow('Failed to get invoice: Not Found');
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      mockFetch.mockResolvedValue({
        status: 200
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await deleteInvoice(mockGroupId, mockInvoiceId);
      expect(mockFetch).toHaveBeenCalledWith(`${mockGroupId}/invoice/${mockInvoiceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        }
      });
    });

    it('should throw error when deletion fails', async () => {
      mockFetch.mockResolvedValue({
        status: 404,
        json: () => Promise.resolve({ message: 'Invoice not found' })
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(deleteInvoice(mockGroupId, mockInvoiceId))
        .rejects.toThrow('Invoice not found');
    });

    it('should handle invalid invoice ID', async () => {
      mockFetch.mockResolvedValue({
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid invoice ID' })
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(deleteInvoice(mockGroupId, ''))
        .rejects
        .toThrow('Invalid invoice ID');
    });
  });

  describe('approveInvoice', () => {
    it('should approve invoice successfully', async () => {
      mockFetch.mockResolvedValue({
        status: 200
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await approveInvoice(mockGroupId, mockInvoiceId);
      expect(mockFetch).toHaveBeenCalledWith(`${mockGroupId}/invoice/${mockInvoiceId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        }
      });
    });

    it('should throw error when approval fails', async () => {
      mockFetch.mockResolvedValue({
        status: 400,
        json: () => Promise.resolve({ message: 'Cannot approve invoice' })
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(approveInvoice(mockGroupId, mockInvoiceId))
        .rejects.toThrow('Cannot approve invoice');
    });

    it('should handle unauthorized approval', async () => {
      mockFetch.mockResolvedValue({
        status: 403,
        json: () => Promise.resolve({ message: 'Unauthorized to approve' })
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(approveInvoice(mockGroupId, mockInvoiceId))
        .rejects
        .toThrow('Unauthorized to approve');
    });
  });

  describe('rejectInvoice', () => {
    it('should reject invoice successfully', async () => {
      mockFetch.mockResolvedValue({
        status: 200
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await rejectInvoice(mockGroupId, mockInvoiceId);
      expect(mockFetch).toHaveBeenCalledWith(`${mockGroupId}/invoice/${mockInvoiceId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        }
      });
    });

    it('should throw error when rejection fails', async () => {
      mockFetch.mockResolvedValue({
        status: 400,
        json: () => Promise.resolve({ message: 'Cannot reject invoice' })
      });
      (jwtUtils.getTokens as jest.Mock).mockReturnValue({ jwt: mockToken });

      await expect(rejectInvoice(mockGroupId, mockInvoiceId))
        .rejects.toThrow('Cannot reject invoice');
    });
  });
});
