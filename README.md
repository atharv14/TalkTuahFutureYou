# TalkTuahFutureYou

TalkTuahFutureYou is an AI-powered financial planning application that lets you chat with your future self and visualize your financial journey.

## Features
- 💬 Chat with your AI future self
- 📊 Interactive financial timeline visualization
- 🔄 What-if scenario comparisons
- 📈 Real-time financial projections
- 🎯 Personalized financial advice

## Tech Stack
- Frontend: React + Vite
- Styling: TailwindCSS + Shadcn/ui
- Charts: Recharts
- AI: OpenAI API
- State Management: Zustand

## Local Development
1. Clone the repository:
```bash
git clone https://github.com/atharv14/TalkTuahFutureYou.git
cd TalkTuahFutureYou
```
2. Install dependencies:
```bash
npm install
```
3. Create a ```.env``` file in the root:
```bash
touch .env
VITE_OPENAI_API_KEY=your_openai_api_key
```
4. Start the development server:
```bash
npm run dev
```

## Key Components

- /src/components/chat/: Chat interface components
- /src/components/timeline/: Financial visualization components
- /src/lib/store/: State management
- /src/lib/api/: API integrations
