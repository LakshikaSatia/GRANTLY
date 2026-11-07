# Grantly: Unified Scholarship Discovery & Management Platform

Grantly helps students **discover** scholarships they actually qualify for, **track** every application,
and **prepare** the right documents, all in one place. Built in React + Vite for THE OUTPOST hackathon.

## Problem it solves
Students lose out on scholarships because opportunities are scattered, eligibility rules are confusing and
deadlines are easy to miss. Grantly brings discovery, eligibility checking, application tracking and
document preparation into one dashboard.

## Features
- **Scholarship discovery:** search, filter by level and category, sort by match, amount or deadline
- **Eligibility matching:** a live Match Score (0-100) from your level, field, GPA and family income, with reasons
- **Save / bookmark** scholarships to your tracker
- **Application tracker:** Saved → Preparing → Submitted → Awarded board with progress bar
- **Document vault:** tick the documents you have; each scholarship shows its readiness %
- **Deadline radar:** the closest deadlines with urgency colours
- **Funding dashboard:** matches, tracked applications, funding in play, next deadline
- **Profile:** validated form that personalises every score
- **Dark / light theme** and persistent data via localStorage
- **Accessible and responsive:** skip link, semantic landmarks, labelled controls, keyboard-friendly dialog,
  ARIA progress bars, focus styles, reduced-motion support, mobile bottom navigation

## Tech stack
React 18+ · Vite · JavaScript · plain CSS (design tokens) · localStorage (no backend, no API keys)

## Project structure
```
src/
  App.jsx                 app state and page composition
  App.css / index.css     component styles / design tokens and base styles
  components/             Header, StatsBar, Filters, ScholarshipCard, ScholarshipModal,
                          Tracker, DocumentVault, ProfileForm, Radar, MatchRing, Toast, EmptyState
  hooks/useLocalStorage.js
  utils/helpers.js        match scoring, dates, currency, document readiness
  data/scholarships.js    sample scholarships and document list
```

## Run locally
```bash
npm install
npm run dev
```
Production build: `npm run build`

## Notes
All scholarship providers and data are fictional sample data created for this hackathon.