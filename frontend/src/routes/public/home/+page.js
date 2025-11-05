export async function load({ fetch }) {
    const url = "https://dummyjson.com/quotes"
    
    try {
        const response = await fetch(url); 
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const quotes = await response.json();
        return { quotes };
        
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return { quotes: [] }; // Return an empty array or handle the error as needed
    }
}

    // "quotes": [
    // {
    //   "id": 1,
    //   "quote": "Your heart is the size of an ocean. Go find yourself in its hidden depths.",
    //   "author": "Rumi"
    // },
    // {
    //   "id": 2,
    //   "quote": "The Bay of Bengal is hit frequently by cyclones. The months of November and May, in particular, are dangerous in this regard.",
    //   "author": "Abdul Kalam"
    // }