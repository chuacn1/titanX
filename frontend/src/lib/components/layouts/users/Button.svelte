<script>
    let { text, onclick } = $props(); 
</script>

<button {onclick}>
    {text}
</button>

<style>
   button {
        background-color: #0805008f;
        border: 1px solid #dc8400;
        color: #dc8400;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 4px;
        min-width: 100px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 400;
        transition: all 0.2s ease;
    }

    button:hover {
        background-color: #dc8400;
        border-color:#0805008f;
        color:  #0805008f;
    }
</style>