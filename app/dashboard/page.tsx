'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  // Mock data - in real app this would come from database
  const stats = {
    totalInterviews: 12,
    averageScore: 7.3,
    streak: 5,
    improvementRate: 0.4,
  };

  const recentInterviews = [
    {
      id: '1',
      date: '2025-01-15',
      problem: 'Two Sum Variant',
      score: 8.5,
      result: 'strong-pass',
      duration: 42,
    },
    {
      id: '2',
      date: '2025-01-14',
      problem: 'Binary Tree Traversal',
      score: 7.0,
      result: 'weak-pass',
      duration: 55,
    },
    {
      id: '3',
      date: '2025-01-13',
      problem: 'Sliding Window Maximum',
      score: 6.5,
      result: 'borderline',
      duration: 60,
    },
  ];

  const weakAreas = [
    { topic: 'Dynamic Programming', failureRate: 0.6 },
    { topic: 'Graphs', failureRate: 0.45 },
    { topic: 'Trees', failureRate: 0.3 },
  ];

  const strengths = [
    { topic: 'Arrays', successRate: 0.9 },
    { topic: 'Hashmaps', successRate: 0.85 },
    { topic: 'Strings', successRate: 0.8 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              New Interview
            </button>
            <button
              onClick={() => router.push('/')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Total Interviews</div>
            <div className="text-3xl font-bold">{stats.totalInterviews}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Average Score</div>
            <div className="text-3xl font-bold text-blue-400">{stats.averageScore}/10</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Current Streak</div>
            <div className="text-3xl font-bold text-green-400">{stats.streak} days</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Improvement Rate</div>
            <div className="text-3xl font-bold text-purple-400">+{stats.improvementRate}/week</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Interviews */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Recent Interviews</h2>
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="bg-gray-900 rounded p-4 border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
                  onClick={() => router.push(`/interview/feedback?session=${interview.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{interview.problem}</div>
                      <div className="text-sm text-gray-400">{interview.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-400">{interview.score}/10</div>
                      <div className="text-xs text-gray-500">{interview.duration} min</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        interview.result === 'strong-pass'
                          ? 'bg-green-900 text-green-300'
                          : interview.result === 'weak-pass'
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-orange-900 text-orange-300'
                      }`}
                    >
                      {interview.result.split('-').join(' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="space-y-6">
            {/* Weak Areas */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Areas to Improve</h2>
              <div className="space-y-3">
                {weakAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{area.topic}</span>
                      <span className="text-red-400">{(area.failureRate * 100).toFixed(0)}% struggle rate</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${area.failureRate * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Your Strengths</h2>
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{strength.topic}</span>
                      <span className="text-green-400">{(strength.successRate * 100).toFixed(0)}% success rate</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${strength.successRate * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Practice */}
        <div className="mt-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700">
          <h2 className="text-xl font-semibold mb-2">Recommended Practice</h2>
          <p className="text-gray-300 mb-4">
            Based on your performance, we recommend focusing on Dynamic Programming problems this week.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Start Targeted Practice
          </button>
        </div>
      </main>
    </div>
  );
}
