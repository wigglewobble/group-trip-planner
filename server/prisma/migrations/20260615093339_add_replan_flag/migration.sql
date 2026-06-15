-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "needsReplan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replanReason" TEXT;
