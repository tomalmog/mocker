import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import type { Language, TestCase } from '@/types/interview';

const LANGUAGE_MAP: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
};

export async function POST(req: NextRequest) {
  try {
    const { code, language, testCases } = await req.json();

    const pistonLanguage = LANGUAGE_MAP[language as Language];
    if (!pistonLanguage) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    // Execute code using Piston API
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: pistonLanguage,
      version: '*',
      files: [
        {
          name: getFileName(language as Language),
          content: code,
        },
      ],
    });

    const result = response.data;

    // If test cases are provided, run them
    let testResults = null;
    if (testCases && testCases.length > 0) {
      testResults = await runTestCases(code, language as Language, testCases);
    }

    return NextResponse.json({
      stdout: result.run?.stdout || '',
      stderr: result.run?.stderr || '',
      exitCode: result.run?.code || 0,
      testResults,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}

function getFileName(language: Language): string {
  const fileNames: Record<Language, string> = {
    python: 'main.py',
    javascript: 'main.js',
    java: 'Main.java',
    cpp: 'main.cpp',
  };
  return fileNames[language];
}

async function runTestCases(
  code: string,
  language: Language,
  testCases: TestCase[]
): Promise<any[]> {
  const results = [];

  for (const testCase of testCases.filter(tc => !tc.hidden)) {
    try {
      // Modify code to include test input
      const testCode = wrapCodeWithTest(code, language, testCase.input);

      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: LANGUAGE_MAP[language],
        version: '*',
        files: [
          {
            name: getFileName(language),
            content: testCode,
          },
        ],
      });

      const output = response.data.run?.stdout?.trim() || '';
      const passed = output === testCase.expectedOutput.trim();

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: output,
        passed,
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: 'Error executing test',
        passed: false,
      });
    }
  }

  return results;
}

function wrapCodeWithTest(code: string, language: Language, input: string): string {
  // This is simplified - in production, you'd need more sophisticated test wrapping
  switch (language) {
    case 'python':
      return `${code}\n\nif __name__ == "__main__":\n    print(solution(${input}))`;
    case 'javascript':
      return `${code}\n\nconsole.log(solution(${input}));`;
    default:
      return code;
  }
}
