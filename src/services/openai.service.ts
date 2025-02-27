import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // This will be removed when moved to backend
    });
  }

  async generateChatCompletion(userMessage: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage },
        ],
      });

      return (
        completion.choices[0].message.content ||
        "Sorry, I couldn't process that request."
      );
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const openAIService = new OpenAIService(
  import.meta.env.VITE_OPENAI_API_KEY
);
