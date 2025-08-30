import getResponseFromAI from "../services/gemini.services.js";

const generateResponse = async (recruiterMessageObject) => {
  try {
    const response = await getResponseFromAI(recruiterMessageObject);

    if (!response) {
      throw new Error("No response from AI");
    }

    const message = {
      from: "Assistant",
      to: "Recruiter",
      recruiterMsg: recruiterMessageObject,
      message: response.candidates[0].content.parts[0].text,
      meta: {
        model: "gemini-2.5-flash",
        responseId: "7XOxaP3VJOnYvdIP7LzwuAE",
      },
    };

    console.log("New message : ", message);

    return message;
  } catch (error) {
    throw new Error(error);
  }
};

export { generateResponse };
