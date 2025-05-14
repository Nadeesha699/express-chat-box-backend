-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_conversationId_fkey`;

-- DropIndex
DROP INDEX `message_conversationId_fkey` ON `message`;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
