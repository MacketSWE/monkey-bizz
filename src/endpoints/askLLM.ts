import { LLMMessage } from "../types/llmMessage";

export const askLLM = async (messages: LLMMessage[]) => {
  const res = await fetch(`https://honeyginger-dev.onrender.com/api/mbizz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });
  const data = await res.json();

  if (data.message && data.message.choices && data.message.choices.length > 0) {
    const usage = data.message.usage;

    return {
      content: data.message.choices[0].message.content,
      usage: {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
      },
    };
  }

  throw new Error("Failed to get response from LLM");
};
