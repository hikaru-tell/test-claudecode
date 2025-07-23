# Convex + Next.js プロジェクト構成ガイド

## 🏗️ **推奨プロジェクト構成**

### ❌ **避けるべき構成（NextとConvexを分離）**
```
project-root/
├── Next/           # ❌ 分離は推奨されない
│   ├── package.json
│   └── src/
└── Convex/         # ❌ 分離は推奨されない
    ├── package.json
    └── convex/
```

### ✅ **推奨構成（統合型）**
```
project-root/
├── package.json           # 共通の依存関係
├── next.config.js         # Next.js設定
├── convex/               # Convexバックエンド
│   ├── _generated/       # 自動生成ファイル
│   ├── functions.ts      # サーバー関数
│   └── schema.ts         # データベーススキーマ
├── src/                  # Next.jsフロントエンド
│   ├── app/             # App Router
│   ├── components/      # React コンポーネント
│   └── convex/          # Convex型定義（自動生成）
└── public/              # 静的ファイル
```

## 📋 **理由とメリット**

### **1. Convex公式の推奨パターン**
- Convexは単一リポジトリでの開発を前提に設計されている
- 型安全性がフロント・バック間で自動的に保証される

### **2. 開発効率の向上**
- 一つの`package.json`で依存関係を管理
- 型定義の自動共有で開発速度アップ
- デプロイプロセスの簡素化

### **3. 型安全性**
- ConvexがNext.js用の型定義を自動生成
- API呼び出しが完全に型安全
- リアルタイムでスキーマ変更が反映

### **4. 開発体験**
- `npm run dev` で両方同時起動
- ホットリロードが両方で機能
- 一つのIDEで全体を管理可能

## 🚀 **セットアップ手順**

### 1. Next.jsプロジェクト作成
```bash
npx create-next-app@latest my-app
cd my-app
```

### 2. Convex追加
```bash
npm install convex
npx convex dev
```

### 3. 統合開発
- 単一リポジトリで作業
- `npm run dev` でNext.js開発サーバー起動
- `npx convex dev` でConvexバックエンド起動

## 💡 **プロジェクトのメリット**

この構成により、以下が実現できます：

- **フルスタック開発の効率化**
- **型安全なAPI通信**
- **リアルタイムデータ同期**
- **シンプルなデプロイメント**
- **統一された開発環境**

## 🔧 **開発フロー**

1. **スキーマ定義** (`convex/schema.ts`)
2. **関数実装** (`convex/functions.ts`)
3. **フロントエンド開発** (`src/app/`)
4. **型安全な統合** (自動生成型使用)

この構成により、フルスタック開発が最も効率的に行えます。 