# Mocker - AI-Powered Mock Technical Interviews

Mocker is a realistic mock interview platform that simulates actual technical interviews with an AI interviewer that behaves like a human - not just a code judge. Think "interviewing at Google" but you can do it at 2am in your pajamas.

## Features

### Core Capabilities

- **Dynamic Problem Generation**: Every problem is unique and generated fresh using Claude AI - no memorization
- **Human-Like AI Interviewer**: AI that reads your behavior (silence, rapid coding, confusion) and responds naturally
- **Real-Time Code Execution**: Test your code against test cases using the Piston API
- **Comprehensive Feedback**: Detailed analysis including code review, complexity analysis, and personalized improvement tips
- **Multiple Languages**: Support for Python, JavaScript, Java, and C++
- **Monaco Editor**: Professional code editing experience (same as VSCode)

### Interview Experience

1. **Customizable Settings**:
   - Difficulty: Easy, Medium, Hard, or Random
   - Topic Focus: Arrays, Trees, Graphs, DP, Strings, etc.
   - Company Style: FAANG, Startup, or Trading Firm
   - Duration: 30, 45, or 60 minutes
   - Communication: Text-only, Voice-only, or Both (voice coming soon)
   - Interviewer Personality: Friendly, Neutral, or Tough

2. **Interview Room**:
   - Split-screen interface (60% code editor, 40% problem/chat)
   - Real-time chat with AI interviewer
   - Timer tracking
   - Hint system (with score impact)
   - Run and test code functionality

3. **Post-Interview Feedback**:
   - Overall performance rating
   - Score breakdown (Problem Solving, Code Quality, Communication, etc.)
   - What went well vs areas to improve
   - Complexity analysis
   - Line-by-line code review
   - Similar problems to practice

4. **Dashboard**:
   - Track interview history
   - Performance trends
   - Identify strengths and weaknesses

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editing
- **Framer Motion** - Animations (coming soon)

### Backend
- **Next.js API Routes** - Serverless functions
- **Anthropic Claude API** - AI interviewer and problem generation
- **Piston API** - Code execution
- **Prisma** - Database ORM
- **SQLite** - Database (for development)

### State Management
- **Zustand** - Lightweight state management
- **React Hooks** - Component state

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

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
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```env
ANTHROPIC_API_KEY=your_api_key_here
```

4. Initialize the database (optional for now):
```bash
# Note: Prisma setup is prepared but not required for basic functionality
# The app currently uses in-memory storage
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
mocker/
├── app/
│   ├── api/
│   │   ├── interview/
│   │   │   ├── start/          # Create new interview session
│   │   │   ├── session/        # Get session data
│   │   │   ├── chat/           # AI interviewer chat
│   │   │   └── feedback/       # Generate feedback
│   │   └── code/
│   │       └── execute/        # Execute code
│   ├── interview/
│   │   └── [sessionId]/
│   │       ├── page.tsx        # Interview room
│   │       └── feedback/
│   │           └── page.tsx    # Feedback page
│   ├── dashboard/              # User dashboard
│   └── page.tsx                # Homepage
├── lib/
│   ├── anthropic.ts            # Claude API client
│   └── prisma.ts               # Prisma client
├── types/
│   └── interview.ts            # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
└── README.md
```

## How It Works

### 1. Interview Setup
User selects preferences (difficulty, topic, style, etc.) on the homepage and clicks "Start Mock Interview".

### 2. Problem Generation
The backend calls Claude API to generate a unique coding problem based on the settings. The problem includes:
- Title and description
- Examples with explanations
- Test cases (visible and hidden)
- Progressive hints
- Optimal solution with complexity analysis

### 3. Interview Session
- User enters the interview room with split-screen layout
- AI interviewer greets and presents the problem
- User writes code in Monaco editor
- AI monitors behavior:
  - Silence for 2+ minutes → Offers help
  - Coding without explaining → Asks for approach
  - Progress → Acknowledges and asks follow-ups
- User can chat, request hints, run code, and submit

### 4. Feedback Generation
When interview ends, Claude analyzes the entire session:
- Chat history
- Code written
- Hints used
- Time taken
- Problem difficulty

It generates comprehensive feedback with scores, suggestions, and next steps.

## API Endpoints

### POST /api/interview/start
Create a new interview session with generated problem.

**Request:**
```json
{
  "difficulty": "medium",
  "topic": "arrays",
  "companyStyle": "faang",
  "duration": 45,
  "communicationMode": "text",
  "personality": "friendly"
}
```

**Response:**
```json
{
  "sessionId": "session_123...",
  "problem": { ... }
}
```

### GET /api/interview/session/[sessionId]
Retrieve interview session data.

### POST /api/interview/chat
Get AI interviewer response.

**Request:**
```json
{
  "sessionId": "session_123",
  "chatHistory": [...],
  "userCode": "...",
  "problem": { ... }
}
```

### POST /api/code/execute
Execute code and run test cases.

**Request:**
```json
{
  "code": "def solution():\n    pass",
  "language": "python",
  "testCases": [...]
}
```

### GET /api/interview/feedback/[sessionId]
Generate comprehensive interview feedback.

## Future Enhancements

### Short Term
- [ ] Voice mode implementation (speech-to-text, text-to-speech)
- [ ] Persist sessions to database instead of memory
- [ ] User authentication (NextAuth)
- [ ] Save interview history to database
- [ ] Animated interviewer avatar

### Medium Term
- [ ] Real-time code analysis and suggestions
- [ ] More sophisticated test case generation
- [ ] Video recording of interview sessions
- [ ] Peer comparison and leaderboards
- [ ] Custom problem sets

### Long Term
- [ ] System design interview mode
- [ ] Behavioral interview practice
- [ ] Team interview simulation
- [ ] Integration with job platforms
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Acknowledgments

- Anthropic for Claude API
- Monaco Editor team
- Piston API for code execution
- Next.js team for the amazing framework

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using Claude AI and Next.js
