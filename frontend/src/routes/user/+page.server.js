import { redirect } from '@sveltejs/kit';

export const actions = {
    logout: async ({ cookies }) => {
        cookies.delete('token', { path: '/' });
        throw redirect(303, '/auth/login');
    }
};