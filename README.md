# Nuzu

**Meet nearby, in real life.**

## How it started

One evening I was sitting in the library, watching the same thing I'd watched a hundred times before — rows of people buried in their books, headphones in, eyes on screens between chapters. 
Always studying, rarely playing. And it struck me that it probably wasn't by choice. Most of them likely wanted to step outside, play a sport, join a walk, sit around and talk about something that wasn't an exam.
But wanting to go isn't the same as having someone to go with. You need real friends for that — the kind who'll actually show up — and not everyone has a ready supply of them.

That gap is where Nuzu came from: a way to turn "I want to do something today" into an actual plan with actual people, nearby, in real life. Not another feed to scroll — a bridge back out the door. 
The goal was never just an app. It was to chip away at the quiet social anxiety that keeps people indoors, and to build a little more real-world social engagement into daily life, one activity at a time.

I started with Phase One — the basics. A simple loop: see what's happening nearby, join it, show up, be counted. From there it grew, piece by piece, into what Nuzu is today.

## What Nuzu does

Nuzu helps people discover and join real-world activities happening near them — sports, study groups, volunteering, trips, discussions — and verifies that they actually showed up, rather than just RSVP'd online.

## Key features

- **Nearby discovery** — activities within a configurable radius, using a Haversine-distance query against user and activity coordinates
- **QR-verified attendance** — the activity creator generates a short-lived signed QR token; participants scan it to check in, which triggers point awards automatically
- **Circles** — private activity feeds for a specific society, college, university, or workplace, with moderator-approved membership. Built for people who find open, stranger-filled meetups intimidating:
-  small-group activities, pre-join visibility of who else is attending, and repeated exposure to the same familiar group of people rather than one-off encounters with strangers
- **Safety & trust layer**
  - 18+ age gate enforced at registration
  - Gender-restricted and verified-only activity options
  - Categorized reporting (harassment, unsafe behavior, fake profile, inappropriate content, no-show)
  - Automatic restriction after repeated active reports against a user
  - Admin escalation ladder: warning → temporary suspension → permanent ban
  - Location privacy: exact coordinates are never exposed to other users, only approximate distance
- **Points & history** — verified check-ins award points automatically; a dedicated endpoint and Profile screen show a user's full points history
- **Admin dashboard** — review open reports, change their status, and apply restrictions, gated behind an `ADMIN` role check on both the API and the frontend route
- <img width="706" height="778" alt="image" src="https://github.com/user-attachments/assets/39acea1d-96c7-4fe8-a4a2-875b4a866b44" />




## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS v4 |
| Routing | React Router v6 |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL, hosted on Supabase |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod, on every API input |
| QR codes | `qrcode` (generation) + signed JWT tokens (verification) |
| Icons | lucide-react |

The backend follows a **modular monolith** structure: one folder per feature (`auth`, `users`, `circles`, `activities`, `participants`, `attendance`, `points`, `reports`, `admin`), each with the same four-file pattern:
