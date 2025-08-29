import { createPartFromUri, GoogleGenAI } from "@google/genai";
import sebastienData from "../data/data.json" with {type: "json"};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getResponseFromAI = async (message) => {
  try {
    const file = await ai.files.upload({
      file: "./data/CV_Sebastien_Morazzani_developpeur_web.pdf",
      config: {
        displayName: "CV_Sebastien_Morazzani_developpeur_web.pdf",
      },
    });

    let getFile = await ai.files.get({ name: file.name });
    while (getFile.state === "PROCESSING") {
      getFile = await ai.files.get({ name: file.name });
      console.log(`current file status: ${getFile.state}`);
      console.log("File is still processing, retrying in 5 seconds");

      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
    }
    if (file.state === "FAILED") {
      throw new Error("File processing failed.");
    }

    const content = [
      `You are a helpful assistant, analyze and answer the question coherently from a recruiter for Sebastien Morazzani. Answer shortly and politely. Use the json that is provided to to answer the question, a curriculum vitae is also provided in the files, the json will contain all the data about Sebastien Morazzani on his capacities to do the developer job. Only return the sentence. Here's is the question you need to answer: ${
        message.message
      }. For example if the recruiter asks: Where is Sebastien Morazzani from ? You answer: Sebastien Morazzani is from Nantes, France. Adapt your language based on the question language. Here's is the json to help you formulate your answer: ${JSON.stringify(
        sebastienData
      )}`,
    ];

    if (file.uri && file.mimeType) {
      const fileContent = createPartFromUri(file.uri, file.mimeType);
      content.push(fileContent);
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
      config: {
        systemInstruction: "You are a helpful Assistant.",
      },
    });

    console.log("response" + response);
    
    if (!response) {
      throw new Error("No response from AI");
    }

    return response;
  } catch (error) {
    throw new Error("Failed to get response from AI" + error.message);
  }
};

export default getResponseFromAI;
