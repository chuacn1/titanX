<script>
	let { data } = $props();

	// Dropdown exercise name for existing exercises
	// Input name and drop down for muscle group for new exercises
	let exerciseData = $state({
		name: '',
		muscleGroup: ''
	});

	// Dropdown notes state
	let workoutSessionData = $state({
		notes: ''
	});

	// Input Session exercise data state
	let SessionExerciseData = $state({
		sets: '',
		reps: '',
		weight: '',
		sessionID: '',
		exerciseID: ''
	});

	// Collapsible section states
	let showCreateExercise = $state(false);
	let showCreateNotes = $state(false);

	// Display Total Volume
	function calculateVolume() {
		const sets = parseFloat(SessionExerciseData.sets) || 0;
		const reps = parseFloat(SessionExerciseData.reps) || 0;
		const weight = parseFloat(SessionExerciseData.weight) || 0;
		return sets * reps * weight;
	}

	function toggleCreateExercise() {
		showCreateExercise = !showCreateExercise;
	}

	function toggleCreateNotes() {
		showCreateNotes = !showCreateNotes;
	}
</script>

<section class = "add">
	<h2>ADD YOUR WORKOOUT</h2>
	<form method="POST" action="?/sessionExercise">
		<div class = "session-exercise">

			<label for="sessionID">Select a Note:</label>
			<select id="sessionID" name="sessionID" bind:value={SessionExerciseData.sessionID} required>
				{#each data.sessions as session}
					<option value={session.sessionID}
						>{session.notes || 'Session ' + session.sessionID}</option
					>
				{/each}
			</select>

			<label for="exerciseID">Exercise Name:</label>
			<select
				id="exerciseID"
				name="exerciseID"
				bind:value={SessionExerciseData.exerciseID}
				required>
				{#each data.exercises as exercise}
					<option value={exercise.exerciseID}>{exercise.name}</option>
				{/each}
			</select>

		</div>

		<div class = "workout">

		<div>
			<label for="sets">Sets:</label>
			<input type="number" id="sets" name="sets" bind:value={SessionExerciseData.sets} required />
		</div>

		<div>
			<label for="reps">Reps:</label>
			<input type="number" id="reps" name="reps" bind:value={SessionExerciseData.reps} required />
		</div>

		<div>
			<label for="weight">Weight:</label>
			<input
				type="number"
				id="weight"
				name="weight"
				bind:value={SessionExerciseData.weight}
				required
			/>
		</div>
	</div>


		<button type="submit">Add Workout</button>
	</form>
</section>
<p> {calculateVolume()} kg</p>


<section id="create">
	<!-- Create New Exercise - Collapsible -->
	<div class="collapsible-section">
		<button type="button" class="collapsible-header" onclick={toggleCreateExercise}>
			<h2>Create New Exercise</h2>
			<div class="toggle-icon">{showCreateExercise ? '−' : '+'}</div>
		</button>

		{#if showCreateExercise}
			<div class="collapsible-content">
				<form method="POST" action="?/exercise">
					<div>
						<label for="name">Exercise Name:</label>
						<input type="text" id="name" name="name" bind:value={exerciseData.name} required />
					</div>

					<div>
						<label for="muscleGroup">Muscle Group:</label>
						<select
							id="muscleGroup"
							name="muscleGroup"
							bind:value={exerciseData.muscleGroup}
							required
						>
							<option value="">Select Muscle Group</option>
							<option value="PUSH">Push</option>
							<option value="PULL">Pull</option>
							<option value="LEGS">Legs</option>
							<option value="ABS">Abs</option>
						</select>
					</div>

					<button type="submit">Create Exercise</button>
				</form>
			</div>
		{/if}
	</div>

	<!-- Create Notes - Collapsible -->
	<div class="collapsible-section">
		<button type="button" class="collapsible-header" onclick={toggleCreateNotes}>
			<h2>Create Workout Notes</h2>
			<div class="toggle-icon">{showCreateNotes ? '−' : '+'}</div>
		</button>

		{#if showCreateNotes}
			<div class="collapsible-content">
				<form method="POST" action="?/workoutSession">
					<div>
						<textarea
							id="notes"
							name="notes"
							bind:value={workoutSessionData.notes}
							placeholder="Notes for this workout..."
						></textarea>
					</div>

					<button type="submit">Add Notes</button>
				</form>
			</div>
		{/if}
	</div>
</section>

<style>
	
	.add{
		max-width: 1000px;
	}


	section {
		padding: 2rem;
		background: rgba(0, 0, 0, 0.6);
		border-radius: 12px;
		backdrop-filter: blur(8px);
		max-width: 600px;
		margin: auto; /* Centers horizontally */
	}

div{
	margin: auto; 
}

	h2 {
		color: white;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		font-size: 1.6em;
		margin-bottom: 5rem;
		letter-spacing: 1px;
		text-align: center;
		border-bottom: 2px solid rgba(255, 255, 255, 0.3);
		padding-bottom: 0.5rem;
	}

	form {
		display: flex;
		flex-direction: row;
	}



	label {
		display: block;
		color: #dc8400;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		font-size: 1.1em;

		margin-top: 0.8rem;
		letter-spacing: 0.5px;
	}

	input[type='text'],
	input[type='number'],
	select,
	textarea {
		padding: 1rem 1.2rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: white;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		font-size: 1em;
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	input[type='text']:focus,
	input[type='number']:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #dc8400;
		background: rgba(255, 255, 255, 0.15);
	}

	textarea {
		min-height: 100px;
	}

	button {
        background-color: #dc8400;
        color: #ffffff;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 400;
        transition: all 0.2s ease;

    }

	p {
		color: white;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		font-size: 1.3em;
		padding: 1.5rem;
		background: #f63e3b38;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		text-align: center;
		backdrop-filter: blur(5px);
		max-width: 1000px;
		margin: auto;
		margin-bottom: 2rem;
	}

	/* Collapsible Section Styles */
	.collapsible-section {
		margin-bottom: 1.5rem;
	}

	.collapsible-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(220, 132, 0, 0.3);
		border-radius: 8px;
		cursor: pointer;
		/* transition: all 0.3s ease; */
	}

	.collapsible-header:hover {
		background: rgba(0, 0, 0, 0.6);
		border-color: rgba(220, 132, 0, 0.6);
	}

	.collapsible-header h2 {
		margin: 0;
		border: none;
		text-align: left;
		font-size: 1.2em;
	}

	.toggle-icon {
		font-size: 1.5em;
		font-weight: bold;
		color: #fcfcfc70;
		
	}

	.collapsible-content {
		padding: 2rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0 0 8px 8px;
		border-top: none;
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Improved select dropdown styling */
	select {
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23dc8400' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 12px;
		padding-right: 3rem;
	}
</style>
