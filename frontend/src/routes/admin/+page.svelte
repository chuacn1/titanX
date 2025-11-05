<script>
    import AdminHeader from "$lib/components/layouts/admin/AdminHeader.svelte";
    import AdminNav from "$lib/components/layouts/admin/AdminNav.svelte";
    import UserTab from "$lib/components/layouts/admin/UserTab.svelte";
    
    let { data } = $props();
    let activeTab = $state('users');
    let users = $state(data.users || []);
    
    console.log('Page data:', $state.snapshot(data));
    console.log('Users:', $state.snapshot(users));
    </script>
    
    <div class="container-fluid">
        <!-- Pass the username variable -->
        <AdminHeader username={data.username} />
        <AdminNav {activeTab} />
    
        {#if activeTab === 'users'}
            <UserTab {users} />
        {/if}
    </div>