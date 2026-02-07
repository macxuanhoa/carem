-- CreateTable
CREATE TABLE "XeMuaVao" (
    "id" SERIAL NOT NULL,
    "maXe" TEXT,
    "bienSo" TEXT,
    "soKhung" TEXT,
    "soMay" TEXT,
    "dongXe" TEXT NOT NULL,
    "namSanXuat" INTEGER NOT NULL,
    "mauXe" TEXT NOT NULL,
    "tinhTrang" INTEGER NOT NULL DEFAULT 90,
    "nguoiBan" TEXT NOT NULL,
    "tinhThanh" TEXT NOT NULL,
    "facebookLink" TEXT NOT NULL,
    "hinhAnh" TEXT NOT NULL DEFAULT '[]',
    "ngayThoaThuan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ngayCoc" TIMESTAMP(3),
    "soTienCoc" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tongGiaMua" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "soTienDaChuyen" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ngayHenGiao" TIMESTAMP(3),
    "nguoiGiuTien" TEXT,
    "daNhanXe" BOOLEAN NOT NULL DEFAULT false,
    "trangThai" TEXT NOT NULL DEFAULT 'TIM_THAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "XeMuaVao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XeBanRa" (
    "id" SERIAL NOT NULL,
    "xeMuaVaoId" INTEGER NOT NULL,
    "giaBan" DOUBLE PRECISION NOT NULL,
    "khachMua" TEXT NOT NULL,
    "ngayBan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daGiaoXe" BOOLEAN NOT NULL DEFAULT false,
    "daThuDuTien" BOOLEAN NOT NULL DEFAULT false,
    "trangThai" TEXT NOT NULL DEFAULT 'DANG_BAN',

    CONSTRAINT "XeBanRa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoSoXe" (
    "id" SERIAL NOT NULL,
    "xeMuaVaoId" INTEGER NOT NULL,
    "noiGiuHoSo" TEXT NOT NULL DEFAULT 'CHU_CU',
    "trangThai" TEXT NOT NULL DEFAULT 'CHUA_CAN',
    "ngayHenRut" TIMESTAMP(3),
    "hanCuoi" TIMESTAMP(3),
    "nguoiChiuTrachNhiem" TEXT,
    "ghiChu" TEXT,

    CONSTRAINT "HoSoXe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XeGopDauTu" (
    "id" SERIAL NOT NULL,
    "xeMuaVaoId" INTEGER NOT NULL,
    "nguoiGop" TEXT NOT NULL,
    "tyLeGop" DOUBLE PRECISION NOT NULL,
    "soTienGop" DOUBLE PRECISION NOT NULL,
    "daGop" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ngayBatDau" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trangThai" TEXT NOT NULL DEFAULT 'DANG_GOP',
    "laiLo" DOUBLE PRECISION,
    "daChiaTien" BOOLEAN NOT NULL DEFAULT false,
    "giayToLienQuan" TEXT,

    CONSTRAINT "XeGopDauTu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LichSuGopVon" (
    "id" SERIAL NOT NULL,
    "xeGopDauTuId" INTEGER NOT NULL,
    "soTien" DOUBLE PRECISION NOT NULL,
    "ngayNop" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ghiChu" TEXT,
    "hinhAnh" TEXT,

    CONSTRAINT "LichSuGopVon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChiPhiXe" (
    "id" SERIAL NOT NULL,
    "xeMuaVaoId" INTEGER,
    "loaiChiPhi" TEXT NOT NULL,
    "giaDuKien" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "giaThucTe" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nguoiBaoGia" TEXT NOT NULL,
    "nguoiDuyet" TEXT,
    "trangThai" TEXT NOT NULL DEFAULT 'CHO_DUYET',
    "ghiChu" TEXT,
    "anhHoaDon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChiPhiXe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GhiChuXe" (
    "id" SERIAL NOT NULL,
    "xeMuaVaoId" INTEGER NOT NULL,
    "noiDung" TEXT NOT NULL,
    "loaiGhiChu" TEXT NOT NULL DEFAULT 'KHAC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GhiChuXe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LichSuThayDoi" (
    "id" SERIAL NOT NULL,
    "xeMuaVaoId" INTEGER NOT NULL,
    "nguoiThucHien" TEXT NOT NULL,
    "hanhDong" TEXT NOT NULL,
    "chiTiet" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LichSuThayDoi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "XeMuaVao_maXe_key" ON "XeMuaVao"("maXe");

-- CreateIndex
CREATE UNIQUE INDEX "XeBanRa_xeMuaVaoId_key" ON "XeBanRa"("xeMuaVaoId");

-- CreateIndex
CREATE UNIQUE INDEX "HoSoXe_xeMuaVaoId_key" ON "HoSoXe"("xeMuaVaoId");

-- AddForeignKey
ALTER TABLE "XeBanRa" ADD CONSTRAINT "XeBanRa_xeMuaVaoId_fkey" FOREIGN KEY ("xeMuaVaoId") REFERENCES "XeMuaVao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoSoXe" ADD CONSTRAINT "HoSoXe_xeMuaVaoId_fkey" FOREIGN KEY ("xeMuaVaoId") REFERENCES "XeMuaVao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XeGopDauTu" ADD CONSTRAINT "XeGopDauTu_xeMuaVaoId_fkey" FOREIGN KEY ("xeMuaVaoId") REFERENCES "XeMuaVao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LichSuGopVon" ADD CONSTRAINT "LichSuGopVon_xeGopDauTuId_fkey" FOREIGN KEY ("xeGopDauTuId") REFERENCES "XeGopDauTu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiPhiXe" ADD CONSTRAINT "ChiPhiXe_xeMuaVaoId_fkey" FOREIGN KEY ("xeMuaVaoId") REFERENCES "XeMuaVao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GhiChuXe" ADD CONSTRAINT "GhiChuXe_xeMuaVaoId_fkey" FOREIGN KEY ("xeMuaVaoId") REFERENCES "XeMuaVao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LichSuThayDoi" ADD CONSTRAINT "LichSuThayDoi_xeMuaVaoId_fkey" FOREIGN KEY ("xeMuaVaoId") REFERENCES "XeMuaVao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
