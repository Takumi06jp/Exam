# CLAUDE.md

このファイルは、リポジトリ内のコードを操作する際に Claude Code (claude.ai/code) へのガイダンスを提供します。

## コマンド

```bash
# 開発
npm run dev        # Turbopack を使用して localhost:3000 で開発サーバーを起動
npm run build      # 本番ビルド
npm run lint       # ESLint

# データベース
npx drizzle-kit generate   # スキーマ変更からマイグレーションを生成
npx drizzle-kit push       # スキーマをデータベースに反映
```

## 環境変数

`.env.local` を作成して以下を設定:

```
DATABASE_URL=
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_SUCCESS_URL=
OPENAI_API_KEY=
CLOUDFLARE_ACCOUNT_ID=
R2_UPLOAD_IMAGE_ACCESS_KEY_ID=
R2_UPLOAD_IMAGE_SECRET_ACCESS_KEY=
R2_UPLOAD_IMAGE_BUCKET_NAME=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STARTER_TIER=
NEXT_PUBLIC_STARTER_SLUG=
```

注意: `drizzle.config.ts` は `.env.local` ではなく `.env` を読み込むため、マイグレーション実行時は DB の変数を `.env` にも記載すること。

## アーキテクチャ

App Router を使用した Next.js 15 の SaaS スターターキット。

### 認証 (`lib/auth.ts`, `lib/auth-client.ts`)

- サーバーサイド: `lib/auth.ts` の `auth` — API ルートやサーバーコンポーネントで `auth.api.getSession({ headers: await headers() })` として使用
- クライアントサイド: `lib/auth-client.ts` の `authClient` — クライアントコンポーネントで使用
- **Better Auth** がセッション・Google OAuth を管理し、サブスクリプション対応の認証のために Polar と直接連携
- ミドルウェア (`middleware.ts`) がセッションクッキーを検証して `/dashboard/*` ルートを保護

### データベース (`db/`)

- **Neon PostgreSQL** + **Drizzle ORM**
- スキーマは `db/schema.ts`: `user`、`session`、`account`、`verification`（Better Auth テーブル）+ `subscription`（Polar webhook データ）
- `subscription` テーブルは `lib/auth.ts` の upsert ロジックを通じて Polar webhook で追加・更新される

### サブスクリプション (`lib/subscription.ts`)

サブスクリプション状態を確認するサーバー専用ヘルパー:
- `getSubscriptionDetails()` — サブスクリプションの全情報
- `isUserSubscribed()` — アクティブかどうかの真偽値チェック
- `hasAccessToProduct(productId)` — 特定プランへのアクセス確認
- `getUserSubscriptionStatus()` — `"active" | "canceled" | "expired" | "none"`

Polar は **サンドボックスモード** で設定されている (`lib/auth.ts`)。本番環境では `server: "sandbox"` を `server: "production"` に変更すること。

### AI チャット (`app/api/chat/route.ts`)

Vercel AI SDK (`ai` パッケージ) と `@ai-sdk/openai` を使用。Web 検索ツールを有効にした `gpt-4o` からレスポンスをストリーミング。

### ファイルアップロード (`lib/upload-image.ts`, `app/api/upload-image/route.ts`)

AWS S3 互換 SDK (`@aws-sdk/client-s3`) 経由で Cloudflare R2 を使用。

### UI

- `components/ui/` 内の **shadcn/ui** コンポーネント（手動編集禁止 — `npx shadcn@latest add <component>` を使用）
- Tailwind CSS v4
- `next-themes` によるダーク/ライトテーマ
- `components/provider.tsx` がテーマと分析プロバイダーでアプリ全体をラップ

### ダッシュボード構成

`app/dashboard/` はミドルウェアで保護されている。サイドバー (`app/dashboard/_components/sidebar.tsx`) にナビゲーション項目が列挙されており、新しいダッシュボードページを追加する際はここに追記する。

# 目標
web上で、試験対策を行うための練習問題を提供する
