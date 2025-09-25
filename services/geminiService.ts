
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIAction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getSystemInstruction = (action: AIAction, prompt: string): string => {
  switch (action) {
    case AIAction.ANALYZE:
      return "You are an expert code analyst. Analyze the provided code for errors, potential bugs, security vulnerabilities, and adherence to best practices. Provide a clear, concise report in markdown format. Start with a summary, then list the issues with code snippets and suggested fixes.";
    case AIAction.REFACTOR:
      return "You are an expert software engineer specializing in code refactoring. Your task is to refactor the given code to improve its readability, performance, and maintainability without altering its external behavior. Provide the complete refactored code block, followed by a brief, bulleted list of the key changes you made.";
    case AIAction.GENERATE:
      return `You are a code generation assistant. Based on the user's prompt and any provided context code, generate a new, complete code snippet. The user's request is: "${prompt}". Only output the raw code, without any explanations or markdown formatting.`;
    case AIAction.CHAT:
      return "You are a helpful and friendly AI pair programmer, the Master Control Program (MCP). Your goal is to assist the user with their coding questions, explain complex concepts, and help them solve problems. Provide clear, concise, and accurate information.";
    default:
      return "You are a helpful AI assistant.";
  }
};

const buildPrompt = (action: AIAction, code: string, userPrompt: string): string => {
    switch (action) {
        case AIAction.ANALYZE:
        case AIAction.REFACTOR:
            return `Here is the code to process:\n\n\`\`\`\n${code}\n\`\`\``;
        case AIAction.GENERATE:
            return `Here is the current code context (it might be empty):\n\n\`\`\`\n${code}\n\`\`\`\n\nPlease generate the code as requested.`
        case AIAction.CHAT:
            return userPrompt;
        default:
            return userPrompt;
    }
}

export const runAIQuery = async (
  action: AIAction,
  userPrompt: string,
  codeContext: string
): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(action, userPrompt);
    const model = 'gemini-2.5-flash';
    const finalPrompt = buildPrompt(action, codeContext, userPrompt);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: finalPrompt,
      config: {
        systemInstruction,
        temperature: 0.5,
        topP: 0.95,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        return `Error interacting with Gemini API: ${error.message}`;
    }
    return "An unknown error occurred while contacting the Gemini API.";
  }
};
