import { Router } from "express";
import fetchAtomaCompletion from "../utils/ai/atoma/createMetadata";
import fetchAtomaImage from "../utils/ai/atoma/createImage";
import fetchAtomaRole from "../utils/ai/atoma/createRole";

const router = Router();

router.post("/createMetadata", async (req, res) => {
	try {
		const { content } = req.body;
		if (!content) {
			res.status(400).json({ error: "userContent is required." });
			return;
		}

		const response = await fetchAtomaCompletion(content);

		res.status(200).json({
			success: true,
			message: response,
		});
	} catch (error) {
		console.error("Error fetching Atoma completion:", error);
		res.status(500).json({ error: "Failed to fetch Atoma completion." });
	}
});

router.post("/createImage", async (req, res) => {
	try {
		const { content } = req.body;
		if (!content) {
			res.status(400).json({ error: "userContent is required." });
			return;
		}

		const response = await fetchAtomaImage(content);

		res.status(200).json({
			success: true,
			message: response,
		});
	} catch (error) {
		console.error("Error fetching Atoma completion:", error);
		res.status(500).json({ error: "Failed to fetch Atoma completion." });
	}
});

router.post("/createRole", async (req, res) => {
	try {
		const { content } = req.body;
		if (!content) {
			res.status(400).json({ error: "userContent is required." });
			return;
		}

		const response = await fetchAtomaRole(content);

		res.status(200).json({
			success: true,
			message: response,
		});
	} catch (error) {
		console.error("Error fetching Atoma completion:", error);
		res.status(500).json({ error: "Failed to fetch Atoma completion." });
	}
});

export default router;
