/*
  Warnings:

  - You are about to drop the `analise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "analise";

-- CreateTable
CREATE TABLE "messagesOfMounth" (
    "id" SERIAL NOT NULL,
    "mounthName" TEXT NOT NULL,

    CONSTRAINT "messagesOfMounth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analiseUserMessage" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "fileLength" INTEGER NOT NULL,
    "textLength" INTEGER NOT NULL,
    "analiseUserMessageId" INTEGER NOT NULL,

    CONSTRAINT "analiseUserMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "analiseUserMessage" ADD CONSTRAINT "analiseUserMessage_analiseUserMessageId_fkey" FOREIGN KEY ("analiseUserMessageId") REFERENCES "messagesOfMounth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
