/*
  Warnings:

  - The `birthday` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3);
