/*
  Warnings:

  - You are about to drop the `_likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_likes" DROP CONSTRAINT "_likes_A_fkey";

-- DropForeignKey
ALTER TABLE "_likes" DROP CONSTRAINT "_likes_B_fkey";

-- DropTable
DROP TABLE "_likes";
