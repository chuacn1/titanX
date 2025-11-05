import express from 'express';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import progressRoutes from './routes/progress.js';
import workoutSessionRoutes from './routes/workoutSession.js';
import exerciseRoutes from './routes/exercise.js';
import sessionExerciseRoutes from './routes/sessionExercise.js';

import isContentTypeApplicationJSON from './middleware/utils.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/workout-sessions", workoutSessionRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/session-exercise", sessionExerciseRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. Visit http://localhost:${PORT}`);
    }
);

export default app;