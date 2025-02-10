import { falAIUserPrompt } from "@/constants/ai/prompt";
import { Metadata } from "@/types/ai/metadata";

const formatCreateImagePrompt = (metadata: Metadata): string => {
  return `${falAIUserPrompt}\nSymbol: ${metadata.symbol}\nName: ${metadata.name}\nDescription: ${metadata.description}`;
};

export default formatCreateImagePrompt;
