'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InterviewSettings } from '@/types';

export default function Home() {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<InterviewSettings>({
    difficulty: 'medium',
    topic: 'surprise',
    companyStyle: 'faang',
    duration: 45,
    communicationMode: 'text',
    interviewerPersonality: 'friendly',
    language: 'python',
  });

  const handleStartInterview = () => {
    // Store settings in sessionStorage
    sessionStorage.setItem('interviewSettings', JSON.stringify(settings));
    router.push('/interview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mocker</h1>
          <nav className="flex gap-4">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="/settings" className="text-gray-300 hover:text-white transition-colors">
              Settings
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Practice Technical Interviews
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get realistic mock interviews with an AI interviewer that behaves like a human.
            Build confidence, improve your coding skills, and ace your next interview.
          </p>
        </div>

        {/* Main CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Ready to practice?</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                {showSettings ? 'Hide Settings' : 'Customize Settings'}
              </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={settings.difficulty}
                    onChange={(e) =>
                      setSettings({ ...settings, difficulty: e.target.value as any })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="random">Random</option>
                  </select>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Topic Focus
                  </label>
                  <select
                    value={settings.topic}
                    onChange={(e) => setSettings({ ...settings, topic: e.target.value as any })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="arrays">Arrays</option>
                    <option value="trees">Trees</option>
                    <option value="graphs">Graphs</option>
                    <option value="dynamic-programming">Dynamic Programming</option>
                    <option value="strings">Strings</option>
                    <option value="hashmaps">Hashmaps</option>
                    <option value="stacks-queues">Stacks & Queues</option>
                    <option value="linked-lists">Linked Lists</option>
                    <option value="sorting-searching">Sorting & Searching</option>
                    <option value="surprise">Surprise Me!</option>
                  </select>
                </div>

                {/* Company Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Style
                  </label>
                  <select
                    value={settings.companyStyle}
                    onChange={(e) =>
                      setSettings({ ...settings, companyStyle: e.target.value as any })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="faang">FAANG (Hard Algorithms)</option>
                    <option value="startup">Startup (Practical)</option>
                    <option value="trading-firm">Trading Firm (Math-heavy)</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={settings.duration}
                    onChange={(e) =>
                      setSettings({ ...settings, duration: parseInt(e.target.value) })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                {/* Communication Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Communication
                  </label>
                  <select
                    value={settings.communicationMode}
                    onChange={(e) =>
                      setSettings({ ...settings, communicationMode: e.target.value as any })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text Only</option>
                    <option value="voice">Voice Only</option>
                    <option value="both">Text & Voice</option>
                  </select>
                </div>

                {/* Interviewer Personality */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Interviewer Style
                  </label>
                  <select
                    value={settings.interviewerPersonality}
                    onChange={(e) =>
                      setSettings({ ...settings, interviewerPersonality: e.target.value as any })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="neutral">Neutral</option>
                    <option value="tough">Tough</option>
                  </select>
                </div>

                {/* Programming Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      setSettings({ ...settings, language: e.target.value as any })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                  </select>
                </div>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStartInterview}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-[1.02] shadow-lg"
            >
              Start Mock Interview
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="text-blue-400 text-2xl mb-3">🎯</div>
              <h4 className="font-semibold text-lg mb-2">Realistic Practice</h4>
              <p className="text-gray-400 text-sm">
                AI interviewer that acts like a human - asks follow-ups, gives hints, and reviews
                your code
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="text-purple-400 text-2xl mb-3">💡</div>
              <h4 className="font-semibold text-lg mb-2">Instant Feedback</h4>
              <p className="text-gray-400 text-sm">
                Get detailed analysis of your performance, code quality, and areas for improvement
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="text-green-400 text-2xl mb-3">📈</div>
              <h4 className="font-semibold text-lg mb-2">Track Progress</h4>
              <p className="text-gray-400 text-sm">
                Monitor your improvement over time and identify patterns in your weak areas
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
