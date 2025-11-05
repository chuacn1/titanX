<script>
        let { activeTab } = $props();
</script>

<ul class="nav nav-tabs mb-4">
    <li class="nav-item">
        <button class="nav-link {activeTab === 'users' ? 'active' : ''}" 
                onclick={() => activeTab = 'users'}>
            Users
        </button>
    </li>
    <li class="nav-item">
        <button class="nav-link {activeTab === 'exercises' ? 'active' : ''}" 
                onclick={() => activeTab = 'exercises'}>
            Exercises
        </button>
    </li>
    <li class="nav-item">
        <button class="nav-link {activeTab === 'sessions' ? 'active' : ''}" 
                onclick={() => activeTab = 'sessions'}>
            Workout Sessions
        </button>
    </li>
</ul>