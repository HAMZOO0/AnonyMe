// src/app/api/gemini/route.ts
// ! it pick env its own
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
   const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

   // IMPORTANT: Set up your Gemini API key as an environment variable.
   // See https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
   //  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
   //     return NextResponse.json({ error: "Gemini API key not configured in .env.local" }, { status: 500 });
   //  }

   if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
   }

   try {
      const ai = new GoogleGenAI({
         //  apiKey: process.env.GEMINI_API_KEY,
      });

      // Note: The 'gemini-2.5-flash' model name is hypothetical.
      // Please use a valid model name like 'gemini-1.5-flash'.
      const response = await ai.models.generateContent({
         model: "gemini-1.5-flash",
         contents: prompt,
      });
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "No text generated";
      console.log(text);

      return NextResponse.json({ text });
   } catch (error) {
      console.error("Gemini API Error:", error);
      return NextResponse.json({ error: "Failed to get response from Gemini API" }, { status: 500 });
   }
}
