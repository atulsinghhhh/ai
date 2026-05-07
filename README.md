# Astra AI – Intelligent Search Engine

Astra AI is a premium, AI-powered search engine that provides direct answers with cited sources, similar to Perplexity. It leverages modern LLMs and real-time web search to deliver accurate, contextual information.

## 🔗 Live Links
- **Frontend**: [https://frontend-six-peach-98.vercel.app](https://frontend-six-peach-98.vercel.app)
- **Backend**: [https://ai-hj37.onrender.com](https://ai-hj37.onrender.com)


## 🚀 Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **LLM Provider**: [Groq](https://groq.com/) (Llama 3.3 70B)
- **Search Engine**: [Tavily AI](https://tavily.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)

### Frontend
- **Framework**: [React](https://react.dev/) (Bun template)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Context

---

## 📁 Project Structure

```text
├── backend/
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── index.ts        # Express server & API routes
│   │   ├── middleware.ts   # Supabase auth & user syncing
│   │   ├── client.ts       # Supabase client initialization
│   │   └── prompt.ts       # AI system prompts and templates
│   └── health.test.ts      # Backend health check tests
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard and Auth views
│   │   ├── lib/            # API utilities and configurations
│   │   └── frontend.tsx    # React entry point
│   └── health.test.ts      # Frontend health check tests
└── README.md
```

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Install [Bun](https://bun.sh/) (`powershell -c "irm bun.sh/install.ps1 | iex"`)
- A Supabase account and project
- A Tavily API key
- A Groq API key

### 2. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `bun install`
3. Create a `.env` file and add the following:
   ```env
   PORT=3001
   DATABASE_URL="your_postgresql_url"
   TAVILY_API_KEY="your_tavily_key"
   GROQ_API_KEY="your_groq_key"
   SUPABASE_URL="your_supabase_url"
   SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
   ```
4. Run Prisma migrations: `bun x prisma migrate dev`
5. Start the server: `bun run index.ts`

### 3. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `bun install`
3. Create a `.env` file or update `src/lib/config.ts` with your backend URL and Supabase credentials.
4. Start the development server: `bun run dev`

---

## 🧪 Running Tests
Both frontend and backend include health check suites for CI/CD:
```bash
# In either directory
bun test
```

## 🔒 Security
This project uses **GitHub Push Protection**. Never hardcode API keys or secrets in the codebase. Always use the `.env` file and environment variables.
