<script>
    let { exerciseData = {} } = $props();
    
    let currentMuscleGroup = $state('PUSH');

    const muscleGroups = ['PUSH', 'PULL', 'LEGS', 'ABS'];
    
    function switchMuscleGroup(group) {
        currentMuscleGroup = group;
    }
    
    // Use derived signals instead of reactive statements
    const currentData = $derived(exerciseData[currentMuscleGroup] || {});
    const exercises = $derived(Object.keys(currentData));
</script>

<div>
    <!-- Muscle Group Buttons -->
    <div class="muscle-group-buttons">
        {#each muscleGroups as group}
            <button 
                class="muscle-group-button {currentMuscleGroup === group ? 'active' : ''}"
                onclick={() => switchMuscleGroup(group)}
            >
                {group}
            </button>
        {/each}
    </div>

    <!-- Data Table -->
    <div>
        {#if exercises.length > 0}
            {#each exercises as exercise}
                <div class="exercise-section">

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Volume</th>
                                <th>Sets</th>
                                <th>Max Weight</th>
                                <th>Total Reps</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each currentData[exercise] as entry}
                                <tr>
                                    <td>{entry.date}</td>
                                    <td>{entry.totalVolume}</td>
                                    <td>{entry.sets}</td>
                                    <td>{entry.maxWeight} kg</td>
                                    <td>{entry.totalReps}</td>
                                    <td>{entry.notes}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/each}
        {:else}
            <p class="no-data">No data available for {currentMuscleGroup}</p>
        {/if}
    </div>
</div>

<style>
    .muscle-group-buttons {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        justify-content: center;
    }
    
    .muscle-group-button {
        padding: 0.75em 1.5rem;
          border-radius: 8px;
          background: #3b83f695;
          border: none;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s ease;
    }
    
    .muscle-group-button.active {
        background: #3b82f6;
        color: white;
    }
    
    .muscle-group-button:hover {
        background: #3b82f6;
    }

    
    .exercise-section {
        margin-bottom: 25px;
        background: rgba(12, 12, 12, 0.337);
        backdrop-filter: blur(5px);
        padding: 15px;
        border-radius: 8px;
    }
    
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .data-table th {
        padding: 8px;
        text-align: left;
        border: 1px solid #00000065;
        background: #dc8400b0;
        font-weight: 600;
        color: #ddd;
    }
    
    .data-table td {
        padding: 8px;
        border: 1px solid #00000065;
        color: #ddd;
    }
    
    .data-table tbody tr:hover {
        background-color: #ffffff4e;
    }
    
    .no-data {
        text-align: center;
        color: #000000;
        font-style: italic;
        padding: 20px;
    }
</style>