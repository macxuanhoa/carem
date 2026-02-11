
import { describe, it, expect } from 'vitest';
import { carSchema, expenseSchema, investorSchema } from '@/lib/schemas';

describe('Zod Schemas Validation', () => {
  
  describe('Car Schema', () => {
    it('should validate valid car data', () => {
      const validCar = {
        dongXe: 'Honda SH 150i',
        namSanXuat: 2023,
        mauXe: 'Trắng',
        tongGiaMua: 85000000,
        soTienCoc: 5000000,
        trangThai: 'TIM_THAY'
      };
      const result = carSchema.safeParse(validCar);
      expect(result.success).toBe(true);
    });

    it('should reject invalid car data (missing required fields)', () => {
      const invalidCar = {
        dongXe: '', // Empty string
        namSanXuat: 1800, // Too old
        tongGiaMua: -100 // Negative price
      };
      const result = carSchema.safeParse(invalidCar);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.dongXe).toBeDefined();
        expect(errors.namSanXuat).toBeDefined();
        expect(errors.mauXe).toBeDefined(); // Missing
        expect(errors.tongGiaMua).toBeDefined();
      }
    });
  });

  describe('Expense Schema', () => {
    it('should validate valid expense', () => {
      const validExpense = {
        loaiChiPhi: 'Sửa chữa',
        giaDuKien: 500000,
        nguoiBaoGia: 'Staff A'
      };
      const result = expenseSchema.safeParse(validExpense);
      expect(result.success).toBe(true);
    });

    it('should reject negative price', () => {
      const invalidExpense = {
        loaiChiPhi: 'Sửa chữa',
        giaDuKien: -50000,
        nguoiBaoGia: 'Staff A'
      };
      const result = expenseSchema.safeParse(invalidExpense);
      expect(result.success).toBe(false);
    });
  });

  describe('Investor Schema', () => {
    it('should validate valid investor', () => {
      const validInvestor = {
        nguoiGop: 'Investor B',
        soTienGop: 10000000,
        tyLeGop: 10
      };
      const result = investorSchema.safeParse(validInvestor);
      expect(result.success).toBe(true);
    });

    it('should reject invalid percentage', () => {
      const invalidInvestor = {
        nguoiGop: 'Investor B',
        soTienGop: 10000000,
        tyLeGop: 150 // > 100
      };
      const result = investorSchema.safeParse(invalidInvestor);
      expect(result.success).toBe(false);
    });
  });

});
