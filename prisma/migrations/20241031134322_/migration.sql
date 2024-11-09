/*
  Warnings:

  - You are about to drop the `pricing` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pricing` to the `Computer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `computer` ADD COLUMN `pricing` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `pricing`;
