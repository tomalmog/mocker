'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ThemeToggle from '@/app/components/ThemeToggle';
import type { InterviewFeedback } from '@/types/interview';

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, [sessionId]);

  const loadFeedback = async () => {
    try {
      const response = await fetch(`/api/interview/feedback/${sessionId}`);
      const data = await response.json();
      setFeedback(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading feedback:', error);
      setIsLoading(false);
    }
  };

  const getRatingColor = (rating: string) => {
    const colors = {
      strong_pass: 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200',
      weak_pass: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200',
      borderline: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200',
      no_hire: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200',
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  const getRatingText = (rating: string) => {
    const texts = {
      strong_pass: 'Strong Pass',
      weak_pass: 'Weak Pass',
      borderline: 'Borderline',
      no_hire: 'No Hire',
    };
    return texts[rating as keyof typeof texts] || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-black dark:text-white text-lg">Analyzing your interview...</div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-black dark:text-white text-lg">Error loading feedback</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-black dark:text-white">Mocker</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Interview Complete</h2>
            <p className="text-gray-600 dark:text-gray-400">Here's your comprehensive feedback</p>
          </div>

          {/* Overall Rating */}
          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-6 text-center">
            <div className={`inline-block px-6 py-3 rounded-lg font-semibold mb-2 ${getRatingColor(feedback.overallRating)}`}>
              {getRatingText(feedback.overallRating)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Overall Performance</p>
          </div>

          {/* Score Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-6">Score Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(feedback.scores).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-semibold">{value}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-black dark:bg-white h-2 rounded-full transition-all"
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Went Well */}
          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">What Went Well</h3>
            <ul className="space-y-2">
              {feedback.whatWentWell.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Areas for Improvement</h3>
            <ul className="space-y-2">
              {feedback.areasToImprove.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400 mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Complexity Analysis */}
          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Complexity Analysis</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Your Solution</h4>
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-3 text-sm">
                  <div className="mb-1">Time: <span className="font-mono">{feedback.complexityAnalysis.userSolution.time}</span></div>
                  <div>Space: <span className="font-mono">{feedback.complexityAnalysis.userSolution.space}</span></div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Optimal Solution</h4>
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-3 text-sm">
                  <div className="mb-1">Time: <span className="font-mono">{feedback.complexityAnalysis.optimalSolution.time}</span></div>
                  <div>Space: <span className="font-mono">{feedback.complexityAnalysis.optimalSolution.space}</span></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.complexityAnalysis.explanation}</p>
          </div>

          {/* Code Review */}
          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Code Review</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Analysis</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-4">
                  {feedback.codeReview.lineByLineFeedback}
                </p>
              </div>

              {feedback.codeReview.styleSuggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style Suggestions</h4>
                  <ul className="space-y-1">
                    {feedback.codeReview.styleSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span>•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.codeReview.bugs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Bugs Found</h4>
                  <ul className="space-y-1">
                    {feedback.codeReview.bugs.map((bug, idx) => (
                      <li key={idx} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                        <span>⚠</span>
                        <span>{bug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Similar Problems */}
          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Practice These Next</h3>
            <div className="space-y-3">
              {feedback.similarProblems.map((problem, idx) => (
                <div key={idx} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded p-4">
                  <h4 className="text-sm font-medium text-black dark:text-white mb-2">{problem.title}</h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      problem.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300' :
                      problem.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                    }`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                    {problem.topics.map((topic, tidx) => (
                      <span key={tidx} className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 px-6 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Start New Interview
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-700 text-black dark:text-white font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
