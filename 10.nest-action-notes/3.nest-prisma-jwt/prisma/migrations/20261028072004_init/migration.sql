-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(80) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userdetail" (
    "id" SERIAL NOT NULL,
    "hobby" JSONB NOT NULL,
    "status" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "userdetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userdetail_userId_key" ON "userdetail"("userId");

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userdetail" ADD CONSTRAINT "userdetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
