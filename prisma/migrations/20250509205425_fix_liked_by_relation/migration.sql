/*
  Warnings:

  - Made the column `content` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserLikedComments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "UserLikedComments_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "UserLikedComments_A_idx" ON "UserLikedComments"("A");

-- CreateIndex
CREATE INDEX "UserLikedComments_B_idx" ON "UserLikedComments"("B");
