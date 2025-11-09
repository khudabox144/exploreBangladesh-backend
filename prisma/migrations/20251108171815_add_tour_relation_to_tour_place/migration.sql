-- AlterTable
ALTER TABLE "TourPlace" ADD COLUMN     "tourId" INTEGER;

-- AddForeignKey
ALTER TABLE "TourPlace" ADD CONSTRAINT "TourPlace_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE SET NULL ON UPDATE CASCADE;
