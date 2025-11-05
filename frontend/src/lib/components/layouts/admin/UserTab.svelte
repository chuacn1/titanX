<script>
	let { users = [] } = $props();

	// Reactive state for editing
	let editingUser = $state();
	let editForm = $state({
		username: '',
		email: '',
		age: '',
		role: 'NORMAL'
	});

	let errorMessage = $state('');
	let successMessage = $state('');

	function confirmDelete(username) {
		return confirm(
			`Are you sure you want to delete user "${username}"? This action cannot be undone.`
		);
	}

	function startEdit(user) {
		console.log('🔄 Starting edit for user:', $state.snapshot(user));
		editingUser = user;
		editForm.username = user.username;
		editForm.email = user.email;
		editForm.age = user.age.toString(); // Ensure age is string
		editForm.role = user.role;
	}

	function cancelEdit() {
		console.log('❌ Canceling edit');
		editingUser = null;
		editForm.username = '';
		editForm.email = '';
		editForm.age = '';
		editForm.role = 'NORMAL';
	}

	async function saveEdit() {
		console.log('💾 Starting saveEdit function');
		console.log('📝 Edit form data:', $state.snapshot(editForm));
		console.log('👤 Editing user ID:', editingUser?.id);

		try {
			const formData = new FormData();
			formData.append('id', editingUser.id);
			formData.append('username', editForm.username);
			formData.append('email', editForm.email);
			formData.append('age', editForm.age);
			formData.append('role', editForm.role);

			const response = await fetch('?/update', {
				method: 'POST',
				body: formData
			});

			console.log(' Response status:', response.status);
			console.log(' Response ok:', response.ok);

			const result = await response.json();
			console.log('📄 Response JSON:', result);

            if (result.type === 'success' || result.success === true) {
            console.log('🎉 Update completed successfully:', result);
            
            // Update the user in the local users array without having to refresh after closing the edit form
            users = users.map(user => {
                if (user.id === editingUser.id) {
                    return {
                        ...user,
                        username: editForm.username,
                        email: editForm.email,
                        age: editForm.age, 
                        role: editForm.role
                    };
                }
                return user;
            });
            // Close the edit form
            cancelEdit();
			} else {
				console.log('❌ Update failed. Raw response:', result);
			}
		} catch (err) {
			console.log(' Error message:', err.message);
		}
	}

	async function deleteUser(user) {
		console.log('🗑️ Attempting to delete user:', $state.snapshot(user));
		if (!confirmDelete(user.username)) {
			console.log('Delete canceled by user');
			return;
		}

		try {
			const formData = new FormData();
			formData.append('id', user.id);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			console.log('📡 Delete response status:', response.status);
			const result = await response.json();
			console.log('📄 Delete response JSON:', result);

			if (result.type === 'success' || result.success === true) {
				console.log('✅ Delete successful, updating local state');
				// Remove from local users array
				users = users.filter((u) => u.id !== user.id);

			} else {
				console.log('Delete failed with error:', errorMessage);
			}
		} catch (err) {
			console.log('Exception during delete:', err);
		}
	}
</script>

<div class="card-body">
	<!-- Users Table -->
	<div class="table-responsive">
		<table class="table table-striped">
			<thead>
				<tr>
					<th>Username</th>
					<th>Email</th>
					<th>Age</th>
					<th>Role</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if users.length === 0}
					<tr>
						<td colspan="5" class="text-center text-muted py-4"> No users found </td>
					</tr>
				{:else}
					{#each users as user (user.id)}
						{#if editingUser?.id === user.id}
							<!-- Edit Row -->
							<tr>
								<td>
									<input
										type="text"
										class="form-control form-control-sm"
										bind:value={editForm.username}
									/>
								</td>
								<td>
									<input
										type="email"
										class="form-control form-control-sm"
										bind:value={editForm.email}
									/>
								</td>
								<td>
									<input
										type="number"
										class="form-control form-control-sm"
										bind:value={editForm.age}
									/>
								</td>
								<td>
									<select class="form-select form-select-sm" bind:value={editForm.role}>
										<option value="NORMAL">NORMAL</option>
										<option value="ADMIN">ADMIN</option>
									</select>
								</td>
								<td>
									<button type="button" class="btn btn-sm btn-success me-1" onclick={saveEdit}>
										Save
									</button>
									<button type="button" class="btn btn-sm btn-secondary" onclick={cancelEdit}>
										Cancel
									</button>
								</td>
							</tr>
						{:else}
							<!-- Read-only Row -->
							<tr>
								<td>{user.username}</td>
								<td>{user.email}</td>
								<td>{user.age}</td>
								<td>
									<span class="badge {user.role === 'ADMIN' ? 'bg-warning' : 'bg-secondary'}">
										{user.role}
									</span>
								</td>
								<td>
									<button
										class="btn btn-sm btn-outline-primary me-1"
										onclick={() => startEdit(user)}
									>
										Edit
									</button>
									<button
										type="button"
										class="btn btn-sm btn-outline-danger"
										onclick={() => deleteUser(user)}
									>
										Delete
									</button>
								</td>
							</tr>
						{/if}
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
