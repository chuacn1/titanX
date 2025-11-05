/*
  Warnings:

  - You are about to drop the column `date` on the `WorkoutSession` table. All the data in the column will be lost.
  - You are about to drop the `SessionWorkout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SessionWorkout" DROP CONSTRAINT "SessionWorkout_exerciseID_fkey";

-- DropForeignKey
ALTER TABLE "public"."SessionWorkout" DROP CONSTRAINT "SessionWorkout_sessionID_fkey";

-- AlterTable
ALTER TABLE "public"."WorkoutSession" DROP COLUMN "date";

-- DropTable
DROP TABLE "public"."SessionWorkout";

-- CreateTable
CREATE TABLE "public"."SessionExercise" (
    "sessionExerciseID" SERIAL NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "sessionID" INTEGER NOT NULL,
    "exerciseID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionExercise_pkey" PRIMARY KEY ("sessionExerciseID")
);

-- AddForeignKey
ALTER TABLE "public"."SessionExercise" ADD CONSTRAINT "SessionExercise_sessionID_fkey" FOREIGN KEY ("sessionID") REFERENCES "public"."WorkoutSession"("sessionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SessionExercise" ADD CONSTRAINT "SessionExercise_exerciseID_fkey" FOREIGN KEY ("exerciseID") REFERENCES "public"."Exercise"("exerciseID") ON DELETE CASCADE ON UPDATE CASCADE;
