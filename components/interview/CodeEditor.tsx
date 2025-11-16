'use client';

import { Editor, OnMount } from '@monaco-editor/react';
import { ProgrammingLanguage } from '@/types';
import { useRef, useState } from 'react';

interface CodeEditorProps {
  language: ProgrammingLanguage;
  value: string;
  onChange: (value: string) => void;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  readOnly?: boolean;
  height?: string;
}

const LANGUAGE_MAP: Record<ProgrammingLanguage, string> = {
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  javascript: 'javascript',
  typescript: 'typescript',
};

const STARTER_CODE: Record<ProgrammingLanguage, string> = {
  python: '# Write your solution here\ndef solve():\n    pass\n',
  java: 'class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your solution here\n    }\n};\n',
  javascript: '// Write your solution here\nfunction solve() {\n    \n}\n',
  typescript: '// Write your solution here\nfunction solve(): void {\n    \n}\n',
};

export default function CodeEditor({
  language,
  value,
  onChange,
  onLanguageChange,
  readOnly = false,
  height = '100%',
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsReady(true);

    // Configure Monaco editor
    monaco.editor.defineTheme('mocker-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1a1a',
      },
    });
    monaco.editor.setTheme('mocker-dark');

    // Enable auto-completion, formatting, etc.
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      rulers: [80],
      wordWrap: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      formatOnPaste: true,
      formatOnType: true,
    });
  };

  const handleLanguageSelect = (newLang: ProgrammingLanguage) => {
    // Ask for confirmation if there's code
    if (value && value.trim() !== '' && value !== STARTER_CODE[language]) {
      if (!confirm('Changing language will reset your code. Continue?')) {
        return;
      }
    }

    onLanguageChange(newLang);
    onChange(STARTER_CODE[newLang]);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Language selector toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252525] border-b border-gray-700">
        <span className="text-sm text-gray-400">Language:</span>
        <select
          value={language}
          onChange={(e) => handleLanguageSelect(e.target.value as ProgrammingLanguage)}
          className="bg-[#1a1a1a] text-white text-sm border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
          disabled={readOnly}
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      {/* Code editor */}
      <div className="flex-1">
        <Editor
          height={height}
          language={LANGUAGE_MAP[language]}
          value={value}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-[#1a1a1a] text-gray-400">
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
