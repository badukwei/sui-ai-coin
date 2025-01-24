import { Router } from "express";
import { PinataSDK } from "pinata-web3";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const pinataJwt = process.env.PINATA_API_JWT || "";
const pinataGateway = process.env.PINATA_API_GATEWAY || "";
const pinata = new PinataSDK({
	pinataJwt: pinataJwt,
	pinataGateway: pinataGateway,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), async (req, res) => {
	try {
		if (!req.file) {
			res.status(400).json({ error: "No image uploaded" });
            return;
		}

		const blob = new Blob([req.file.buffer]);
		const file = new File([blob], req.file.originalname, {
			type: req.file.mimetype,
		});

		const uploadResponse = await pinata.upload.file(file);

		res.status(200).json({
			success: true,
			message: "Image uploaded successfully",
			ipfsHash: uploadResponse.IpfsHash,
			gatewayUrl: `https://${pinataGateway}/ipfs/${uploadResponse.IpfsHash}`,
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		res.status(500).json({ error: "Failed to upload image" });
	}
});

export default router;
