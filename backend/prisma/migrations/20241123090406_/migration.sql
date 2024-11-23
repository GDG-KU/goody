/*
  Warnings:

  - You are about to drop the column `location` on the `activity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activity_id,location_name]` on the table `activity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `location_name` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activity_id` to the `activity_location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activity" DROP COLUMN "location",
ADD COLUMN     "location_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "activity_location" ADD COLUMN     "activity_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "activity_activity_id_location_name_key" ON "activity"("activity_id", "location_name");

-- AddForeignKey
ALTER TABLE "activity_location" ADD CONSTRAINT "activity_location_activity_id_name_fkey" FOREIGN KEY ("activity_id", "name") REFERENCES "activity"("activity_id", "location_name") ON DELETE RESTRICT ON UPDATE CASCADE;
