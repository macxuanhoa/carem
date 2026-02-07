import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding 10 popular Vietnamese motorbikes...');

  // Reset database (Optional, caution in production)
  try {
    await prisma.chiPhiXe.deleteMany();
    await prisma.hoSoXe.deleteMany();
    await prisma.xeBanRa.deleteMany();
    await prisma.xeGopDauTu.deleteMany();
    await prisma.lichSuThayDoi.deleteMany();
    await prisma.xeMuaVao.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Old data cleared.');
  } catch (error) {
    console.log('⚠️  Could not clear old data (maybe tables not exist), proceeding...');
  }

  // --- 0. USERS ---
  await prisma.user.create({
      data: {
          username: 'admin',
          password: '123',
          name: 'Chủ Cửa Hàng',
          role: 'ADMIN'
      }
  });

  await prisma.user.create({
      data: {
          username: 'sale',
          password: '123',
          name: 'Nhân Viên Sale',
          role: 'STAFF'
      }
  });

  // --- 1. Honda Vision (Quốc dân) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Honda Vision',
      namSanXuat: 2023,
      mauXe: 'Xám Xi Măng',
      bienSo: '29E1-567.89',
      nguoiBan: 'Nguyễn Thùy Linh',
      tinhThanh: 'Hà Nội',
      facebookLink: 'https://facebook.com/marketplace/item/1',
      ngayThoaThuan: new Date('2024-01-15'),
      tongGiaMua: 34500000,
      soTienCoc: 5000000,
      soTienDaChuyen: 34500000,
      daNhanXe: true,
      trangThai: 'DANG_BAN',
      tinhTrang: 98,
      hinhAnh: JSON.stringify([
        "https://cdn.honda.com.vn/motorbike-versions/December2022/Vision_Thethao_Xamden.png",
        "https://img.websosanh.vn/v2/users/review/images/4w0p6q5w5z5z5.jpg"
      ]),
      hoSo: {
        create: {
          trangThai: 'DA_RUT',
          noiGiuHoSo: 'CUA_HANG',
          nguoiChiuTrachNhiem: 'Admin'
        }
      }
    }
  });

  // --- 2. Honda Air Blade 160 (Nam tính) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Honda Air Blade 160',
      namSanXuat: 2023,
      mauXe: 'Đen Nhám',
      bienSo: '59T1-999.99',
      nguoiBan: 'Trần Văn Hùng',
      tinhThanh: 'TP.HCM',
      facebookLink: 'https://facebook.com/marketplace/item/2',
      ngayThoaThuan: new Date('2024-02-01'),
      tongGiaMua: 52000000,
      soTienCoc: 10000000,
      trangThai: 'DANG_BAN',
      tinhTrang: 95,
      hinhAnh: JSON.stringify([
        "https://cdn.honda.com.vn/motorbike-versions/May2022/AB160_Dacbiet_XanhXamDen.png"
      ]),
      chiPhi: {
        create: [
          { loaiChiPhi: 'Dán keo trong', giaDuKien: 400000, giaThucTe: 350000, nguoiBaoGia: 'Sale', trangThai: 'DA_DUYET' }
        ]
      }
    }
  });

  // --- 3. Honda SH 150i (Sang chảnh) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Honda SH 150i',
      namSanXuat: 2022,
      mauXe: 'Trắng Ngọc Trai',
      bienSo: '30H1-888.88',
      nguoiBan: 'Lê Hoàng Nam',
      tinhThanh: 'Hà Nội',
      facebookLink: 'https://facebook.com/marketplace/item/3',
      ngayThoaThuan: new Date('2024-01-20'),
      tongGiaMua: 98000000,
      soTienCoc: 20000000,
      trangThai: 'DA_COC',
      tinhTrang: 99,
      hinhAnh: JSON.stringify([
        "https://cdn.honda.com.vn/motorbike-versions/July2023/SH160i_Caocap_TrangDen.png"
      ]),
      gopVon: {
        create: [
          { nguoiGop: 'Anh Tuấn', tyLeGop: 50, soTienGop: 49000000, daGop: 49000000, trangThai: 'DANG_GOP' }
        ]
      }
    }
  });

  // --- 4. Yamaha Exciter 155 (Vua đường phố) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Yamaha Exciter 155 VVA',
      namSanXuat: 2023,
      mauXe: 'Xanh GP',
      bienSo: '60F1-123.45',
      nguoiBan: 'Phạm Minh Khôi',
      tinhThanh: 'Đồng Nai',
      facebookLink: 'https://facebook.com/marketplace/item/4',
      ngayThoaThuan: new Date('2024-02-10'),
      tongGiaMua: 44000000,
      soTienCoc: 5000000,
      trangThai: 'DANG_BAN',
      tinhTrang: 92,
      hinhAnh: JSON.stringify([
        "https://yamaha-motor.com.vn/wp-content/uploads/2023/09/Exciter-155-VVA-GP-Blue-004.png"
      ]),
      hoSo: {
        create: {
          trangThai: 'DANG_RUT',
          noiGiuHoSo: 'CONG_AN',
          ngayHenRut: new Date('2024-03-01'),
          nguoiChiuTrachNhiem: 'Sale'
        }
      }
    }
  });

  // --- 5. Honda Winner X (Đối thủ Ex) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Honda Winner X',
      namSanXuat: 2022,
      mauXe: 'Đỏ Đen',
      bienSo: '36B1-456.78',
      nguoiBan: 'Bùi Tiến Dũng',
      tinhThanh: 'Thanh Hóa',
      facebookLink: 'https://facebook.com/marketplace/item/5',
      ngayThoaThuan: new Date('2024-01-05'),
      tongGiaMua: 32000000,
      soTienCoc: 3000000,
      trangThai: 'DA_BAN',
      tinhTrang: 88,
      hinhAnh: JSON.stringify([
        "https://cdn.honda.com.vn/motorbike-versions/December2021/WinnerX_Thethao_DoDen.png"
      ]),
      banRa: {
        create: {
          giaBan: 36000000,
          khachMua: 'Hoàng Văn Thụ',
          daThuDuTien: true,
          daGiaoXe: true,
          ngayBan: new Date('2024-01-25')
        }
      }
    }
  });

  // --- 6. Honda Lead 125 (Cốp rộng) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Honda Lead 125',
      namSanXuat: 2021,
      mauXe: 'Vàng Kem',
      bienSo: '51G1-777.77',
      nguoiBan: 'Đỗ Mỹ Linh',
      tinhThanh: 'TP.HCM',
      facebookLink: 'https://facebook.com/marketplace/item/6',
      ngayThoaThuan: new Date('2024-02-15'),
      tongGiaMua: 38000000,
      soTienCoc: 0,
      trangThai: 'TIM_THAY',
      tinhTrang: 90,
      hinhAnh: JSON.stringify([
        "https://cdn.honda.com.vn/motorbike-versions/September2022/Lead_Dacbiet_Bac.png"
      ])
    }
  });

  // --- 7. Honda Wave Alpha (Giá rẻ) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Honda Wave Alpha',
      namSanXuat: 2024,
      mauXe: 'Trắng',
      bienSo: '18B1-222.22',
      nguoiBan: 'Vũ Văn Thanh',
      tinhThanh: 'Nam Định',
      facebookLink: 'https://facebook.com/marketplace/item/7',
      ngayThoaThuan: new Date('2024-02-20'),
      tongGiaMua: 16500000,
      soTienCoc: 2000000,
      trangThai: 'XE_DA_VE',
      tinhTrang: 99,
      hinhAnh: JSON.stringify([
        "https://cdn.honda.com.vn/motorbike-versions/July2023/WaveAlpha_TieuChuan_Trang.png"
      ])
    }
  });

  // --- 8. Yamaha Sirius (Bền bỉ) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Yamaha Sirius FI',
      namSanXuat: 2020,
      mauXe: 'Đen Nhám',
      bienSo: '37C1-333.33',
      nguoiBan: 'Hồ Quang Hiếu',
      tinhThanh: 'Nghệ An',
      facebookLink: 'https://facebook.com/marketplace/item/8',
      ngayThoaThuan: new Date('2024-01-10'),
      tongGiaMua: 14000000,
      soTienCoc: 1000000,
      trangThai: 'DANG_BAN',
      tinhTrang: 85,
      hinhAnh: JSON.stringify([
        "https://yamaha-motor.com.vn/wp-content/uploads/2021/08/Sirius-Fi-RC-Black-004.png"
      ]),
      chiPhi: {
        create: [
          { loaiChiPhi: 'Thay nhớt + Lọc gió', giaDuKien: 200000, giaThucTe: 180000, nguoiBaoGia: 'Staff', trangThai: 'DA_DUYET' }
        ]
      }
    }
  });

  // --- 9. Vespa Sprint (Thời trang) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Vespa Sprint 125',
      namSanXuat: 2022,
      mauXe: 'Vàng',
      bienSo: '43D1-555.55',
      nguoiBan: 'Nguyễn Ngọc Nữ',
      tinhThanh: 'Đà Nẵng',
      facebookLink: 'https://facebook.com/marketplace/item/9',
      ngayThoaThuan: new Date('2024-01-25'),
      tongGiaMua: 68000000,
      soTienCoc: 10000000,
      trangThai: 'DANG_BAN',
      tinhTrang: 97,
      hinhAnh: JSON.stringify([
        "https://www.vespa.com/pixel/400x300/e5425c3c-8a0b-426d-933e-005d5d368e7d/Sprint-125-Yellow.png"
      ])
    }
  });

  // --- 10. Yamaha Grande (Tiết kiệm xăng) ---
  await prisma.xeMuaVao.create({
    data: {
      dongXe: 'Yamaha Grande Hybrid',
      namSanXuat: 2023,
      mauXe: 'Đỏ Mận',
      bienSo: '65E1-888.99',
      nguoiBan: 'Lê Thị Hồng',
      tinhThanh: 'Cần Thơ',
      facebookLink: 'https://facebook.com/marketplace/item/10',
      ngayThoaThuan: new Date('2024-02-05'),
      tongGiaMua: 41000000,
      soTienCoc: 4000000,
      trangThai: 'DANG_BAN',
      tinhTrang: 96,
      hinhAnh: JSON.stringify([
        "https://yamaha-motor.com.vn/wp-content/uploads/2022/09/Grande-Blue-Core-Hybrid-Limited-Red-004.png"
      ]),
      hoSo: {
        create: {
          trangThai: 'CHUA_CAN',
          noiGiuHoSo: 'CHU_CU'
        }
      }
    }
  });

  console.log('✅ Seeding 10 motorbikes completed successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });