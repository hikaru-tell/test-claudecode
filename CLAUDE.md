# マッチョ専用マッチングアプリ - プロジェクト設定
project_name: "マッチョマッチングアプリ"
description: "男性審査制マッチョ専用マッチングアプリ - Tinder風スワイプ機能付き"

# 技術スタック
tech_stack:
  frontend: "Next.js 15 (App Router)"
  backend: "Convex"
  database: "Convex Database"
  auth: "Convex Auth"
  storage: "Convex File Storage"
  payments: "Stripe"
  push_notifications: "Web Push API / FCM"
  realtime: "Convex Realtime"

# 主要機能
features:
  core:
    - "Tinder風スワイプ機能"
    - "検索・フィルター機能"
    - "リアルタイムメッセージング"
    - "プロフィール管理"
    - "審査システム（管理者用）"
  
  user_types:
    male: "審査制（本人確認 + 筋肉確認必須）"
    female: "通常登録"
    admin: "審査・管理機能"
  
  subscription:
    free: "基本機能（制限付きいいね）"
    premium: "無制限いいね + 追加機能"

# 権限レベル定義
permission_levels:
  1: "ログインのみ"
  2: "ログイン + 本人確認（免許証等）"
  3: "ログイン + 本人確認 + 筋肉確認（男性のみ、管理者目視審査）"
  4: "ログイン + 本人確認 + 筋肉確認 + 課金（プレミアム機能）"

# 審査システム
approval_system:
  identity_verification:
    method: "免許証・身分証明書アップロード"
    reviewer: "管理者による目視確認"
  
  muscle_verification:
    target: "男性ユーザーのみ"
    method: "プロフィール写真による目視審査"
    reviewer: "管理者による主観的判断"
    criteria: "マッチョレベルの主観的評価"

# データベーススキーマ設計方針
database_schema:
  users:
    - "基本プロフィール情報"
    - "体型・トレーニング情報"
    - "審査ステータス"
    - "サブスクリプション状態"
  
  matches:
    - "スワイプ履歴"
    - "マッチング情報"
    - "いいね制限管理"
  
  messages:
    - "リアルタイムメッセージ"
    - "既読状態"
    - "画像・ファイル送信"
  
  admin:
    - "審査待ちユーザー"
    - "審査履歴"
    - "管理ログ"

# 開発ルール
development_rules:
  general:
    - "TypeScriptを使用し、厳密な型安全性を保つ"
    - "context7を積極的に活用してConvex最新情報を参照"
    - "検索や相談にはgemini -p"相談内容"というコマンドを用いる"
    - "sequentialthinkingを用いて随時作業進捗やタスクを確認"
    - "セキュリティ最優先（審査制システムのため）"
    - "プライバシー保護を徹底"
    - "リアルタイム性能を重視"
    - "最適なMCPを用いて確実な開発を行う"
  
  architecture:
    - "コンポーネントは再利用可能な設計"
    - "レスポンシブデザイン必須（モバイルファースト）"
    - "Progressive Web App (PWA) 対応"
    - "アクセシビリティ準拠"
  
  security:
    - "画像アップロードの検証・圧縮"
    - "不適切コンテンツの自動検出"
    - "ユーザーデータの暗号化"
    - "審査プロセスの透明性確保"

