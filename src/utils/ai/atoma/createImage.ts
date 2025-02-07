import { AtomaSDK } from "atoma-sdk";
import { atomaSystemMessage } from "../../../constants/ai/atoma";

const atomaSDK = new AtomaSDK({
	bearerAuth: process.env["ATOMASDK_BEARER_AUTH"] ?? "",
});

/**
 * Fetch completion from OpenAI
 * @param {string} content - The user content to send to OpenAI.
 * @returns {Promise<string>} - The assistant's response.
 */
const fetchAtomaImage = async (content: string): Promise<string> => {
	const completion = await atomaSDK.images.generate({
		model: "black-forest-labs/FLUX.1-schnell",
		prompt: content,
		n: 1,
		size: "1024x1024",
	});

	console.log(completion);

	return completion.data[0].url || "";
};

export default fetchAtomaImage;
