<script>
    import Footer from '$lib/components/layouts/users/Footer.svelte';
    import Siteheader from '$lib/components/layouts/users/Siteheader.svelte';
    // @ts-ignore
    import PubNav from '$lib/components/layouts/users/PubNav.svelte';
    import Button from '$lib/components/layouts/users/Button.svelte';

    import { goto } from '$app/navigation';

    let { children } = $props();
    </script>
    
    <div class="global-bg">
        <div class="siteHeader">
            <Siteheader />
            <div class="nav-container">
                <PubNav />
            </div>
                <div class="button-container">
                    <Button text={"Login"} onclick={() => goto("/auth/login")}></Button>
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
    
        .button-container {
            position: absolute;
            right: 5rem;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .global-bg {
            position: fixed;
            width: 100%;
            height: 100%;
            background-image: url('/images/greekgod.jpg');
            background-size: cover;
            background-position: center;
            z-index: -1;    
        }
    
    </style>