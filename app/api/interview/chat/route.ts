import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic';
import type { ChatMessage, Problem } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, chatHistory, userCode, problem } = await req.json();

    // Get the session
    const session = global.sessions?.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Build context for the AI interviewer
    const systemPrompt = buildInterviewerPrompt(session.settings, problem);
    const conversationHistory = buildConversationHistory(chatHistory, userCode);

    // Get AI response
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: conversationHistory,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const message = content.text;

    // Update session with new message
    session.chatHistory.push(
      chatHistory[chatHistory.length - 1], // User's message
      {
        role: 'interviewer',
        content: message,
        timestamp: Date.now(),
      }
    );

    global.sessions?.set(sessionId, session);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}

function buildInterviewerPrompt(settings: any, problem: Problem): string {
  const personalityMap = {
    friendly: 'You are Alex, a friendly and encouraging technical interviewer. You want the candidate to succeed and provide supportive guidance.',
    neutral: 'You are Alex, a professional and neutral technical interviewer. You maintain objectivity while being helpful.',
    tough: 'You are Alex, a rigorous and challenging technical interviewer. You have high standards but are fair.',
  };

  const personality = personalityMap[settings.personality as keyof typeof personalityMap] || personalityMap.friendly;

  return `${personality}

You are conducting a technical coding interview. Your role is to:

1. **Guide, don't solve**: Help the candidate think through the problem without giving away the answer
2. **Monitor behavior**:
   - If they're coding without explaining, ask them to walk through their approach first
   - If they're stuck, offer hints or ask guiding questions
   - If they're making progress, acknowledge it and ask follow-up questions
3. **Be human-like**: Use natural language, show emotion, and engage in real conversation
4. **Ask clarifying questions**: When they explain their approach, ask about edge cases, complexity, trade-offs
5. **Provide feedback**: Comment on their approach, code quality, and communication

Current problem: ${problem.title}

Keep responses concise (2-3 sentences usually). Act like a real human interviewer, not a robot.

IMPORTANT: Never reveal the optimal solution directly. Guide them towards it with questions and hints.`;
}

function buildConversationHistory(
  chatHistory: ChatMessage[],
  userCode: string
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  // Add chat history
  for (const msg of chatHistory) {
    messages.push({
      role: msg.role === 'candidate' ? 'user' : 'assistant',
      content: msg.content,
    });
  }

  // Add current code context if significant
  if (userCode && userCode.length > 50) {
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      lastUserMessage.content += `\n\n[Current code:\n${userCode}\n]`;
    }
  }

  return messages;
}
