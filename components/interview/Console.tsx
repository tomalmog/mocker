'use client';

import { ExecutionResult } from '@/types';
import { useState } from 'react';

interface ConsoleProps {
  onRun: (input: string) => Promise<ExecutionResult>;
  onSubmit: () => Promise<void>;
  isRunning?: boolean;
}

export default function Console({ onRun, onSubmit, isRunning = false }: ConsoleProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRun = async () => {
    setIsExecuting(true);
    try {
      const result = await onRun(input);
      setOutput(result);
    } catch (error) {
      setOutput({
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0,
        memory: 0,
        success: false,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] border-l border-gray-700">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252525] border-b border-gray-700">
        <button
          onClick={handleRun}
          disabled={isExecuting || isRunning}
          className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isExecuting ? 'Running...' : 'Run Code'}
        </button>
        <button
          onClick={onSubmit}
          disabled={isExecuting || isRunning}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Submit Solution
        </button>
      </div>

      {/* Input section */}
      <div className="p-4 border-b border-gray-700">
        <label className="block text-sm text-gray-400 mb-2">Input (optional):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter test input here..."
          className="w-full h-20 bg-[#2a2a2a] text-white text-sm font-mono p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
          disabled={isExecuting || isRunning}
        />
      </div>

      {/* Output section */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="text-sm text-gray-400 mb-2">Output:</div>
        {output ? (
          <div className="space-y-2">
            {output.success ? (
              <div className="bg-green-900/30 border border-green-700 rounded p-3">
                <div className="text-green-400 font-semibold mb-2">Success!</div>
                <pre className="text-gray-200 text-sm font-mono whitespace-pre-wrap">
                  {output.output}
                </pre>
                <div className="mt-2 text-xs text-gray-400">
                  Execution time: {output.executionTime}ms | Memory: {output.memory}KB
                </div>
              </div>
            ) : (
              <div className="bg-red-900/30 border border-red-700 rounded p-3">
                <div className="text-red-400 font-semibold mb-2">Error</div>
                <pre className="text-gray-200 text-sm font-mono whitespace-pre-wrap">
                  {output.error || 'No error message'}
                </pre>
                {output.output && (
                  <>
                    <div className="text-gray-400 text-xs mt-2 mb-1">Output:</div>
                    <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                      {output.output}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm italic">
            Run your code to see the output here...
          </div>
        )}
      </div>
    </div>
  );
}
