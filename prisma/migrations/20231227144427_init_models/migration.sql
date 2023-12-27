-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appointment" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
