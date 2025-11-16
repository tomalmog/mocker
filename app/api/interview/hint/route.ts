import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/api/claude';
import { Problem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      problem,
      code,
      hintNumber,
    }: {
      sessionId: string;
      problem: Problem;
      code: string;
      hintNumber: number;
    } = await request.json();

    const hintLevel =
      hintNumber === 1 ? 'conceptual' : hintNumber === 2 ? 'directional' : 'specific';

    const prompt = `You are a technical interviewer providing a hint for the following problem:

PROBLEM: ${problem.title}
${problem.description}

CANDIDATE'S CURRENT CODE:
${code || '(No code yet)'}

HINT NUMBER: ${hintNumber}
HINT LEVEL: ${hintLevel}

Provide a ${hintLevel} hint:
- Hint 1 (conceptual): Give a high-level insight about what approach/data structure to consider
- Hint 2 (directional): Point them toward a specific algorithm or pattern
- Hint 3 (specific): Provide more detailed guidance, but still don't solve it for them

Keep the hint natural and conversational, as a human interviewer would say it. 2-3 sentences max.`;

    const hint = await generateChatCompletion(
      [{ role: 'user', content: prompt }],
      'You are a helpful technical interviewer providing progressive hints.',
      300
    );

    return NextResponse.json({ hint });
  } catch (error) {
    console.error('Error generating hint:', error);
    return NextResponse.json({ error: 'Failed to generate hint' }, { status: 500 });
  }
}
