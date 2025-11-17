import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic';
import type { InterviewFeedback } from '@/types/interview';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Get session
    const session = global.sessions?.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Generate comprehensive feedback using Claude
    const feedback = await generateFeedback(session);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}

async function generateFeedback(session: any): Promise<InterviewFeedback> {
  const prompt = `You are an expert technical interviewer providing comprehensive feedback on a candidate's interview performance.

Interview Details:
- Problem: ${session.problem.title}
- Difficulty: ${session.settings.difficulty}
- Duration: ${session.settings.duration} minutes
- Time Elapsed: ${Math.floor((session.timeElapsed || 0) / 60)} minutes
- Hints Used: ${session.hintsUsed}

Problem Description:
${session.problem.description}

Candidate's Code:
${session.userCode || 'No code submitted'}

Chat History:
${session.chatHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Optimal Solution:
Time: ${session.problem.optimalSolution.timeComplexity}
Space: ${session.problem.optimalSolution.spaceComplexity}

Please provide detailed feedback in the following JSON format:
{
  "overallRating": "strong_pass" | "weak_pass" | "no_hire" | "borderline",
  "scores": {
    "problemSolving": 0-10,
    "codeQuality": 0-10,
    "communication": 0-10,
    "timeManagement": 0-10,
    "optimization": 0-10
  },
  "whatWentWell": ["strength 1", "strength 2", "strength 3"],
  "areasToImprove": ["area 1", "area 2", "area 3"],
  "complexityAnalysis": {
    "userSolution": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "optimalSolution": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "explanation": "Detailed explanation of complexity differences"
  },
  "codeReview": {
    "lineByLineFeedback": "Detailed analysis of the code",
    "styleSuggestions": ["suggestion 1", "suggestion 2"],
    "bugs": ["bug 1 if any"],
    "refactoredCode": "Optional: better version of the code"
  },
  "similarProblems": [
    {
      "title": "Problem Title",
      "difficulty": "medium",
      "topics": ["arrays", "hashmaps"]
    }
  ]
}

Be constructive, specific, and actionable in your feedback. Consider:
1. Problem-solving approach and methodology
2. Code correctness and edge case handling
3. Communication clarity and thought process articulation
4. Time management and pacing
5. Algorithm efficiency and optimization awareness

Provide honest but encouraging feedback that helps them improve.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const feedback = JSON.parse(content.text);
  return feedback as InterviewFeedback;
}
