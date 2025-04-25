/*
  Warnings:

  - You are about to drop the column `profileId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_profileId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "profileId";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "photo";
