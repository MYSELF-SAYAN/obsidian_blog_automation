# Blog Automation UI



<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js Version">
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/AI-Powered-green?style=for-the-badge&logo=openai" alt="AI Powered">
</p>

> ⚡ **One-Click Blog-to-Obsidian Automation** — Paste a blog link, AI scrapes & processes it, creates structured markdown notes with automatic backlink connections — fully automated.

---

## 🚀 The Magic: How It Works

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│  Paste URL  │ ─► │   AI Scrapes  │ ─► │ AI Processes│ ─► │ Creates    │
│             │    │   & Fetches   │    │  & Structur │    │ Linked Note│
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘
                                                                    │
                              ┌────────────────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  Visualize in   │ ─► 📊 Backlinks, Metrics,
                    │   Obsidian      │     Outgoing Links, Word Count
                    └─────────────────┘
```

**Traditional Flow:**
- Copy content manually
- Create markdown file
- Format & structure it
- Add links manually

**This Automation:**
1. Paste blog URL
2. Click "Import"
3. ✅ Done — AI handles everything

---

## Features

### 🔗 One-Click Import
- Paste any blog post URL
- Automatic content extraction via web scraper
- AI-powered content processing & structuring
- Creates properly formatted markdown
- Saves directly to your Obsidian vault

### 🧠 AI-Powered Processing
- Intelligent content parsing & summarization
- Auto-generates title, tags, and metadata
- Creates semantic links to related notes
- Smart backlink management

### 📊 Note Analytics & Visualization
- **Word Count** — Track note length
- **Backlinks** — See what links to this note
- **Outgoing Links** — See what this note links to
- **Outline/Headings** — Document structure at a glance

### 📅 Daily Notes Integration
- Quick access to daily notes
- One-click append functionality
- Template-ready for recurring entries

### 📁 Vault Explorer
- Browse all notes in your Obsidian vault
- Filter by folder, date, or content
- Quick preview and navigation

### ⚙️ Settings Management
- Configure Obsidian vault name
- Set OpenAI API key for AI features
- Customize import preferences

---

## Quick Start

```bash
# Navigate to UI directory
cd ui

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Then open **http://localhost:3000** in your browser.

---

## Environment Variables

Create a `.env.local` file with:

```env
# Obsidian - Your vault name
OBSIDIAN_VAULT_NAME=my_vault

# OpenAI - For AI-powered processing (required for smart features)
OPENAI_API_KEY=sk-...

# Optional: Server port
PORT=3000
```

> **Note:** You need [Obsidian](https://obsidian.md) installed and the [Obsidian Shell Commands](https://github.com/charliecm/obsidian-shell-commands) plugin for CLI integration.

---

## Project Structure

```
ui/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── blog/          # Blog import endpoint ← Magic happens here
│   │   │   ├── daily/         # Daily notes endpoint
│   │   │   ├── notes/         # Notes CRUD with backlinks/metrics
│   │   │   └── vault/         # Vault info endpoint
│   │   ├── add/               # Add new blog post (the import UI)
│   │   ├── daily/             # Daily notes page
│   │   ├── explorer/          # Vault explorer with analytics
│   │   └── settings/          # Configuration page
│   ├── components/            # React components
│   │   └── ui/                # Reusable UI components (shadcn/ui)
│   └── lib/                   # Core utilities
│       ├── server/            # Server-side services
│       │   └── services/
│       │       ├── obsidian.ts    # Obsidian SDK wrapper
│       │       ├── scraper.ts     # Web content extraction
│       │       └── ai.ts          # OpenAI processing
│       ├── api-client.ts      # Client-side API wrapper
│       ├── hooks.ts           # Custom React hooks
│       ├── types.ts           # TypeScript definitions
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS config
├── postcss.config.js          # PostCSS config
└── package.json               # Dependencies
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/blog` | **Magic endpoint** — Paste URL, get processed note |
| `GET` | `/api/daily` | Get daily note content |
| `POST` | `/api/daily` | Append to daily note |
| `GET` | `/api/notes` | List all vault notes |
| `GET` | `/api/notes/[path]` | Get specific note |
| `POST` | `/api/notes/[path]/append` | Append content to note |
| `GET` | `/api/notes/[path]/backlinks` | **Visualization** — Who links here? |
| `GET` | `/api/notes/[path]/outgoing` | **Visualization** — Where does this link? |
| `GET` | `/api/notes/[path]/metrics` | **Visualization** — Word count, outline |
| `GET` | `/api/vault` | Get vault information |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **AI**: OpenAI GPT-4 for intelligent processing
- **Obsidian**: obsidian-sdk for vault operations
- **Scraping**: Cheerio for web content extraction

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint code analysis |

---

## The Import Flow (Deep Dive)

```typescript
// 1. User pastes URL in UI
// 2. API receives POST /api/blog with { url: "https://..." }

// 3. Scraper fetches HTML and extracts content
const article = await scrapeBlog(url);

// 4. AI processes and structures the content
const structured = await ai.process(article.content, {
  extractTitle: true,
  generateSummary: true,
  extractTags: true,
  findRelatedConcepts: true
});

// 5. Obsidian SDK creates the note
const notePath = await obsidian.notes.create({
  path: `Imported/Blog/${slugify(article.title)}.md`,
  content: structured.markdown
});

// 6. Auto-link to related notes
await obsidian.linking.createLink({
  file: notePath,
  link: structured.relatedNotes[0]
});
```

---

## References

- [obsidian-sdk](https://www.npmjs.com/package/obsidian-sdk) — Official npm package
- [obsidian_cli_sdk](https://github.com/MYSELF-SAYAN/obsidian_cli_sdk) — GitHub repository
- [Obsidian SDK Docs](https://obsidiansdk.vercel.app/) — Documentation & API reference

