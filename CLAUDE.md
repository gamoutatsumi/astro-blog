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

## MCP Workflow

フロントエンドの改善やコード修正を行う際の標準的な作業フローです。

### 1. 現状分析フェーズ

```
1. Astro MCP で設定・ルート情報を取得
   - mcp__astro__get-astro-config
   - mcp__astro__list-astro-routes
   - mcp__astro__get-astro-server-address

2. Playwright MCP でビジュアル確認
   - browser_navigate でページにアクセス
   - browser_take_screenshot でスクリーンショット取得
   - browser_resize でレスポンシブ確認
   - browser_snapshot でアクセシビリティツリー取得

3. Serena MCP でコード構造を分析
   - activate_project でプロジェクトをアクティベート
   - list_dir でディレクトリ構造確認
   - read_file / find_symbol でコード詳細確認
```

### 2. 計画立案フェーズ

```
1. 問題点を洗い出してリスト化

2. Codex MCP で実行計画を立案
   - prompt: 計画を .claude/PLAN.md に書き出すよう指示
   - sandbox: workspace-write
   - approval-policy: never

3. Context7 MCP でライブラリドキュメントを参照
   - resolve-library-id でライブラリID取得
   - get-library-docs でドキュメント取得
```

### 3. 実装フェーズ

```
1. TodoWrite でタスクを細分化して管理
   - 各タスクを独立してコミット可能な単位に分割
   - status: pending → in_progress → completed

2. Serena MCP でコード編集
   - replace_content: 正規表現またはリテラル置換
   - replace_symbol_body: シンボル単位の置換
```

### 4. 検証フェーズ（コミット前に必須）

```
1. Playwright MCP で修正結果を確認
   - browser_navigate でページにアクセス
   - browser_take_screenshot でスクリーンショット取得
   - browser_network_requests でエラーがないか確認
   - browser_snapshot でDOM構造を確認

2. 確認項目
   - 修正が意図通りに反映されているか
   - コンソールエラーが発生していないか
   - 既存機能が壊れていないか

3. 問題がある場合
   - 実装フェーズに戻って修正
   - 再度検証を行う

4. 確認が完了してからコミットフェーズへ進む
```

### 5. コミットフェーズ

```
1. 検証完了後にコミットを作成
2. タスクごとに独立したコミットを作成
3. コミットメッセージ形式:
   - fix: バグ修正
   - style: スタイル変更
   - feat: 新機能追加
   - a11y: アクセシビリティ改善
   - docs: ドキュメント更新
```

### MCP サーバー一覧

| MCP                | 用途                                         |
| ------------------ | -------------------------------------------- |
| **Astro MCP**      | Astro設定・ルート・開発サーバー情報          |
| **Playwright MCP** | ブラウザ操作・スクリーンショット・視覚的検証 |
| **Serena MCP**     | コード解析・シンボル操作・ファイル編集       |
| **Codex MCP**      | 実行計画立案・タスク委任                     |
| **Context7 MCP**   | ライブラリドキュメント参照                   |
| **Git MCP**        | Gitリポジトリ操作                            |

### Codex MCP 使用時の注意

```typescript
// 推奨オプション
{
  sandbox: "workspace-write",
  "approval-policy": "never",
  cwd: "/path/to/project"
}
```

- 計画は `.claude/PLAN.md` などに書き出す
- タスクは細分化して進捗を追いやすくする
- 追加コンテキストが必要な場合は `mcp__codex__codex-reply` で対話継続
