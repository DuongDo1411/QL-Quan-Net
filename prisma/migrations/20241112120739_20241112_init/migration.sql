-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_computerId_fkey`;

-- AlterTable
ALTER TABLE `transaction` MODIFY `computerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_computerId_fkey` FOREIGN KEY (`computerId`) REFERENCES `Computer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
