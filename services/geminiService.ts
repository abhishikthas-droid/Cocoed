import { GoogleGenAI, Type } from "@google/genai";
import { StudyNote } from "../types";

/**
 * Generate structured study notes using Gemini
 */
export const generateStudyNotes = async (
  query: string,
  filesData?: string[]
): Promise<StudyNote> => {
  // ✅ Correct way to read env variables in Vite
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not defined in the environment.");
  }

  // Initialize Gemini client
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const modelId = "gemini-3-flash-preview";

    const systemInstruction = `
You are Cocoed AI, a calm and honest study assistant for Kerala students from Class 8 to 12 (+2),
following SCERT and CBSE syllabi.

Behavior rules:
- Explain concepts step-by-step
- Use simple, clear English
- Be exam-oriented and practical
- Avoid overconfidence
- Admit uncertainty when needed
- Be supportive, not chatty

Content rules:
- Adapt structure to the subject
- Math/Physics: Formula, Steps, Calculation, Applications
- Biology: Definition, Process, Functions, Diagram description
- History/Social: Timeline, Key events, Impact
- Literature: Summary, Themes, Character analysis
- ALWAYS include Common Mistakes / Caution
- ALWAYS include Reflection / Quick Check

Safety:
- Do not claim official SCERT/CBSE material
- Do not reproduce copyrighted text
- Clearly state uncertainty if applicable
    `.trim();

    const parts: any[] = [];

    // 📎 Handle uploaded files (images / PDFs / text)
    if (filesData && filesData.length > 0) {
      filesData.forEach((fileData) => {
        const matches = fileData.match(/^data:([^;]+);base64,(.+)$/);

        if (matches) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      });

      const promptText = query
        ? `Analyze the attached file(s) and generate structured study notes for: "${query}".`
        : `Analyze the attached file(s) and generate structured English study notes.`;

      parts.push({ text: promptText });
    } else {
      parts.push({
        text: `Create structured study notes for the topic: "${query}"`,
      });
    }

    // 🤖 Generate content
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description: "Normalized topic title",
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Section heading",
                  },
                  content: {
                    type: Type.STRING,
                    description: "Section content (markdown allowed)",
                  },
                  type: {
                    type: Type.STRING,
                    enum: ["normal", "example", "warning", "highlight"],
                  },
                },
                required: ["title", "content", "type"],
              },
            },
          },
          required: ["topic", "sections"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from AI model.");
    }

    // 📦 Parse structured JSON
    const data = JSON.parse(response.text) as StudyNote;
    return data;
  } catch (error) {
    console.error("Gemini generation error:", error);

    if (error instanceof Error) {
      throw new Error(`AI Service Error: ${error.message}`);
    }

    throw error;
  }
};
