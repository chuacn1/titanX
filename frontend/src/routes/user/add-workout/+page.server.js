import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000" || env.API_BASE_URL_DEPLOY;

// LOAD function - runs when page loads, fetches existing exercises for dropdown
// @ts-ignore
export async function load({ fetch, cookies }) {
    console.log('🔍 LOAD FUNCTION STARTED');
    const token = cookies.get("token");
    console.log('🔑 Token from cookies:', token ? 'Present' : 'Missing');
    
    // Fetch muscle groups along with your other data
    console.log('📡 Starting API calls...');
    const [exRes, sessionRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/exercises`, {
            headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/workout-sessions/my-notes`, {
            headers: { Authorization: `Bearer ${token}` }
        })
    ]);

    console.log('📊 API Responses received:', {
        exercisesStatus: exRes.status,
        sessionsStatus: sessionRes.status
    });

    let exercises = [];
    let sessions = [];

    if (exRes.ok) {
        const exData = await exRes.json();
        exercises = exData.data || [];
        console.log('🏋️ Exercises fetched:', exercises.length);
    } else {
        console.log('❌ Failed to fetch exercises:', exRes.status);
    }

    if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        sessions = sessionData.data || [];
        console.log('📅 Sessions fetched:', sessions.length);
    } else {
        console.log('❌ Failed to fetch sessions:', sessionRes.status);
    }

    console.log('✅ LOAD FUNCTION COMPLETED');
    return { 
        exercises, 
        sessions 
    };
}

