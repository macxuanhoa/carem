-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- AlterTable
ALTER TABLE "XeMuaVao" ADD COLUMN     "nguonGoc" TEXT DEFAULT 'MUA_DAN',
ADD COLUMN     "soDienThoai" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "ChiPhiXe_trangThai_idx" ON "ChiPhiXe"("trangThai");

-- CreateIndex
CREATE INDEX "HoSoXe_trangThai_idx" ON "HoSoXe"("trangThai");

-- CreateIndex
CREATE INDEX "XeBanRa_ngayBan_idx" ON "XeBanRa"("ngayBan");

-- CreateIndex
CREATE INDEX "XeMuaVao_trangThai_idx" ON "XeMuaVao"("trangThai");

-- CreateIndex
CREATE INDEX "XeMuaVao_createdAt_idx" ON "XeMuaVao"("createdAt");

-- CreateIndex
CREATE INDEX "XeMuaVao_dongXe_idx" ON "XeMuaVao"("dongXe");

-- CreateIndex
CREATE INDEX "XeMuaVao_bienSo_idx" ON "XeMuaVao"("bienSo");
