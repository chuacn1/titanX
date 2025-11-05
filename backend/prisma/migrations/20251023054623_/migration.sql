-- CreateEnum
CREATE TYPE "public"."MuscleGroup" AS ENUM ('PUSH', 'PULL', 'LEGS', 'ABS');

-- CreateTable
CREATE TABLE "public"."Progress" (
    "progressID" SERIAL NOT NULL,
    "totalVolume" DOUBLE PRECISION NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("progressID")
);

-- CreateTable
CREATE TABLE "public"."WorkoutSession" (
    "sessionID" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "id" TEXT NOT NULL,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("sessionID")
);

-- CreateTable
CREATE TABLE "public"."Exercise" (
    "exerciseID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroup" "public"."MuscleGroup" NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("exerciseID")
);

-- CreateTable
CREATE TABLE "public"."SessionWorkout" (
    "sessionWorkoutID" SERIAL NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "sessionID" INTEGER NOT NULL,
    "exerciseID" INTEGER NOT NULL,

    CONSTRAINT "SessionWorkout_pkey" PRIMARY KEY ("sessionWorkoutID")
);

-- AddForeignKey
ALTER TABLE "public"."Progress" ADD CONSTRAINT "Progress_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkoutSession" ADD CONSTRAINT "WorkoutSession_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SessionWorkout" ADD CONSTRAINT "SessionWorkout_sessionID_fkey" FOREIGN KEY ("sessionID") REFERENCES "public"."WorkoutSession"("sessionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SessionWorkout" ADD CONSTRAINT "SessionWorkout_exerciseID_fkey" FOREIGN KEY ("exerciseID") REFERENCES "public"."Exercise"("exerciseID") ON DELETE CASCADE ON UPDATE CASCADE;
