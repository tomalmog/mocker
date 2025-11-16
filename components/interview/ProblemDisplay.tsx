'use client';

import { Problem } from '@/types';

interface ProblemDisplayProps {
  problem: Problem | null;
  isLoading?: boolean;
}

export default function ProblemDisplay({ problem, isLoading }: ProblemDisplayProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400">Waiting for problem...</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 overflow-auto">
      {/* Title and Difficulty */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(
              problem.difficulty
            )} bg-gray-900`}
          >
            {problem.difficulty.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          Topic: {problem.topic.split('-').join(' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
      </div>

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
          {problem.examples.map((example, index) => (
            <div key={index} className="mb-4 bg-gray-900 rounded p-4 border border-gray-700">
              <div className="mb-2">
                <span className="text-gray-400 text-sm">Input:</span>
                <pre className="text-green-400 font-mono text-sm mt-1">{example.input}</pre>
              </div>
              <div className="mb-2">
                <span className="text-gray-400 text-sm">Output:</span>
                <pre className="text-blue-400 font-mono text-sm mt-1">{example.output}</pre>
              </div>
              {example.explanation && (
                <div>
                  <span className="text-gray-400 text-sm">Explanation:</span>
                  <p className="text-gray-300 text-sm mt-1">{example.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Constraints</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="text-sm">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
