'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CodeEditor from '@/components/interview/CodeEditor';
import Console from '@/components/interview/Console';
import Chat from '@/components/interview/Chat';
import Timer from '@/components/interview/Timer';
import ProblemDisplay from '@/components/interview/ProblemDisplay';
import {
  InterviewSettings,
  InterviewMessage,
  Problem,
  ProgrammingLanguage,
  ExecutionResult,
} from '@/types';

const STARTER_CODE: Record<ProgrammingLanguage, string> = {
  python: '# Write your solution here\ndef solve():\n    pass\n',
  java: 'class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your solution here\n    }\n};\n',
  javascript: '// Write your solution here\nfunction solve() {\n    \n}\n',
  typescript: '// Write your solution here\nfunction solve(): void {\n    \n}\n',
};

export default function InterviewPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<InterviewSettings | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');
  const [startTime] = useState(new Date());
  const [isInterviewerTyping, setIsInterviewerTyping] = useState(false);
  const [isProblemLoading, setIsProblemLoading] = useState(true);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [sessionId] = useState(() => `interview-${Date.now()}`);

  // Load settings from sessionStorage
  useEffect(() => {
    const storedSettings = sessionStorage.getItem('interviewSettings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings) as InterviewSettings;
      setSettings(parsed);
      setLanguage(parsed.language);
      setCode(STARTER_CODE[parsed.language]);

      // Start the interview
      initializeInterview(parsed);
    } else {
      // No settings found, redirect to home
      router.push('/');
    }
  }, [router]);

  const initializeInterview = async (settings: InterviewSettings) => {
    // Add initial greeting from interviewer
    setTimeout(() => {
      addInterviewerMessage("Hi! I'm Alex, I'll be your interviewer today. How are you doing?");
      setIsInterviewerTyping(false);
    }, 1500);

    // Generate problem
    try {
      const response = await fetch('/api/interview/generate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        setProblem(data.problem);
        setIsProblemLoading(false);

        // Interviewer introduces the problem
        setTimeout(() => {
          addInterviewerMessage(
            "Alright, let me share the problem with you. Take a moment to read it, and feel free to think out loud as you work through it."
          );
        }, 3000);
      } else {
        console.error('Failed to generate problem');
        setIsProblemLoading(false);
        addInterviewerMessage(
          "Sorry, I'm having trouble loading the problem. Please try refreshing the page."
        );
      }
    } catch (error) {
      console.error('Error generating problem:', error);
      setIsProblemLoading(false);
      addInterviewerMessage(
        "Sorry, I'm having trouble loading the problem. Please try refreshing the page."
      );
    }
  };

  const addInterviewerMessage = (content: string) => {
    const message: InterviewMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: 'interviewer',
      content,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages((prev) => [...prev, message]);
  };

  const addCandidateMessage = (content: string) => {
    const message: InterviewMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: 'candidate',
      content,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleSendMessage = async (content: string) => {
    addCandidateMessage(content);
    setIsInterviewerTyping(true);

    // Send message to AI interviewer
    try {
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: content,
          code,
          problem,
          hintsUsed,
          messages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          addInterviewerMessage(data.response);
          setIsInterviewerTyping(false);
        }, 1000 + Math.random() * 1000); // Random delay for realism
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsInterviewerTyping(false);
      addInterviewerMessage("Sorry, I didn't catch that. Could you repeat?");
    }
  };

  const handleRunCode = async (input: string): Promise<ExecutionResult> => {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, input }),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Execution failed');
      }
    } catch (error) {
      return {
        output: '',
        error: 'Failed to execute code',
        executionTime: 0,
        memory: 0,
        success: false,
      };
    }
  };

  const handleSubmit = async () => {
    addCandidateMessage('I think I have a solution ready!');
    setIsInterviewerTyping(true);

    try {
      const response = await fetch('/api/interview/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          code,
          language,
          problem,
          messages,
          hintsUsed,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsInterviewerTyping(false);

        if (data.nextPhase === 'review') {
          addInterviewerMessage(
            "Okay, let me take a look... Interesting! Can you walk me through your solution?"
          );
        } else if (data.nextPhase === 'complete') {
          // Redirect to feedback page
          router.push(`/interview/feedback?session=${sessionId}`);
        }
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setIsInterviewerTyping(false);
    }
  };

  const handleRequestHint = async () => {
    const newHintCount = hintsUsed + 1;
    setHintsUsed(newHintCount);
    addCandidateMessage('Could I get a hint?');
    setIsInterviewerTyping(true);

    try {
      const response = await fetch('/api/interview/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          problem,
          code,
          hintNumber: newHintCount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          addInterviewerMessage(data.hint);
          setIsInterviewerTyping(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error requesting hint:', error);
      setIsInterviewerTyping(false);
      addInterviewerMessage("Let me think... Try breaking down the problem into smaller parts.");
    }
  };

  const handleEndInterview = () => {
    if (confirm('Are you sure you want to end the interview? Your progress will be saved.')) {
      router.push(`/interview/feedback?session=${sessionId}`);
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading interview...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Mocker Interview</h1>
          <div className="text-sm text-gray-400">
            Session: {sessionId.slice(-8)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Timer
            startTime={startTime}
            duration={settings.duration}
            onTimeUp={() => addInterviewerMessage("Time's up! Let's wrap up.")}
          />

          <button
            onClick={handleRequestHint}
            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
          >
            Request Hint {hintsUsed > 0 && `(${hintsUsed})`}
          </button>

          <button
            onClick={handleEndInterview}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          >
            End Interview
          </button>
        </div>
      </header>

      {/* Main content: Split screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side: Code Editor (60%) */}
        <div className="w-[60%] flex flex-col border-r border-gray-700">
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              language={language}
              value={code}
              onChange={setCode}
              onLanguageChange={setLanguage}
            />
          </div>

          {/* Console at bottom */}
          <div className="h-[300px] border-t border-gray-700">
            <Console onRun={handleRunCode} onSubmit={handleSubmit} />
          </div>
        </div>

        {/* Right side: Problem + Chat (40%) */}
        <div className="w-[40%] flex flex-col">
          {/* Problem description */}
          <div className="h-[50%] overflow-auto p-4">
            <ProblemDisplay problem={problem} isLoading={isProblemLoading} />
          </div>

          {/* Chat interface */}
          <div className="h-[50%] p-4 pt-0">
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              isInterviewerTyping={isInterviewerTyping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
