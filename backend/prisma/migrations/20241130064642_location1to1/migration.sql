/*
  Warnings:

  - A unique constraint covering the columns `[activity_id]` on the table `activity_location` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "activity_location" DROP CONSTRAINT "activity_location_activity_id_name_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "activity_location_activity_id_key" ON "activity_location"("activity_id");

-- AddForeignKey
ALTER TABLE "activity_location" ADD CONSTRAINT "activity_location_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
