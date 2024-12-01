/*
  Warnings:

  - A unique constraint covering the columns `[user_id,activity_id]` on the table `recent_activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recent_activity_user_id_activity_id_key" ON "recent_activity"("user_id", "activity_id");
