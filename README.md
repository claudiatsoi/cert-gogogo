# Go-Go-Go Competition Platform

A low-budget online competition platform for students in Hong Kong.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** Supabase
- **Theme:** Modern & Academic (Blue/White/Gold)

## Prerequisite
1. **Node.js**: Ensure Node.js is installed.
2. **Supabase**: You need a Supabase project.
   - Create a project at [supabase.com](https://supabase.com).
   - Go to the SQL Editor and run the content of `supabase/schema.sql`.
   - Get your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings > API.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   # If installation fails, try installing packages manually:
   # npm install clsx tailwind-merge lucide-react class-variance-authority @radix-ui/react-slot @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Visit [http://localhost:3000](http://localhost:3000).

## Project Structure
- `src/app`: Page routes (Home, Register, Dashboard, Competition).
- `src/components`: UI components (Navbar, Footer, Shadcn UI).
- `src/lib`: Utilities and Supabase client.
- `src/types`: TypeScript definitions for Database.
- `supabase`: SQL Schema.

## Features
- **Landing Page**: Hero section and value proposition.
- **Registration**: Student signup with Supabase Auth.
- **Dashboard**: View active competitions and past results.
- **Competition Interface**: Interactive quiz with specific "Word" question support (Text-to-Speech) and Anti-Cheat warning.
- **Results**: Automatic scoring and Tier calculation (Honor, Gold, Silver, Bronze).


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
