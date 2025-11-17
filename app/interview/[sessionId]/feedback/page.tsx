'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
      strong_pass: 'bg-green-500',
      weak_pass: 'bg-yellow-500',
      borderline: 'bg-orange-500',
      no_hire: 'bg-red-500',
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-500';
  };

  const getRatingEmoji = (rating: string) => {
    const emojis = {
      strong_pass: '🟢',
      weak_pass: '🟡',
      borderline: '⚪',
      no_hire: '🔴',
    };
    return emojis[rating as keyof typeof emojis] || '⚪';
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
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white text-xl">Analyzing your interview...</div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white text-xl">Error loading feedback</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Interview Complete</h1>
          <p className="text-purple-200">Here's your comprehensive feedback</p>
        </div>

        {/* Overall Rating */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{getRatingEmoji(feedback.overallRating)}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {getRatingText(feedback.overallRating)}
            </h2>
            <div className={`inline-block px-6 py-2 rounded-full ${getRatingColor(feedback.overallRating)} text-white font-semibold`}>
              Overall Performance
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6">Score Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(feedback.scores).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-white mb-2">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-bold">{value}/10</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                    style={{ width: `${(value / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What Went Well */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> What Went Well
          </h3>
          <ul className="space-y-3">
            {feedback.whatWentWell.map((item, idx) => (
              <li key={idx} className="text-green-200 flex items-start gap-3">
                <span className="text-green-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {feedback.areasToImprove.map((item, idx) => (
              <li key={idx} className="text-yellow-200 flex items-start gap-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Complexity Analysis */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Complexity Analysis</h3>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Your Solution</h4>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-white mb-1">
                  <span className="text-slate-400">Time:</span> {feedback.complexityAnalysis.userSolution.time}
                </div>
                <div className="text-white">
                  <span className="text-slate-400">Space:</span> {feedback.complexityAnalysis.userSolution.space}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Optimal Solution</h4>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-white mb-1">
                  <span className="text-slate-400">Time:</span> {feedback.complexityAnalysis.optimalSolution.time}
                </div>
                <div className="text-white">
                  <span className="text-slate-400">Space:</span> {feedback.complexityAnalysis.optimalSolution.space}
                </div>
              </div>
            </div>
          </div>
          <p className="text-purple-200">{feedback.complexityAnalysis.explanation}</p>
        </div>

        {/* Code Review */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Code Review</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Detailed Analysis</h4>
              <p className="text-white whitespace-pre-wrap bg-slate-800 rounded-lg p-4">
                {feedback.codeReview.lineByLineFeedback}
              </p>
            </div>

            {feedback.codeReview.styleSuggestions.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-2">Style Suggestions</h4>
                <ul className="space-y-2">
                  {feedback.codeReview.styleSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-purple-200 flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.codeReview.bugs.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-2">Bugs Found</h4>
                <ul className="space-y-2">
                  {feedback.codeReview.bugs.map((bug, idx) => (
                    <li key={idx} className="text-red-200 flex items-start gap-2">
                      <span className="text-red-400">⚠️</span>
                      <span>{bug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Similar Problems */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Practice These Next</h3>
          <div className="grid gap-4">
            {feedback.similarProblems.map((problem, idx) => (
              <div key={idx} className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-2">{problem.title}</h4>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    problem.difficulty === 'easy' ? 'bg-green-600' :
                    problem.difficulty === 'medium' ? 'bg-yellow-600' :
                    'bg-red-600'
                  } text-white`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                  {problem.topics.map((topic, tidx) => (
                    <span key={tidx} className="px-3 py-1 rounded-full text-sm bg-purple-600 text-white">
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
            className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Start New Interview
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-4 px-8 bg-white/10 text-white text-lg font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
