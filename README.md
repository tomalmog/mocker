# Mocker - AI-Powered Mock Interview Platform

A realistic mock interview platform that simulates actual technical interviews with an AI interviewer that behaves like a human - not just a code judge.

## Features

- **Realistic AI Interviewer**: Powered by Claude, the interviewer acts like a real human - asks follow-ups, gives hints, and reviews your code
- **Dynamic Problem Generation**: Every problem is unique and calibrated to your selected difficulty
- **Live Code Editor**: Monaco Editor (VSCode) with syntax highlighting and language support
- **Real-time Code Execution**: Test your code instantly with Piston API
- **Comprehensive Feedback**: Detailed analysis of your performance, code quality, and areas for improvement
- **Progress Tracking**: Monitor your improvement over time and identify patterns in your weak areas
- **Customizable Settings**: Choose difficulty, topic focus, company style, duration, and more

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Monaco Editor** - Code editing experience

### Backend & APIs
- **Claude (Anthropic)** - AI interviewer and problem generation
- **Piston API** - Code execution
- **Next.js API Routes** - Backend endpoints

### Future Integrations
- PostgreSQL - Data persistence
- Redis - Session management
- Deepgram/OpenAI Whisper - Speech-to-text
- ElevenLabs/OpenAI TTS - Text-to-speech

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mocker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
mocker/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── execute/        # Code execution endpoint
│   │   └── interview/      # Interview-related endpoints
│   │       ├── generate-problem/
│   │       ├── chat/
│   │       ├── hint/
│   │       ├── submit/
│   │       └── feedback/
│   ├── interview/          # Interview pages
│   │   ├── page.tsx       # Main interview room
│   │   └── feedback/      # Feedback/debrief page
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── interview/        # Interview-specific components
│   │   ├── CodeEditor.tsx
│   │   ├── Console.tsx
│   │   ├── Chat.tsx
│   │   ├── Timer.tsx
│   │   └── ProblemDisplay.tsx
│   ├── ui/              # Reusable UI components
│   └── dashboard/       # Dashboard components
├── lib/                 # Utility libraries
│   ├── api/            # API clients
│   │   ├── claude.ts
│   │   └── code-execution.ts
│   ├── config.ts       # Configuration management
│   └── utils/          # Helper functions
├── types/              # TypeScript type definitions
│   └── index.ts
└── contexts/           # React contexts (future)
```

## Usage

### Starting an Interview

1. Go to the homepage
2. (Optional) Click "Customize Settings" to configure:
   - Difficulty: Easy, Medium, Hard, or Random
   - Topic: Arrays, Trees, Graphs, DP, etc.
   - Company Style: FAANG, Startup, or Trading Firm
   - Duration: 30, 45, or 60 minutes
   - Programming Language: Python, Java, C++, JavaScript, or TypeScript
   - Interviewer Personality: Friendly, Neutral, or Tough
3. Click "Start Mock Interview"

### During the Interview

- **Problem Panel** (top right): Read the problem description, examples, and constraints
- **Code Editor** (left): Write your solution
  - Change language using the dropdown
  - Code is auto-saved
- **Console** (bottom left):
  - Run your code with custom input
  - Submit your solution when ready
- **Chat** (bottom right): Communicate with the AI interviewer
  - Ask questions
  - Explain your approach
  - Request hints (tracked in your score)
- **Top Bar**:
  - View elapsed time
  - Request hints
  - End interview early

### After the Interview

You'll receive comprehensive feedback including:
- Overall score and performance rating
- Score breakdown (problem solving, code quality, communication, etc.)
- What went well
- Areas for improvement
- Complexity analysis of your solution vs. optimal
- Code review with specific suggestions
- Similar problems to practice

## API Endpoints

### POST `/api/interview/generate-problem`
Generate a new interview problem based on settings.

**Request:**
```json
{
  "settings": {
    "difficulty": "medium",
    "topic": "arrays",
    "companyStyle": "faang",
    "duration": 45,
    "language": "python"
  },
  "sessionId": "interview-123"
}
```

**Response:**
```json
{
  "problem": {
    "id": "problem-123",
    "title": "...",
    "description": "...",
    "examples": [...],
    "constraints": [...],
    "hints": [...],
    ...
  }
}
```

### POST `/api/interview/chat`
Send a message to the AI interviewer.

### POST `/api/interview/hint`
Request a progressive hint.

### POST `/api/interview/submit`
Submit your solution for review.

### POST `/api/interview/feedback`
Generate comprehensive feedback after the interview.

### POST `/api/execute`
Execute code in the specified language.

## Environment Variables

See `.env.example` for all available configuration options.

Required:
- `ANTHROPIC_API_KEY` - Your Anthropic API key

Optional:
- `DATABASE_URL` - PostgreSQL connection string (future)
- `REDIS_URL` - Redis connection string (future)
- `DEEPGRAM_API_KEY` - For speech-to-text (future)
- `ELEVENLABS_API_KEY` - For text-to-speech (future)

## Development Roadmap

- [x] Core interview room with split-screen layout
- [x] Monaco code editor integration
- [x] Claude AI interviewer (problem generation, chat, hints)
- [x] Code execution (Piston API)
- [x] Feedback and scoring system
- [x] Dashboard with mock data
- [ ] Database integration (PostgreSQL)
- [ ] User authentication
- [ ] Session persistence
- [ ] Voice mode (speech-to-text, text-to-speech)
- [ ] Interviewer avatar visualization
- [ ] Adaptive difficulty system
- [ ] Spaced repetition for weak topics
- [ ] Responsive design
- [ ] Comprehensive tests
- [ ] Production deployment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Claude (Anthropic)](https://www.anthropic.com/)
- Code execution by [Piston](https://github.com/engineer-man/piston)
- Code editor by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
