import { redirect } from "@sveltejs/kit";

const API_BASE_URL = "https://titanx-ptq6.onrender.com" ||"http://localhost:3000" ;

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