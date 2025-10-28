# Kolping-Open-Air-Theater Ramsen – Website

Modern, content-driven website for the Kolping-Open-Air-Theater Ramsen, built with Next.js App Router and Tailwind CSS. It features a home poster/hero, About page with timeline and group photo, Team pages with actor and tech profiles, and a performant Gallery with per‑show masonry and a lightbox.

### Tech stack

- Next.js 15 (App Router, edge OG image route)
- TypeScript, React Server/Client Components
- Tailwind CSS with CSS variables for theme tokens
- Next Image optimization

### Key features

- Home hero with blurred backdrop, trailer CTA, and announcement box
- About “Chronik” timeline (newest first) and group photo
- Team
  - Ensemble, Tech & Crew, Former members
  - Placeholder avatars supported via `placeholderAvatar`
  - Person page merges roles (actor) and jobs (tech) when someone does both
- Gallery
  - Show list sourced from `src/data/timeline.json`
  - Per‑show masonry layout (CSS columns) using image metadata
  - Lightbox with caption, next/prev, close, download, and a loading spinner
- Booking System
  - Online seat reservation with visual seat selection
  - QR code tickets for event check-in
  - Calendar integration (iOS, Android, Desktop)
  - Print-optimized ticket view with dark theme support
  - Local storage-based booking management
- Theme toggle (dark/light) with `[data-theme]` tokens and light‑mode overrides

### Prerequisites

- Node.js LTS and pnpm

### Local development

```bash
pnpm i
pnpm dev
# open http://localhost:3000
```

### Project structure

- `src/app/`
  - `layout.tsx`: global shell, header with theme toggle
  - `page.tsx`: home hero/poster
  - `about/`: About page and timeline
  - `team/`: team listing, person pages, slideshow
  - `gallery/`: galleries per show with `ClientGrid` and `Lightbox`
- `src/data/`: JSON data (`timeline.json`, `team.json`, `images.json`, `pics.json`)
- `public/img/`: images, banners, avatars, gallery assets

### Theming

Semantic tokens (`--color-site-*`, `--color-kolping-*`) are defined in `src/app/globals.css`. Light theme overrides are applied via `[data-theme='light']`. The toggle persists preference in `localStorage` and sets the `data-theme` attribute on `<html>`.

### Data conventions

- `timeline.json`: includes `header`, `date`, optional `image`, and `galleryHash` used to map show galleries
- `team.json`:
  - `current`, `former`, `tech` arrays
  - `roles` arrays align to `plays` order (null means no participation)
  - `jobs` on tech members displayed on team and person pages

### Gallery

- Thumbnails: `public/img/gallery_thumbs/<hash>/Bild_n.jpg`
- Full size: `public/img/gallery_full/<hash>/Bild_n.jpg`
- Metadata: `src/data/images.json` per show with `{ width, height, alt, index }`

### Calendar Integration

The booking system includes calendar integration for easy event management:

**Features:**
- **Platform Detection**: Automatically detects iOS, Android, or Desktop
- **Calendar File Generation**: Creates ICS files compatible with all major calendar apps
- **Universal Support**: Works with Apple Calendar, Google Calendar, Outlook, and others
- **Event Details**: Includes date, time, location, seat assignments, and booking ID
- **Reminders**: Automatically adds 2-hour reminder before event
- **Offline Access**: Once added to calendar, works without internet

**User Experience:**
- iOS users: Download opens directly in Apple Calendar
- Android users: Download opens in Google Calendar or default calendar app  
- Desktop users: Downloads ICS file for any calendar application
- Events appear on lock screens and in notification centers
- No setup or configuration required

### Deployment

Build and start:

```bash
pnpm build
pnpm start
```

Or deploy to any Node host/edge platform supporting Next.js.

### Scripts

- `pnpm dev` – start dev server
- `pnpm build` – create production build
- `pnpm start` – run production server

### License

Content (images, text) © Kolping-Open-Air-Theater Ramsen. Code licensed under MIT unless noted otherwise.
