// src/routes/admin/+page.server.js
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ fetch, cookies, url }) => {
    try {
        const token = cookies.get('token');
        console.log('🔐 Fetching data with token:', token ? 'present' : 'missing');
        
        if (!token) {
            // Redirect to login if no token
            throw redirect(303, '/auth/login');
        }
        
        // Fetch current user data
        console.log('👤 Fetching current user data...');
        const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Current user response status:', userRes.status);
        
        if (userRes.status === 401) {
            // Clear invalid token and redirect to login
            cookies.delete('token', { path: '/' });
            throw redirect(303, '/auth/login');
        }
        
        if (!userRes.ok) {
            console.error('Failed to fetch current user:', userRes.status);
            // Continue without user data, but don't redirect
        }
        
        let currentUser = null;
        if (userRes.ok) {
            const userData = await userRes.json();
            currentUser = userData.data || userData;
            console.log('Current user:', currentUser?.username);
        }
        
        // Fetch users list (your existing code)
        console.log('📋 Fetching users list...');
        const usersRes = await fetch(`${API_BASE_URL}/api/users/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Users list response status:', usersRes.status);
        
        if (usersRes.status === 401) {
            cookies.delete('token', { path: '/' });
            throw redirect(302, '/login?redirect=' + url.pathname + '&message=session_expired');
        }
        
        if (!usersRes.ok) {
            const errorText = await usersRes.text();
            console.error('API Error fetching users:', errorText);
            throw new Error(`Failed to fetch users: ${usersRes.status}`);
        }
        
        const usersResponse = await usersRes.json();
        const users = usersResponse.data || usersResponse;
        console.log(`✅ Loaded ${users.length} users`);
        
        return { 
            users,
            username: currentUser?.username || 'Admin',
            user: currentUser, 
            error: null 
        };
    } catch (err) {
        if (err.status === 302) {
            throw err;
        }
        
        console.error('💥 Load function error:', err.message);
        return { 
            users: [], 
            username: 'Admin',
            user: null,
            error: err.message 
        };
    }
};

export const actions = {
    update: async ({ request, fetch, cookies }) => {
        console.log('🔄 UPDATE ACTION CALLED');
        
        const formData = await request.formData();
        const userId = formData.get('id');
        
        const updateData = {
            username: formData.get('username'),
            email: formData.get('email'),
            age: formData.get('age'),
            role: formData.get('role')
        };
        
        try {
            const token = cookies.get('token');
            
            const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API returned ${res.status}`);
            }
            
            const result = await res.json();
            
            return { 
                success: true,
                action: 'update',
                user: result.data || result
            };
        } catch (err) {
            console.error('Update action error:', err.message);
            return {
                success: false,
                error: err.message
            };
        }
    },
    
    delete: async ({ request, fetch, cookies }) => {
        console.log('🗑️ DELETE ACTION CALLED');
        
        const formData = await request.formData();
        const userId = formData.get('id');
        
        try {
            const token = cookies.get('token');
            
            const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API returned ${res.status}`);
            }
            
            return { 
                success: true,
                action: 'delete',
                deletedId: userId
            };
        } catch (err) {
            console.error('Delete action error:', err.message);
            return {
                success: false,
                error: err.message
            };
        }
    },
    
    logout: async ({ cookies }) => {
        console.log('🚪 LOGOUT ACTION CALLED');
        
        cookies.delete('token', { path: '/' });
        console.log('✅ Token cookie cleared');
        
        throw redirect(303, '/auth/login');
    }
}