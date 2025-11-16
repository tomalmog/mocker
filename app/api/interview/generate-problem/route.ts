import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/api/claude';
import { InterviewSettings, Problem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { settings, sessionId }: { settings: InterviewSettings; sessionId: string } =
      await request.json();

    const prompt = `Generate a coding interview problem with the following specifications:

Difficulty: ${settings.difficulty}
Topic: ${settings.topic}
Company Style: ${settings.companyStyle}
Target Duration: ${settings.duration} minutes

Requirements:
1. Create a unique, original problem (not from LeetCode or similar platforms)
2. The problem should be solvable in ${settings.duration} minutes by a competent candidate
3. Include 2-3 clear examples with explanations
4. Provide constraints that are realistic
5. Problem should test understanding of ${settings.topic === 'surprise' ? 'common data structures and algorithms' : settings.topic}
6. ${settings.companyStyle === 'faang' ? 'Focus on algorithmic complexity and optimization' : settings.companyStyle === 'startup' ? 'Focus on practical, real-world scenarios' : 'Include mathematical reasoning and optimization'}

Return your response as a JSON object with this exact structure:
{
  "title": "Problem Title",
  "description": "Detailed problem description",
  "examples": [
    {
      "input": "example input",
      "output": "example output",
      "explanation": "why this is the output"
    }
  ],
  "constraints": ["constraint 1", "constraint 2"],
  "hints": ["hint 1 (conceptual)", "hint 2 (directional)", "hint 3 (specific)"],
  "optimalSolution": {
    "code": "solution code in ${settings.language}",
    "language": "${settings.language}",
    "timeComplexity": "O(...)",
    "spaceComplexity": "O(...)",
    "explanation": "explanation of the optimal approach"
  },
  "testCases": [
    {
      "input": "test input",
      "expectedOutput": "expected output",
      "isHidden": false
    }
  ],
  "difficulty": "${settings.difficulty}",
  "topic": "${settings.topic}"
}

Only respond with the JSON object, no additional text.`;

    const response = await generateChatCompletion(
      [{ role: 'user', content: prompt }],
      'You are an expert technical interviewer creating coding interview problems. Generate high-quality, original problems that test real programming skills.',
      4000
    );

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse problem JSON');
    }

    const problem: Problem = JSON.parse(jsonMatch[0]);
    problem.id = `problem-${sessionId}`;

    return NextResponse.json({ problem });
  } catch (error) {
    console.error('Error generating problem:', error);
    return NextResponse.json(
      { error: 'Failed to generate problem' },
      { status: 500 }
    );
  }
}
