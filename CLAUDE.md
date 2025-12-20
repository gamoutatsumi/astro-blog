# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog site for @gamoutatsumi built with Astro, deployed to Cloudflare Pages.
Site URL: https://blog.gamou.dev

## Development Environment

This project uses **Nix Flakes** for reproducible development. Dependencies are managed via Nix, not npm directly.

```bash
# Enter development shell (or use direnv)
nix develop

# Start dev server
task dev
# or: astro dev

# Build for production
task build
# or: astro build

# Preview production build locally
wrangler pages dev ./dist
```

## Linting & Type Checking

```bash
# Type check Astro components
astro check

# Type check TypeScript
tsc --noEmit

# Lint and format check with Biome
biome check

# Lint Japanese markdown with textlint
textlint "**/*.md"

# Format all files
treefmt
```

Pre-commit hooks automatically run: textlint, astro check, tsc, biome, treefmt.

## Code Style

- **Biome** for JS/TS/Astro formatting: double quotes, semicolons always, trailing commas, 2-space indent
- **textlint** for Japanese writing: `preset-ja-technical-writing`, space between half/full-width chars
- **nixfmt-rfc-style** for Nix files
- Use `keep-sorted` comments for sorted lists in flake.nix

## Architecture

### Content System
- Blog posts: Markdown files in `content/posts/{category}/{slug}.md`
- Content collection defined in `src/content.config.ts` with Zod schema
- Post schema: `title`, `tags[]`, `image?`, `publishDate`, `isDraft`
- Posts with `isDraft: true` or in `nsfw/` category are filtered from public listings

### Routing Structure
- `src/pages/[...page].astro` - Paginated home listing
- `src/pages/[category]/[slug].astro` - Individual post pages
- `src/pages/[category]/[...page].astro` - Category listings
- `src/pages/ogp/[category]/[slug].jpg.ts` - Dynamic OGP image generation
- `src/pages/rss.xml.ts` - RSS feed

### OGP Image Generation
Uses `@napi-rs/canvas` to generate OGP images at build time. Requires Noto Sans JP font in `fonts/` directory.

### Path Aliases
```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@utils/*      → src/utils/*
@images/*     → src/images/*
@lib/*        → src/lib/*
```

### Key Integrations
- **UnoCSS** - Atomic CSS (config: `uno.config.ts`)
- **astro-seo** - SEO meta tags
- **@astrojs/sitemap** - Sitemap generation (excludes `/nsfw/` pages)
- **@astrojs/partytown** - Third-party script optimization (Cloudflare Analytics)
- **astro-mcp** - MCP server integration for editor tooling