# タスク管理システム
task_management:
  task_file_location: ".kiro/task.md"
  
  mandatory_workflow:
    - "作業開始前に必ず.kiro/task.mdを確認し、現在のタスク状況を把握する"
    - "各タスク完了後、task.mdのチェックボックスを更新する"
    - "サブタスクも含めて進捗を正確に反映させる"
    - "次のタスクに進む前に、task.mdで次に実行すべきタスクを確認する"
  
  task_status_management:
    in_progress: "- [ ] → - [進行中] に変更"
    completed: "- [ ] → - [x] に変更"
    blocked: "- [ ] → - [保留] 理由を併記"
    
  task_completion_process:
    1: ".kiro/task.mdの該当タスクを確認"
    2: "タスク実装を実行"
    3: "Geminiとの相互レビュー実施"
    4: "レビュー完了後、task.mdのチェックボックスを[x]に更新"
    5: "完了日時とレビュー結果をコメント追記"
    6: "次のタスクをtask.mdから特定して進行"
  
  progress_tracking:
    - "task.mdファイルを常に最新状態に保つ"
    - "完了したタスクには完了日時を記録"
    - "問題が発生した場合はタスクにコメントを追記"
    - "依存関係のあるタスクは順序を守って実行"
  
  task_update_format: |
    完了時の更新例:
    - [x] 1.1 Next.js 15プロジェクトの初期化とディレクトリ構造の設定 
      ✅ 完了日時: 2025-XX-XX XX:XX
      📝 レビュー結果: Geminiレビュー完了、品質基準満足
      🔧 実装内容: [具体的な実装内容]

# タスク完了ワークフロー
task_completion_workflow:
  mandatory_process:
    - "作業開始時: .kiro/task.mdを確認し、現在のタスクを特定"
    - "実装中: タスクステータスを[進行中]に更新"
    - "実装完了後: 必ずGeminiとの相互レビューを実施"
    - "レビュー完了後: task.mdを[x]に更新し、詳細情報を追記"
    - "次タスク開始前: task.mdで次のタスクを確認"
  
  review_steps:
    1: "タスク実装完了の報告"
    2: "Geminiに詳細レビューを依頼"
    3: "指摘事項の修正・改善実施"
    4: "修正内容の再レビュー"
    5: "完了確認後、task.mdを更新"
    6: "次タスクの確認と開始"
  
  review_criteria:
    code_quality:
      - "TypeScript型安全性の確認"
      - "エラーハンドリングの適切性"
      - "コードの可読性・保守性"
      - "パフォーマンス最適化"
    
    requirement_compliance:
      - "要件仕様との100%適合確認"
      - "機能動作の正確性検証"
      - "UIUXの要件満足度"
    
    security_privacy:
      - "セキュリティ脆弱性チェック"
      - "プライバシー保護の実装確認"
      - "データ暗号化の適切性"
    
    testing:
      - "ユニットテスト実装完了"
      - "テストカバレッジの確認"
      - "エッジケースのテスト網羅"
  
  completion_criteria:
    - "要件仕様100%満足"
    - "Geminiレビューの全指摘事項解決"
    - "テスト実装完了（カバレッジ80%以上）"
    - "Claude・Gemini両者の品質承認"
    - "セキュリティチェック完了"
  
  review_prompt_template: |
    ## タスク[X.X]完了レビュー依頼
    
    **実装内容:**
    - [実装した機能の詳細]
    
    **対応要件:**
    - Requirement [X]: [要件名]
    
    **実装ファイル:**
    - [変更・追加したファイル一覧]
    
    **確認ポイント:**
    1. 要件仕様との適合度
    2. TypeScript型安全性とエラーハンドリング
    3. セキュリティ・プライバシー考慮事項
    4. パフォーマンス最適化
    5. テスト実装状況とカバレッジ
    6. コードの可読性・保守性
    
    **gemini-cliを使用して上記ポイントの詳細レビューを実施してください。**
    不完全な部分があれば具体的な修正提案をお願いします。
    両者が納得するまで修正を繰り返し、完了確認後に次タスクに進みます。

# レビュー後の進行ルール
post_review_rules:
  - "レビュー指摘事項が0件になるまで修正を継続"
  - "Geminiが「完了」と判断するまで次タスクには進まない"
  - "修正完了後は必ず再レビューを実施"
  - "品質基準を満たさない場合は実装を最初からやり直す"
  - "完了確認後、.kiro/task.mdを更新してから次タスクの実装計画を立てる"
  - "次タスク開始前に必ず.kiro/task.mdで依存関係とタスク内容を確認"

