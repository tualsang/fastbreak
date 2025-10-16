# Fastbreak Event Dashboard

A full-stack Sports Event Management application built with Next.js 15, TypeScript, Supabase, and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account
- Git installed

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd fastbreak-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Set up the database**

Run the SQL script from the repository in your Supabase SQL Editor to create the necessary tables and policies.

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fastbreak-dashboard/
├── app/
│   ├── actions/          # Server Actions
│   │   ├── auth.ts       # Authentication actions
│   │   └── events.ts     # Event management actions
│   ├── auth/
│   │   └── callback/     # OAuth callback handler
│   ├── dashboard/        # Dashboard page
│   ├── events/
│   │   ├── create/       # Create event page
│   │   └── edit/[id]/    # Edit event page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── dashboard-client.tsx
│   └── event-form.tsx
├── lib/
│   ├── supabase/         # Supabase clients
│   └── types.ts          # TypeScript types
└── middleware.ts         # Route protection

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (use your Vercel URL)
5. Click "Deploy"

### Step 3: Configure Supabase

After deployment, update your Supabase settings:

1. Go to your Supabase project
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to **Site URL**
4. Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**

### Step 4: Enable Google OAuth (Optional)

1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Google**
3. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com)
4. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Add Client ID and Secret to Supabase



## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGc...` |
| `NEXT_PUBLIC_SITE_URL` | Your application URL | `http://localhost:3000` |

## Testing the Application

### Create an Account

1. Navigate to `/signup`
2. Enter email and password
3. Click "Sign up"
4. You'll be redirected to the dashboard

### Create an Event

1. Click "Create Event" button
2. Fill in event details:
   - Event name
   - Sport type
   - Date & time
   - Description (optional)
   - At least one venue
3. Click "Create Event"

### Search and Filter

1. Use the search bar to find events by name
2. Use the sport filter dropdown to filter by sport type
3. Click "Search" to apply filters

### Edit/Delete Events

1. Click "Edit" button on any event card
2. Modify the event details
3. Click "Update Event"
4. Or click the trash icon to delete an event


## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Acknowledgments

- Built for Fastbreak coding challenge
- Uses Shadcn UI components
- Powered by Supabase and Vercel