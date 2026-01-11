
import { GoogleGenAI, Type } from "@google/genai";
import { VisualStyleDefinition } from "../types";

// Using Pro for professional public-ready analysis
const MODEL_NAME = 'gemini-3-pro-preview';

export async function analyzeImageStyle(base64Image: string): Promise<VisualStyleDefinition> {
  // Use process.env.API_KEY directly as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: `You are a world-class visual architect and design systems lead. Dissect this image to extract its absolute "Visual DNA". This definition will be used in NotebookLM and Gemini Nano Banana prompts to replicate this exact aesthetic for high-end infographics.

Strict Architectural Requirements:
1. STYLE ID: A unique identifier (e.g., STYLE #B-902).
2. STYLE NAME: Evocative nomenclature.
3. TONE: Professional descriptors for mood and authority.
4. VISUAL IDENTITY: Provide a clean, curated palette. 
   - Define primary Background, Text, and Accent hex codes. 
   - Detect and include an array of "Secondary Colors". 
   - ADAPTIVE LOGIC: For minimalist or low-color images, provide EXACTLY 2. For complex diagrams, multi-colored architectures, or vibrant illustrations, extract between 3 and 5 significant secondary colors that represent intentional design categories or accents. Avoid insignificant color noise (like anti-aliasing artifacts).
5. IMAGE STYLE: 
   - "Features": Core visual elements.
   - "Texture": Surface qualities and tactile feel.
   - "Composition": Spatial arrangement and layout logic.
   - "Lighting": Light source, shadow quality, and luminosity.
6. TYPOGRAPHY: Define "Heading", then "Body" and "Font Weights".
7. TAGS: Generate 3-5 relevant categories/tags (e.g., "Cyberpunk", "Minimalist", "Corporate", "Neo-Vintage", "High-Contrast").
8. SCORES: Grade (0-10) for: Legibility, Hierarchy, Composition, Theme Fit, Visual Impact. Total out of 50.
9. COMPATIBILITY: Include ["Nano Banana Pro", "NotebookLM", "Gemini"].

Output only valid JSON.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          styleName: { type: Type.STRING },
          styleId: { type: Type.STRING },
          compatibility: { type: Type.ARRAY, items: { type: Type.STRING } },
          totalScore: { type: Type.NUMBER },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallDesignSettings: {
            type: Type.OBJECT,
            properties: {
              tone: { type: Type.STRING }
            },
            required: ["tone"]
          },
          visualIdentity: {
            type: Type.OBJECT,
            properties: {
              backgroundColor: { type: Type.STRING },
              textColor: { type: Type.STRING },
              accentColor: { type: Type.STRING },
              secondaryColors: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["backgroundColor", "textColor", "accentColor", "secondaryColors"]
          },
          imageStyle: {
            type: Type.OBJECT,
            properties: {
              features: { type: Type.STRING },
              texture: { type: Type.STRING },
              composition: { type: Type.STRING },
              lighting: { type: Type.STRING },
              details: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["features", "texture", "composition", "lighting", "details"]
          },
          typography: {
            type: Type.OBJECT,
            properties: {
              heading: { type: Type.STRING },
              details: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["heading", "details"]
          },
          scores: {
            type: Type.OBJECT,
            properties: {
              legibility: { type: Type.NUMBER },
              hierarchy: { type: Type.NUMBER },
              composition: { type: Type.NUMBER },
              themeFit: { type: Type.NUMBER },
              visualImpact: { type: Type.NUMBER }
            },
            required: ["legibility", "hierarchy", "composition", "themeFit", "visualImpact"]
          }
        },
        required: [
          "styleName", "styleId", "compatibility", "totalScore", "tags",
          "overallDesignSettings", "visualIdentity", "imageStyle", 
          "typography", "scores"
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Architectural analysis failed. Check your API key.");
  
  return JSON.parse(text) as VisualStyleDefinition;
}