# 作業開始時の必須確認事項
work_start_checklist:
  - "□ .kiro/task.mdファイルを開いて現在の進捗状況を確認"
  - "□ 実行すべき次のタスクを特定"
  - "□ タスクの要件と依存関係を理解"
  - "□ 必要なMCPツール（context7等）を準備"
  - "□ タスクステータスを[進行中]に更新"

# 作業完了時の必須更新事項
work_completion_checklist:
  - "□ Geminiレビューの実施と完了"
  - "□ .kiro/task.mdのチェックボックスを[x]に更新"
  - "□ 完了日時の記録"
  - "□ レビュー結果の記録"
  - "□ 実装内容の簡潔な記録"
  - "□ 次タスクの確認と準備"

# MCP使用方針
mcp_usage:
  context7:
    usage: "必須 - Convex関連実装で常時使用"
    command: "use context7"
  
  playwright:
    usage: "E2Eテスト・UI自動化"
    scenarios: "スワイプ操作、メッセージング、決済フロー"
  
  deepwiki:
    usage: "ライブラリ調査・実装参考"
    targets: "Next.js, Convex, Stripe統合"
  
  sequentialthinking:
    usage: "複雑なタスク品質向上"
    applications: "審査システム設計、マッチングアルゴリズム"
  
  gemini:
    usage: "必須 - 全タスク完了時の品質レビュー"
    applications: "コードレビュー、要件適合性チェック、品質保証"
    review_command: "geminiを使ってコードレビューを実施"
  
  sharp:
    usage: "画像処理・最適化"
    applications: "プロフィール画像リサイズ・圧縮"
  
  websocket:
    usage: "リアルタイム通信"
    applications: "メッセージング、通知"
  
  geolocation:
    usage: "位置情報処理"
    applications: "近くのユーザー検索、エリアフィルター"

# プロジェクト構造
project_structure:
  app/:
    - "(auth)/ - 認証関連ページ"
    - "(main)/ - メインアプリ"
    - "(admin)/ - 管理者画面"
    - "api/ - API routes"
  
  convex/:
    - "schema.ts - データベーススキーマ"
    - "users.ts - ユーザー管理"
    - "matches.ts - マッチング機能"
    - "messages.ts - メッセージング"
    - "admin.ts - 審査システム"
    - "payments.ts - Stripe連携"
  
  components/:
    - "ui/ - 基本UIコンポーネント"
    - "profile/ - プロフィール関連"
    - "matching/ - スワイプ・マッチング"
    - "messaging/ - チャット機能"
    - "admin/ - 管理者機能"
  
  lib/:
    - "auth.ts - 認証ユーティリティ"
    - "matching.ts - マッチングロジック"
    - "image.ts - 画像処理"
    - "notifications.ts - プッシュ通知"

# 開発フェーズ
development_phases:
  phase1: "基本認証・プロフィール機能"
  phase2: "審査システム・管理者画面"
  phase3: "スワイプ・マッチング機能"
  phase4: "メッセージング・リアルタイム"
  phase5: "決済・プレミアム機能"
  phase6: "プッシュ通知・PWA対応"

# 品質保証
quality_assurance:
  testing:
    - "Jest/React Testing Library (単体テスト)"
    - "Playwright (E2Eテスト)"
    - "Convex関数テスト"
  
  performance:
    - "Core Web Vitals最適化"
    - "画像遅延読み込み"
    - "リアルタイム通信最適化"
  
  security:
    - "OWASP準拠セキュリティチェック"
    - "個人情報保護対応"
    - "審査プロセス監査"

# 注意事項
important_notes:
  - "男性ユーザーは必ず筋肉確認審査を通過する必要がある"
  - "管理者の主観による審査のため、基準の一貫性に注意"
  - "プライバシー保護とマッチング効率のバランスを重視"
  - "リアルタイム機能によるサーバー負荷を監視"
  - "課金機能実装時は法的コンプライアンス確認必須"