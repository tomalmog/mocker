import { NextRequest, NextResponse } from 'next/server';
import { executeCode } from '@/lib/api/code-execution';
import { ProgrammingLanguage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const {
      code,
      language,
      input,
    }: {
      code: string;
      language: ProgrammingLanguage;
      input?: string;
    } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    const result = await executeCode(code, language, input);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      {
        output: '',
        error: 'Failed to execute code',
        executionTime: 0,
        memory: 0,
        success: false,
      },
      { status: 500 }
    );
  }
}
