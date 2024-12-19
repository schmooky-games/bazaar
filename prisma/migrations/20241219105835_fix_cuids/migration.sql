/*
  Warnings:

  - The primary key for the `Auction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Bid` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "GenerateId" AS ENUM ('cuid2');

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_auctionId_fkey";

-- AlterTable
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Auction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "auctionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bid_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
