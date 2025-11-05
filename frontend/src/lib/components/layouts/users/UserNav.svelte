<script>
	let navItems = [
		{ text: 'Home', href: '/user/home' },
		{ text: 'Progress', href: '/user/progress' },
		{ text: 'About', href: '/about' }
	];
</script>

<nav>
	<ul>
		{#each navItems as item}
			<li><a href={item.href}>{item.text}</a></li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		padding: 0;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: center;
	}

	li {
		margin: 30px;
	}

	a {
		text-decoration: none;
		color: #dc8400;
		font-family: 'Palatino Linotype', 'Book Antiqua', serif;
		font-size: 1.2em;
	}

	a:hover {
		color: #ffffff;
	}
</style>
