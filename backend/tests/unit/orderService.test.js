// Purpose: Unit Tests for Garment Production Order Service Business Logic
// Path: backend/tests/unit/orderService.test.js

const orderService = require('../../src/services/orderService');
const OrderRepository = require('../../src/repositories/OrderRepository');
const CompanyRepository = require('../../src/repositories/CompanyRepository');
const AuditLogRepository = require('../../src/repositories/AuditLogRepository');
const mongoose = require('mongoose');

jest.mock('../../src/repositories/OrderRepository');
jest.mock('../../src/repositories/CompanyRepository');
jest.mock('../../src/repositories/AuditLogRepository');

const generateObjectId = () => new mongoose.Types.ObjectId().toString();

describe('OrderService - Unit Tests', () => {
  const mockTenantId = generateObjectId();
  const mockCompanyId = generateObjectId();
  const mockClothId = generateObjectId();

  const mockOrderData = {
    orderNumber: 'ORD-2026-001',
    companyId: mockCompanyId,
    garmentType: 'SHIRT',
    quantity: 500,
    unitPrice: 15.5,
    totalAmount: 7750,
    clothId: mockClothId,
    estimatedMetersRequired: 1200,
    deadline: new Date('2026-08-31'),
    notes: 'Urgent summer shirt batch'
  };

  const mockCompany = {
    _id: mockCompanyId,
    contractorId: mockTenantId,
    name: 'Test Apparel Co.'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    CompanyRepository.findByIdAndContractor.mockResolvedValue(mockCompany);
    AuditLogRepository.logEvent.mockResolvedValue(true);
  });

  describe('createOrder()', () => {
    it('should successfully create a new job order under contractor scope', async () => {
      const mockCreatedOrder = {
        _id: generateObjectId(),
        ...mockOrderData,
        contractorId: mockTenantId,
        status: 'PENDING'
      };

      OrderRepository.findByOrderNumber.mockResolvedValue(null);
      OrderRepository.create.mockResolvedValue(mockCreatedOrder);

      const order = await orderService.createOrder(mockOrderData, mockTenantId);

      expect(order).toBeDefined();
      expect(order.orderNumber).toBe(mockOrderData.orderNumber);
      expect(order.status).toBe('PENDING');
    });

    it('should throw an error if duplicate order number is used for same contractor', async () => {
      OrderRepository.findByOrderNumber.mockResolvedValue({ _id: generateObjectId() });

      await expect(
        orderService.createOrder(mockOrderData, mockTenantId)
      ).rejects.toThrow('Job order with this order number already exists');
    });
  });

  describe('getContractorOrders()', () => {
    it('should retrieve orders exclusively belonging to the specified contractor', async () => {
      OrderRepository.findByContractor.mockResolvedValue({
        orders: [{ ...mockOrderData, contractorId: mockTenantId }],
        total: 1
      });

      const tenantOrders = await orderService.getContractorOrders(mockTenantId, {});

      expect(tenantOrders).toBeDefined();
      expect(OrderRepository.findByContractor).toHaveBeenCalledWith(mockTenantId, {});
    });
  });

  describe('updateOrderStatus()', () => {
    it('should update status when transition is valid', async () => {
      const mockOrderId = generateObjectId();
      const existingOrder = {
        _id: mockOrderId,
        status: 'PENDING',
        contractorId: mockTenantId
      };

      const updatedOrder = {
        ...existingOrder,
        status: 'IN_PROGRESS'
      };

      OrderRepository.findByIdAndContractor.mockResolvedValue(existingOrder);
      OrderRepository.updateStatus.mockResolvedValue(updatedOrder);

      const updated = await orderService.updateOrderStatus(
        mockOrderId,
        'IN_PROGRESS',
        mockTenantId
      );

      expect(updated).toBeDefined();
      expect(updated.status).toBe('IN_PROGRESS');
    });

    it('should throw an error when attempting invalid status transition', async () => {
      const mockOrderId = generateObjectId();
      const existingOrder = {
        _id: mockOrderId,
        status: 'PENDING',
        contractorId: mockTenantId
      };

      OrderRepository.findByIdAndContractor.mockResolvedValue(existingOrder);

      await expect(
        orderService.updateOrderStatus(mockOrderId, 'COMPLETED', mockTenantId)
      ).rejects.toThrow('Invalid order status transition');
    });
  });
});