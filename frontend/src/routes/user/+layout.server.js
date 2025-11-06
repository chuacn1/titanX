import { redirect, error } from '@sveltejs/kit';
import { env } from "$env/dynamic/private";

const API_BASE_URL = env.API_BASE_URL_DEPLOY || "https://titanx-ptq6.onrender.com" || env.API_BASE_URL || "http://localhost:3000" ;


export async function load({ cookies, fetch }) {
    const token = cookies.get('token');
    
    if (!token) {
        throw redirect(302, '/auth/login');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            cookies.delete('token', { path: '/' });
            throw redirect(302, '/auth/login');
        }

        if (!response.ok) {
            throw error(response.status, 'Failed to fetch user data');
        }

        const data = await response.json();
        
        return {
            username: data.data.username || 'User' // Note: data.data based on your API response
        };
    } catch (err) {
        // @ts-ignore
        if (err.status === 302) {
            throw err;
        }
        throw error(500, 'Failed to load user data');
    }
}
