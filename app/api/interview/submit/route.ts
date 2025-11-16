import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/api/claude';
import { InterviewMessage, Problem, ProgrammingLanguage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      code,
      language,
      problem,
      messages,
      hintsUsed,
    }: {
      sessionId: string;
      code: string;
      language: ProgrammingLanguage;
      problem: Problem;
      messages: InterviewMessage[];
      hintsUsed: number;
    } = await request.json();

    const prompt = `The candidate has submitted their solution. Analyze it and respond naturally as a human interviewer would.

PROBLEM:
${problem.title}
${problem.description}

CANDIDATE'S SOLUTION:
\`\`\`${language}
${code}
\`\`\`

OPTIMAL SOLUTION:
Time Complexity: ${problem.optimalSolution.timeComplexity}
Space Complexity: ${problem.optimalSolution.spaceComplexity}

As a human interviewer, respond with:
1. Brief acknowledgment that you're reviewing their code
2. Ask them to walk through their solution
3. Be prepared to ask follow-up questions about complexity, edge cases, or optimizations

Keep it conversational and natural. 2-3 sentences.`;

    const response = await generateChatCompletion(
      [{ role: 'user', content: prompt }],
      'You are a technical interviewer reviewing a candidate\'s code submission. Be encouraging but thorough.',
      300
    );

    return NextResponse.json({
      response,
      nextPhase: 'review',
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
