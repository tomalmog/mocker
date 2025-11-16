import { ProgrammingLanguage, ExecutionResult } from '@/types';
import { config } from '@/lib/config';

// Piston API language mappings
const PISTON_LANGUAGE_MAP: Record<ProgrammingLanguage, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
};

export async function executeCode(
  code: string,
  language: ProgrammingLanguage,
  input?: string
): Promise<ExecutionResult> {
  try {
    const pistonLang = PISTON_LANGUAGE_MAP[language];

    const response = await fetch(`${config.codeExecution.piston.apiUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonLang.language,
        version: pistonLang.version,
        files: [
          {
            name: getFileName(language),
            content: code,
          },
        ],
        stdin: input || '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    if (!response.ok) {
      throw new Error('Code execution failed');
    }

    const result = await response.json();

    // Piston returns { run: { stdout, stderr, code, signal, output }, compile?: {...} }
    const hasCompileError = result.compile && result.compile.code !== 0;
    const hasRuntimeError = result.run && result.run.code !== 0;

    const output = result.run?.stdout || result.run?.output || '';
    const error = hasCompileError
      ? result.compile.stderr || result.compile.output
      : hasRuntimeError
      ? result.run.stderr || result.run.output
      : '';

    return {
      output: output.trim(),
      error: error ? error.trim() : undefined,
      executionTime: 0, // Piston doesn't provide timing info
      memory: 0, // Piston doesn't provide memory info
      success: !hasCompileError && !hasRuntimeError,
    };
  } catch (error) {
    console.error('Code execution error:', error);
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unknown execution error',
      executionTime: 0,
      memory: 0,
      success: false,
    };
  }
}

function getFileName(language: ProgrammingLanguage): string {
  switch (language) {
    case 'python':
      return 'main.py';
    case 'java':
      return 'Main.java';
    case 'cpp':
      return 'main.cpp';
    case 'javascript':
      return 'main.js';
    case 'typescript':
      return 'main.ts';
    default:
      return 'main.txt';
  }
}
