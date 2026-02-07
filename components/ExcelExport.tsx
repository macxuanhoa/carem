'use client';

import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatCurrency, formatStatus } from '@/lib/utils';

interface ExcelExportProps {
  data: any[];
  fileName?: string;
}

export default function ExcelExport({ data, fileName = 'danh-sach-xe' }: ExcelExportProps) {
  const handleExport = () => {
    // 1. Transform data for Excel friendly format
    const exportData = data.map((item, index) => ({
      'STT': index + 1,
      'Dòng Xe': item.dongXe,
      'Biển Số': item.bienSo || 'Chưa có',
      'Năm SX': item.namSanXuat,
      'Màu Xe': item.mauXe,
      'Trạng Thái': formatStatus(item.trangThai),
      'Giá Mua': item.tongGiaMua,
      'Tiền Cọc': item.soTienCoc,
      'Người Bán': item.nguoiBan,
      'Tỉnh Thành': item.tinhThanh,
      'Ngày Nhập': new Date(item.createdAt).toLocaleDateString('vi-VN'),
      'Hồ Sơ': formatStatus(item.hoSo?.trangThai || 'CHUA_CAN'),
    }));

    // 2. Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 3. Customize Column Widths
    const wscols = [
        { wch: 5 },  // STT
        { wch: 20 }, // Dong Xe
        { wch: 15 }, // Bien So
        { wch: 8 },  // Nam SX
        { wch: 10 }, // Mau Xe
        { wch: 15 }, // Trang Thai
        { wch: 15 }, // Gia Mua
        { wch: 15 }, // Tien Coc
        { wch: 15 }, // Nguoi Ban
        { wch: 15 }, // Tinh Thanh
        { wch: 12 }, // Ngay Nhap
        { wch: 15 }, // Ho So
    ];
    worksheet['!cols'] = wscols;

    // 4. Create Workbook and Append Sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh Sách Xe');

    // 5. Write File
    XLSX.writeFile(workbook, `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm active:scale-95"
    >
      <FileSpreadsheet size={16} />
      <span>Xuất Excel</span>
    </button>
  );
}
