import { Router } from "express";
import fetchFalCompletion from "../utils/ai/falAI";

const router = Router();

router.post("/createImage", async (req, res) => {
	const { prompt } = req.body;

	if (!prompt) {
		res.status(400).json({ error: "Prompt is required." });
		return;
	}

	try {
		const falResponse = await fetchFalCompletion(prompt);

		res.status(200).json({
			success: true,
			data: falResponse.data,
			requestId: falResponse.requestId,
		});
	} catch (error) {
		console.error("Error in /fal-completion route:", error);
		res.status(500).json({ error: "Failed to fetch FAL completion." });
	}
});

export default router;
