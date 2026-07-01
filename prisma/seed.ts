import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // Xóa dữ liệu cũ (Tùy chọn, để reset data)
  await prisma.chiPhiXe.deleteMany();
  await prisma.hoSoXe.deleteMany();
  await prisma.xeBanRa.deleteMany();
  await prisma.xeGopDauTu.deleteMany();
  await prisma.xeMuaVao.deleteMany();
  await prisma.user.deleteMany();

  // --- 0. USERS ---
  // Secure Admin User
  await prisma.user.create({
      data: {
          username: 'carem92',
          password: '@', 
          name: 'Quản Trị Viên',
          role: 'ADMIN'
      }
  });

  // Default Staff User
  await prisma.user.create({
      data: {
          username: 'sale1',
          password: '123',
          name: 'Nhân Viên Sale',
          role: 'STAFF'
      }
  });

  // --- 1. XE SỐ ---
    await prisma.xeMuaVao.create({
        data: {
            dongXe: 'Honda Wave Alpha',
            namSanXuat: 2023,
            mauXe: 'Trắng',
            bienSo: '29E-123.45',
            nguoiBan: 'Nguyễn Văn A',
            tinhThanh: 'Hà Nội',
            facebookLink: 'https://fb.com/post/1',
            ngayThoaThuan: new Date('2023-11-01'),
            tongGiaMua: 15000000,
            soTienCoc: 2000000,
            trangThai: 'DA_BAN',
            hinhAnh: ['/uploads/1770447137114-506712983-wave.jpg'],
            banRa: {
                create: {
                    giaBan: 17500000,
                    khachMua: 'Trần Thị B',
                    daThuDuTien: true,
                    daGiaoXe: true,
                    ngayBan: new Date('2023-11-10')
                }
            },
            chiPhi: {
                create: [
                    { loaiChiPhi: 'Thay nhớt', giaDuKien: 100000, giaThucTe: 100000, nguoiBaoGia: 'Admin', trangThai: 'DA_DUYET' }
                ]
            }
        }
    });

    await prisma.xeMuaVao.create({
        data: {
            dongXe: 'Yamaha Sirius',
            namSanXuat: 2021,
            mauXe: 'Đen Nhám',
            bienSo: '59T-567.89',
            nguoiBan: 'Lê Văn C',
            tinhThanh: 'TP.HCM',
            facebookLink: 'https://fb.com/post/2',
            ngayThoaThuan: new Date(), // Mới nhập
            tongGiaMua: 12000000,
            soTienCoc: 1000000,
            trangThai: 'XE_DA_VE',
            hinhAnh: ['/uploads/1770447139604-364954473-shmode.jpg'],
            hoSo: {
                create: {
                    trangThai: 'DANG_RUT',
                    noiGiuHoSo: 'CHU_CU',
                    nguoiChiuTrachNhiem: 'Sale 1'
                }
            }
        }
    });

    // --- 2. XE TAY GA ---
    await prisma.xeMuaVao.create({
        data: {
            dongXe: 'Honda Vision',
            namSanXuat: 2022,
            mauXe: 'Xanh Coban',
            bienSo: '30H-999.99',
            nguoiBan: 'Phạm Thị D',
            tinhThanh: 'Hải Phòng',
            facebookLink: 'https://fb.com/post/3',
            ngayThoaThuan: new Date('2023-10-15'),
            tongGiaMua: 32000000,
            soTienCoc: 5000000,
            trangThai: 'DANG_BAN',
            hinhAnh: ['/uploads/1770447127740-867969079-vision.jpg'],
            hoSo: {
                create: {
                    trangThai: 'DA_RUT',
                    noiGiuHoSo: 'CUA_HANG',
                    nguoiChiuTrachNhiem: 'Admin'
                }
            },
            chiPhi: {
                create: [
                    { loaiChiPhi: 'Sơn lại yếm', giaDuKien: 500000, giaThucTe: 0, nguoiBaoGia: 'Staff', trangThai: 'CHO_DUYET' }
                ]
            }
        }
    });

    await prisma.xeMuaVao.create({
        data: {
            dongXe: 'Honda SH 150i',
            namSanXuat: 2023,
            mauXe: 'Xám Xi Măng',
            bienSo: '29P-888.88',
            nguoiBan: 'Hoàng Văn E',
            tinhThanh: 'Hà Nội',
            facebookLink: 'https://fb.com/post/4',
            ngayThoaThuan: new Date('2023-09-01'), // Tồn kho lâu
            tongGiaMua: 95000000,
            soTienCoc: 10000000,
            trangThai: 'XE_DA_VE',
            hinhAnh: ['/uploads/1770449423010-642536159-shmode.jpg'],
            hoSo: {
                create: {
                    trangThai: 'QUA_HAN', // Cảnh báo
                    noiGiuHoSo: 'CONG_AN',
                    hanCuoi: new Date('2023-10-01'),
                    nguoiChiuTrachNhiem: 'Sale 2'
                }
            },
            gopVon: {
                create: [
                    { nguoiGop: 'Nhà đầu tư X', tyLeGop: 50, soTienGop: 47500000, daGop: 47500000, trangThai: 'DANG_GOP' }
                ]
            }
        }
    });

    await prisma.xeMuaVao.create({
        data: {
            dongXe: 'Piaggio Liberty',
            namSanXuat: 2020,
            mauXe: 'Trắng',
            bienSo: '14B-111.22',
            nguoiBan: 'Ngô Thị F',
            tinhThanh: 'Quảng Ninh',
            facebookLink: 'https://fb.com/post/5',
            ngayThoaThuan: new Date('2023-11-05'),
            tongGiaMua: 28000000,
            soTienCoc: 3000000,
            trangThai: 'DA_COC',
            hinhAnh: ['/uploads/1770447137114-506712983-wave.jpg'],
            hoSo: {
                create: {
                    trangThai: 'CHUA_CO',
                    noiGiuHoSo: 'CHU_CU',
                    nguoiChiuTrachNhiem: 'Sale 1'
                }
            }
        }
    });

    // --- 3. XE CÔN TAY ---
    await prisma.xeMuaVao.create({
        data: {
            dongXe: 'Yamaha Exciter 155',
            namSanXuat: 2023,
            mauXe: 'Xanh GP',
            bienSo: '60F-222.33',
            nguoiBan: 'Đặng Văn G',
            tinhThanh: 'Đồng Nai',
            facebookLink: 'https://fb.com/post/6',
            ngayThoaThuan: new Date('2023-11-12'),
            tongGiaMua: 42000000,
            soTienCoc: 4000000,
            trangThai: 'CHO_GIAO_XE',
            hinhAnh: [
                '/uploads/Yamaha Exciter 155/Exciter-155-VVA-Red-Standard_004-768x645.webp',
                '/uploads/Yamaha Exciter 155/Exciter-155VVA-Pre-Black-Gold-004-768x576.webp',
                '/uploads/Yamaha Exciter 155/Exciter-155VVA-Pre-GP-004-1-768x576.webp'
            ]
        }
    });

    await prisma.xeMuaVao.create({
        data: {
            dongXe: 'Honda Winner X',
            namSanXuat: 2022,
            mauXe: 'Đỏ Đen',
            bienSo: '36K-444.55',
            nguoiBan: 'Bùi Văn H',
            tinhThanh: 'Thanh Hóa',
            facebookLink: 'https://fb.com/post/7',
            ngayThoaThuan: new Date('2023-10-20'),
            tongGiaMua: 35000000,
            soTienCoc: 3500000,
            trangThai: 'DANG_BAN',
            hinhAnh: [
                '/uploads/Honda Winner X/5pmobl4qqtnfofnm1mbq-171989121752.jpg',
                '/uploads/Honda Winner X/7trwrlqvqb7le17mcl67-171989100676.jpg',
                '/uploads/Honda Winner X/b4ypoebadbyiywkvhraa-171989093756.jpg',
                '/uploads/Honda Winner X/image.png',
                '/uploads/Honda Winner X/images.jpg',
                '/uploads/Honda Winner X/jqq1zfxkkaqsyzxqcaz8-171989097439.jpg',
                '/uploads/Honda Winner X/ju3wjeahzhl8nou8au6o-171989117857.jpg',
                '/uploads/Honda Winner X/sloo3iqc09nntjld86gg-171989108374.jpg'
            ],
            chiPhi: {
                create: [
                    { loaiChiPhi: 'Thay nhông sên dĩa', giaDuKien: 800000, giaThucTe: 800000, nguoiBaoGia: 'Admin', trangThai: 'DA_DUYET' },
                    { loaiChiPhi: 'Rửa xe chi tiết', giaDuKien: 150000, giaThucTe: 0, nguoiBaoGia: 'Staff', trangThai: 'CHO_DUYET' }
                ]
            }
        }
    });

  console.log('✅ Seeding finished with Real Motorbike Data.');
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
