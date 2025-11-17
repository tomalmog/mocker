'use client';

import { useRouter } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-black dark:text-white">Mocker</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Home
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400">Track your progress and improve your skills</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              New Interview
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-black dark:text-white mb-1">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Interviews</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-black dark:text-white mb-1">0.0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-black dark:text-white mb-1">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-black dark:text-white mb-1">0%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pass Rate</div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Strengths</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Array Manipulation</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">90%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Communication</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">85%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Code Quality</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">80%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Areas to Improve</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Dynamic Programming</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">45%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Graph Algorithms</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">50%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Time Management</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">60%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Interviews */}
          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-6">Recent Interviews</h3>
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">No interviews yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Start your first mock interview to begin tracking your progress
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                Start First Interview
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
