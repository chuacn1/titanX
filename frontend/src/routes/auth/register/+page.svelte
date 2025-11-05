<!-- /src/routes/auth/register/+page.svelte -->
<script>
	let { form } = $props();
</script>

<div class="register-wrapper">
	<div class="register-backdrop">
		<h1>REGISTER</h1>

		<form method="POST" action="?/register" class="register-form">
			<div class="form-group">
				<label for="username">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					value={form?.username ?? ''}
					placeholder="Enter username"
					class="form-input"
				/>
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
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
					placeholder="Enter password"
					class="form-input"
				/>
			</div>

			<div class="form-group">
				<label for="age">Age</label>
				<select id="age" name="age" class="form-input">
					<option value="">Select age</option>
					{#each Array.from({ length: 100 }, (_, i) => i + 1) as age}
						<option value={age} selected={form?.age ? +form.age === age : false}>
							{age}
						</option>
					{/each}
				</select>
			</div>

			<div class="form-group">
				<label for="role">Role</label>
				<select id="role" name="role" class="form-input">
					<option value="ADMIN" selected={form?.role === 'ADMIN'}>Admin</option>
					<option value="NORMAL" selected={form?.role === 'NORMAL'}>Normal</option>
				</select>
			</div>

			{#if form?.success === false}
				<div class="message error">
					<p>{form.error}</p>
				</div>
			{/if}

			<button type="submit" class="submit-btn">Register</button>
		</form>
	</div>
</div>

<style>
	.register-wrapper {
		display: grid;
		place-items: center;
		height: 80vh;
	}

	.register-backdrop {
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
		font-weight: 500;
		text-transform: uppercase;
		color: #dc8400;
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
		border: 1px solid #ccc;
		background: white;
	}

	/* Style for select dropdowns */
	.form-input:focus {
		outline: none;
		border-color: #dc8400;
		box-shadow: 0 0 5px rgba(220, 132, 0, 0.5);
	}

	.submit-btn {
		width: 100%;
		padding: 0.8em;
		background: linear-gradient(135deg, #dc8400, #b36900);
		color: black;
		border: none;
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
		background: linear-gradient(135deg, #e89310, #c47800);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(220, 132, 0, 0.3);
	}

	.message.error {
		color: #f64a4a;
		text-align: center;
		padding: 0;
		margin: 0 0 1em 0;
		font-size: 1.1em;
	}
</style>
