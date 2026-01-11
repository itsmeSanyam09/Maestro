import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// 1. Initialize per your template
// The client automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Strip the data URL prefix (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = imageBase64.split(",")[1];

    // 2. Call generateContent with the specific model and JSON schema
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite", // Switch to "gemini-1.5-flash" if 2.0/2.5 is not available to your key yet
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            dimensions: {
              type: "OBJECT",
              properties: {
                length_cm: { type: "STRING", description: "Estimated length in cm" },
                width_cm: { type: "STRING", description: "Estimated width in cm" },
                depth_cm: { type: "STRING", description: "Estimated depth in cm" },
              },
              required: ["length_cm", "width_cm", "depth_cm"],
            },
            severity: {
              type: "STRING",
              enum: ["Low", "Medium", "High"],
            },
            reasoning: {
              type: "STRING",
              description: "How the dimensions were calculated based on reference objects",
            },
          },
        },
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze this pothole image.
              1. Identify a reference object (shoe, tire, markings) to calculate scale.
              2. Estimate Length, Width, and Depth in Centimeters.
              3. If no reference object is found, provide a "Rough Estimate" and note it in reasoning.`,
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64,
              },
            },
          ],
        },
      ],
    });

    const rawText = await response.text || "{}";
    const data = JSON.parse(rawText);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}