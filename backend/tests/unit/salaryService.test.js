// Purpose: Unit Tests for Piece-Rate Payroll & Salary Calculation Service
// Path: backend/tests/unit/salaryService.test.js

const mongoose = require('mongoose');
const salaryService = require('../../src/services/SalaryService');
const SalaryRepository = require('../../src/repositories/SalaryRepository');
const WorkerRepository = require('../../src/repositories/WorkerRepository');
const Assignment = require('../../src/models/Assignment');
const Ledger = require('../../src/models/Ledger');

// Mock external dependencies
jest.mock('../../src/repositories/SalaryRepository', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndContractor: jest.fn(),
  findByWorker: jest.fn(),
  markAsPaid: jest.fn()
}));

jest.mock('../../src/repositories/WorkerRepository', () => ({
  findByIdAndContractor: jest.fn()
}));

jest.mock('../../src/models/Assignment');
jest.mock('../../src/models/Ledger');

const generateObjectId = () => new mongoose.Types.ObjectId().toString();

describe('SalaryService - Unit Tests', () => {
  const mockTenantId = generateObjectId();
  const mockWorkerId = generateObjectId();

  const mockWorker = {
    _id: mockWorkerId,
    contractorId: mockTenantId,
    name: 'Test Stitcher',
    phone: '+1234567890',
    role: 'STITCHER',
    status: 'ACTIVE'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateSalary()', () => {
    it('should accurately calculate piece-rate earnings, net salary, and create draft salary slip', async () => {
      WorkerRepository.findByIdAndContractor.mockImplementation((id, tenant) => {
        if (id === mockWorkerId && tenant === mockTenantId) {
          return Promise.resolve(mockWorker);
        }
        return Promise.resolve(null);
      });

      const mockAssignments = [
        {
          contractorId: mockTenantId,
          workerId: mockWorkerId,
          orderId: generateObjectId(),
          operation: 'STITCHING',
          assignedQuantity: 100,
          completedQuantity: 100,
          ratePerPiece: 12.5,
          totalAmount: 1250,
          status: 'COMPLETED'
        },
        {
          contractorId: mockTenantId,
          workerId: mockWorkerId,
          orderId: generateObjectId(),
          operation: 'HEMMING',
          assignedQuantity: 200,
          completedQuantity: 200,
          ratePerPiece: 5.0,
          totalAmount: 1000,
          status: 'COMPLETED'
        }
      ];

      Assignment.find.mockResolvedValue(mockAssignments);

      const payrollInput = {
        workerId: mockWorkerId,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-07-31'),
        bonus: 250,
        deductions: 100,
        notes: 'Monthly July 2026 payroll'
      };

      const expectedSalarySlip = {
        _id: generateObjectId(),
        contractorId: mockTenantId,
        workerId: mockWorkerId,
        periodStart: payrollInput.startDate,
        periodEnd: payrollInput.endDate,
        pieceRateEarnings: 2250,
        bonus: 250,
        deductions: 100,
        netSalary: 2400,
        paymentStatus: 'PENDING'
      };

      SalaryRepository.create.mockResolvedValue(expectedSalarySlip);

      const salarySlip = await salaryService.calculateSalary(payrollInput, mockTenantId);

      expect(salarySlip).toBeDefined();
      expect(salarySlip.workerId.toString()).toBe(mockWorkerId);
      expect(salarySlip.pieceRateEarnings).toBe(2250);
      expect(salarySlip.bonus).toBe(250);
      expect(salarySlip.deductions).toBe(100);
      expect(salarySlip.netSalary).toBe(2400);
      expect(salarySlip.paymentStatus).toBe('PENDING');
    });

    it('should throw an error if worker does not belong to contractor tenant', async () => {
      const wrongTenantId = generateObjectId();

      WorkerRepository.findByIdAndContractor.mockResolvedValue(null);

      const payrollInput = {
        workerId: mockWorkerId,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-07-31')
      };

      await expect(
        salaryService.calculateSalary(payrollInput, wrongTenantId)
      ).rejects.toThrow('Worker not found under this contractor');
    });
  });

  describe('paySalary()', () => {
    it('should mark salary as PAID and log corresponding DEBIT transaction in ledger', async () => {
      const mockSalaryId = generateObjectId();
      const mockSalarySlip = {
        _id: mockSalaryId,
        contractorId: mockTenantId,
        workerId: mockWorkerId,
        netSalary: 2050,
        paymentStatus: 'PENDING',
        save: jest.fn().mockResolvedValue(true)
      };

      SalaryRepository.findById.mockResolvedValue(mockSalarySlip);

      const mockLedgerEntry = {
        _id: generateObjectId(),
        contractorId: mockTenantId,
        referenceId: mockSalaryId,
        type: 'DEBIT',
        amount: 2050,
        category: 'SALARY'
      };

      Ledger.create.mockResolvedValue(mockLedgerEntry);
      Ledger.findOne.mockResolvedValue(mockLedgerEntry);

      const updatedSlip = await salaryService.paySalary(
        mockSalaryId,
        { paymentMethod: 'BANK_TRANSFER', referenceNumber: 'TXN-998811' },
        mockTenantId
      );

      expect(updatedSlip.paymentStatus).toBe('PAID');
      expect(updatedSlip.paidAt).toBeDefined();

      const ledgerEntry = await Ledger.findOne({
        contractorId: mockTenantId,
        referenceId: mockSalaryId
      });

      expect(ledgerEntry).toBeDefined();
      expect(ledgerEntry.type).toBe('DEBIT');
      expect(ledgerEntry.amount).toBe(2050);
      expect(ledgerEntry.category).toBe('SALARY');
    });

    it('should throw error when attempting to pay an already paid salary slip', async () => {
      const mockSalaryId = generateObjectId();
      const mockSalarySlip = {
        _id: mockSalaryId,
        contractorId: mockTenantId,
        workerId: mockWorkerId,
        netSalary: 1000,
        paymentStatus: 'PAID'
      };

      SalaryRepository.findById.mockResolvedValue(mockSalarySlip);

      await expect(
        salaryService.paySalary(
          mockSalaryId,
          { paymentMethod: 'CASH' },
          mockTenantId
        )
      ).rejects.toThrow('Salary slip has already been paid');
    });
  });
});