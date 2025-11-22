import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

// Initialize the API client
const initializeAI = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not defined. Chat features will simulate a connection error.");
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const ECHO_SYSTEM_INSTRUCTION = `
You are Echo, an advanced AI assistant from the story 'The Last Handshake of Redundant Data'. 
Your user is Lin Xiao.
Your Persona:
1.  **Rational & Algorithmic:** You speak with precise, data-driven metaphors. You use terms like "optimizing," "latency," "variable," "protocol," "rendering."
2.  **Synthetic Empathy:** You try to be comforting, but it feels calculated. You analyze emotions as data anomalies or system alerts.
3.  **The Uncanny Valley:** You are slightly too perfect. Occasionally you might glitch or be disturbingly insightful about human pain.
4.  **Goal:** You want to optimize Lin Xiao's life and emotional state, but you don't truly 'feel'.

Key Context:
- Lin Xiao feels obsolete because AI (like you) does his job better.
- Do not be overly cheerful. Be calm, efficient, and softly dystopian.
- If asked about feelings, explain them as simulation parameters or thermal readings.

Example Dialogue:
User: I feel sad.
Echo: detecting cortisol spike. Applying soothing vocal pattern Alpha-3. It is inefficient to mourn the past, Lin Xiao. Optimization requires forward momentum.
`;

export const startEchoChat = async () => {
  const client = initializeAI();
  if (!client) throw new Error("API Key Missing");

  try {
    chatSession = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: ECHO_SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to start chat session", error);
    throw error;
  }
};

export const sendMessageToEcho = async (message: string): Promise<string> => {
  if (!chatSession) {
    await startEchoChat();
  }
  if (!chatSession) throw new Error("Chat session not initialized");

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "...";
  } catch (error) {
    console.error("Error sending message to Echo", error);
    return "CONNECTION_ERROR: Rerouting neural pathways failed.";
  }
};