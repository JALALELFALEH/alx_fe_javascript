const quoteContainer = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Create an array of quote objects
const quotes = [
    {text:"Live as if you were to die tomorrow.", category:"Life and Motivation"},
    {text:"Be yourself; everyone else is already taken.", category:"Self and Authenticity"},
    {text:"Less is more.", category:"Simplicity and Perspective "},
];

// Function to show a random quote
function showRandomQuote() {
    // Get a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Create elements to display the quote
    const quoteElement = document.createElement('div');
    const quoteText = document.createElement('p');
    const quoteCategory = document.createElement('small');

    // Set the content
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.category}`;

    // Clear previous quote and add new one
    quoteContainer.innerHTML = '';
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);
};

function createAddQuoteForm() {
    const form = document.getElementById('form');
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const newQuote = {
            text: textInput.value,
            category: categoryInput.value,
        };

        quotes.push(newQuote);

        textInput.value = '';
        categoryInput.value = '';

        alert('Quote added successfully!');
    });
};


newQuoteBtn.addEventListener('click', showRandomQuote);

createAddQuoteForm();