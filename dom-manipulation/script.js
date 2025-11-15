// ========== SERVER SYNC & CONFLICT RESOLUTION ========== //

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from server (simulated)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverData = await response.json();
        
        // Convert server data to quote format (simulation)
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

// Send quotes to server (simulated)
async function sendQuotesToServer(quotesToSend) {
    try {
        await fetch(SERVER_URL, {
            method: 'POST',
            body: JSON.stringify(quotesToSend),
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log('Quotes sent to server (simulation)');
        return true;
    } catch (error) {
        console.log('Failed to send to server');
        return false;
    }
}

// Check for conflicts between local and server quotes
function checkForConflicts(localQuotes, serverQuotes) {
    let conflicts = [];
    
    serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotes.find(q => q.text === serverQuote.text);
        if (localQuote && localQuote.category !== serverQuote.category) {
            conflicts.push({
                text: serverQuote.text,
                localCategory: localQuote.category,
                serverCategory: serverQuote.category
            });
            console.log(`Conflict found: "${serverQuote.text}"`);
        }
    });
    
    return conflicts;
}

// Main sync function with conflict handling
async function syncQuotes() {
    console.log('Syncing with server...');
    showSyncMessage('Syncing with server...');
    
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = [...quotes]; // Copy of current quotes
    
    // Check for conflicts before merging
    const conflicts = checkForConflicts(localQuotes, serverQuotes);
    
    // Merge quotes - server quotes take priority
    const mergedQuotes = [...localQuotes];
    
    serverQuotes.forEach(serverQuote => {
        const existingIndex = mergedQuotes.findIndex(localQuote => 
            localQuote.text === serverQuote.text
        );
        
        if (existingIndex === -1) {
            // New quote from server - add it
            mergedQuotes.push(serverQuote);
        } else {
            // Server version wins in conflict
            mergedQuotes[existingIndex] = serverQuote;
        }
    });
    
    // FIXED: Update quotes array by modifying its contents, not reassigning
    quotes.length = 0; // Clear array
    quotes.push(...mergedQuotes); // Add all merged quotes
    
    // Save merged quotes to local storage (conflict resolution applied)
    localStorage.setItem('myQuotes', JSON.stringify(quotes));
    
    // Send updated quotes to server
    await sendQuotesToServer(quotes);
    
    // Show results
    const newQuotesCount = serverQuotes.filter(sq => 
        !localQuotes.find(lq => lq.text === sq.text)
    ).length;
    
    showSyncMessage(`Sync completed! ${newQuotesCount} new quotes added`);
    
    if (conflicts.length > 0) {
        showConflictMessage(conflicts);
    }
    
    populateCategories();
    console.log('Sync completed with', conflicts.length, 'conflicts resolved');
}

// Manual sync function (triggered by button click)
function manualSync() {
    syncQuotes();
}

// Start automatic syncing every 30 seconds
function startSyncing() {
    // Sync immediately when page loads
    syncQuotes();
    
    // Then sync every 30 seconds
    setInterval(syncQuotes, 30000);
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
        background: #e8f5e9;
        color: #2e7d32;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #4caf50;
        border-radius: 5px;
        font-weight: 500;
    `;
    
    // Add it to the page
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.parentNode.insertBefore(messageDiv, quoteDisplay);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Show conflict message with details
function showConflictMessage(conflicts) {
    if (conflicts.length === 0) return;
    
    const conflictDiv = document.createElement('div');
    conflictDiv.style.cssText = `
        background: #fff3cd;
        color: #856404;
        padding: 15px;
        margin: 10px 0;
        border: 1px solid #ffc107;
        border-radius: 5px;
    `;
    
    let conflictHTML = `
        <strong>⚠️ ${conflicts.length} Conflict${conflicts.length > 1 ? 's' : ''} Resolved</strong>
        <p style="margin: 5px 0;">Server data has taken precedence:</p>
        <ul style="margin: 5px 0 10px 20px; font-size: 0.9em;">
    `;
    
    conflicts.forEach(conflict => {
        conflictHTML += `
            <li style="margin: 5px 0;">
                "${conflict.text.substring(0, 50)}..."<br>
                <span style="color: #dc3545;">Local: ${conflict.localCategory}</span> → 
                <span style="color: #28a745;">Server: ${conflict.serverCategory}</span>
            </li>
        `;
    });
    
    conflictHTML += `</ul>`;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        float: right;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #856404;
        padding: 0;
        width: 30px;
        height: 30px;
        margin-top: -5px;
    `;
    closeBtn.addEventListener('click', () => {
        conflictDiv.remove();
    });
    
    conflictDiv.innerHTML = conflictHTML;
    conflictDiv.insertBefore(closeBtn, conflictDiv.firstChild);
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.parentNode.insertBefore(conflictDiv, quoteDisplay);
}

// Export functions for use in main code
// (Add these event listeners in your initialization section)
// document.getElementById('manualSyncBtn').addEventListener('click', manualSync);