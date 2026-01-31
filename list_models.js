import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try to load .env manually since we are running a standalone script
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

let apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    if (fs.existsSync(envLocalPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
        apiKey = envConfig.VITE_GEMINI_API_KEY;
    } else if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        apiKey = envConfig.VITE_GEMINI_API_KEY;
    }
}

// Fallback: check if the user provided it in their code (not recommended but checking)
// In a real scenario, we might need to ask the user, but let's assume they have it set up for the app.
// If this script fails to find the key, we'll know.

async function listModels() {
    if (!apiKey) {
        console.error("Error: VITE_GEMINI_API_KEY not found in environment variables or .env/.env.local files.");
        process.exit(1);
    }

    console.log("Using API Key starting with:", apiKey.substring(0, 5) + "...");

    const ai = new GoogleGenAI({ apiKey: apiKey });

    try {
        console.log("Fetching available models...");
        // The SDK structure might be slightly different depending on version.
        // Documentation for @google/genai (new SDK) suggests usage like:
        const response = await ai.models.list();

        console.log("Raw Response:", JSON.stringify(response, null, 2));

        // Try to handle if it's inside a property like 'models'
        const models = response.models || response;

        if (Array.isArray(models)) {
            console.log("Available Models:");
            models.forEach(model => {
                console.log(`- ${model.name} (Methods: ${model.supportedGenerationMethods?.join(', ')})`);
            });
        } else {
            console.log("Could not find array of models in response.");
        }

    } catch (error) {
        console.error("Error listing models:", error);
        // Print more details if available
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", await error.response.json());
        }
    }
}

listModels();
