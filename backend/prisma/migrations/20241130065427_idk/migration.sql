/*
  Warnings:

  - The primary key for the `activity_location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `activity_location` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "activity_location_activity_id_key";

-- AlterTable
ALTER TABLE "activity_location" DROP CONSTRAINT "activity_location_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "activity_location_pkey" PRIMARY KEY ("activity_id");
