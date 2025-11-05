<script>
    import { enhance } from '$app/forms';
    
    let { username } = $props();
</script>

<div class="row bg-dark text-white p-3 mb-4">
    <div class="col">
        <h1 class="h3">Admin Dashboard</h1>
    </div>
    <div class="col-auto">
        <div class="dropdown">
            <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" 
                    type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span>{username}</span>
            </button>
            <ul class="dropdown-menu">
                <li><span class="dropdown-item-text small text-muted">Logged in as: {username}</span></li>
                <li>
                    <!-- Logout form that calls the logout action -->
                    <form method="POST" action="?/logout" use:enhance>
                        <button class="dropdown-item text-danger" type="submit">
                            🚪 Log Out
                        </button>
                    </form>
                </li>
            </ul>
        </div>
    </div>
</div>