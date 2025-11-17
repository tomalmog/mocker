'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import ThemeToggle from '@/app/components/ThemeToggle';
import type { ChatMessage, Problem, Language } from '@/types/interview';

const LANGUAGE_TEMPLATES = {
  python: '# Write your solution here\n\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\n\nfunction solution() {\n    \n}\n',
  java: '// Write your solution here\n\npublic class Solution {\n    public void solution() {\n        \n    }\n}\n',
  cpp: '// Write your solution here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
};

export default function InterviewRoom() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.python);
  const [language, setLanguage] = useState<Language>('python');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    const checkActivity = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityTime;
      const twoMinutes = 2 * 60 * 1000;

      if (timeSinceLastActivity > twoMinutes && chatMessages.length > 0) {
        sendAIMessage('How\'s it going? Want to talk through your approach?');
        setLastActivityTime(Date.now());
      }
    }, 30000);
    return () => clearInterval(checkActivity);
  }, [lastActivityTime, chatMessages.length]);

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/interview/session/${sessionId}`);
      const data = await response.json();

      setProblem(data.problem);
      setChatMessages(data.chatHistory || []);

      if (!data.chatHistory || data.chatHistory.length === 0) {
        setTimeout(() => {
          const greeting = getInterviewerGreeting(data.settings?.personality || 'friendly');
          sendAIMessage(greeting);
        }, 1000);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading session:', error);
      setIsLoading(false);
    }
  };

  const getInterviewerGreeting = (personality: string) => {
    const greetings = {
      friendly: "Hi! I'm Alex, I'll be your interviewer today. How are you doing? Ready to dive in?",
      neutral: "Hello. I'm Alex, your interviewer for this session. Let's begin when you're ready.",
      tough: "Good day. I'm Alex. Let's get started - we have a lot to cover.",
    };
    return greetings[personality as keyof typeof greetings] || greetings.friendly;
  };

  const sendAIMessage = async (message?: string) => {
    let aiMessage: string;

    if (message) {
      aiMessage = message;
    } else {
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          chatHistory: chatMessages,
          userCode: code,
          problem,
        }),
      });

      const data = await response.json();
      aiMessage = data.message;
    }

    const newMessage: ChatMessage = {
      role: 'interviewer',
      content: aiMessage,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'candidate',
      content: inputMessage,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLastActivityTime(Date.now());

    await sendAIMessage();
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang]);
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases: problem?.testCases || [],
        }),
      });

      const result = await response.json();

      const resultMessage: ChatMessage = {
        role: 'interviewer',
        content: `Test Results:\n${JSON.stringify(result, null, 2)}`,
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [...prev, resultMessage]);
    } catch (error) {
      console.error('Error running code:', error);
    }
  };

  const handleRequestHint = () => {
    if (!problem || hintsUsed >= problem.hints.length) return;

    const hint = problem.hints[hintsUsed];
    const hintMessage: ChatMessage = {
      role: 'interviewer',
      content: `Hint ${hintsUsed + 1}: ${hint}`,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, hintMessage]);
    setHintsUsed((prev) => prev + 1);
    setShowHint(false);
  };

  const handleEndInterview = async () => {
    router.push(`/interview/${sessionId}/feedback`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-black dark:text-white text-lg">Loading interview...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-black dark:text-white">Mocker Interview</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">{formatTime(timeElapsed)}</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHint(true)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
            disabled={!problem || hintsUsed >= problem.hints.length}
          >
            Hint ({hintsUsed}/{problem?.hints.length || 0})
          </button>
          <ThemeToggle />
          <button
            onClick={handleEndInterview}
            className="px-3 py-1.5 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90 transition-opacity"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Code Editor (60%) */}
        <div className="w-[60%] flex flex-col border-r border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <div className="flex gap-1">
              {(['python', 'javascript', 'java', 'cpp'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1 text-xs rounded ${
                    language === lang
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                Run Code
              </button>
              <button className="px-3 py-1 text-xs bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-90">
                Submit
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-black">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => {
                setCode(value || '');
                setLastActivityTime(Date.now());
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Right Side - Problem & Chat (40%) */}
        <div className="w-[40%] flex flex-col bg-gray-50 dark:bg-gray-950">
          {/* Problem Statement */}
          <div className="h-1/3 overflow-y-auto px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            {problem && (
              <div className="text-sm">
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">{problem.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{problem.description}</p>

                <h3 className="text-sm font-semibold text-black dark:text-white mb-2">Examples:</h3>
                {problem.examples.map((example, idx) => (
                  <div key={idx} className="mb-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-3 rounded text-xs">
                    <div className="mb-1"><span className="font-medium">Input:</span> {example.input}</div>
                    <div className="mb-1"><span className="font-medium">Output:</span> {example.output}</div>
                    {example.explanation && (
                      <div className="text-gray-600 dark:text-gray-400 mt-1">{example.explanation}</div>
                    )}
                  </div>
                ))}

                <h3 className="text-sm font-semibold text-black dark:text-white mb-2">Constraints:</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  {problem.constraints.map((constraint, idx) => (
                    <li key={idx} className="text-xs">{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {chatMessages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                      message.role === 'candidate'
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="text-xs mb-1 opacity-70">
                      {message.role === 'candidate' ? 'You' : 'Alex'}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint Modal */}
      {showHint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Request a Hint?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Requesting a hint will affect your final score. Are you sure you want to proceed?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHint(false)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestHint}
                className="flex-1 px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90"
              >
                Get Hint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
