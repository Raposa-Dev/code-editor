
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { getApiKey } from "../utils/apiKeyStore";

// Lazily initialize to prevent app crash on load if API_KEY is not set.
let ai: GoogleGenAI | null = null;
let lastUsedApiKey: string | null = null;

const getAiInstance = () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("API_KEY_NOT_SET");
    }

    // Re-initialize if the API key has changed
    if (ai && apiKey !== lastUsedApiKey) {
        ai = null;
    }

    if (!ai) {
        ai = new GoogleGenAI({ apiKey });
        lastUsedApiKey = apiKey;
    }
    return ai;
};


export async function generateCode(prompt: string): Promise<string> {
    try {
        const genAI = getAiInstance();
        const response: GenerateContentResponse = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        if (error instanceof Error) {
            // Re-throw the original error to be handled by the caller
            throw error;
        }
        throw new Error("An unknown error occurred.");
    }
}