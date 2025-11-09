/**
 * Simulates an AI call to "humanize" text.
 * This function uses Regular Expressions (RegEx) with:
 * - \b: Word boundaries (ensures only whole words are replaced).
 * - g: Global flag (ensures ALL occurrences are replaced).
 * - i: Case-insensitive flag (matches 'Therefore', 'therefore', etc.).
 * The goal is to replace formal, AI-sounding phrases with casual equivalents.
 */
function simulateAITool(text) {
    if (!text) return "";

    let humanizedText = text;

    // --- Formal/AI-sounding phrases replaced with casual equivalents ---
    humanizedText = humanizedText.replace(/\bIn conclusion\b/gi, "So, to wrap things up");
    humanizedText = humanizedText.replace(/\bMoreover\b/gi, "What's more");
    humanizedText = humanizedText.replace(/\butilize\b/gi, "use");
    humanizedText = humanizedText.replace(/\bConsequently\b/gi, "As a result");
    humanizedText = humanizedText.replace(/\bIt is evident that\b/gi, "It's clear that");
    humanizedText = humanizedText.replace(/\bprovides a comprehensive overview\b/gi, "gives you the full picture");
    
    // --- Common AI words and formalisms replaced ---
    humanizedText = humanizedText.replace(/\bparadigm\b/gi, "way of thinking");
    humanizedText = humanizedText.replace(/\bengagement\b/gi, "interaction");
    humanizedText = humanizedText.replace(/\bseamlessly\b/gi, "easily");
    humanizedText = humanizedText.replace(/\bAdditionally\b/gi, "Also");
    
    // --- Add a conversational opening (if short enough) ---
    if (humanizedText.length < 50) {
         humanizedText = "Hey, check this out: " + humanizedText;
    }

    // --- Add a strong, human closing statement ---
    humanizedText += "\n\n(I think that's a much better way to say it, don't you agree?)";

    return humanizedText;
}
