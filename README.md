# LLM Lab — Frontend

A visual experimentation dashboard for exploring how generation parameters shape Large Language Model behavior. Run matrix sweeps, score responses, compare variants, and iterate toward the best settings — with live progress, heatmaps, and shareable results.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS v4 + shadcn/ui
- **Server State:** TanStack React Query v5
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Export:** export-to-csv + native JSON / Jupyter notebook export
- **Package Manager:** pnpm

## Architecture

```
src/
├── app/
│   ├── page.tsx                          # Dashboard (SSR experiments)
│   ├── experiments/page.tsx              # Full experiment library
│   └── experiments/share/[token]/page.tsx # Public shared view
├── components/
│   ├── dashboard/                        # Home dashboard shell
│   └── experiments/                      # Advanced experiment features
├── hooks/
│   ├── use-favorites.ts                  # localStorage + API sync
│   └── use-experiment-poll.ts            # Background job polling
├── lib/
│   ├── api-client.ts                     # Axios + anonymous client ID
│   └── experiment-utils.ts               # Sort, export, heatmap, diff
└── types/experiment.ts                   # Shared TypeScript interfaces
```

## Features

### Dashboard (`/`)
- Hero, KPI stats, workflow strip, and **latest 5 experiments** preview
- Link to full library at `/experiments`
- **Golden benchmark** panel — one-click standard prompt suite

### Experiment creation
- **Prompt presets** — explain, JSON extraction, marketing, code review
- **System prompt** field for persona and format rules
- **Multi-model sweep** — select multiple Gemini models
- **Custom scoring weights** — sliders for all 8 metrics
- Optional **LLM-as-judge** per variant
- **Tags** for organization
- **Background execution** with live progress bar (polls `/status`)
- Combination cap raised to **48 runs** (params × models)

### Full experiment library (`/experiments`)
- Detailed experiment cards with parameter ranges, top response, metrics
- Search, sort, and favorites filter
- All advanced actions from the detail sheet

### Parameter impact heatmap
- **Temperature × Top P** color grid showing average scores
- Available in experiment detail → **Heatmap** tab

### Compare & analyze
- Side-by-side compare (2 variants)
- **Word-level diff view** between compared responses
- **Human rating** (thumbs up/down) synced to backend
- Heuristic score vs **judge score** when available
- **Cost & latency** badges per variant

### Iteration tools
- **Duplicate** — re-run same sweep
- **Narrow sweep** — focused grid around best variant
- **Resume** — continue failed/incomplete jobs
- **Regression check** — re-run and compare best score
- **Auto-suggest next sweep** message after completion

### Sharing & export
- **Public share links** (`/experiments/share/:token`)
- Export **CSV**, **JSON**, and **Jupyter notebook** (`.ipynb`)

### Favorites
- Star experiments locally and **sync to server** via anonymous client ID
- Filter by starred on dashboard and library pages

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with preview + benchmark |
| `/experiments` | Full library with detailed cards |
| `/experiments/share/[token]` | Read-only public shared experiment |

## Data Flow

```
┌─────────────┐    SSR fetch     ┌─────────────────┐
│  Next.js    │ ───────────────► │  Backend API    │
│  Server     │ ◄─────────────── │  (NestJS)       │
└──────┬──────┘   experiments[]  └────────▲────────┘
       │                                   │
       │  POST /experiment (async)         │
       ▼                                   │
┌─────────────┐   poll /status     ┌──────┴──────┐
│  Client UI  │ ─────────────────► │  Background │
│  + sheets   │                    │  sweep job  │
└─────────────┘                    └─────────────┘
```

- **Initial load:** Server components fetch experiments (no cache)
- **Create sweep:** Returns immediately; UI polls progress until `completed`
- **After completion:** `router.refresh()` updates server-rendered lists

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Running backend (see `llm-lab-backend/README.md`)

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:4000
```

### Installation

```bash
pnpm install
```

### Running the Dev Server

```bash
pnpm dev
```

The app starts on `http://localhost:3000`.

### Building for Production

```bash
pnpm build
pnpm start
```

## Deployment

The frontend is deployed on [Vercel](https://llm-lab-frontend-one.vercel.app/).

## License

MIT
