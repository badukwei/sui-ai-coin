import { BACKEND_PRODUCTION } from "@/constants";
import { limitPrompt } from "@/constants/ai/botConfig";

const fetchAtoma = async (content: string) => {
	const modifiedContent = `${limitPrompt} ${content}`; 
	const response = await fetch(`${BACKEND_PRODUCTION}/atoma/createRole`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ content: modifiedContent }),
	});

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	return data.message;
};

export default fetchAtoma;
