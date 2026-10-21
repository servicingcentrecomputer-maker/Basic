# Jordan Ellis — Portfolio

A dynamic, fully responsive portfolio for independent web designer and developer Jordan Ellis. The site keeps the original editorial visual language while adding client-side routing, subtle motion, and an Express API for live content and contact enquiries.

## Stack

- **Front end:** React 19, React Router 7, Vite 8
- **Server:** Express 5, Zod, Helmet, Compression, express-rate-limit
- **Fonts and images:** self-hosted in `public/`
- **Motion:** native CSS transitions, IntersectionObserver, and `requestAnimationFrame` (no animation library)

## Requirements

- Node.js 20.19 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

`npm run dev` starts both processes:

- Vite at <http://localhost:5173>
- Express API at <http://localhost:3001> (Vite proxies `/api` to it)

Open <http://localhost:5173> for the app.

## Production

```bash
npm run build
npm start
```

The Express server serves the built `dist/` directory and the API from a single process on port `3001` by default. It includes:

- Hashed asset caching, compression, and static font/image serving
- SPA fallback for client-side routes
- Content Security Policy with automatic hashing of inline JSON-LD
- `robots.txt` and `sitemap.xml` served from `public/`

## Project structure

```text
data/site.json            Editable content and bundled offline fallback
public/                   Fonts, art, favicon, robots.txt, sitemap.xml
server/                   Express app, content validation, contact handling
src/
  api/client.js           Contact form API client
  components/             Shared UI and motion primitives
  content/                Site content provider
  hooks/                  Page metadata, reduced motion, in-view helpers
  pages/                  Routed pages
  styles/                 Reset, design system, app enhancements
scripts/smoke-test.mjs    API and routing smoke test
```

## Editing content

Most public copy that changes regularly lives in `data/site.json`:

- Profile and contact details
- Availability and booking message
- Hero statistics
- Client names
- Portfolio projects
- Testimonial

The server validates the file with Zod on every cache refresh. Changes are picked up on the next request without restarting. If the API is unavailable, the front end falls back to the bundled copy imported from the same file, so the site still renders.

Replace project and portrait artwork in `public/assets/`. Keep the `alt` text in `data/site.json` accurate when changing images.

Content fields:

| Field | Notes |
| --- | --- |
| `profile` | Name, initials, email, phone, location, hours, short description |
| `availability` | `available` boolean, hero booking text, footer text |
| `stats` | Up to six items with `value`, optional `prefix`/`suffix`, and `label` |
| `clients` | Client names shown in the marquee |
| `projects` | Up to 60 projects; `layout` is `wide`, `narrow`, or `inset` |
| `testimonial` | Quote parts and attribution |

## API

### `GET /api/health`

Returns service status and uptime.

### `GET /api/content`

Returns validated content from the configured content file. Sent with `Cache-Control: no-cache` so edits appear quickly.

### `POST /api/contact`

Accepts JSON:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "projectType": "new-website",
  "budget": "2000-4000",
  "message": "A description of the project, at least twenty characters.",
  "consent": true,
  "website": "",
  "startedAt": 1730000000000
}
```

Successful requests return `201` with an `ok` flag, an enquiry ID, and a confirmation message. Validation failures return `422` with field-level messages. Cross-origin requests that are not allowed return `403`.

Enquiries are appended as JSON Lines to `data/submissions/submissions.jsonl` by default. The directory and file are gitignored because enquiries are private.

## Contact security

The contact endpoint uses several independent safeguards:

- Server-side Zod validation (required consent, message length, allowed project and budget values)
- Honeypot field that silently accepts bot submissions
- Minimum completion-time check
- Same-origin check with optional additional trusted origins
- Rate limits of 120 API requests per minute and 5 enquiries per 15 minutes per connection
- 16 KB JSON body limit
- Helmet security headers and a restrictive CSP
- No secrets or credentials are exposed to the client

Rate limiting uses the connection IP. Set `TRUST_PROXY=true` only when the app runs behind a trusted reverse proxy so client IPs are read correctly.

## Environment variables

Copy `.env.example` to `.env` and adjust as needed. The server loads `.env` at startup.

| Variable | Purpose |
| --- | --- |
| `PORT` | Express port (default `3001`) |
| `TRUST_PROXY` | Set `true` behind a trusted proxy |
| `ALLOWED_ORIGINS` | Extra comma-separated origins allowed to post enquiries |
| `SITE_CONTENT_PATH` | Override the content JSON path |
| `SUBMISSIONS_DIR` | Override where enquiry JSONL files are stored |
| `DISABLE_RATE_LIMIT` | Set `1` only for local load testing; never in production |

## Deployment notes

1. Run `npm ci` and `npm run build`.
2. Set `NODE_ENV=production`.
3. Start with `npm start` and keep the process alive with your platform's process manager.
4. Terminate TLS at the platform or a reverse proxy, then set `TRUST_PROXY=true` if that proxy forwards client IPs.
5. Point `SITE_CONTENT_PATH` and `SUBMISSIONS_DIR` at persistent storage if content and enquiries are edited on the server.
6. Set `ALLOWED_ORIGINS` if the site is served from a different origin than the API.
7. Update the domain in `public/robots.txt` and `public/sitemap.xml` if deploying somewhere other than `jordanellis.studio`.

## Motion and accessibility

- Scroll reveals and route transitions are implemented with native CSS and IntersectionObserver.
- Statistics count up once when they enter the viewport.
- The client marquee has a visible pause control and stops automatically for reduced-motion users.
- Hero parallax is pointer-driven and disabled for reduced motion and touch input.
- Typography is fluid with `clamp()`, layouts collapse cleanly to 320 px, and focus styles and skip navigation are provided.
- Lighthouse mobile targets: Performance 90+, Accessibility 100, Best Practices 100, SEO 100.

## Checks

```bash
npm run smoke
```

The smoke test starts an isolated server on a random local port with temporary enquiry storage, so repeated runs do not touch real submissions or hit the production contact rate limit. It verifies health, content, valid and invalid enquiries, the honeypot, cross-origin rejection, API 404 handling, and SPA fallback.

To test an already-running deployment instead, set `SMOKE_BASE_URL` before running the script.
