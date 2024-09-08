-- CreateTable
CREATE TABLE "USer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fristname" TEXT NOT NULL,
    "lastname" TEXT,

    CONSTRAINT "USer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USer_email_key" ON "USer"("email");
