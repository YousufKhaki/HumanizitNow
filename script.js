// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Get DOM Elements ---
    // Authentication
    const authContainer = document.getElementById("auth-container");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const authMessage = document.getElementById("auth-message");

    // Main App
    const appContainer = document.getElementById("app-container");
    const welcomeMessage = document.getElementById("welcome-message");
    const logoutBtn = document.getElementById("logout-btn");

    // Humanizer
    const textInput = document.getElementById("text-input");
    const humanizeBtn = document.getElementById("humanize-btn");
    const textOutput = document.getElementById("text-output");

    // Dashboard
    const historyList = document.getElementById("history-list");

    // --- State and Constants ---
    // This is the key we'll use to store all app data in localStorage
    const DB_KEY = "textHumanizerApp";
    
    // This variable will hold the username of the currently logged-in user
    let currentLoggedInUser = null;

    // --- Helper Functions ---

    /**
     * Gets all data from localStorage.
     * The data is stored as a single JSON string.
     * We parse it into a JavaScript object.
     * Example DB structure:
     * {
     * "users": {
     * "user1": "pass123",
     * "user2": "abc"
     * },
     * "texts": {
     * "user1": ["text A", "text B"],
     * "user2": ["text C"]
     * }
     * }
     */
    function getDatabase() {
        const dbString = localStorage.getItem(DB_KEY);
        // If no data exists, return a default, empty database structure
        if (!dbString) {
            return {
                users: {},  // To store usernames and passwords
                texts: {}   // To store texts, keyed by username
            };
        }
        // If data exists, parse it from JSON
        return JSON.parse(dbString);
    }

    /**
     * Saves the provided database object back into localStorage.
     * We must convert it to a JSON string to store it.
     * @param {object} db - The database object to save.
     */
    function saveDatabase(db) {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    }

    /**
     * Toggles between the authentication view and the main app view.
     * @param {boolean} showApp - True to show the app, false to show auth.
     */
    function showView(showApp) {
        if (showApp) {
            authContainer.classList.add("hidden");
            appContainer.classList.remove("hidden");
        } else {
            authContainer.classList.remove("hidden");
            appContainer.classList.add("hidden");
        }
    }

    // --- Authentication Logic ---

    function handleSignUp() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!username || !password) {
            authMessage.textContent = "Please enter both username and password.";
            return;
        }

        const db = getDatabase();

        // Check if user already exists
        if (db.users[username]) {
            authMessage.textContent = "Username already exists. Please login.";
        } else {
            // Create new user
            db.users[username] = password; // Store the password
            db.texts[username] = [];       // Create an empty array for their texts
            saveDatabase(db);
            
            // Automatically log them in
            loginUser(username);
        }
    }

    function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            authMessage.textContent = "Please enter both username and password.";
            return;
        }

        const db = getDatabase();

        // Check if user exists and password is correct
        if (db.users[username] && db.users[username] === password) {
            loginUser(username);
        } else {
            authMessage.textContent = "Invalid username or password.";
        }
    }

    /**
     * Logs the user in by setting the global state and updating the UI.
     * @param {string} username - The username of the user to log in.
     */
    function loginUser(username) {
        currentLoggedInUser = username;
        // We can also store this in `sessionStorage` to remember the user
        // across page reloads (but not browser closing).
        // For simplicity, we'll use a variable.
        // For persistence across reloads, we'd use:
        // localStorage.setItem('currentUser', username);
        
        welcomeMessage.textContent = `Welcome, ${username}!`;
        showView(true); // Show the main app
        displayUserHistory(); // Load their texts
        
        // Clear auth form
        usernameInput.value = "";
        passwordInput.value = "";
        authMessage.textContent = "";
    }

    function handleLogout() {
        currentLoggedInUser = null;
        // localStorage.removeItem('currentUser'); // If using localStorage for session
        showView(false); // Show the auth screen
        
        // Clear sensitive data from the UI
        historyList.innerHTML = "";
        textInput.value = "";
        textOutput.textContent = "";
    }

    // --- Main App Logic ---

    /**
     * Simulates an AI call to "humanize" text.
     * This is a very simple simulation for demonstration.
     * It keeps the meaning and rough length the same.
     * @param {string} text - The AI-generated text.
     * @returns {string} - The "humanized" text.
     */
    function simulateAITool(text) {
        if (!text) return "";

        // Simple replacements to sound more "human" or "casual"
        let humanizedText = text;
        
        // Use regular expressions with word boundaries (\b) and case-insensitivity (i)
        humanizedText = humanizedText.replace(/\bIn conclusion\b/gi, "To wrap it up");
        humanizedText = humanizedText.replace(/\bAdditionally\b/gi, "Also");
        humanizedText = humanizedText.replace(/\bIt is important to note that\b/gi, "Keep in mind that");
        humanizedText = humanizedText.replace(/\bHowever\b/gi, "But");
        humanizedText = humanizedText.replace(/\bTherefore\b/gi, "So");
        humanizedText = humanizedText.replace(/\butilize\b/gi, "use");

        // Add a simple "human" touch at the end
        if (humanizedText.length > 20) {
             humanizedText += " (That's just my take on it, though!)";
        }

        return humanizedText;
    }

    function handleHumanizeClick() {
        const originalText = textInput.value;
        if (!originalText.trim()) {
            textOutput.textContent = "Please enter some text to humanize.";
            return;
        }

        // 1. Simulate the AI call
        const humanizedText = simulateAITool(originalText);

        // 2. Display the result
        textOutput.textContent = humanizedText;

        // 3. Save the *original* text to the user's history
        const db = getDatabase();
        // Add text to the beginning of the array (most recent first)
        db.texts[currentLoggedInUser].unshift(originalText);
        saveDatabase(db);

        // 4. Update the dashboard
        displayUserHistory();
        
        // 5. Clear the input box
        textInput.value = "";
    }

    /**
     * Loads and displays the current user's text history.
     */
    function displayUserHistory() {
        // Clear the current list
        historyList.innerHTML = "";

        const db = getDatabase();
        const userTexts = db.texts[currentLoggedInUser];

        if (!userTexts || userTexts.length === 0) {
            historyList.innerHTML = "<p>You have no saved texts yet.</p>";
            return;
        }

        // Create and append a new item for each text
        userTexts.forEach((text, index) => {
            const item = document.createElement("div");
            item.className = "history-item";

            // Create the text element
            const textEl = document.createElement("p");
            textEl.className = "history-text";
            // Show a snippet of the text
            textEl.textContent = text.substring(0, 50) + (text.length > 50 ? "..." : "");
            // Add a tooltip to show the full text on hover
            textEl.title = text;

            // Create the delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "Delete";
            // Store the index of the text on the button itself using a data attribute
            deleteBtn.dataset.index = index;

            // Add an event listener *directly* to this button
            deleteBtn.addEventListener("click", handleDeleteText);

            // Append elements to the item
            item.appendChild(textEl);
            item.appendChild(deleteBtn);

            // Append the item to the list
            historyList.appendChild(item);
        });
    }

    /**
     * Handles the click event for a delete button.
     * @param {Event} event - The click event.
     */
    function handleDeleteText(event) {
        // Get the index we stored in the data-index attribute
        const indexToDelete = parseInt(event.target.dataset.index, 10);

        // Get the database
        const db = getDatabase();
        
        // Remove the text from the user's array using its index
        // .splice(startIndex, numberToRemove)
        db.texts[currentLoggedInUser].splice(indexToDelete, 1);

        // Save the modified database
        saveDatabase(db);

        // Refresh the history display
        displayUserHistory();
    }

    // --- Initialization ---

    /**
     * Initializes the application on page load.
     * For this simple app, we just default to the auth screen.
     * A more advanced version would check if a user is already logged in
     * (e.g., using localStorage.getItem('currentUser')).
     */
    function init() {
        // Add all the event listeners
        signupBtn.addEventListener("click", handleSignUp);
        loginBtn.addEventListener("click", handleLogin);
        logoutBtn.addEventListener("click", handleLogout);
        humanizeBtn.addEventListener("click", handleHumanizeClick);

        // Default to showing the auth screen
        showView(false);
    }

    // Run the app!
    init();
});
