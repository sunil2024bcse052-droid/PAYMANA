-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "requestedRole" "Role",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
