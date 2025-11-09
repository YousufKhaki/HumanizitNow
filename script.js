function handleHumanizeClick() {
    const originalText = textInput.value;
    if (!originalText.trim()) {
        textOutput.textContent = "Please enter some text to humanize.";
        return;
    }

    // 1. Simulate the AI call (use the fixed academic humanizer)
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
    
    // 5. REMOVED STEP: We no longer clear the input box (textInput.value = "";)
    // The original text remains in the input section for comparison.
}
function simulateAITool(text) {
    if (!text) return "";

    let humanizedText = text;

    // Academic and length-focused replacements (using /gi for global, case-insensitive match)
    humanizedText = humanizedText.replace(/\bIn conclusion\b/gi, "To summarize");
    humanizedText = humanizedText.replace(/\bConsequently\b/gi, "As a result");
    humanizedText = humanizedText.replace(/\bTherefore\b/gi, "Henceforth");
    humanizedText = humanizedText.replace(/\bAdditionally\b/gi, "Furthermore");
    humanizedText = humanizedText.replace(/\bMoreover\b/gi, "In addition");
    humanizedText = humanizedText.replace(/\bHowever\b/gi, "Nevertheless");
    humanizedText = humanizedText.replace(/\butilize\b/gi, "employ");
    humanizedText = humanizedText.replace(/\bdemonstrate\b/gi, "illustrate");
    humanizedText = humanizedText.replace(/\bfacilitate\b/gi, "support");
    humanizedText = humanizedText.replace(/\bIt is evident that\b/gi, "Clearly");
    humanizedText = humanizedText.replace(/\bIt is important to note\b/gi, "Significantly");
    humanizedText = humanizedText.replace(/\bcomprehensive\b/gi, "thorough");

    return humanizedText;
}
