'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-purple-200">Track your progress and improve your skills</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-all"
          >
            New Interview
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-purple-200">Total Interviews</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-purple-200">Average Score</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-purple-200">This Week</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">0%</div>
            <div className="text-purple-200">Pass Rate</div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Strengths</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Array Manipulation</span>
                <span className="text-green-400 font-semibold">90%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Communication</span>
                <span className="text-green-400 font-semibold">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Code Quality</span>
                <span className="text-green-400 font-semibold">80%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Areas to Improve</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Dynamic Programming</span>
                <span className="text-yellow-400 font-semibold">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Graph Algorithms</span>
                <span className="text-yellow-400 font-semibold">50%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Time Management</span>
                <span className="text-yellow-400 font-semibold">60%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Recent Interviews</h3>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-purple-200 text-lg mb-4">No interviews yet</p>
            <p className="text-purple-300 mb-6">
              Start your first mock interview to begin tracking your progress
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-all"
            >
              Start First Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
