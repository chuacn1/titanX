<script>
let { data } = $props();
import { goto } from '$app/navigation';
import Button from '$lib/components/layouts/users/Button.svelte';
import Graph from '$lib/components/Graph.svelte';
  // Debug: log the data to console
  import { onMount } from 'svelte';
  onMount(() => {
      console.log('Full data:', data);
      console.log('Exercise data:', data.exerciseData);
  });
</script>

<main style="max-width: 800px; margin: 0 auto; padding: 20px;">

  {#if data.exerciseData && Object.keys(data.exerciseData).length > 0}
      <Graph exerciseData={data.exerciseData} />
  {:else}
      <p>No exercise data available. Complete some workouts to see your progress!</p>
  {/if}
</main>

<div class="button-container">
  <Button text={"Add Workout"} onclick={() => goto("/user/add-workout")}></Button>
</div>

<style>
    .button-container {
    position: fixed;
    bottom: 105px;
    left: 50%;
    transform: translateX(-50%);
    }
</style>