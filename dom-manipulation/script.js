// Define Variables
const quoteContainer = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile')
const quotes = loadQuotes(); // Load quotes from local storage when page starts



// Function to show a random quote
function showRandomQuote() {
    // Get a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Create elements to display the quote
    const quoteElement = document.createElement('div');
    const quoteText = document.createElement('p');
    const quoteCategory = document.createElement('small');
    
    // Set the content - quote text in quotes and category with dash
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.category}`;
    
    // Clear previous quote and add new one
    quoteContainer.innerHTML = '';
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);
};

// Function to add new quote
function createAddQuoteForm() {
    const form = document.getElementById('form');
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    // Listen for form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop page from refreshing
        
        // Create new quote object from input values
        const newQuote = {
            text: textInput.value,
            category: categoryInput.value,
        };
        
        // Add new quote to array and save to storage
        quotes.push(newQuote);
        saveQuotes();
        populateCategories(); // Update dropdown with new category
        
        // Clear input fields
        textInput.value = '';
        categoryInput.value = '';
        
        alert('Quote added successfully!');
    });
};

// Function to save or add new quotes into local storage in the browser
function saveQuotes() {
    // Convert quotes array to JSON string and save in local storage
    localStorage.setItem('myQuotes', JSON.stringify(quotes));
};

// Function to load all saved quotes 
function loadQuotes() {
    // Try to get saved quotes from local storage
    const savedQuotes = localStorage.getItem('myQuotes');
    if(savedQuotes) {
        // If quotes exist in storage, parse and return them
        return JSON.parse(savedQuotes);
    } else {
        // If no quotes in storage, return default quotes
        return [
            {text:"Live as if you were to die tomorrow.", category:"Life and Motivation"},
            {text:"Be yourself; everyone else is already taken.", category:"Self and Authenticity"},
            {text:"Less is more.", category:"Simplicity and Perspective"},
        ];
    };
};

// Function allow user to export (download) data as .JSON File
function exportToJson() {
    // Convert quotes to JSON string
    const data = JSON.stringify(quotes);
    // Create a virtual file (Blob) with JSON data
    const blob = new Blob([data], {type: 'application/json' });
    // Create temporary download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; // Set filename for download
    a.click(); // Trigger download
};

// Function allow user to import (From desktop or local files) Just .Json file  
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    // When file is loaded, process the data
    fileReader.onload = function(event) {
        // Parse JSON data from file
        const importedQuotes = JSON.parse(event.target.result);
        // Add imported quotes to existing quotes array
        quotes.push(...importedQuotes);
        // Save updated quotes to local storage
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    // Read the selected file as text
    fileReader.readAsText(event.target.files[0]);
}

// Function to extract unique categories and populate the dropdown menu
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Use map to get all categories, then filter for unique ones
    const allCategories = quotes.map(quote => quote.category).filter((category, index, array) => array.indexOf(category) === index);
    
    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
};

// Function to update the displayed quotes based on the selected category
function filterQuotes() {
    // Get the currently selected category from dropdown
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    // Save selected filter to local storage for next visit
    localStorage.setItem('lastCategoryFilter', selectedCategory);
    
    if(selectedCategory === 'all'){
        // If "All Categories" selected, show random quote from all quotes
        showRandomQuote();
    } else {
        // Filter quotes to only include selected category
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        
        // Get random quote from filtered list
        const randomIndex = Math.floor(Math.random()*filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        
        // Clear display and show filtered quote
        quoteContainer.innerHTML = "";
        const quoteText = document.createElement('p');
        const quoteCategory = document.createElement('small');
        quoteText.textContent = `"${randomQuote.text}"`;
        quoteCategory.textContent = `- ${randomQuote.category}`;
        quoteContainer.appendChild(quoteText);
        quoteContainer.appendChild(quoteCategory);
    }
};

// Server simulation - using JSONPlaceholder
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Simple function to get quotes from server
async function fetchQuotesFromServer() {
    try {
        // Simulate getting data from server
        const response = await fetch(SERVER_URL);
        const serverData = await response.json();
        
        // Convert server data to our quote format (just for simulation)
        const serverQuotes = serverData.slice(0, 5).map(item => ({
            text: item.title,
            category: "Server Quotes",
            fromServer: true
        }));
        
        return serverQuotes;
    } catch (error) {
        console.log('Could not connect to server, using local data only');
        return [];
    }
}

// Simple function to send quotes to server
async function sendQuotesToServer(quotes) {
    try {
        // Just simulate sending - we don't actually save to JSONPlaceholder
        await fetch(SERVER_URL, {
            method: 'POST',
            body: JSON.stringify(quotes),
            headers: {
                'Content-type': 'application/json',
            },
        });
        console.log('Quotes sent to server (simulation)');
        return true;
    } catch (error) {
        console.log('Failed to send to server');
        return false;
    }
}

// Sync data every 30 seconds
function startSyncing() {
    // Sync immediately when page loads
    syncData();
    
    // Then sync every 30 seconds
    setInterval(syncData, 30000);
}

// Main sync function
async function syncData() {
    console.log('Syncing with server...');
    showSyncMessage('Syncing with server...');
    
    // Get quotes from server
    const serverQuotes = await fetchQuotesFromServer();
    
    // Get our local quotes
    const localQuotes = quotes;
    
    // Merge them - server quotes replace local ones if conflict
    const mergedQuotes = [...localQuotes];
    
    serverQuotes.forEach(serverQuote => {
        // Check if we already have this quote
        const existingIndex = mergedQuotes.findIndex(localQuote => 
            localQuote.text === serverQuote.text
        );
        
        if (existingIndex === -1) {
            // New quote from server - add it
            mergedQuotes.push(serverQuote);
        } else {
            // Conflict - server version wins
            mergedQuotes[existingIndex] = serverQuote;
        }
    });
    
    // Update our quotes
    quotes = mergedQuotes;
    saveQuotes();
    
    // Send our updated quotes to server (simulation)
    await sendQuotesToServer(quotes);
    
    showSyncMessage('Sync completed!');
    populateCategories();
    
    console.log('Sync completed. Total quotes:', quotes.length);
}

// Show sync status message
function showSyncMessage(message) {
    // Remove old message if exists
    const oldMessage = document.getElementById('syncMessage');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.id = 'syncMessage';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        background: yellow;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid orange;
        border-radius: 5px;
    `;
    
    // Add it to the page
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.parentNode.insertBefore(messageDiv, quoteDisplay);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Simple conflict detection and resolution
function checkForConflicts(localQuotes, serverQuotes) {
    let conflicts = 0;
    
    serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotes.find(q => q.text === serverQuote.text);
        if (localQuote && localQuote.category !== serverQuote.category) {
            conflicts++;
            console.log(`Conflict found: "${serverQuote.text}"`);
        }
    });
    
    return conflicts;
}

