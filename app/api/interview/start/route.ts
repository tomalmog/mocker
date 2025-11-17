import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic';
import type { InterviewSettings, Problem } from '@/types/interview';

export async function POST(req: NextRequest) {
  try {
    const settings: InterviewSettings = await req.json();

    // Generate problem using Claude
    const problem = await generateProblem(settings);

    // Create session in memory (for now - will use DB later)
    const sessionId = generateSessionId();

    // Store session (simplified for now)
    const session = {
      id: sessionId,
      settings,
      problem,
      chatHistory: [],
      userCode: '',
      language: 'python',
      hintsUsed: 0,
      startedAt: Date.now(),
    };

    // In production, store this in database or Redis
    // For now, we'll pass it through the session ID and retrieve later
    global.sessions = global.sessions || new Map();
    global.sessions.set(sessionId, session);

    return NextResponse.json({ sessionId, problem });
  } catch (error) {
    console.error('Error starting interview:', error);
    return NextResponse.json(
      { error: 'Failed to start interview' },
      { status: 500 }
    );
  }
}

async function generateProblem(settings: InterviewSettings): Promise<Problem> {
  const difficultyMap = {
    easy: 'easy (LeetCode Easy level)',
    medium: 'medium (LeetCode Medium level)',
    hard: 'hard (LeetCode Hard level)',
    random: 'randomly chosen difficulty',
  };

  const topicMap = {
    arrays: 'arrays',
    trees: 'binary trees or tree structures',
    graphs: 'graph algorithms',
    dp: 'dynamic programming',
    strings: 'string manipulation',
    'linked-lists': 'linked lists',
    'stacks-queues': 'stacks or queues',
    surprise: 'any topic you choose',
  };

  const styleMap = {
    faang: 'FAANG-style (focus on algorithmic complexity and optimal solutions)',
    startup: 'Startup-style (focus on practical, real-world problems)',
    trading: 'Trading firm-style (focus on math-heavy and performance-critical problems)',
  };

  const prompt = `You are an expert technical interviewer. Generate a unique, original coding interview problem with the following specifications:

Difficulty: ${difficultyMap[settings.difficulty]}
Topic: ${topicMap[settings.topic || 'surprise']}
Style: ${styleMap[settings.companyStyle || 'faang']}
Target time to solve: ${Math.floor(settings.duration * 0.6)} minutes

Requirements:
1. Create a COMPLETELY NEW problem - not from LeetCode or any other platform
2. The problem should be realistic and interesting
3. Include clear examples with explanations
4. Provide 5-6 test cases (mix of visible and hidden)
5. Include 3 progressive hints
6. Provide the optimal solution with complexity analysis

Respond with ONLY a valid JSON object in this exact format:
{
  "title": "Problem Title",
  "description": "Clear problem description with context",
  "examples": [
    {
      "input": "example input",
      "output": "example output",
      "explanation": "why this is the output"
    }
  ],
  "constraints": ["constraint 1", "constraint 2"],
  "testCases": [
    {
      "input": "test input",
      "expectedOutput": "expected output",
      "hidden": false
    }
  ],
  "hints": [
    "Hint 1: Conceptual guidance",
    "Hint 2: Directional hint",
    "Hint 3: More specific guidance"
  ],
  "optimalSolution": {
    "code": "Python code for optimal solution",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "explanation": "Explanation of the approach"
  }
}`;

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

  // Parse the JSON response
  const problemData = JSON.parse(content.text);
  return problemData as Problem;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// Type augmentation for global
declare global {
  var sessions: Map<string, any> | undefined;
}
