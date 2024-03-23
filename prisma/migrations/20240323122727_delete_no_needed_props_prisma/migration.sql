/*
  Warnings:

  - You are about to drop the column `appointment` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "appointment",
DROP COLUMN "phone",
DROP COLUMN "rank";
