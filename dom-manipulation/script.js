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
    quoteCategory.textContent = `-${randomQuote.category}`;

    // Clear previous quote and add new one
    quoteContainer.innerHTML = '';
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);
};

function createAddQuoteForm() {
    const form = document.createElement('form');
    const textInput = document.createElement('input');
    const categoryInput = document.createElement('input');
    const submitButton = document.createElement('button');

    textInput.placeholder = "Enter quote text";
    textInput.type = "text";
    categoryInput.placeholder = "Enter category";
    categoryInput.type = "text";
    submitButton.textContent = "Add Quote";

    form.appendChild(textInput);
    form.appendChild(categoryInput);
    form.appendChild(submitButton);

    document.body.appendChild(form);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        newQuote = {
            text: textInput.value,
            category: categoryInput.value,
        };

        quotes.push(newQuote);

        textInput = '';
        categoryInput = '';

        alert('Quote added successfully!');
    });
};


newQuoteBtn.addEventListener('click', showRandomQuote);

createAddQuoteForm();