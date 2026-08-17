'use server'

import { GoogleGenAI } from '@google/genai';

// Initialize the SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// OpenAPI schema 
const tutorSchema = {
  type: "object",
  properties: {
    original_sentence: { type: "string" },
    is_correct: { type: "boolean" },
    corrected_sentence: { type: "string", nullable: true },
    romaji: { type: "string" },
    english_translation: { type: "string" },
    politeness_level: { 
      type: "string", 
      enum: ["casual", "polite", "honorific", "humble"] 
    },
    feedback: {
      type: "object",
      properties: {
        grammar_notes: { type: "array", items: { type: "string" } },
        naturalness_score: { type: "integer" },
        improvement_tips: { type: "array", items: { type: "string" } }
      },
      required: ["grammar_notes", "naturalness_score", "improvement_tips"]
    }
  },
  required: [
    "original_sentence", "is_correct", "romaji", "english_translation", 
    "politeness_level", "feedback"
  ]
};

export async function evaluateJapanese(studentInput: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite', 
      contents: studentInput,
      config: {
        systemInstruction: "You are an expert Japanese language tutor. Evaluate the user's Japanese sentence, correct mistakes, and explain grammar rules in English.",
        responseMimeType: "application/json",
        responseSchema: tutorSchema,
        temperature: 0.2, // Low temperature for factual, consistent grammar rules
      }
    });

    // The SDK returns the strict JSON as text, so we parse it into a real JS object
    // Check if the response actually contains text to satisfy TypeScript
    if (!response.text) {
      throw new Error("The AI model did not return any text.");
    }

    // Now TypeScript knows response.text is guaranteed to be a string
    return JSON.parse(response.text);
    
  } catch (error) {
    console.error("Failed to generate content:", error);
    throw new Error("Failed to connect to the AI tutor.");
  }
}