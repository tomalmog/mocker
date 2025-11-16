'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Feedback } from '@/types';

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    // In a real app, fetch feedback from the backend
    // For now, generate mock feedback for demonstration
    generateFeedback();
  }, [sessionId, router]);

  const generateFeedback = async () => {
    // This would call the feedback API
    // For demo purposes, showing a mock structure
    setTimeout(() => {
      setFeedback({
        score: {
          overall: 7.5,
          problemSolving: 8,
          codeQuality: 7,
          communication: 7,
          timeManagement: 8,
          optimizationAwareness: 7,
        },
        strengths: [
          'Identified the optimal approach within 5 minutes',
          'Clear communication of thought process',
          'Good handling of edge cases',
        ],
        improvements: [
          'Started coding before fully explaining approach - discuss first in real interviews',
          'Missed an optimization opportunity (could be O(n) instead of O(n²))',
          "Didn't test with edge cases before submitting",
        ],
        complexityAnalysis: {
          userSolution: {
            time: 'O(n²)',
            space: 'O(1)',
          },
          optimalSolution: {
            time: 'O(n)',
            space: 'O(n)',
          },
          explanation:
            'Your nested loop solution works but can be optimized using a hashmap to achieve O(n) time complexity.',
        },
        codeReview: {
          lineComments: [
            { line: 5, comment: 'Good null check here' },
            { line: 12, comment: 'This nested loop creates O(n²) complexity' },
          ],
          suggestions: [
            'Use more descriptive variable names (e.g., "targetSum" instead of "x")',
            'Add comments for complex logic',
            'Consider edge cases earlier in the process',
          ],
          refactoredCode: undefined,
        },
        similarProblems: [
          'Two Sum (hashmap practice)',
          'Three Sum (extension of this pattern)',
          'Subarray Sum Equals K (similar hashmap approach)',
        ],
        result: 'weak-pass',
      });
      setIsLoading(false);
    }, 2000);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'strong-pass':
        return 'bg-green-600';
      case 'weak-pass':
        return 'bg-yellow-600';
      case 'borderline':
        return 'bg-orange-600';
      case 'no-hire':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'strong-pass':
        return '🟢';
      case 'weak-pass':
        return '🟡';
      case 'borderline':
        return '⚪';
      case 'no-hire':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'strong-pass':
        return 'Strong Pass';
      case 'weak-pass':
        return 'Weak Pass';
      case 'borderline':
        return 'Borderline';
      case 'no-hire':
        return 'No Hire';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Analyzing your interview...</div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No feedback available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Interview Feedback</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            New Interview
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Overall Result */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <div className="text-6xl mb-4">{getResultIcon(feedback.result)}</div>
          <h2 className="text-3xl font-bold mb-2">{getResultText(feedback.result)}</h2>
          <div className="text-5xl font-bold text-blue-400 mb-2">
            {feedback.score.overall.toFixed(1)}/10
          </div>
          <p className="text-gray-400">Overall Performance</p>
        </div>

        {/* Score Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Problem Solving', value: feedback.score.problemSolving },
              { label: 'Code Quality', value: feedback.score.codeQuality },
              { label: 'Communication', value: feedback.score.communication },
              { label: 'Time Management', value: feedback.score.timeManagement },
              { label: 'Optimization Awareness', value: feedback.score.optimizationAwareness },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-blue-400 font-semibold">{item.value}/10</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(item.value / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">✅ What Went Well</h3>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">⚠️ Areas for Improvement</h3>
          <ul className="space-y-2">
            {feedback.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">!</span>
                <span className="text-gray-300">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Complexity Analysis */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Complexity Analysis</h3>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="font-semibold text-gray-400 mb-2">Your Solution</h4>
              <div className="text-sm">
                <div>Time: <span className="text-red-400 font-mono">{feedback.complexityAnalysis.userSolution.time}</span></div>
                <div>Space: <span className="text-blue-400 font-mono">{feedback.complexityAnalysis.userSolution.space}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-400 mb-2">Optimal Solution</h4>
              <div className="text-sm">
                <div>Time: <span className="text-green-400 font-mono">{feedback.complexityAnalysis.optimalSolution.time}</span></div>
                <div>Space: <span className="text-blue-400 font-mono">{feedback.complexityAnalysis.optimalSolution.space}</span></div>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-sm">{feedback.complexityAnalysis.explanation}</p>
        </div>

        {/* Code Review */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Code Review</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-400 mb-2">Suggestions</h4>
              <ul className="space-y-2">
                {feedback.codeReview.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-300 text-sm">• {suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Problems */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Practice These Next</h3>
          <div className="space-y-2">
            {feedback.similarProblems.map((problem, index) => (
              <div key={index} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                → {problem}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            View Dashboard
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </main>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading feedback...</div>
        </div>
      }
    >
      <FeedbackContent />
    </Suspense>
  );
}
