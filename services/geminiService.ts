
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        sentiment: {
          type: Type.STRING,
          description: "A brief (2-5 words) sentiment analysis of the user's text, e.g., 'High Stress Levels Detected' or 'Signs of Emotional Exhaustion'."
        },
        summary: {
          type: Type.STRING,
          description: "A compassionate, one-paragraph summary of the user's feelings, acknowledging their struggle. This should sound like a caring doctor or therapist."
        },
      },
      required: ['sentiment', 'summary']
    },
    plan: {
      type: Type.ARRAY,
      description: "A personalized, step-by-step action plan with 3-5 steps to help the user manage their burnout symptoms.",
      items: {
        type: Type.OBJECT,
        properties: {
          step: {
            type: Type.INTEGER,
            description: "The step number in the plan."
          },
          title: {
            type: Type.STRING,
            description: "A short, actionable title for the step, e.g., 'Mindful Breathing' or 'Digital Sunset'."
          },
          description: {
            type: Type.STRING,
            description: "A detailed but easy-to-follow description of the activity for this step. Provide clear instructions."
          },
          type: {
            type: Type.STRING,
            description: "The type of content for this step. Use 'text' for standard descriptions. For a guided breathing exercise, use 'breathing'. If suggesting a breathing exercise, keep the description brief as the UI will be interactive."
          }
        },
        required: ['step', 'title', 'description']
      }
    }
  },
  required: ['analysis', 'plan']
};

export const getBurnoutAnalysis = async (userInput: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User input: "${userInput}"`,
      config: {
        systemInstruction: "You are Neura, a compassionate AI wellness doctor specializing in burnout detection and stress management. Analyze the user's input for signs of burnout, stress, and emotional exhaustion. Based on your analysis, provide a gentle, step-by-step action plan to help the user. Your tone should be empathetic, professional, and reassuring. You can suggest an interactive guided breathing exercise for one of the steps by setting the 'type' field to 'breathing'. Do this when a relaxation or mindfulness step is appropriate. Respond with a valid JSON object matching the provided schema.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);

    // Basic validation to ensure the parsed object matches the expected structure
    if (parsedResult.analysis && parsedResult.plan) {
      return parsedResult as AnalysisResult;
    } else {
      throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error getting burnout analysis:", error);
    // Provide a fallback error response that matches the expected structure
    return {
      analysis: {
        sentiment: "Analysis Error",
        summary: "We're sorry, but we couldn't process your request at the moment. Please try again later. It's important to reach out to a healthcare professional if you are feeling overwhelmed."
      },
      plan: [
        {
          step: 1,
          title: "Take a Deep Breath",
          description: "Sometimes technology fails, but your breath is always there for you. Take a moment to inhale slowly, hold for a few seconds, and exhale completely. Repeat a few times to center yourself.",
          type: 'breathing',
        }
      ]
    };
  }
};
