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
const fetchAtomaRole = async (content: string): Promise<string> => {
	const completion = await atomaSDK.chat.create({
		model: "meta-llama/Llama-3.3-70B-Instruct",
		stream: false,
		messages: [
			// { role: "developer", content: atomaSystemMessage },
			{ role: "user", content: content },
		],
	});

	console.log(completion.choices[0].message);

	return completion.choices[0].message.content || "";
};

export default fetchAtomaRole;
