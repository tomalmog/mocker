// Core types for Mocker

export type Difficulty = 'easy' | 'medium' | 'hard' | 'random';

export type InterviewTopic =
  | 'arrays'
  | 'trees'
  | 'graphs'
  | 'dynamic-programming'
  | 'strings'
  | 'hashmaps'
  | 'stacks-queues'
  | 'linked-lists'
  | 'sorting-searching'
  | 'surprise';

export type CompanyStyle = 'faang' | 'startup' | 'trading-firm';

export type CommunicationMode = 'text' | 'voice' | 'both';

export type InterviewerPersonality = 'friendly' | 'neutral' | 'tough';

export type ProgrammingLanguage = 'python' | 'java' | 'cpp' | 'javascript' | 'typescript';

export interface InterviewSettings {
  difficulty: Difficulty;
  topic: InterviewTopic;
  companyStyle: CompanyStyle;
  duration: number; // in minutes
  communicationMode: CommunicationMode;
  interviewerPersonality: InterviewerPersonality;
  language: ProgrammingLanguage;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  examples: Example[];
  constraints: string[];
  hints: string[];
  optimalSolution: Solution;
  testCases: TestCase[];
  difficulty: Difficulty;
  topic: InterviewTopic;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Solution {
  code: string;
  language: ProgrammingLanguage;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

export interface InterviewMessage {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
  type: 'text' | 'voice';
}

export interface InterviewState {
  sessionId: string;
  problem: Problem | null;
  messages: InterviewMessage[];
  code: string;
  language: ProgrammingLanguage;
  startTime: Date;
  endTime?: Date;
  hintsUsed: number;
  status: 'setup' | 'active' | 'reviewing' | 'completed';
  settings: InterviewSettings;
}

export interface CodeExecution {
  code: string;
  language: ProgrammingLanguage;
  input?: string;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memory: number;
  success: boolean;
}

export interface InterviewScore {
  overall: number; // 0-10
  problemSolving: number; // 0-10
  codeQuality: number; // 0-10
  communication: number; // 0-10
  timeManagement: number; // 0-10
  optimizationAwareness: number; // 0-10
}

export interface Feedback {
  score: InterviewScore;
  strengths: string[];
  improvements: string[];
  complexityAnalysis: {
    userSolution: {
      time: string;
      space: string;
    };
    optimalSolution: {
      time: string;
      space: string;
    };
    explanation: string;
  };
  codeReview: {
    lineComments: { line: number; comment: string }[];
    suggestions: string[];
    refactoredCode?: string;
  };
  similarProblems: string[];
  result: 'strong-pass' | 'weak-pass' | 'no-hire' | 'borderline';
}

export interface Interview {
  id: string;
  userId: string;
  problem: Problem;
  settings: InterviewSettings;
  code: string;
  messages: InterviewMessage[];
  feedback?: Feedback;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalInterviews: number;
  averageScore: number;
  weakAreas: { topic: InterviewTopic; failureRate: number }[];
  strengths: { topic: InterviewTopic; successRate: number }[];
  commonMistakes: string[];
  improvementRate: number; // per week
  streak: number; // current streak in days
}

export interface User {
  id: string;
  email: string;
  name: string;
  stats: UserStats;
  interviews: Interview[];
  createdAt: Date;
  tier: 'free' | 'pro' | 'enterprise';
}
