# CommunityConnect

A working prototype of **CommunityConnect** — India's community-first platform for verified groups to connect, collaborate, and build meaningful real-world relationships.

## Launch Community

**Initial focus:** Jawahar Navodaya Vidyalaya (JNV) Alumni Network  
**Future expansion:** Colleges, corporates, apartment communities, NGOs, sports clubs, and interest-based groups

## Features (Prototype)

| Feature | Status |
|---------|--------|
| Community dashboard | ✅ Interactive |
| Event listing & detail | ✅ Interactive |
| RSVP tracking (Going / Maybe / Can't Go) | ✅ Interactive |
| Member directory with search & batch filter | ✅ Interactive |
| Announcements (pinned & categorized) | ✅ Interactive |
| Discussions (like, reply, create new) | ✅ Interactive |
| Community profile & expansion roadmap | ✅ Interactive |
| Job board, mentorship, marketplace | 🔜 Coming soon |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** for fast dev/build
- **Tailwind CSS 4** for styling
- **React Router 7** for navigation
- **Lucide React** for icons
- Mock data (no backend required for prototype)

## Quick Start

```bash
cd CommunityConnect
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI (Layout, cards, badges)
├── context/        # App state & interactions
├── data/           # Mock data for JNV Alumni
├── pages/          # Route pages
└── types/          # TypeScript interfaces
```

## Demo User

Logged in as **Rajesh Kumar** (Batch 2012, JNV Pune) — explore RSVP, discussions, and member directory as this user.

---

*CommunityConnect — Enabling authentic connections in verified communities.*
