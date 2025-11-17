export type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
export type Topic = 'arrays' | 'trees' | 'graphs' | 'dp' | 'strings' | 'linked-lists' | 'stacks-queues' | 'surprise';
export type CompanyStyle = 'faang' | 'startup' | 'trading';
export type CommunicationMode = 'text' | 'voice' | 'both';
export type Personality = 'friendly' | 'neutral' | 'tough';
export type Language = 'python' | 'javascript' | 'java' | 'cpp';
export type OverallRating = 'strong_pass' | 'weak_pass' | 'no_hire' | 'borderline';

export interface InterviewSettings {
  difficulty: Difficulty;
  topic?: Topic;
  companyStyle?: CompanyStyle;
  duration: number;
  communicationMode: CommunicationMode;
  personality: Personality;
}

export interface Problem {
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  testCases: TestCase[];
  hints: string[];
  optimalSolution: {
    code: string;
    timeComplexity: string;
    spaceComplexity: string;
    explanation: string;
  };
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface ChatMessage {
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: number;
}

export interface InterviewSession {
  id: string;
  settings: InterviewSettings;
  problem: Problem;
  chatHistory: ChatMessage[];
  userCode: string;
  language: Language;
  hintsUsed: number;
  startedAt: number;
  timeElapsed?: number;
  lastActivity?: number;
}

export interface InterviewFeedback {
  overallRating: OverallRating;
  scores: {
    problemSolving: number;
    codeQuality: number;
    communication: number;
    timeManagement: number;
    optimization: number;
  };
  whatWentWell: string[];
  areasToImprove: string[];
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
    lineByLineFeedback: string;
    styleSuggestions: string[];
    bugs: string[];
    refactoredCode?: string;
  };
  similarProblems: Array<{
    title: string;
    difficulty: Difficulty;
    topics: string[];
  }>;
}
