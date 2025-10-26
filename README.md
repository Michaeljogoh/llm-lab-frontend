This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# 🧪 LLM Lab — Explore the Mind of AI

> **Understand how parameters like `temperature`, `top_p`, `top_k`  shape LLM behavior through interactive experiments and visual analytics.**

---

## 🚀 Overview

**LLM Lab** is a full-stack experimental console that helps users dissect how Large Language Models (LLMs) behave under different generation settings.  
You can input prompts, tweak generation parameters, visualize multiple model outputs, and analyze them using programmatic quality metrics you define.

The goal: make the invisible visible — see how the AI “thinks” when you turn the dials.


**Data Flow:**
1. User submits prompt + parameter range  
2. Backend triggers multiple LLM calls  
3. Responses stored with parameters & computed metrics  
4. Frontend fetches and displays comparison dashboard  

---

Set up environment variables

Create a .env.local file in the root directory and add:

NEXT_PUBLIC_BASE_URL=<your_supabase_url>


Open [https://llm-lab-frontend-one.vercel.app/](https://llm-lab-frontend-one.vercel.app/) with your browser to see the result.



This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
