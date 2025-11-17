'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    // Create interview session
    const response = await fetch('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    const { sessionId } = await response.json();
    router.push(`/interview/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4">
              Mocker
            </h1>
            <p className="text-xl text-purple-200">
              AI-Powered Mock Technical Interviews
            </p>
            <p className="text-lg text-purple-300 mt-2">
              Practice like it's the real thing. Interview at Google, but in your pajamas.
            </p>
          </div>

          {/* Settings Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Interview Settings</h2>

            <div className="space-y-6">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Difficulty
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {(['easy', 'medium', 'hard', 'random'] as Difficulty[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSettings({ ...settings, difficulty: level })}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        settings.difficulty === level
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-white/10 text-purple-100 hover:bg-white/20'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Focus */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Topic Focus
                </label>
                <select
                  value={settings.topic}
                  onChange={(e) => setSettings({ ...settings, topic: e.target.value as Topic })}
                  className="w-full py-3 px-4 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Company Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['faang', 'startup', 'trading'] as CompanyStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setSettings({ ...settings, companyStyle: style })}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        settings.companyStyle === style
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-white/10 text-purple-100 hover:bg-white/20'
                      }`}
                    >
                      {style === 'faang' ? 'FAANG' : style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Interview Length: {settings.duration} minutes
                </label>
                <input
                  type="range"
                  min="30"
                  max="60"
                  step="15"
                  value={settings.duration}
                  onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-sm text-purple-300 mt-1">
                  <span>30 min</span>
                  <span>45 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Communication Mode */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Communication Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['text', 'voice', 'both'] as CommunicationMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettings({ ...settings, communicationMode: mode })}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        settings.communicationMode === mode
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-white/10 text-purple-100 hover:bg-white/20'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interviewer Personality */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Interviewer Personality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['friendly', 'neutral', 'tough'] as Personality[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSettings({ ...settings, personality: p })}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        settings.personality === p
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-white/10 text-purple-100 hover:bg-white/20'
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
              className="w-full mt-8 py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Start Mock Interview
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Dynamic Problems</h3>
              <p className="text-purple-200 text-sm">
                Every problem is unique and generated fresh - no memorization
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-lg font-semibold text-white mb-2">Human-Like AI</h3>
              <p className="text-purple-200 text-sm">
                AI interviewer that reads your behavior and responds naturally
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Detailed Feedback</h3>
              <p className="text-purple-200 text-sm">
                Get comprehensive analysis and personalized improvement tips
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
