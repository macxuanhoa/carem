import { describe, it, expect } from 'vitest'
import { formatCurrency, formatStatus } from '@/lib/utils'

describe('Utils', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000000)).toBe('1.000.000 đ')
    expect(formatCurrency(0)).toBe('0 đ')
  })

  it('should format status correctly', () => {
    expect(formatStatus('TIM_THAY')).toBe('Mới Về')
    expect(formatStatus('DA_BAN')).toBe('Đã Bán')
    expect(formatStatus('UNKNOWN_STATUS')).toBe('UNKNOWN STATUS')
  })
})
