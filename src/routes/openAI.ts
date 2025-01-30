import { Router } from "express";
import fetchOpenAICompletion from "../utils/ai/openAI";

const router = Router();

router.post("/createMetadata", async (req, res) => {
	try {
		const { content } = req.body;
		if (!content) {
			res.status(400).json({ error: "userContent is required." });
			return;
		}

		const openAIresponse = await fetchOpenAICompletion(content);
		const metadata = JSON.parse(openAIresponse);

		res.status(200).json({
			success: true,
			message: metadata,
		});
	} catch (error) {
		console.error("Error fetching OpenAI completion:", error);
		res.status(500).json({ error: "Failed to fetch OpenAI completion." });
	}
});

export default router;
