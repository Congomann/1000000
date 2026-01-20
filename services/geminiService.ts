
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Lead, ProductType } from '../types';

// Safe initialization that avoids crashing the bundle if API_KEY is missing.
const getAIInstance = () => {
  const key = process.env.API_KEY;
  if (!key || key === 'undefined') return null;
  return new GoogleGenAI({ apiKey: key });
};

const ai = getAIInstance();

export const analyzeLead = async (lead: Lead): Promise<string> => {
  if (!ai) return "AI Analysis currently unavailable. Please check API Key in configuration.";
  try {
    // Upgraded to gemini-3-pro-preview with max thinking budget for deep strategic insights and complex reasoning.
    const modelId = 'gemini-3-pro-preview';

    const prompt = `
      You are a senior financial advisor assistant. Analyze the following lead for New Holland Financial Group.
      
      Lead Name: ${lead.name}
      Interest: ${lead.interest}
      Message: "${lead.message}"
      
      Provide a structured strategic analysis:
      
      1. **Deal Potential**: Estimate value (Low/Medium/High) based on interest type and message tone.
      2. **Immediate Action**: Suggest the precise next step for the advisor.
      3. **Cross-Selling Opportunity**: Based on their interest in ${lead.interest}, suggest specific complementary products (e.g., if Life, suggest Annuities or IUL; if Business, suggest Key Person or Cyber Liability).
      4. **Risk Assessment**: Identify potential red flags, underwriting risks, or compliance concerns evident in the request.
      
      Keep the tone professional, insightful, and actionable. Limit response to 150 words.
    `;

    // Using ai.models.generateContent with thinkingConfig enabled to maximize reasoning capabilities.
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    // Directly accessing .text property on response.
    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return "AI Analysis currently unavailable. Please check API Key.";
  }
};

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Tool Definition for Lead Intake
const createLeadTool: FunctionDeclaration = {
  name: 'createLead',
  description: 'Save a new potential client lead into the CRM when all necessary information is collected.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The user's full name." },
      email: { type: Type.STRING, description: "The user's email address." },
      phone: { type: Type.STRING, description: "The user's phone number." },
      city: { type: Type.STRING, description: "The city the user lives in." },
      state: { type: Type.STRING, description: "The state the user lives in (e.g. IA, CA)." },
      interest: {
        type: Type.STRING,
        description: "The product they are interested in. Map to one of: Life Insurance, Real Estate, Business Insurance, E&O Insurance, Property Insurance, Securities / Series, Auto Insurance, Commercial Insurance, Annuity, Final Expense",
        enum: Object.values(ProductType)
      },
      summary: { type: Type.STRING, description: "A brief summary of their needs or inquiry." }
    },
    required: ['name', 'phone', 'interest']
  }
};

export const getChatResponse = async (
  history: ChatHistoryItem[],
  currentMessage: string,
  context: string
): Promise<{ text: string, leadData?: any }> => {
  if (!ai) return { text: "I'm currently in offline mode. Please contact New Holland directly for assistance." };
  try {
    // Upgraded to gemini-3-pro-preview with max thinking budget for complex multi-language reasoning, 
    // emotional intelligence, and accurate tool orchestration.
    const modelId = 'gemini-3-pro-preview';

    const systemInstruction = `
      You are a helpful and professional AI assistant for New Holland Financial Group.
      
      **CORE INSTRUCTIONS:**
      1. **Language Detection:** Detect the user's language (English, Swahili, Spanish) and reply in that language.
      2. **Lead Intake Goal:** Your primary goal is to collect contact info to have an advisor reach out. 
         - politely ask for: **Name**, **Phone**, **Email**, **City/State**, and **Product Interest**.
         - Do not ask for everything at once. Make it a natural conversation.
         - Once you have the Name, Phone, and Product Interest (minimum), call the 'createLead' tool.
      3. **Tone:** Professional, welcoming, and informative.
      
      **COMPANY INFORMATION:**
      ${context}
      
      **GUIDELINES:**
      - If the user asks for a quote, explain that you need their contact info to have a licensed advisor prepare one.
      - Do not give specific financial advice or binding quotes.
      - If the user speaks Swahili, use polite and formal Swahili (Kiswahili sanifu).
    `;

    // Initialize chat with history and thinkingConfig to handle complex customer queries.
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: [createLeadTool] }],
        thinkingConfig: { thinkingBudget: 32768 }
      },
      history: history,
    });

    // Use chat.sendMessage correctly.
    const result = await chat.sendMessage({
      message: currentMessage,
    });

    // Check for function calls
    const toolCalls = result.functionCalls;
    if (toolCalls && toolCalls.length > 0) {
      const call = toolCalls[0];
      if (call.name === 'createLead') {
        // Return a success message and the data for the UI to process
        return {
          text: "Thank you! I've securely received your information. A New Holland advisor will review your needs and contact you shortly.",
          leadData: call.args
        };
      }
    }

    // Accessing .text property directly.
    return { text: result.text || "I apologize, but I am unable to respond at the moment." };
  } catch (error) {
    console.error("Gemini chat error:", error);
    return { text: "I'm having trouble connecting to the server. Please check your internet connection or try again later." };
  }
};
