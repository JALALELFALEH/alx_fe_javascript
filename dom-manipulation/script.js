const quoteContainer = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile')
// Create an array of quote objects
const quotes = loadQuotes();

function saveQuotes() {
    localStorage.setItem('myQuotes', JSON.stringify(quotes));
};

function loadQuotes () {
    const savedQuotes = localStorage.getItem('myQuotes');
    if(savedQuotes) {
        return JSON.parse(savedQuotes);
    } else {
        return [
            {text:"Live as if you were to die tomorrow.", category:"Life and Motivation"},
            {text:"Be yourself; everyone else is already taken.", category:"Self and Authenticity"},
            {text:"Less is more.", category:"Simplicity and Perspective"},
        ];
    };
};

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

function AddQuoteForm() {
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

        saveQuotes();

        textInput.value = '';
        categoryInput.value = '';

        alert('Quote added successfully!');
    });
};

function exportToJson() {
    const data = JSON.stringify(quotes);
    const blob = new Blob([data], {type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
};

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

newQuoteBtn.addEventListener('click', showRandomQuote);
AddQuoteForm();

exportBtn.addEventListener('click', exportToJson);
importFile.addEventListener('change', importFromJsonFile);