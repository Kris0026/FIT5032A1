# Men's Health App (A1.2 - Version 1)

## Run locally
```bash
npm install
npm run dev
```
Open the URL printed by Vite (e.g., http://localhost:5173).

## How this meets Business Requirements
- **A.1 Development Stack**: Vue 3 + Vite.
- **A.2 Responsiveness**: Bootstrap 5 layout and components; works on mobile/tablet/desktop.
- **B.1 Validations**: Email format + age range + required select in `HealthForm.vue`.
- **B.2 Dynamic Data**: `HealthTopics.vue` fetches from `/public/data.json` (served at `/data.json`); form also persists to LocalStorage.

## Structure
- `src/components/HealthForm.vue` - form with validation and LocalStorage.
- `src/components/HealthTopics.vue` - loads topics dynamically.
- `src/components/Tools.vue` - tool cards.
- `src/components/NavBar.vue`, `FooterBar.vue`
- `public/data.json` - dynamic content source.

> Tip: Make frequent commits to Github while you work.
