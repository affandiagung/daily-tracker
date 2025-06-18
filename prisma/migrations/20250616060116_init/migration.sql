/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `surat` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Target` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `DailyLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TargetParticipant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Target` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('PENDING', 'DONE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "DailyLog" DROP CONSTRAINT "DailyLog_targetId_fkey";

-- DropForeignKey
ALTER TABLE "DailyLog" DROP CONSTRAINT "DailyLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "TargetParticipant" DROP CONSTRAINT "TargetParticipant_targetId_fkey";

-- DropForeignKey
ALTER TABLE "TargetParticipant" DROP CONSTRAINT "TargetParticipant_userId_fkey";

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "createdBy",
DROP COLUMN "surat",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "DailyLog";

-- DropTable
DROP TABLE "TargetParticipant";

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'PENDING',
    "memberId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TargetMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TargetMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Progress_date_memberId_targetId_key" ON "Progress"("date", "memberId", "targetId");

-- CreateIndex
CREATE INDEX "_TargetMembers_B_index" ON "_TargetMembers"("B");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TargetMembers" ADD CONSTRAINT "_TargetMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TargetMembers" ADD CONSTRAINT "_TargetMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Target"("id") ON DELETE CASCADE ON UPDATE CASCADE;
