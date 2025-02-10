import { BACKEND_PRODUCTION } from "@/constants";
import { Metadata, MetadataApiResponse } from "@/types/ai/metadata";

/**
 * Fetch metadata from the /createMetadata API
 * @param {string} content - The input content to send to the API.
 * @returns {Promise<Metadata>} - The response containing the metadata.
 */
const fetchMetadata = async (content: string): Promise<Metadata> => {
  const response = await fetch(`${BACKEND_PRODUCTION}/openai/createMetadata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data: MetadataApiResponse = await response.json();
  const metadata = data.message;
  return metadata;
};

export default fetchMetadata;
