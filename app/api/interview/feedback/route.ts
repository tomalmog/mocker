import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/api/claude';
import { InterviewMessage, Problem, ProgrammingLanguage, Feedback } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      code,
      language,
      problem,
      messages,
      hintsUsed,
      duration,
    }: {
      sessionId: string;
      code: string;
      language: ProgrammingLanguage;
      problem: Problem;
      messages: InterviewMessage[];
      hintsUsed: number;
      duration: number; // actual duration in minutes
    } = await request.json();

    const prompt = `You are evaluating a technical interview. Provide comprehensive feedback.

PROBLEM:
${problem.title}
${problem.description}

OPTIMAL SOLUTION:
Time: ${problem.optimalSolution.timeComplexity}
Space: ${problem.optimalSolution.spaceComplexity}
${problem.optimalSolution.explanation}

CANDIDATE'S SOLUTION:
\`\`\`${language}
${code}
\`\`\`

INTERVIEW DURATION: ${duration} minutes
HINTS USED: ${hintsUsed}

MESSAGE SUMMARY:
${messages.length} messages exchanged
Candidate communicated: ${messages.filter((m) => m.role === 'candidate').length} times

Provide a detailed evaluation as JSON:
{
  "score": {
    "overall": 0-10,
    "problemSolving": 0-10,
    "codeQuality": 0-10,
    "communication": 0-10,
    "timeManagement": 0-10,
    "optimizationAwareness": 0-10
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "complexityAnalysis": {
    "userSolution": {
      "time": "O(...)",
      "space": "O(...)"
    },
    "optimalSolution": {
      "time": "${problem.optimalSolution.timeComplexity}",
      "space": "${problem.optimalSolution.spaceComplexity}"
    },
    "explanation": "detailed comparison"
  },
  "codeReview": {
    "lineComments": [
      {"line": 1, "comment": "specific feedback"}
    ],
    "suggestions": ["suggestion 1", "suggestion 2"],
    "refactoredCode": "improved version if needed"
  },
  "similarProblems": ["problem 1", "problem 2", "problem 3"],
  "result": "strong-pass|weak-pass|no-hire|borderline"
}

Be thorough and constructive. Base scores on actual performance.`;

    const response = await generateChatCompletion(
      [{ role: 'user', content: prompt }],
      'You are an expert technical interviewer providing detailed, honest, constructive feedback.',
      4000
    );

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse feedback JSON');
    }

    const feedback: Feedback = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}
