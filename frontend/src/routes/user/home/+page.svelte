<script>
    import Button from "$lib/components/layouts/users/Button.svelte";   
    import { goto } from "$app/navigation";

    let { data } = $props();
    
    // Generate random quote
    let randomQuote = $state();
    const randomIndex = Math.floor(Math.random() * data.quotes.quotes.length);
    randomQuote = data.quotes.quotes[randomIndex];
</script>


<div class="welcome-message">
    <h1>Welcome to TitanX, {data.username}!</h1>
</div>

<div class="quotes">
    <p>{randomQuote.quote}</p>
    <p> - {randomQuote.author}</p>
</div>

<div class="button-container">
    <Button text={"Add Workout"} onclick={() => goto("/user/add-workout")}></Button>
</div>

<style>
    .welcome-message {
        text-align: center;
        margin: 0rem 0;
        padding: 1rem;
    }

    .welcome-message h1 {
        color: #5491f4aa;
        font-size: 2.5em;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        font-family: 'Palatino Linotype', 'Book Antiqua', serif;
        margin: 0;
    }

    .quotes {
        position: fixed;
        bottom: 150px; /* Adjust this value to move up/down from bottom */
        left: 50%;
        transform: translateX(-50%);
        border-radius: 8px;
        text-align: center;
        background: rgba(12, 12, 12, 0.337);
        backdrop-filter: blur(5px);
        padding: 25px;
    }

    .quotes p {
        font-size: 1.8em;
        color: white;
        font-style: italic; /* All text italic */
        text-shadow: 1px 1px 2px rgb(0, 0, 0); 
    }

    .quotes p:last-child {
        font-size: 1.5em; 
        margin-top: 1em;
    }

    .button-container {
        position: fixed;
        bottom: 105px;
        left: 50%;
        transform: translateX(-50%);
    }
</style>