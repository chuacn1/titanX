import { redirect } from '@sveltejs/kit';
import { env } from "$env/dynamic/private";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000" || env.API_BASE_URL_DEPLOY || "https://titanx-ptq6.onrender.com";


export const actions = {
    logout: async ({ cookies, locals }) => {
        cookies.delete('token', { 
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        
        locals.user = null;
        throw redirect(303, '/auth/login');
    }
};

export async function load({ fetch, cookies }) {
    const quotesUrl = "https://dummyjson.com/quotes";
    const token = cookies.get('token');
    
    try {
        // Fetch quotes
        const quotesResponse = await fetch(quotesUrl); 
        const quotes = quotesResponse.ok ? await quotesResponse.json() : { quotes: [] };
        
        // Fetch user data if token exists
        let username = 'User';
        if (token) {
            try {
                // Replace with your actual user endpoint
                const userResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    username = userData.data?.name || userData.data?.username || 'User';
                }
            } catch (userError) {
                console.error("Error fetching user data:", userError);
            }
        }
        
        return { 
            quotes,
            username 
        };
        
    } catch (error) {
        console.error("Error in load function:", error);
        return { 
            quotes: { quotes: [] },
            username: 'User'
        };
    }
}