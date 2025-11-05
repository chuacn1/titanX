import { redirect, error } from '@sveltejs/kit';
import { env } from "$env/dynamic/private";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000" || env.API_BASE_URL_DEPLOY || "https://titanx-ptq6.onrender.com";

export async function load({ cookies, fetch }) {
    const token = cookies.get('token');
    
    if (!token) {
        throw redirect(302, '/auth/login');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/progress/muscle-group/summary`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw error(response.status, 'Failed to fetch progress data');
        }

        const result = await response.json();
        
        return {
            exerciseData: result.data || {}
        };
    } catch (err) {
        throw error(500, 'Failed to load progress data');
    }
}