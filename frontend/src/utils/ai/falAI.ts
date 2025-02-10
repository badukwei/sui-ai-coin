import { BACKEND_PRODUCTION } from "@/constants";

/**
 * Fetches an image URL from the specified API
 * @param {string} prompt - The prompt to send to the API for generating an image.
 * @returns {Promise<string>} - The URL of the generated image.
 */
const fetchImage = async (prompt: string): Promise<string> => {
  const response = await fetch(`${BACKEND_PRODUCTION}/falai/createImage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.success && data.data?.images?.[0]?.url) {
    return data.data.images[0].url;
  }

  throw new Error("Image URL not found in the API response.");
};

export default fetchImage;
