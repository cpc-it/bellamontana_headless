# Bella Montana Headless Site

This repository contains the Bella Montana frontend built with Next.js and Faust.js against a headless WordPress backend. It powers the public site experience for Cal Poly Partners content, including the homepage, available homes, projects, posts, search, and WordPress-driven template routes.

## Stack

- Next.js 14
- React 18
- Faust.js / `@faustwp/core`
- Apollo Client
- WPGraphQL-backed WordPress content
- Sass modules

## Requirements

- Node.js 18+ recommended
- npm
- A WordPress instance with:
  - FaustWP configured
  - WPGraphQL available at `/graphql`
  - Content and templates expected by this frontend

The `package.json` engine field still allows older Node versions, but current Next.js support is better on modern LTS Node. Use Node 18 or 20 unless you have a project-specific reason not to.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file from the sample:

```bash
cp .env.local.sample .env.local
```

3. Update `.env.local` with your WordPress backend URL:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.example
```

4. If preview or authenticated Faust flows are needed, add the Faust secret from WordPress:

```env
FAUST_SECRET_KEY=your_faust_secret
```

5. Start the dev server:

```bash
npm run dev
```

The app will connect to `NEXT_PUBLIC_WORDPRESS_URL/graphql`.

## Available Scripts

- `npm run dev` starts the local Faust/Next.js dev server
- `npm run build` builds the production app
- `npm run start` runs the built app
- `npm run lint` runs the project linter
- `npm run generate` regenerates GraphQL possible types
- `npm run format` formats JS, JSX, Markdown, CSS, and SCSS files
- `npm run format:check` checks formatting without writing changes

## Site Structure

Key routes and templates include:

- `/` via WordPress front-page resolution
- `/available-homes` for Bella Montana home listings
- `/projects`
- `/posts`
- `/search`
- Dynamic WordPress routes through `pages/[...wordpressNode].js`

Primary implementation areas:

- `pages/` for route entry points
- `wp-templates/` for Faust WordPress templates
- `components/` for shared UI building blocks
- `app.config.js` for pagination, contact info, and theme-level settings
- `public/` for static site assets

## WordPress and Content Model Notes

This codebase still includes the Atlas/ACM blueprint export files used to seed or sync the associated WordPress content model:

- `acm-blueprint.zip`
- `atlas-blueprint-portfolio.zip`

Blueprint import/export workflow notes live in [DEVELOPMENT.md](/Users/bchenowe/Sites/bellamontana_headless/DEVELOPMENT.md).

If the WordPress schema changes, regenerate GraphQL possible types with:

```bash
npm run generate
```

## Repository

GitHub remote ownership for this repo is now under `cpc-it`:

- `git@github.com:cpc-it/bellamontana_headless.git`
