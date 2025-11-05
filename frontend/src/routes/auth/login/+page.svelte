<!-- /src/routes/auth/login/+page.svelte -->
<script>
	let { form } = $props();
</script>

<div class="login-wrapper">
	<div class="login-backdrop">
		<h1>LOGIN</h1>

		<form method="POST" action="?/login" class="login-form">
			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					name="email"
					type="text"
					value={form?.email ?? ''}
					placeholder="abc@gmail.com"
					class="form-input"
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					value={form?.password ?? ''}
					class="form-input"
				/>
			</div>

			{#if form?.success === false}
			<div class="message error">
				<p>{form.error}</p>
			</div>
		{/if}
			<div class="signup">
				<p>Don't have an account? <a href="/auth/register">Sign up here</a></p>
			</div>

			<button type="submit" class="submit-btn">Login</button>
		</form>

	</div>
</div>

<style>
	.login-wrapper {
		display: grid;
		place-items: center;
		height: 80vh;
	}

	.login-backdrop {
		max-width: 500px;
		width: 100%;
		padding: 3em 2.5em;

		background: rgba(0, 0, 0, 0.582);
		backdrop-filter: blur(12px);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	h1 {
		font-size: 2.2em;
		margin-bottom: 1.5em;
		font-weight: 700;
		text-transform: uppercase;
		color: #00112d;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		letter-spacing: 5px;
		text-align: center;
	}

	.form-group {
		margin-bottom: 3em;
	}

	label {
		display: block;
		margin-bottom: 0.5em;
		color: #dc8400;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		font-size: 1.1em;
	}

	.form-input {
		width: 100%;
		padding: 1em 0.4em; 
		border-radius: 8px;
		color: rgb(0, 0, 0);
		font-size: 1em;
		transition: all 0.3s ease;
		backdrop-filter: blur(5px);
	}

	.submit-btn {
		width: 100%;
		padding: 0.8em;
		background: linear-gradient(135deg, #cba365, #b36900);
		color: black;
		border-radius: 6px;
		font-size: 1.2em;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		text-transform: uppercase;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: 0.8em;
	}

	.submit-btn:hover {
		background: linear-gradient(135deg, #c1985b, #c47800);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(220, 132, 0, 0.3);
	}

	.message.error {
		color: #f64a4a;
		text-align: center;
		padding: 0;
		margin: 0;
		font-size: 1.1em;
	}

	.signup {
        text-align: center;
        margin-top: 2em;
        padding-top: 1.2em;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .signup p {
        color: rgba(255, 255, 255, 0.8);
        font-family: 'Palatino Linotype', 'Book Antiqua', serif;
        font-size: 1.1em;
        margin: 0;
    }

    .signup a {
        color: #dc8400;
        margin-left: 0.5em;
        transition: all 0.3s ease;
    }

    .signup a:hover {
        color: #ffffff;
        text-shadow: 0 0 8px rgba(220, 132, 0, 0.5);
    }

</style>
