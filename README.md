# Where It Went

A simple expense tracker for everyday household spending. Inspired by a reel about turning a paper expense notebook into an app.

**Live:** https://kharcha-kohl.vercel.app

## What it does
- **Home**: month overview with total spent, top categories, a week-by-week bar chart, and quick category buttons.
- **Fill**: add expenses by category (name and price), pick the date, add more rows per category.
- **Stats**: "Where did it go?" category breakdown with percentages, daily or weekly spending trend, and a plain-language insight (highest category, highest expense, highest day).
- **History**: every entry grouped by day, with delete.

Data stays in your browser (localStorage). There is no backend or account. The first launch shows sample entries, and the menu button resets to them.

## Run locally
```
npm install
npm run dev
```

## Stack
React 19, Vite. Deployed on Vercel.
