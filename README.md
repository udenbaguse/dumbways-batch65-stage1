# Dumbways Batch 65 - Stage 1 (Personal Web)

A simple personal web app built with Express + Handlebars and PostgreSQL.  
Features include project CRUD, detail page, and tech icons using Devicon.

## Features
- Home, My Projects, Contact
- List projects from PostgreSQL
- Create, Update, Delete project
- Project detail by ID
- Tech icons rendered from `technologies.icon_html`

## Tech Stack
- Node.js, Express
- Handlebars (express-handlebars)
- PostgreSQL (pg)
- Bootstrap 5

## Requirements
- Node.js >= 20
- PostgreSQL + pgAdmin

## Setup
1. Install dependencies
```bash
npm install
```

2. Create `.env` in project root
```
DB_HOST=...
DB_PORT=...
DB_NAME=personal-web-65
DB_USER=...
DB_PASSWORD=...
DEFAULT_USER_ID=...
```

3. Run the app
```bash
npm run dev
```

App runs on `http://localhost:3000`.

## Database Notes
This app expects these tables:
- `users`
- `projects`
- `technologies`
- `project_technologies`

Important columns used by the app:
- `projects.image` (string)
- `technologies.icon_html` (string) for Devicon HTML

Example `technologies.icon_html` value:
```
<i class="devicon-react-original colored" style="font-size: 1.5rem;"></i>
```

## Routes
- `GET /` Home
- `GET /projects` My Projects
- `POST /projects` Create project
- `PUT /projects/:id` Update project
- `DELETE /projects/:id` Delete project
- `GET /project-detail/:id` Project detail

## Scripts
- `npm run dev` Start dev server with nodemon
- `npm run clean:uploads` Remove orphan upload files
- `npm run clean:uploads:dry` Preview orphan files without deleting

## Notes
finish daily task dumbways batch 65 stage 1 personal web app

## Separate Package (Upload Cleaner)
This repo now includes a reusable CLI package at:

- `packages/clean-orphan-uploads-cli`

You can move that folder to its own repository and publish it separately.

Local run examples:

```bash
node packages/clean-orphan-uploads-cli/bin/clean-orphan-uploads.js --dry-run
node packages/clean-orphan-uploads-cli/bin/clean-orphan-uploads.js --uploads-dir public/uploads
```
