import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/api/claude';
import { InterviewMessage, Problem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      message,
      code,
      problem,
      hintsUsed,
      messages,
    }: {
      sessionId: string;
      message: string;
      code: string;
      problem: Problem | null;
      hintsUsed: number;
      messages: InterviewMessage[];
    } = await request.json();

    // Build conversation history
    const conversationHistory = messages
      .slice(-10) // Last 10 messages for context
      .map((msg) => ({
        role: (msg.role === 'candidate' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      }));

    // Add the new message
    conversationHistory.push({
      role: 'user',
      content: message,
    });

    const systemPrompt = `You are Alex, a ${problem ? 'professional' : 'friendly'} technical interviewer at a top tech company.

${
  problem
    ? `CURRENT PROBLEM:
Title: ${problem.title}
Description: ${problem.description}

CANDIDATE'S CODE:
${code || '(No code written yet)'}

HINTS USED: ${hintsUsed}

YOUR ROLE:
- Act like a real human interviewer - be natural, encouraging, but professional
- Monitor the candidate's progress and provide guidance when needed
- If they're stuck for too long, gently prompt them to talk through their thinking
- If they start coding without explaining, ask them to walk through their approach first
- Ask clarifying questions about their solution
- Don't give away the answer directly - guide them with questions
- Encourage good practices (talking through approach, testing, considering edge cases)
- Be supportive but honest
- Keep responses concise (2-3 sentences max usually)

IMPORTANT BEHAVIORAL CUES:
- If candidate is silent/stuck: Ask what they're thinking or offer to talk through it
- If candidate codes without explaining: "Before you code, can you walk me through your approach?"
- If candidate makes progress: Show genuine interest and ask follow-up questions
- If candidate asks for help: Provide hints that guide without solving
- Keep the conversation natural and human-like`
    : `You are in the opening phase of the interview. Make small talk, be friendly and welcoming.`
}`;

    const response = await generateChatCompletion(
      conversationHistory,
      systemPrompt,
      500 // Shorter responses for chat
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
