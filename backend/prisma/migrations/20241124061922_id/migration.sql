/*
  Warnings:

  - The primary key for the `activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activity_id` on the `activity` table. All the data in the column will be lost.
  - The primary key for the `activity_keywords` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `activity_location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `location_id` on the `activity_location` table. All the data in the column will be lost.
  - The primary key for the `keyword` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `keyword_id` on the `keyword` table. All the data in the column will be lost.
  - The primary key for the `recent_activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recent_activity_id` on the `recent_activity` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `user` table. All the data in the column will be lost.
  - The primary key for the `user_location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_location_id` on the `user_location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,location_name]` on the table `activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activity_id,keyword_id]` on the table `activity_keywords` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_user_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_keywords" DROP CONSTRAINT "activity_keywords_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_keywords" DROP CONSTRAINT "activity_keywords_keyword_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_location" DROP CONSTRAINT "activity_location_activity_id_name_fkey";

-- DropForeignKey
ALTER TABLE "recent_activity" DROP CONSTRAINT "recent_activity_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "recent_activity" DROP CONSTRAINT "recent_activity_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_location" DROP CONSTRAINT "user_location_user_id_fkey";

-- DropIndex
DROP INDEX "activity_activity_id_location_name_key";

-- AlterTable
ALTER TABLE "activity" DROP CONSTRAINT "activity_pkey",
DROP COLUMN "activity_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "activity_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "activity_keywords" DROP CONSTRAINT "activity_keywords_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "activity_keywords_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "activity_location" DROP CONSTRAINT "activity_location_pkey",
DROP COLUMN "location_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "activity_location_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "keyword" DROP CONSTRAINT "keyword_pkey",
DROP COLUMN "keyword_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "keyword_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "recent_activity" DROP CONSTRAINT "recent_activity_pkey",
DROP COLUMN "recent_activity_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "recent_activity_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_location" DROP CONSTRAINT "user_location_pkey",
DROP COLUMN "user_location_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_location_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_id_location_name_key" ON "activity"("id", "location_name");

-- CreateIndex
CREATE UNIQUE INDEX "activity_keywords_activity_id_keyword_id_key" ON "activity_keywords"("activity_id", "keyword_id");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_keywords" ADD CONSTRAINT "activity_keywords_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_keywords" ADD CONSTRAINT "activity_keywords_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "keyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_location" ADD CONSTRAINT "activity_location_activity_id_name_fkey" FOREIGN KEY ("activity_id", "name") REFERENCES "activity"("id", "location_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_location" ADD CONSTRAINT "user_location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_activity" ADD CONSTRAINT "recent_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_activity" ADD CONSTRAINT "recent_activity_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
