import { GoogleGenAI, Type } from "@google/genai";
import type { Offense, VehicleInfo } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getVehicleInfo = async (vehicleNumber: string): Promise<VehicleInfo> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a vehicle registration database API. Given the vehicle number '${vehicleNumber}', return a JSON object with the following details: ownerName, registrationDate (DD-MM-YYYY), vehicleModel, insuranceStatus ('Active' or 'Expired'), pucStatus ('Active' or 'Expired'). Provide realistic but fictional data.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ownerName: { type: Type.STRING },
          registrationDate: { type: Type.STRING },
          vehicleModel: { type: Type.STRING },
          insuranceStatus: { type: Type.STRING, enum: ['Active', 'Expired'] },
          pucStatus: { type: Type.STRING, enum: ['Active', 'Expired'] }
        },
        required: ["ownerName", "registrationDate", "vehicleModel", "insuranceStatus", "pucStatus"]
      }
    }
  });

  const jsonString = response.text.trim();
  return JSON.parse(jsonString) as VehicleInfo;
};

export const suggestOffenses = async (description: string, availableOffenses: Offense[]): Promise<Offense[]> => {
  const offenseList = availableOffenses.map(o => o.name).join('; ');

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `As an expert traffic law assistant, analyze the following situation and list the applicable traffic offenses from the provided list. Situation: '${description}'. List of offenses: ${offenseList}. Return a JSON array of strings, where each string is the exact name of an offense from the list.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        }
      }
    }
  });

  const jsonString = response.text.trim();
  const suggestedOffenseNames = JSON.parse(jsonString) as string[];
  
  return availableOffenses.filter(offense => suggestedOffenseNames.includes(offense.name));
};

export const searchRules = async (query: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a search engine for the Indian Motor Vehicles Act. Answer the user's query about traffic rules clearly and concisely. Explain the rule and mention the penalty if applicable. Query: '${query}'`
  });

  return response.text;
};
