/*
  Warnings:

  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
