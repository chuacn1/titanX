import { redirect, error } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
    const token = cookies.get('token');
    
    if (!token) {
        throw redirect(302, '/auth/login');
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/me', {
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
