-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('INVITED', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "TripMember" ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'INVITED';
