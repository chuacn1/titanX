<script>
	import Footer from '$lib/components/layouts/users/Footer.svelte';
	import Siteheader from '$lib/components/layouts/users/Siteheader.svelte';
	import UserNav from '$lib/components/layouts/users/UserNav.svelte';
	import Logout from '$lib/components/layouts/users/Logout.svelte';

	let { children } = $props();
</script>

<div class="global-bg">
	<div class="siteHeader">
		<Siteheader />
		<div class="nav-container">
			<UserNav />
		</div>
		<div class="logout-container">
			<Logout/>
		</div>
	</div>
	<main>
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	/* applied to the entire app that is in the body */
	:global(body) {
		margin: 0;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		height: 100%;
	}

	.global-bg {
		background-image: url('/images/greekgod.jpg');
		background-size: cover;
		background-position: center;
		background-attachment: fixed; /* This keeps the background fixed while scrolling */
		background-repeat: no-repeat;
	}

	.siteHeader {
		display: flex;
		align-items: center;
		position: relative;
		padding: 1rem 0;
	}

	.nav-container {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.logout-container {
		position: absolute;
		right: 5rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
	}

	main {
		position: relative;
		min-height: calc(100vh - 120px);
		z-index: 1;
	}
</style>