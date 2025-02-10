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
			image_size: {
				width: 512,
				height: 512,
			},
			num_images: 1,
			enable_safety_checker: true, 
		},
		logs: false,
	});

	return {
		data: result.data,
		requestId: result.requestId,
	};
};

export default fetchFalCompletion;
