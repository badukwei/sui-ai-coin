import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

const falAIApiKey = process.env.FALAI_API_KEY || "";

fal.config({
	credentials: falAIApiKey,
});

/**
 * Function to subscribe to FAL service
 * @param {string} prompt - The prompt to send to FAL.
 * @returns {Promise<object>} - The FAL response.
 */
const fetchFalCompletion = async (prompt: string): Promise<any> => {
  const result = await fal.subscribe("fal-ai/flux/schnell", {
    input: {
      prompt,
    },
    logs: false,
    // onQueueUpdate: (update) => {
    //   if (update.status === "IN_PROGRESS") {
    //     update.logs.map((log) => log.message).forEach(console.log);
    //   }
    // },
  });

  return {
    data: result.data,
    requestId: result.requestId,
  };
};

export default fetchFalCompletion;
