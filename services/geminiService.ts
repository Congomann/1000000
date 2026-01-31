
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Lead, ProductType, CalendarEvent, AI_ASSISTANT_ID } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * LEAD ENRICHMENT (Contextual Analysis)
 * Analyzes raw interest and provides deeper context for advisors.
 */
export const enrichLeadContext = async (lead: Partial<Lead>): Promise<string> => {
  try {
    const prompt = `
      Analyze this prospect for New Holland Financial Group. 
      Name: ${lead.name}
      Interested in: ${lead.interest}
      User Message: "${lead.message}"
      
      Determine:
      1. Immediate Need Intensity (1-10).
      2. Life Stage Assessment (e.g., Young Family, Wealth Preservation, Business Scaler).
      3. Strategic Product Upsell (Next logical service after ${lead.interest}).
      4. Likely Pain Points.
      
      Keep it brief and professional for a CRM note. Max 100 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });

    return response.text || "No deeper context identified.";
  } catch (error) {
    return "Interest analysis currently offline.";
  }
};

/**
 * DEEP STRATEGIC BRIEF (Complex Reasoning)
 * Model: gemini-3-pro-preview
 */
export const generateStrategicBrief = async (lead: Lead): Promise<string> => {
  try {
    const prompt = `
      You are a high-level Strategic Growth Consultant for New Holland Financial Group. 
      Analyze the following lead data for deep conversion potential.
      
      LEAD PROFILE:
      Name: ${lead.name}
      Product: ${lead.interest}
      Source: ${lead.source}
      Context: "${lead.message}"
      Existing Notes: "${lead.notes || 'None'}"
      Vertical Specifics: ${JSON.stringify(lead.lifeDetails || lead.realEstateDetails || lead.securitiesDetails || lead.customDetails || {})}
      
      Generate a "Neural Intelligence Brief":
      1. PSYCHOGRAPHIC PROFILE: What is driving this user emotionally?
      2. REJECTION DEFENSE: Top 3 likely objections and how to counter them.
      3. CROSS-VERTICAL MAPPING: If they close on ${lead.interest}, what is the 12-month cross-sell roadmap?
      4. STRATEGIC OPENER: Draft a high-impact first sentence for a call.
      
      Format with bold headers. Maximum 200 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text || "Strategic analysis failed.";
  } catch (error) {
    console.error("Gemini strategic brief failed", error);
    return "Intelligence engine offline. Please verify API configuration.";
  }
};

/**
 * INTERNAL ASSISTANT QUERY (Fast Reasoning)
 * Model: gemini-3-flash-preview
 * Processes internal chat messages and administrative queries.
 */
export const getInternalAssistantResponse = async (
  message: string, 
  userContext: string,
  history: {role: 'user'|'model', text: string}[] = []
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `
          You are the "NHFG Neural Hub", an expert internal assistant for New Holland Financial Group advisors and administrators.
          Context about the user: ${userContext}
          
          You have access to knowledge about:
          - Life Insurance (Term, IUL, Whole, Universal)
          - Real Estate (Pipeline, Escrow, Portfolios)
          - Mortgage (Refi, Purchase, HELOC)
          - Securities (Series 6/7/63, Fiduciary, AUM)
          - CRM Workflows (Lead Ingestion, Smart Reminders)
          
          Tone: Professional, highly efficient, and encouraging.
          Format: Use bullet points for lists. Be concise.
        `,
        thinkingConfig: { thinkingBudget: 0 }
      },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I am processing that request now.";
  } catch (error) {
    return "The Intelligence Hub is currently calibrating. Please try again in 60 seconds.";
  }
};

/**
 * SMART REMINDER GENERATION (Fast Response)
 * Model: gemini-3-flash-preview
 */
export const generateSmartReminder = async (lead: Lead): Promise<Partial<CalendarEvent>> => {
  try {
    const prompt = `
      Based on this financial lead, generate one optimal follow-up reminder.
      Name: ${lead.name}
      Need: ${lead.interest}
      Note: "${lead.message}"
      
      Return JSON ONLY: { "title": "...", "description": "...", "delayDays": number }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const data = JSON.parse(response.text || '{}');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (data.delayDays || 3));

    return {
      title: data.title || `Follow up: ${lead.name}`,
      description: data.description || `Automated AI follow-up for ${lead.interest}`,
      date: futureDate.toISOString().split('T')[0],
      time: '10:00 AM',
      type: 'reminder'
    };
  } catch (error) {
    return {
      title: `Follow up: ${lead.name}`,
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      type: 'reminder'
    };
  }
};

/**
 * API LOG INTELLIGENCE (Fast Analysis)
 * Model: gemini-3-flash-preview
 */
export const analyzeApiLogs = async (logPayload: any): Promise<string> => {
  try {
    const prompt = `
      As a Technical Operations Assistant, explain this raw API Webhook payload in simple business terms for a non-technical advisor.
      Payload: ${JSON.stringify(logPayload)}
      
      Explain:
      1. What platform sent this?
      2. What data was successfully captured?
      3. Any missing fields that might cause issues?
      
      Tone: Concise and professional. Max 60 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.text || "No insights available.";
  } catch (error) {
    return "Log analysis unavailable.";
  }
};

// Existing lead intake/chat logic preserved below...
export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const createLeadTool: FunctionDeclaration = {
  name: 'createLead',
  description: 'Save a new potential client lead into the CRM when all necessary information is collected.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      email: { type: Type.STRING },
      phone: { type: Type.STRING },
      city: { type: Type.STRING },
      state: { type: Type.STRING },
      interest: { type: Type.STRING, enum: Object.values(ProductType) },
      summary: { type: Type.STRING }
    },
    required: ['name', 'phone', 'interest']
  }
};

export const getChatResponse = async (history: ChatHistoryItem[], currentMessage: string, context: string): Promise<{ text: string, leadData?: any }> => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are a helpful AI assistant for New Holland Financial Group. Context: ${context}`,
      tools: [{ functionDeclarations: [createLeadTool] }],
      thinkingConfig: { thinkingBudget: 32768 }
    },
    history: history,
  });
  const result = await chat.sendMessage({ message: currentMessage });
  const toolCalls = result.functionCalls;
  if (toolCalls && toolCalls.length > 0) {
    const call = toolCalls[0];
    if (call.name === 'createLead') {
      return { text: "Thank you! Information received.", leadData: call.args };
    }
  }
  return { text: result.text || "Unable to respond." };
};
