/*
  Warnings:

  - The `hinhAnh` column on the `XeMuaVao` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "XeMuaVao" DROP COLUMN "hinhAnh",
ADD COLUMN     "hinhAnh" TEXT[] DEFAULT ARRAY[]::TEXT[];
