/*
  Warnings:

  - You are about to drop the column `tourId` on the `TourPlace` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TourPlace" DROP CONSTRAINT "TourPlace_tourId_fkey";

-- AlterTable
ALTER TABLE "TourPlace" DROP COLUMN "tourId";
