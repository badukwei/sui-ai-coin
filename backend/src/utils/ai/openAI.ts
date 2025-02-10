import OpenAI from "openai";
import { openAISystemMessage } from "../../constants/ai/openAI";
import dotenv from "dotenv";

const openAIApiKey = process.env.OPENAI_API_KEY || "";

const openai = new OpenAI({
	apiKey: openAIApiKey,
});

/**
 * Fetch completion from OpenAI
 * @param {string} content - The user content to send to OpenAI.
 * @returns {Promise<string>} - The assistant's response.
 */
const fetchOpenAICompletion = async (content: string): Promise<string> => {
	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: openAISystemMessage },
			{ role: "user", content: content },
		],
		store: true,
		response_format: {
			type: "json_object",
		},
	});

	return completion.choices[0].message.content || "";
};

export default fetchOpenAICompletion;