// Updated sync function with conflict handling
async function syncData() {
    console.log('Syncing with server...');
    showSyncMessage('Syncing with server...');
    
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = [...quotes]; // Copy of current quotes
    
    // Check for conflicts before merging
    const conflictCount = checkForConflicts(localQuotes, serverQuotes);
    
    // Merge - server quotes take priority
    const mergedQuotes = [...localQuotes];
    
    serverQuotes.forEach(serverQuote => {
        const existingIndex = mergedQuotes.findIndex(localQuote => 
            localQuote.text === serverQuote.text
        );
        
        if (existingIndex === -1) {
            // New quote from server
            mergedQuotes.push(serverQuote);
        } else {
            // Server version wins in conflict
            mergedQuotes[existingIndex] = serverQuote;
        }
    });
    
    // Update our quotes
    quotes = mergedQuotes;
    saveQuotes();
    
    // Send to server
    await sendQuotesToServer(quotes);
    
    // Show results
    showSyncMessage(`Sync completed! ${serverQuotes.length} server quotes processed`);
    
    if (conflictCount > 0) {
        showConflictMessage(conflictCount);
    }
    
    populateCategories();
    console.log('Sync completed with', conflictCount, 'conflicts resolved');
}

// Manual sync function
function manualSync() {
    syncData();
}

// Show conflict message to user
function showConflictMessage(conflictCount) {
    if (conflictCount > 0) {
        const conflictDiv = document.createElement('div');
        conflictDiv.innerHTML = `
            <div style="background: #ffcccc; padding: 10px; margin: 10px 0; border: 1px solid red; border-radius: 5px;">
                <strong>Conflict Resolved:</strong> ${conflictCount} quotes were updated from server.
                <button onclick="this.parentElement.remove()" style="float: right;">X</button>
            </div>
        `;
        
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.parentNode.insertBefore(conflictDiv, quoteDisplay);
    }
}
// ========== INITIALIZATION ========== //


populateCategories(); // Populate categories dropdown when page loads
createAddQuoteForm(); // Set up form for adding new quotes

// Event listeners for buttons and inputs
newQuoteBtn.addEventListener('click', function() {
    // Get current filter and show appropriate quotes
    const currentFilter = document.getElementById('categoryFilter').value;
    if (currentFilter === 'all') {
        showRandomQuote();
    } else {
        filterQuotes(); // This will show random quote from filtered category
    }
});
exportBtn.addEventListener('click', exportToJson);
importFile.addEventListener('change', importFromJsonFile);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Load and apply saved filter preference from previous session
const savedFilter = localStorage.getItem('lastCategoryFilter');
if(savedFilter) {
    document.getElementById('categoryFilter').value = savedFilter; 
    filterQuotes();
}

startSyncing();
