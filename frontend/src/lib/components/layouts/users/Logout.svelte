<script>
    // Simple logout button component
</script>

<form method="POST" action="?/logout">
    <button 
        class="logout-icon-btn"
        type="submit"
        aria-label="Log out"
        title="Log out"
    >
        <svg class="logout-svg" viewBox="0 0 24 24" fill="none">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="#dc8400"/>
        </svg>
    </button>
</form>

<style>
    .logout-icon-btn {
        width: 50px;
        height: 50px;
        background: none;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .logout-icon-btn:hover {
        background: rgba(220, 132, 0, 0.1);
        transform: scale(1.1);
    }
    
    .logout-svg {
        width: 28px;
        height: 28px;
    }
</style>