export const actions = {
    // Action to add a new exercise
    // @ts-ignore
    exercise: async ({ request, cookies }) => {
        console.log('🎯 EXERCISE ACTION TRIGGERED');
        const token = cookies.get("token");
        console.log('🔑 Token for exercise action:', token ? 'Present' : 'Missing');

        // Check authentication first
        if (!token) {
            console.log('❌ Authentication failed in exercise action');
            return fail(401, {
                success: false,
                error: "Not authenticated"
            });
        }

        const formData = await request.formData();
        const name = formData.get("name");
        const muscleGroup = formData.get("muscleGroup");
        const exercise = { name, muscleGroup };

        console.log('📝 Form data received:', { name, muscleGroup });

        if (!name) {
            console.log('❌ Validation failed: Exercise name missing');
            return fail(400, {
                success: false,
                error: "Exercise name is required",
                name,
                muscleGroup
            });
        }

        if (!muscleGroup) {
            console.log('❌ Validation failed: Muscle group missing');
            return fail(400, {
                success: false,
                error: "Muscle group is required",
                name,
                muscleGroup
            });
        }

        console.log('📤 Sending exercise to API:', exercise);
        let res, data;
        try {
            res = await fetch(`${API_BASE_URL}/api/exercises`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(exercise)
            });
            data = await res.json();
            console.log('📥 API Response for exercise:', { status: res.status, data });
        } catch (err) {
            console.log('❌ Fetch error in exercise action:', err);
            return fail(500, {
                success: false,
                // @ts-ignore
                error: err.message,
                name,
                muscleGroup,
            });
        }

        if (!res.ok) {
            console.log('❌ API error in exercise action:', res.status, data);
            return fail(res.status, {
                success: false,
                error: data.message,
                name,
                muscleGroup
            });
        }

        console.log('✅ Exercise created successfully');
        return { success: true, message: data.message, exercise: data.data };
    },
    
    // Action to add a new workout session
    // @ts-ignore
    workoutSession: async ({ request, cookies }) => {
        console.log('🎯 WORKOUT SESSION ACTION TRIGGERED');
        const token = cookies.get("token");
        console.log('🔑 Token for workout session:', token ? 'Present' : 'Missing');
        
        // Check authentication first
        if (!token) {
            console.log('❌ Authentication failed in workout session action');
            return fail(401, {
                success: false,
                error: "Not authenticated"
            });
        }

        const formData = await request.formData();
        const notes = formData.get("notes")?.toString().trim() || null;
        const workoutSession = { notes };
        
        console.log('📝 Workout Session Form data received:', { notes });
        
        console.log('📤 Sending workout session to API:', workoutSession);
        let res, data;
        try {
            res = await fetch(`${API_BASE_URL}/api/workout-sessions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(workoutSession)
            });
            data = await res.json();
            console.log('📥 API Response for workout session:', { status: res.status, data });
        } catch (err) {
            console.log('❌ Fetch error in workout session action:', err);
            return fail(500, {
                success: false,
                // @ts-ignore
                error: err.message,
                notes
            });
        }

        if (!res.ok) {
            console.log('❌ API error in workout session action:', res.status, data);
            return fail(res.status, {
                success: false,
                error: data.message,
                notes
            });
        }

        console.log('✅ Workout session created successfully');
        return { success: true, message: data.message, workoutSession: data.data };
    },

    // Action to add a session exercise
    // @ts-ignore
    sessionExercise: async ({ request, cookies }) => {
        console.log('🎯 SESSION EXERCISE ACTION TRIGGERED');
        const token = cookies.get("token");
        console.log('🔑 Token for session exercise:', token ? 'Present' : 'Missing');
    
        if (!token) {
            console.log('❌ Authentication failed in session exercise action');
            return fail(401, {
                success: false,
                error: "Not authenticated"
            });
        }
    
        const formData = await request.formData();
        console.log('📋 Raw FormData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value);
        }

        // Convert FormDataEntryValue to string first
        const sets = formData.get("sets")?.toString() || '';
        const reps = formData.get("reps")?.toString() || '';
        const weight = formData.get("weight")?.toString() || '';
        const sessionID = formData.get("sessionID")?.toString() || '';
        const exerciseID = formData.get("exerciseID")?.toString() || '';
    
        // DEBUG: Log exactly what we're sending
        console.log('🔍 DEBUG - Form data parsed:', {
            sets, reps, weight, sessionID, exerciseID
        });
    
        // VALIDATION: Check if dropdowns are selected
        if (!sessionID) {
            console.log('❌ Validation failed: sessionID missing');
            return fail(400, {
                success: false,
                error: "Please select a workout session",
                sets, reps, weight, sessionID, exerciseID
            });
        }

        if (!exerciseID) {
            console.log('❌ Validation failed: exerciseID missing');
            return fail(400, {
                success: false,
                error: "Please select an exercise",
                sets, reps, weight, sessionID, exerciseID
            });
        }
    
        // Convert to numbers for your Joi schema
        const sessionExercise = { 
            sets: parseInt(sets), 
            reps: parseInt(reps), 
            weight: parseFloat(weight), 
            sessionID: parseInt(sessionID),
            exerciseID: parseInt(exerciseID)
        };

        console.log('🔢 Converted numeric values:', sessionExercise);
    
        // Validate numeric conversions
        if (isNaN(sessionExercise.sets) || isNaN(sessionExercise.reps) || isNaN(sessionExercise.weight)) {
            console.log('❌ Numeric conversion failed:', {
                sets: sessionExercise.sets,
                reps: sessionExercise.reps,
                weight: sessionExercise.weight
            });
            return fail(400, {
                success: false,
                error: "Sets, reps, and weight must be valid numbers",
                sets, reps, weight, sessionID, exerciseID
            });
        }
    
        console.log('📨 DEBUG - Final object being sent to API:', sessionExercise);
    
        let res, data;
        try {
            console.log('🚀 Making API call to:', `${API_BASE_URL}/api/session-exercise`);
            res = await fetch(`${API_BASE_URL}/api/session-exercise`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(sessionExercise)
            });
            data = await res.json();
            
            console.log('📥 API Response received:', {
                status: res.status,
                statusText: res.statusText,
                data: data
            });
            
        } catch (err) {
            console.log('❌ Fetch error in session exercise action:', err);
            // @ts-ignore
            console.log('Error details:', err.message);
            return fail(500, {
                success: false,
                // @ts-ignore
                error: err.message,
                sets, reps, weight, sessionID, exerciseID
            });
        }
    
        if (!res.ok) {
            console.log('❌ API returned error status:', res.status);
            console.log('Error response data:', data);
            return fail(res.status, {
                success: false,
                error: data.message || 'Unknown error',
                sets, reps, weight, sessionID, exerciseID
            });
        }

        console.log('✅ Session exercise created successfully, redirecting to /user/progress');
        redirect(303, "/user/progress");
    }
};