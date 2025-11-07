-- CreateTable
CREATE TABLE "TourPlaceReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tourPlaceId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TourPlaceReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TourPlaceReview" ADD CONSTRAINT "TourPlaceReview_tourPlaceId_fkey" FOREIGN KEY ("tourPlaceId") REFERENCES "TourPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
