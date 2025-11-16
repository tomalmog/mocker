import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/lib/config';

export const anthropic = new Anthropic({
  apiKey: config.ai.anthropicApiKey,
});

export async function generateChatCompletion(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt?: string,
  maxTokens: number = 2000
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response type');
}
