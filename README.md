## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

# Fastbreak Event Dashboard

**Live Application:** [https://fastbreak-two.vercel.app](https://fastbreak-two.vercel.app)

A modern sports event management platform where users can create, organize, and manage sports events with multiple venue locations.

---

## 🎯 What This Application Does

This is a **full-stack web application** that allows users to:

- **Create an account** and sign in securely
- **Create sports events** (basketball games, soccer tournaments, tennis matches, etc.)
- **Add multiple venues** to each event (different courts, fields, or locations)
- **Search and filter** through all events by name or sport type
- **Edit their own events** and update details as needed
- **Delete events** they've created
a
Think of it as a centralized hub for organizing sports events - similar to how you might use Google Calendar for meetings, but specifically designed for sports activities.

---

## Try It Yourself

### **Option 1: Use the Live Demo**

1. Visit: [https://fastbreak-two.vercel.app](https://fastbreak-two.vercel.app)
2. Click **"Sign up"** and create a test account
3. Once logged in, you'll see the dashboard
4. Click **"Create Event"** to add a new sports event
5. Fill in the event details and add one or more venues
6. Try searching and filtering events by sport type
7. Edit or delete your events using the buttons on each event card

---

## Key Features Demonstrated

### **1. User Authentication & Security**
- Users must create an account and log in to access the application
- Each user can only edit or delete their own events (not others')
- Passwords are securely encrypted and never stored in plain text
- Session management keeps users logged in securely

### **2. Full Event Management (CRUD Operations)**
- **Create:** Add new events with all relevant details
- **Read:** View all events in an organized dashboard
- **Update:** Edit event details, dates, venues, etc.
- **Delete:** Remove events with confirmation to prevent accidents

### **3. Multi-Venue Support**
- Each event can have multiple locations (useful for tournaments spanning several courts/fields)
- Add, edit, or remove venues dynamically
- Each venue can have its own name and address

### **4. Search & Filter Functionality**
- Search events by name (case-insensitive)
- Filter by sport type (Basketball, Soccer, Tennis, etc.)
- Results update immediately based on your criteria

### **5. User-Friendly Interface**
- Clean, modern design that works on desktop and mobile
- Real-time feedback with success/error notifications
- Loading indicators show when operations are in progress
- Confirmation prompts prevent accidental deletions

### **6. Data Persistence**
- All data is stored in a secure database
- Events remain saved even after logging out
- Changes are immediately reflected across the application

---