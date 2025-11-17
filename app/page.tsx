'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './components/ThemeToggle';
import type { Difficulty, Topic, CompanyStyle, CommunicationMode, Personality } from '@/types/interview';

export default function Home() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    difficulty: 'medium' as Difficulty,
    topic: 'surprise' as Topic,
    companyStyle: 'faang' as CompanyStyle,
    duration: 45,
    communicationMode: 'text' as CommunicationMode,
    personality: 'friendly' as Personality,
  });

  const handleStartInterview = async () => {
    const response = await fetch('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    const { sessionId } = await response.json();
    router.push(`/interview/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-black dark:text-white">Mocker</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-6">
              AI-Powered Mock
              <br />
              Technical Interviews
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Practice coding interviews with an AI interviewer that behaves like a human.
              Get instant feedback and improve your skills.
            </p>
          </div>

          {/* Settings Card */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-6">
              Configure Your Interview
            </h3>

            <div className="space-y-6">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['easy', 'medium', 'hard', 'random'] as Difficulty[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSettings({ ...settings, difficulty: level })}
                      className={`py-2 px-4 rounded-md border transition-all text-sm font-medium ${
                        settings.difficulty === level
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Focus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Topic Focus
                </label>
                <select
                  value={settings.topic}
                  onChange={(e) => setSettings({ ...settings, topic: e.target.value as Topic })}
                  className="w-full py-2.5 px-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
                >
                  <option value="surprise">Surprise Me</option>
                  <option value="arrays">Arrays</option>
                  <option value="trees">Trees</option>
                  <option value="graphs">Graphs</option>
                  <option value="dp">Dynamic Programming</option>
                  <option value="strings">Strings</option>
                  <option value="linked-lists">Linked Lists</option>
                  <option value="stacks-queues">Stacks & Queues</option>
                </select>
              </div>

              {/* Company Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Company Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['faang', 'startup', 'trading'] as CompanyStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setSettings({ ...settings, companyStyle: style })}
                      className={`py-2 px-4 rounded-md border transition-all text-sm font-medium ${
                        settings.companyStyle === style
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      {style === 'faang' ? 'FAANG' : style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Duration: {settings.duration} minutes
                </label>
                <input
                  type="range"
                  min="30"
                  max="60"
                  step="15"
                  value={settings.duration}
                  onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                  <span>30 min</span>
                  <span>45 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Communication Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Communication Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['text', 'voice', 'both'] as CommunicationMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettings({ ...settings, communicationMode: mode })}
                      className={`py-2 px-4 rounded-md border transition-all text-sm font-medium ${
                        settings.communicationMode === mode
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interviewer Personality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Interviewer Personality
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['friendly', 'neutral', 'tough'] as Personality[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSettings({ ...settings, personality: p })}
                      className={`py-2 px-4 rounded-md border transition-all text-sm font-medium ${
                        settings.personality === p
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartInterview}
              className="w-full mt-8 py-3 px-6 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Start Interview
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                Dynamic Problems
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unique questions generated fresh for each interview
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                Human-Like AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interviewer that reads behavior and responds naturally
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                Detailed Feedback
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive analysis with actionable insights
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            Built with Claude AI and Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
