# Prioritization Grid

A web app for ranking a list of items by making pairwise choices. You enter your items, then choose between pairs; the app counts how often each item is chosen and shows a ranked list.

## What it does

- **Enter items** — Add items to the “Unprioritized” list (in any order). The number of slots is **configurable via the `items` URL parameter** (default 10, min 2, max 25). Example: `?items=16`.
- **Pairwise choices** — A grid of choice cells appears. In each cell you pick the higher-priority option (e.g. “1” or “2”). Only pairs for items you’ve entered are active.
- **Live ranking** — As you make choices, the app counts how many times each item was selected and updates the “Prioritized” list and the “Counts” panel so you see the current order and scores.

Use it for prioritizing tasks, features, options, or anything you can list and compare in pairs.

## Tech stack

- **React 18** with TypeScript
- **Vite** for dev and build
- **Sass** for styles
- **Vitest** + **Testing Library** for tests

## Getting started

### Prerequisites

- Node.js (with npm or yarn)

### Install and run

```bash
npm install
npm start
```

Open [http://localhost:5173](http://localhost:5173) (Vite’s default port). Use `?items=16` to show 16 item slots.

### Other scripts

| Command | Description |
|--------|-------------|
| `npm run build` | Type-check, build for production, and output to the `docs` folder (e.g. for GitHub Pages). |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run tests once. |
| `npm run test:watch` | Run tests in watch mode. |

## Project structure

- `src/App.tsx` — Root component; renders `PrioritizationGrid`.
- `src/components/PrioritizationGrid.tsx` — Main state and logic: items, choice grid data, rankings, and result list.
- `src/components/ItemGrid.tsx` — Wraps the item list and result list (unprioritized vs prioritized).
- `src/components/ChoiceGrid.tsx` — Grid of pairwise choice cells.
- `src/components/ChoiceBox.tsx` — Single “choose A or B” cell.
- `src/components/ResultGrid.tsx` — “Counts” display (how many times each item was chosen).
- `src/utils/utils.ts` — Helpers (e.g. `convertToItemNumbersInRankedOrder` for ranking from counts).

## License

See [LICENSE](LICENSE).
