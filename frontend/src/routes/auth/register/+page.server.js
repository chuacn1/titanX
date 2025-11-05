import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const actions = {
  // @ts-ignore
  register: async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const age = formData.get("age");
    const role = formData.get("role");
    const user = { username, email, password, age, role };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        return fail(409, {
          success: false,
          error: data.message,
          errors: data.errors,
          username,
          email,
          age,
          password,
          role,
        });
      }

      throw redirect(303, '/auth/login');

    } catch (err) {
      // @ts-ignore
      if (err.status === 303) {
        throw err; 
      }
      return fail(500, {
        success: false,
        // @ts-ignore
        error: err.message,
        username,
        email,
        age,
        password,
        role,
      });
    }
  },
};