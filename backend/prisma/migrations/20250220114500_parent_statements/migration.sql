-- AlterTable
ALTER TABLE "Statement" ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Statement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
