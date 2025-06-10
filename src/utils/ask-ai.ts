import axios from 'axios';

type askAiProps = {
  systemMessage: string;
  userMessage: string;
};

export async function askAi({
  systemMessage,
  userMessage,
}: askAiProps): Promise<string> {
  const messages = [
    { content: systemMessage, role: 'system' },
    { content: userMessage, role: 'user' },
  ];

  try {
    const gptResponse = await axios.post('/api/chatgpt', {
      messages,
    });

    return gptResponse.data.response;
  } catch (error) {
    throw new Error(`Ask AI error: ${error}`);
  }
}
