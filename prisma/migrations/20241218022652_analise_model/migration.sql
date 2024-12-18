-- CreateTable
CREATE TABLE "analise" (
    "id" SERIAL NOT NULL,
    "fileLength" INTEGER NOT NULL,
    "textLength" INTEGER NOT NULL,

    CONSTRAINT "analise_pkey" PRIMARY KEY ("id")
);
