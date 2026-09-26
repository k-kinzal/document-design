// A complete long-form paper, generated the way a consumer would generate it:
// data in, a `.sheet` out, no stylesheet of its own. It is the fixture the PDF
// test paginates and the example the start guide links to.
//
// The content is real. It is the public record of k-kinzal's engineering work
// from 2014 to 2026, as published at
// https://k-kinzal-engineering-2014-2026.kinzal.chatgpt.site/ — the paper whose
// production produced the feedback this example answers. The Japanese text is
// the original; the English is a translation of it. Dates, counts and the
// sources are as published there and are not to be "improved".
import { escape, stylesheet } from './site.mjs';

// Title, URL and date are the same in both languages; the kind and the note
// are translated. Titles keep the language they were published in.
const SOURCES = [
  ['GruntJSで伺かを操作するgrunt-sstpを作った', 'https://qiita.com/kinzal/items/ecc0284e3e9a8d00f6b9', '2014.05.06'],
  ['Scala-SBTで伺かを実行する', 'https://qiita.com/kinzal/items/f91239cd39338e980291', '2014.06.01'],
  ['Dgeniで簡単に始めるngdocドキュメント生成', 'https://qiita.com/kinzal/items/4580abe9e116dfecc85c', '2014.09.22'],
  ['dgeni-markdown', 'https://github.com/k-kinzal/dgeni-markdown', '2014.09'],
  ['grunt-dgeni', 'https://github.com/k-kinzal/grunt-dgeni', '2014.09'],
  ['PHP Conference Japan 2014 / 公式プログラム', 'https://phpcon.php.gr.jp/w/2014/', '2014.10.11'],
  ['PHP＋伺かで始める新しい通知の形', 'https://www.slideshare.net/slideshow/php-40139017/40139017', '2014.10.11'],
  ['AWS Lambdaの開発サイクルを作ろう！', 'https://qiita.com/kinzal/items/7bc9072510756edb20e7', '2015.01.03'],
  ['Dgeni with AngularJS Application', 'https://www.slideshare.net/slideshow/dgeni-with-angularjs-application/46111398', '2015.03.21'],
  ['Scala.jsはじめました！', 'https://www.slideshare.net/slideshow/scalajs-51163091/51163091', '2015.08.01'],
  ['Scala.js / Presentations', 'https://www.scala-js.org/community/presentations.html', '2015'],
  ['AWS Lambdaのデプロイフロー管理', 'https://qiita.com/kinzal/items/046a848a9f0829f87670', '2015.12.09'],
  ['Node.jsから扱うScala.js開発環境［内容名］', 'https://qiita.com/kinzal/items/9876b14e8810c3badf11', '2016.01.31'],
  ['SAM＋Node＋FlowtypeでのLambda開発［内容名］', 'https://qiita.com/kinzal/items/7a09659399d9be40d674', '2016.12.08'],
  ['Step Functionsで並列分散処理を実現する', 'https://qiita.com/kinzal/items/843c4659a887a9af7499', '2016.12.11'],
  ['Serverless Meetup Tokyo #4', 'https://techplay.jp/event/627738', '2017.08.09'],
  ['FlowtypeとOpaque Type Aliases', 'https://qiita.com/kinzal/items/735d3c4c58deca41a4b6', '2017.11.19'],
  ['サーバーレスの活用事例［内容名］', 'https://speakerdeck.com/cwozaki/serverless-at-chatwork', '2018.05.30'],
  ['aliases', 'https://github.com/k-kinzal/aliases', '2018.10'],
  ['既存システムのKubernetes化［内容名］', 'https://speakerdeck.com/cwozaki/chatworkniokeruresientosisutemufalsekuberneteshua-falsequ-rizu-mi-number-containerdaysjp-number-meetup', '2018.12.03'],
  ['Helmのimportプラグインを作った［抄題］', 'https://qiita.com/kinzal/items/2f3bed69f27e520adb36', '2019.01.06'],
  ['pr', 'https://github.com/k-kinzal/pr', '2019.10'],
  ['EC2からKubernetesへ移行する取り組み［内容名］', 'https://speakerdeck.com/cwozaki/aws-devday-2020-c-8-resientosisutemuwoec2karakubernetesnizhi-kihuan-eruzhan-i-number-awsdevday', '2020.10.20'],
  ['PHPシステムのKubernetes移行・第1回［内容名］', 'https://creators-note.chatwork.com/entry/2020/11/04/141050', '2020.11.04'],
  ['Kubernetes基盤の移行事例［内容名］', 'https://d1.awsstatic.com/case-studies/jp/pdf/chatwork.pdf', '2020'],
  ['PHP on Kubernetes', 'https://creators-note.chatwork.com/entry/2020/12/12/140539', '2020.12.12'],
  ['僕たちはアラートを管理できない', 'https://zenn.dev/kinzal/articles/998707314a8f6e', '2021.01.24'],
  ['Helm Chartリポジトリの2年半の運用', 'https://speakerdeck.com/cwozaki/helm-chartrihositoriwo2nian-ban-yun-yong-sitewakatutairoironahua-cloudnative-days-spring-2021-online-number-cndo2021', '2021.03.12'],
  ['Typesafe State in Rust (preview)', 'https://zenn.dev/kinzal/books/aa109c0c428089', '2022.03.08'],
  ['開発チームにオーナーシップを委譲する手法', 'https://speakerdeck.com/cwozaki/kai-fa-timunionasitupuwowei-rang-surushou-fa-devopsdays-tokyo-2022-number-devopsdaystokyo', '2022.04.22'],
  ['async-graphql / PR #1018', 'https://github.com/async-graphql/async-graphql/pull/1018', '2022.08.18'],
  ['async-graphql / PR #1049', 'https://github.com/async-graphql/async-graphql/pull/1049', '2022.09.06'],
  ['ちょっとした工夫で見やすい構成図を書こう！', 'https://zenn.dev/kinzal/articles/b9a8d9398f2e1b', '2022.11.12'],
  ['GraphQLの安全なスキーマ変更［内容名］', 'https://zenn.dev/kinzal/articles/afdf142d31d729', '2022.12.26'],
  ['ChatGPTとLlamaIndexを使った仕様問い合わせAI［抄題］', 'https://zenn.dev/kinzal/articles/39f17a62bb6b20', '2023.02.24'],
  ['ChatGPTを使ったSecurity Hubのトリアージ［内容名］', 'https://zenn.dev/kinzal/articles/98db7c5752871e', '2023.03.19'],
  ['ChatGPTをシステムに組み込むためのプロンプト技法', 'https://www.slideshare.net/slideshow/chatgpt-chatgptjp/257470820', '2023.04.19'],
  ['サーバーレスを採用すべき100の理由', 'https://speakerdeck.com/cwozaki/sabaresuwocai-yong-subeki100noli-you-1tusikahua-sanaiyo', '2023.08.30'],
  ['solana-materials-in-japanese', 'https://github.com/k-kinzal/solana-materials-in-japanese', '2023.09'],
  ['SolanaのプログラムでCRUDしてみよう', 'https://zenn.dev/kinzal/articles/5302a4dae1c8d7', '2023.10.07'],
  ['Rust入門 in Solana', 'https://www.slideshare.net/slideshow/rust-in-solanapdf-soldevhub/263877075', '2023.11.25'],
  ['Solana Developer Hub / 公開イベント資料集', 'https://note.com/solana_dev_hub/n/ne19497567c33', ''],
  ['Solana Developer Hub Workshop #4', 'https://github.com/k-kinzal/solana-developer-hub-workshop-20240326', '2024.03.26'],
  ['Compute Units / Budget最適化', 'https://www.slideshare.net/slideshow/compute-units-budget-solana-developer-hub-online-6-soldevhub/269419208', '2024.05.30'],
  ['シグネチャで始めるRustプログラミング', 'https://centrum.substack.com/p/solana-superteam-japan-rust-614', '2024.06.14'],
  ['testcontainers-php', 'https://github.com/k-kinzal/testcontainers-php', '2024.11〜'],
  ['開発の自律性と信頼性への取り組み［内容名］', 'https://zenn.dev/kinzal/articles/9b7e633b4d36ba', '2024.11.14'],
  ['レガシーPHPをサポートしたTestcontainers作りました', 'https://zenn.dev/kinzal/articles/05ed228550e513', '2025.03.22'],
  ['Solanaプログラムのテスト手法', 'https://www.slideshare.net/slideshow/solana-solana-developer-hub-online-16-soldevhub/278451432', '2025.04.26'],
  ['AI Agentでタスク駆動開発をしている話', 'https://zenn.dev/kinzal/articles/ea40cfe897ce47', '2025.06.01'],
  ['Claude Codeを使ったlinterとリファクタリング［内容名］', 'https://zenn.dev/kinzal/articles/4bea9e68156889', '2025.09.03'],
  ['Solana Mobile StackではじめるSeekerアプリ開発', 'https://www.slideshare.net/slideshow/solana-mobile-stack-seeker-solana-developer-hub-21-soldevhub/283478702', '2025.09.28'],
  ['AIを使ってBower/GruntJS時代の個人サイトをモダナイズした', 'https://zenn.dev/kinzal/articles/3295f5d16b9ceb', '2025.12.06'],
  ['testcontainers-php / コンテナ再利用', 'https://github.com/k-kinzal/testcontainers-php/commit/81a03391d680ea8136d1990f6adedc94bbf3584e', '2025.12.20'],
  ['2026年開発、AI系の環境', 'https://sizu.me/kinzal/posts/ist2ewn2unva', '2026.01.02'],
  ['ztd-query-php', 'https://github.com/k-kinzal/ztd-query-php', '2026.01〜'],
  ['storybook-php', 'https://github.com/k-kinzal/storybook-php', '2026.03〜'],
  ['php-ai-toolkit', 'https://github.com/k-kinzal/php-ai-toolkit', '2026.03〜'],
  ['AIエージェントに不確実性を探索させるためにやること', 'https://zenn.dev/kinzal/articles/6e789454354cfc', '2026.05.09'],
  ['みんなAI Agentで開発どうしてる？僕はこうしてる！！', 'https://zenn.dev/kinzal/articles/80d230f075f4b1', '2026.05.23'],
  ['AIのためのタスク管理アプリケーションを作ったら気持ちよかった', 'https://zenn.dev/kinzal/articles/2ca5dcfc55f057', '2026.08.22'],
  ['document-design / doc-ui', 'https://github.com/k-kinzal/document-design', '2026'],
];

const SOURCE_NOTES = {
  ja: [
    ['Qiita', 'ビルド結果を通知するGruntプラグインの制作'], ['Qiita', 'SBTから伺かを操作する手順'], ['Qiita', '導入・設定から文書生成までを解説'], ['GitHub', '文書をMarkdownとして出力するテンプレート'], ['GitHub', '文書生成をGruntタスクへ組み込むプラグイン'],
    ['イベント記録', 'LT「PHP＋伺かで始める新しい通知の形」'], ['登壇資料', 'PHP・SSTP・APIを組み合わせた通知の実装'], ['Qiita', 'ローカルのテストとクラウドでの実行をつなぐ'], ['登壇資料', 'ng-japan 2015。文書生成の導入方法を比較'], ['登壇資料', 'Scala関西Summit 2015。npmとSBTの開発環境'],
    ['公式サイト', '7月公開のScala.js発表を紹介。2015年の資料'], ['Qiita', '設定・成果物・デプロイの分離を説明'], ['Qiita', 'SBTに依存しない構成を検証した記事'], ['Qiita', '開発からデプロイまでの流れを整理'], ['Qiita', '動的な状態定義、並列化、例外処理を検討'],
    ['イベント記録', '「flowtypeStepFunction」の登壇枠'], ['Qiita', '同じ基本型でも用途の異なる値を区別する設計'], ['登壇資料', 'AWS Summit 2018。既存システムへの部分導入'], ['GitHub', 'コンテナでコマンドと依存環境を扱うGo製ツール'], ['登壇資料', 'Japan Container Days v18.12 Meetup。資料公開日を掲載'],
    ['Qiita', 'GitHubなどのChartをローカルへ取り込む'], ['GitHub', '条件に合うPull Requestを操作するGo製CLI'], ['登壇資料', 'AWS DevDay 2020 C-8。日付は資料公開日'], ['技術記事', '本人による移行解説連載の第1回'], ['公開事例PDF', '移行に参画したチームの定量的な成果'],
    ['登壇報告', 'PHP Conference 2020の概要・質疑応答'], ['Zenn', '検知・対応・根本解決の責務と指標を整理'], ['登壇資料', 'CloudNative Days Spring 2021'], ['Zenn Books', '状態と遷移を型で表す、全8章の公開書籍'], ['登壇資料', 'DevOpsDays Tokyo 2022。IaC・GitOps・制約'],
    ['GitHub PR', 'resolverのリクエストデータ消失を修正'], ['GitHub PR', 'CursorTypeのプリミティブ型対応'], ['Zenn', '整列・余白・線・グルーピングの考え方'], ['Zenn', '互換性を変換層で扱う提案とRustでの試作'], ['Zenn', '仕様文書の構造化と回答の精度を検証'],
    ['Zenn', '判断・構造化出力・人への確認を検討'], ['登壇資料', 'ChatGPT Meetup Osaka #1。検証とガード処理'], ['登壇資料', '拡張速度と耐障害性。日付は資料公開日'], ['GitHub', '複数の著者による日本語の開発資料を整理'], ['Zenn', 'アカウント・所有者・状態の更新をコードで学ぶ'],
    ['登壇資料', 'Solana Developer Hub #0。カウンターの実装を題材に'], ['主催者の記録', 'Rust・AI・Solana Payなどの発表を収録。随時更新'], ['GitHub教材', '環境構築・ウォレット接続・NFT発行・公開'], ['登壇資料', 'Solana Developer Hub #6。計測・実装・手数料を検討'], ['主催者の案内', 'Rust学習とSolana活用に関する発表'],
    ['GitHub', 'PHP 5.6〜8.5対応は確認時点のREADMEによる'], ['Zenn', '自動化による権限委譲と、指標を使う支援の振り返り'], ['Zenn', '既存PHPの更新を支える結合テスト環境の制作'], ['登壇資料', 'Solana Developer Hub #16。日付は資料公開日'], ['Zenn', '目的・計画・記録をファイルに残す開発フロー'],
    ['Zenn', '自然言語ルールでコードを検査するcconvの試作'], ['登壇資料', 'Solana Developer Hub #21。日付は資料公開日'], ['Zenn', '画面比較・部品化・検証を伴う移行の実践'], ['GitHub commit', 'コンテナ再利用モードの追加'], ['しずかなインターネット', 'AI開発環境と使い分けの記録'],
    ['GitHub', 'Zero Table DependencyのPHP実装とSQL検証基盤'], ['GitHub', 'PHPコンポーネントをStorybookで確認するアドオン'], ['GitHub', '静的解析、テスト出力、文書化を支えるツール群'], ['Zenn', '反復・コンテキスト・外部介入を比較した実践記録'], ['Zenn', '概念整理、テスト、監査、実利用を組み合わせる'],
    ['Zenn', '自分用アプリの開発記録。アプリ自体は非公開'], ['GitHub', '本ペーパーはdocument-designの配布CSSを使用'],
  ],
  en: [
    ['Qiita', 'A Grunt plugin that reports build results to a desktop mascot'], ['Qiita', 'Driving Ukagaka from Scala SBT'], ['Qiita', 'From installation and setup to generated documentation'], ['GitHub', 'A template that emits documentation as Markdown'], ['GitHub', 'A plugin that adds documentation generation to a Grunt build'],
    ['Event record', 'Lightning talk “A new form of notification with PHP and Ukagaka”'], ['Slides', 'Notifications built from PHP, SSTP and APIs'], ['Qiita', 'Connecting local tests with execution in the cloud'], ['Slides', 'ng-japan 2015. Comparing ways to adopt documentation generation'], ['Slides', 'Scala Kansai Summit 2015. A development environment on npm and SBT'],
    ['Official site', 'Lists the Scala.js talk published in July. 2015 material'], ['Qiita', 'Separating configuration, artifacts and deployment'], ['Qiita', 'Verifying a setup that does not depend on SBT'], ['Qiita', 'The flow from development to deployment'], ['Qiita', 'Dynamic state definitions, parallelism and error handling'],
    ['Event record', 'The talk slot for “flowtypeStepFunction”'], ['Qiita', 'Keeping values of the same base type but different purposes apart'], ['Slides', 'AWS Summit 2018. Partial adoption in an existing system'], ['GitHub', 'A Go tool that runs commands and their dependencies in containers'], ['Slides', 'Japan Container Days v18.12 Meetup. Dated by publication of the slides'],
    ['Qiita', 'Importing charts from GitHub and elsewhere into a local repository'], ['GitHub', 'A Go CLI that operates on the pull requests matching a condition'], ['Slides', 'AWS DevDay 2020 C-8. Dated by publication of the slides'], ['Article', 'First part of the author’s series on the migration'], ['Published case study (PDF)', 'Quantified results of the team the author joined'],
    ['Talk report', 'Summary and Q&A from PHP Conference 2020'], ['Zenn', 'Responsibilities and metrics for detection, response and root cause'], ['Slides', 'CloudNative Days Spring 2021'], ['Zenn Books', 'An eight-chapter public book on states and transitions as types'], ['Slides', 'DevOpsDays Tokyo 2022. IaC, GitOps and constraints'],
    ['GitHub PR', 'Fixes request data lost in resolvers'], ['GitHub PR', 'Primitive type support for CursorType'], ['Zenn', 'Alignment, spacing, lines and grouping in diagrams'], ['Zenn', 'A proposal to handle compatibility in a translation layer, prototyped in Rust'], ['Zenn', 'Structuring a specification and measuring answer accuracy'],
    ['Zenn', 'Judgement, structured output and confirmation by a person'], ['Slides', 'ChatGPT Meetup Osaka #1. Verification and guard processing'], ['Slides', 'Speed of extension and fault tolerance. Dated by publication of the slides'], ['GitHub', 'Japanese development material by several authors, organised'], ['Zenn', 'Learning accounts, owners and state updates through code'],
    ['Slides', 'Solana Developer Hub #0. An introduction to Rust through a counter'], ['Organiser’s record', 'Talks on Rust, AI and Solana Pay, among others. Updated over time'], ['GitHub course', 'Setup, wallet connection, minting an NFT and publishing'], ['Slides', 'Solana Developer Hub #6. Measurement, implementation and fees'], ['Organiser’s announcement', 'A talk on learning Rust and applying it to Solana'],
    ['GitHub', 'PHP 5.6–8.5 support as stated in the README at the time of checking'], ['Zenn', 'A retrospective on delegation through automation and support guided by metrics'], ['Zenn', 'An integration-test environment that supports updating legacy PHP'], ['Slides', 'Solana Developer Hub #16. Dated by publication of the slides'], ['Zenn', 'A development flow that keeps goals, plans and records in files'],
    ['Zenn', 'A prototype, cconv, that checks code against natural-language rules'], ['Slides', 'Solana Developer Hub #21. Dated by publication of the slides'], ['Zenn', 'A migration with screen comparison, componentisation and verification'], ['GitHub commit', 'Adds a container reuse mode'], ['Shizuka na Internet', 'Notes on an AI development environment and how each tool is used'],
    ['GitHub', 'A PHP implementation of Zero Table Dependency and an SQL verification base'], ['GitHub', 'An addon for checking PHP components in Storybook'], ['GitHub', 'Tools for static analysis, test output and documentation'], ['Zenn', 'A practical comparison of iteration, context and outside intervention'], ['Zenn', 'Combining concept work, tests, audits and real use'],
    ['Zenn', 'Building a personal app; the app itself is not published'], ['GitHub', 'This paper uses the stylesheet distributed by document-design'],
  ],
};

// A period of the chronology: the rail carries its name and keywords, the
// field its claim, its context and its entries. Entries cite by number.
const PERIODS = {
  ja: [
    { years: '2014', name: '最初の公開活動', keywords: 'PHP · Node.js · Grunt · Scala · Documentation',
      lead: '身近な不便を、作って、書いて、話す。', note: '初登壇の前から、作った道具と使い方をQiitaで公開。通知の実装とドキュメント生成に、初期の関心が表れている。',
      focus: ['着眼点', '実装と説明を、一緒に公開する。何を作ったかだけでなく、どう動かすかまで伝える。後年のテスト支援や学習教材にもつながる活動の形が、2014年から見られる。'],
      entries: [
        { time: '2014.05–06', title: 'ビルド結果を「伺か」に伝える', text: 'Gruntの成功・警告・失敗などをデスクトップマスコットへ通知するgrunt-sstpを制作。5月6日にQiitaで公開し、6月1日にはScalaのSBTから操作する方法も解説した。', cites: [1, 2] },
        { time: '2014.09', title: '文書を、コードから生成できるように', text: 'Dgeniによるngdoc生成をQiitaで解説。grunt-dgeniで日常のビルドに文書生成を組み込み、dgeni-markdownでMarkdown出力の道具も用意した。手順の紹介と、その手順を簡単にする実装が並んでいる。', cites: [3, 4, 5] },
        { time: '2014.10.11 · 初登壇', tone: 'tone-accent', title: 'PHP＋伺かで始める新しい通知の形', text: 'PHP Conference Japan 2014のLT。PHPとSSTP、APIを組み合わせ、さまざまなイベントを「伺か」へ届ける仕組みを紹介。春から公開していた通知ツールの試みが、技術カンファレンスでの発表へつながった。', cites: [6, 7] },
      ] },
    { years: '2015–2016', name: '開発の流れ', keywords: 'Lambda · Scala.js · npm · Flowtype · State Machines',
      lead: '新しい技術を、普段の開発へつなぐ。', note: 'LambdaやScala.jsを試すだけでなく、テスト・ビルド・デプロイの流れへ組み込む方法を、記事と登壇で共有した。',
      entries: [
        { time: '2015.01', title: 'Lambdaの開発サイクルを組み立てる', text: '1月の記事ではlambda-templateを使い、ローカルのテストからクラウドでの実行・ログ確認までを説明。関数のコードだけでなく、繰り返し開発して確かめる流れを整え、CI/CDへつなぐ方法を共有した。', cites: [8] },
        { time: '2015.03 · 08', title: '文書生成とScala.jsを登壇で伝える', text: '3月21日のng-japan 2015ではDgeniの始め方を比較。8月1日のScala関西Summit 2015では、npmとSBTをどう組み合わせるかを紹介した。7月公開の別のScala.js発表は、Scala.js公式サイトの資料一覧にも掲載されている。', cites: [9, 10, 11] },
        { time: '2015.12 – 2016.01', title: '配布とビルドの流れを見直す', text: '12月にはLambdaの設定・成果物・デプロイを分離する方法を説明。翌1月には、SBTを使わずNode.jsからScala.jsを扱う環境を検証した。技術を、普段の開発の道具立てへ合わせていく。', cites: [12, 13] },
        { time: '2016.12', title: 'サーバーレスを型と状態で考える', text: 'SAM・Node・Flowtypeを組み合わせたLambda開発を解説。Step Functionsの記事では、状態定義を動的に作る並列分散処理や、例外・再試行の扱いを検討した。', cites: [14, 15] },
      ] },
    { years: '2017–2019', name: '繰り返せる運用', keywords: 'Serverless · Go · Containers · Helm · Automation',
      lead: '繰り返す作業を、設定とルールに変える。', note: 'サーバーレスの導入判断から、コンテナでのコマンド実行、ChartやPull Requestの操作まで。開発と運用の摩擦を小さくしていく。',
      entries: [
        { time: '2017.08 · 11', title: '処理の流れと、型の境界を説明する', text: '8月9日のServerless Meetup Tokyo #4で「flowtypeStepFunction」を発表。11月のQiitaではOpaque Type Aliasesを取り上げ、同じ基本型でも用途の違うIDなどを区別し、誤った受け渡しを防ぐ設計を説明した。', cites: [16, 17] },
        { time: '2018.05 · 10', title: '導入の判断と、実行環境を整える', text: '5月の発表では、既存システムにサーバーレスを部分的に取り入れる考え方を紹介。10月に作成されたGo製ツールaliasesでは、YAMLで定義したコマンドと依存関係をコンテナ上で扱えるようにした。', cites: [18, 19] },
        { time: '2018.12 – 2019.01', title: 'Kubernetesの導入と、配布の手間を扱う', text: '12月のJapan Container Daysで既存システムのKubernetes化を発表。翌1月には、GitHubなどのHelm Chartをローカルへ取り込むhelm-importをQiitaで紹介し、helmfileと組み合わせる方法を示した。', cites: [20, 21] },
        { time: '2019.10', title: 'Pull Request運用を自動化する', text: 'Go製CLIのprを作成。JMESPathによる条件で対象を選び、ラベル・担当者・レビュー・マージなどの操作を行う。日々のリポジトリ運用を、再利用できるルールとして扱う道具である。', cites: [22] },
      ] },
    { years: '2020–2021', name: '信頼できる変更', keywords: 'PHP · Kubernetes · Helm · Observability · Reliability',
      lead: '動いているシステムを、変え続けられるように。', note: '既存PHPシステムのKubernetes移行を、発表・連載・質疑応答として公開。移行後の運用や、アラートの扱いまで関心が広がる。',
      entries: [
        { time: '2020.10–12', title: '移行で直面した論点を、実務の言葉で共有', text: '10月のAWS DevDay、11月からの連載、12月のPHP Conferenceで、EC2からKubernetesへ移す取り組みを説明。設定の注入、ログ、コンテナの終了処理、開発環境など、移行を進める際の課題を具体的に扱った。移行で示された変化は、後掲の「主な成果」にまとめた。', cites: [23, 24, 26] },
        { time: '2021.01', title: 'アラートを、通知だけの問題にしない', text: 'Zennの「僕たちはアラートを管理できない」では、検知、利用者への影響の解消、原因の根本解決を分けて整理。対応する人の負担、責務、知識の蓄積、指標の難しさを、自身の課題意識から論じた。', cites: [27] },
        { time: '2021.03', title: 'Helm Chartを運用し続ける知見を共有', text: 'CloudNative Days Spring 2021で、2年半のChartリポジトリ運用を振り返る。配布の自動化、複数Chartの管理、Kubernetes更新への追従、テストなど、導入後に続く作業を整理した。', cites: [28] },
      ] },
    { years: '2022', name: '自律性と型', keywords: 'Rust · Type Safety · GraphQL · GitOps · Developer Autonomy',
      lead: '自分たちで変えられる、壊しにくい仕組みへ。', note: '開発の自律性を支える基盤づくりと、Rust・GraphQLの実装。設計の考え方を、書籍・登壇・コード・記事のそれぞれで表した。',
      entries: [
        { time: '2022.03', title: '状態と遷移を、Rustの型で表現する', text: 'Zenn Booksで「Typesafe State in Rust (preview)」を公開。状態に応じたデータや振る舞い、遷移を型で表現し、誤った操作を制約する設計を全8章で説明している。', cites: [29] },
        { time: '2022.04', title: '開発チームへオーナーシップを渡す', text: 'DevOpsDays Tokyo 2022に登壇。IaCの継続的デリバリー、Argo CDによるGitOps、OPAによる制約などを紹介した。開発者が自ら変更できる環境と、安全を保つための仕組みを併せて設計する取り組みである。', cites: [30] },
        { time: '2022.08–09', title: '使うOSSの課題を、上流の修正へつなぐ', text: 'async-graphqlへ、resolverでリクエストデータが失われる不具合の修正と、CursorTypeのプリミティブ型対応を提案。2件のPull Requestはそれぞれ8月・9月にマージされた。', cites: [31, 32] },
        { time: '2022.11–12', title: '設計を伝え、互換性を検討する', text: '11月は構成図の整列・余白・線・まとまりを説明するZenn記事を公開。12月にはGraphQLの古い操作を変換層で受け止めるスキーマ変更の案を示し、Rustでの試作と未実装の課題を共有した。', cites: [33, 34] },
      ] },
    { years: '2023', name: 'AIと新しい学び', keywords: 'ChatGPT · LlamaIndex · Serverless · Solana · Rust',
      lead: 'AIを試し、学びの入口を増やす。', note: '生成AIをシステムへ組み込む検証が、年初から始まる。後半にはSolanaの日本語資料とRustの学習支援へ活動が広がった。',
      caveat: 'AIの記事は本人による実験・検討の記録。日本語資料集には他の著者の資料も含まれる。',
      entries: [
        { time: '2023.02–03', title: 'AIへ渡す情報と、返る答えを検証', text: 'ChatGPTとLlamaIndexで「伺か」の仕様を問い合わせる実験を公開。文書の分割や構造が回答に及ぼす影響を調べた。Security Hubのトリアージでは、構造化した判断結果と、人への確認を含む処理を検討した。', cites: [35, 36] },
        { time: '2023.04', title: 'AIの出力を、プログラムから扱う', text: 'ChatGPT Meetup Osaka #1で、プロンプト技法を発表。回答の揺れを実験し、プロンプトに加えて、検査・再試行・補正を組み合わせる考え方を紹介した。', cites: [37] },
        { time: '2023.08–10', title: '経験を再整理し、新しい領域を学ぶ', text: '8月公開の登壇資料では、サーバーレスを拡張速度と耐障害性の観点で論じる。9月にはSolanaの日本語資料集を作成し、10月のZennではアカウントや状態更新を、CRUDの実装を通じて解説した。', cites: [38, 39, 40] },
        { time: '2023.11–12', title: 'RustとSolanaを、体験できる学びに', text: 'Solana Developer Hub #0で「Rust入門 in Solana」「AIで始めるRustプログラミング」の資料を公開。カウンターの実装を題材にRustへ入門する構成を取り、#1ではSolana Payも扱っている。', cites: [41, 42] },
      ] },
    { years: '2024', name: '実践と支援', keywords: 'Rust · Solana · PHP · Docker · Developer Experience',
      lead: '動かして学び、自力で進める条件を作る。', note: 'Solanaの実習・計測から、既存PHPのテスト支援、開発者の自律性の振り返りまで。技術を使う人の次の一歩を支える。',
      entries: [
        { time: '2024.03', title: '環境構築から公開までの教材を用意', text: 'Solana Developer Hub Workshop #4向けに、開発環境の準備、ウォレット接続、NFT発行、Web公開までをたどる教材を公開した。実際にアプリを作り、公開するところまで学べる構成にしている。', cites: [43] },
        { time: '2024.05–06', title: '内部の動きを測り、Rustの学び方を伝える', text: '5月の資料「Compute Units / Budget最適化」では、Solanaの実行コストを計測し、実装や手数料との関係を検討。6月14日のイベントでは、型のシグネチャから学ぶRustと、Solanaでの活用をテーマに発表した。', cites: [44, 45] },
        { time: '2024.11', title: '古いPHPでも、結合テストを書きやすく', text: 'testcontainers-phpのリポジトリを作成。Dockerコンテナの起動・待機・終了をPHPから扱い、テスト環境を組み立てる。確認時点のREADMEでは、PHP 5.6〜8.5への対応を掲げている。', cites: [46] },
        { time: '2024.11 · 記事公開', title: '自動化の先に、開発者の自律性を確かめる', text: 'Zennで、それまでの権限委譲と開発支援を振り返る。直接の権限付与だけに頼らず、制約付きの自動化を用意し、アンケートやメトリクスで自律性を確認した経験を記述。指標をもとに継続して改善する支援へ進んでいる。', cites: [47] },
      ] },
    { years: '2025', name: 'テストとAIワークフロー', keywords: 'Testing · AI Agents · Refactoring · Storybook · Solana',
      lead: '開発を速くするために、確かめる仕組みを作る。', note: '既存PHPの更新、Solanaのテスト、AIとのタスク管理。異なる領域で、検証と作業の進め方を具体的な実装へ落とし込んだ。',
      entries: [
        { time: '2025.03–04', title: 'テストを、変更を進めるための土台に', text: '3月のZenn記事で、古いPHPの更新に必要なテストを整えるため、testcontainers-phpを作った経緯を説明。4月公開のSolana Developer Hub #16の資料では、ユニットテストとTest Validatorを使う検証を整理した。', cites: [48, 49] },
        { time: '2025.06', title: 'AIの作業を、タスクと記録で引き継ぐ', text: 'Zennでタスク駆動のAI開発を紹介。目的、計画、作業記録をファイルへ残し、会話の文脈が失われたり、使うエージェントが変わったりしても、続きから進められる形を試みた。', cites: [50] },
        { time: '2025.09', title: '自然言語の規約を、検査と修正へ', text: 'Claude Codeを呼び出すcconvを試作し、自然言語ルールでコードを検査・修正する過程と限界をZennで共有。Solanaの発信も続け、Seeker向けアプリの構築・接続・公開を解説する資料を公開した。', cites: [51, 52] },
        { time: '2025.12', title: '過去の資産を、検証しながら更新する', text: '2014年末から更新していなかった個人サイトを、AIとともにReact・Viteなどへ移行。画面比較テスト、部品化、品質確認の手順と失敗を記事にまとめた。testcontainers-phpにはコンテナ再利用モードも追加している。', cites: [53, 54] },
      ] },
    { years: '2026', name: 'AIと作る成果の検証', keywords: 'PHP · SQL · Storybook · AI Agents · Documentation',
      lead: 'AIで作る力を、確かめて使える力へ。', note: 'AIに実装を任せるほど、設計・検査・記録の仕組みが重要になる。その問題を、PHPの道具と自身の開発手法の両方から掘り下げている。',
      caveat: 'Zero Table Dependencyの着想は別の著者によるもの。ここではPHPでの実装と検証基盤への取り組みを扱う。活動のつながりは本書の編集上の解釈。',
      entries: [
        { time: '2026.01–03', title: 'PHPの実装・検証をつなぐ道具を公開', text: '開発環境の記事でAIの使い分けを紹介。ztd-query-phpではZero Table DependencyのPHP実装とSQL検証を進め、storybook-phpでは画面部品の確認、php-ai-toolkitでは静的解析・テスト出力・文書化を支援する。', cites: [55, 56, 57, 58] },
        { time: '2026.05', title: 'AIの探索と、成果物の品質を掘り下げる', text: 'Zennで、反復実行やコンテキスト、外部からの介入が探索へ及ぼす影響を報告。別の記事では概念整理、リンター、テスト、監査、実利用を組み合わせる開発を記述し、品質を上げる手法と残る課題を整理した。', cites: [59, 60] },
        { time: '2026.08', title: '複数のAIの作業を、自分用の道具で扱う', text: 'タスクの依存関係、実行待ち、定期タスク、エージェントのログを一元管理するアプリを制作し、使用体験を記事で共有。記事は公開されているが、アプリ自体は自分用で、公開予定はないと明記している。', cites: [61] },
        { time: '2026.09 · 確認時点', title: '読み解ける成果物へ整える', text: 'document-designでは、文書・レポートの階層、組版、図表を共通CSSとして整備。本ペーパーもそのCSSを使っている。2014年のDgeniから続く「作ったものを理解できる形で渡す」関心が、ここにも見られる。', cites: [62] },
      ] },
  ],
  en: [
    { years: '2014', name: 'First public works', keywords: 'PHP · Node.js · Grunt · Scala · Documentation',
      lead: 'Build, write and talk about the inconveniences close at hand.', note: 'Before the first talk, the tools built and how to use them were already published on Qiita. An early interest in notifications and documentation generation shows here.',
      focus: ['In focus', 'Publish the implementation and the explanation together. Not only what was built, but how to run it. The shape of activity that later leads to test support and learning material is visible from 2014.'],
      entries: [
        { time: '2014.05–06', title: 'Reporting build results to Ukagaka', text: 'Built grunt-sstp, which sends Grunt successes, warnings and failures to a desktop mascot. Published on Qiita on 6 May, followed on 1 June by an explanation of driving it from Scala’s SBT.', cites: [1, 2] },
        { time: '2014.09', title: 'Generating documentation from code', text: 'Explained ngdoc generation with Dgeni on Qiita. grunt-dgeni put documentation generation into the everyday build, and dgeni-markdown added a tool for Markdown output. The walkthrough and the implementation that simplifies it appear side by side.', cites: [3, 4, 5] },
        { time: '2014.10.11 · First talk', tone: 'tone-accent', title: 'A new form of notification with PHP and Ukagaka', text: 'A lightning talk at PHP Conference Japan 2014. It combined PHP, SSTP and APIs to deliver events of all kinds to Ukagaka. The notification tools published since spring led to a talk at a technical conference.', cites: [6, 7] },
      ] },
    { years: '2015–2016', name: 'Development workflows', keywords: 'Lambda · Scala.js · npm · Flowtype · State Machines',
      lead: 'Connect new technology to everyday development.', note: 'Rather than only trying Lambda and Scala.js, the articles and talks showed how to fit them into the flow of testing, building and deploying.',
      entries: [
        { time: '2015.01', title: 'Assembling a development cycle for Lambda', text: 'The January article used lambda-template to walk from local tests to execution and log inspection in the cloud. Beyond the function’s code, it arranged a repeatable develop-and-verify loop and connected it to CI/CD.', cites: [8] },
        { time: '2015.03 · 08', title: 'Talks on documentation generation and Scala.js', text: 'At ng-japan 2015 on 21 March, a comparison of ways to start with Dgeni. At Scala Kansai Summit 2015 on 1 August, how to combine npm with SBT. Another Scala.js talk, published in July, is listed on the official Scala.js site.', cites: [9, 10, 11] },
        { time: '2015.12 – 2016.01', title: 'Revisiting distribution and the build', text: 'December explained separating Lambda configuration, artifacts and deployment. The following January verified handling Scala.js from Node.js without SBT. Technology is fitted to the tooling of everyday development.', cites: [12, 13] },
        { time: '2016.12', title: 'Thinking about serverless in types and states', text: 'Explained Lambda development combining SAM, Node and Flowtype. The Step Functions article examined parallel, distributed processing with dynamically built state definitions, and the handling of exceptions and retries.', cites: [14, 15] },
      ] },
    { years: '2017–2019', name: 'Repeatable operations', keywords: 'Serverless · Go · Containers · Helm · Automation',
      lead: 'Turn repeated work into configuration and rules.', note: 'From deciding on serverless to running commands in containers and operating charts and pull requests: reducing the friction between development and operations.',
      entries: [
        { time: '2017.08 · 11', title: 'Explaining the flow of processing and the boundaries of types', text: 'Presented “flowtypeStepFunction” at Serverless Meetup Tokyo #4 on 9 August. A November Qiita article took up Opaque Type Aliases: keeping identifiers of the same base type but different purposes apart, so they cannot be passed in the wrong place.', cites: [16, 17] },
        { time: '2018.05 · 10', title: 'Deciding on adoption and preparing an execution environment', text: 'The May talk introduced adopting serverless for parts of an existing system. aliases, a Go tool created in October, runs commands and their dependencies defined in YAML inside containers.', cites: [18, 19] },
        { time: '2018.12 – 2019.01', title: 'Adopting Kubernetes and handling the cost of distribution', text: 'Presented moving an existing system to Kubernetes at Japan Container Days in December. The following January introduced helm-import on Qiita, which pulls Helm charts from GitHub and elsewhere into a local repository, and showed how to combine it with helmfile.', cites: [20, 21] },
        { time: '2019.10', title: 'Automating pull request operations', text: 'Created pr, a Go CLI. It selects targets with JMESPath conditions and applies labels, assignees, reviews, merges and other operations. A tool that treats day-to-day repository operations as reusable rules.', cites: [22] },
      ] },
    { years: '2020–2021', name: 'Reliable change', keywords: 'PHP · Kubernetes · Helm · Observability · Reliability',
      lead: 'Keep a running system changeable.', note: 'The migration of an existing PHP system to Kubernetes was published as talks, a series and Q&A. Interest widened to operating after the migration and to the handling of alerts.',
      entries: [
        { time: '2020.10–12', title: 'Sharing the issues met in the migration, in practical terms', text: 'AWS DevDay in October, a series from November and PHP Conference in December described moving from EC2 to Kubernetes. Configuration injection, logging, container shutdown and development environments were handled concretely. The change the migration produced is summarised under “Main results” below.', cites: [23, 24, 26] },
        { time: '2021.01', title: 'Alerts are not only a notification problem', text: '“We cannot manage alerts” on Zenn separated detection, removing the effect on users, and resolving the root cause. It discussed the burden on responders, responsibilities, accumulated knowledge and the difficulty of metrics, from the author’s own concerns.', cites: [27] },
        { time: '2021.03', title: 'Sharing what it takes to keep operating Helm charts', text: 'At CloudNative Days Spring 2021, a look back at two and a half years of running a chart repository: automating distribution, managing several charts, keeping up with Kubernetes releases, and testing. The work that continues after adoption.', cites: [28] },
      ] },
    { years: '2022', name: 'Autonomy and types', keywords: 'Rust · Type Safety · GraphQL · GitOps · Developer Autonomy',
      lead: 'Toward systems teams can change themselves and find hard to break.', note: 'Building the foundation for developer autonomy, and implementations in Rust and GraphQL. Design thinking expressed as a book, a talk, code and articles.',
      entries: [
        { time: '2022.03', title: 'Expressing states and transitions in Rust types', text: 'Published “Typesafe State in Rust (preview)” on Zenn Books. Eight chapters on expressing state-dependent data, behaviour and transitions as types, so that wrong operations are constrained.', cites: [29] },
        { time: '2022.04', title: 'Handing ownership to development teams', text: 'Spoke at DevOpsDays Tokyo 2022 on continuous delivery of IaC, GitOps with Argo CD and constraints with OPA. Designing an environment developers can change themselves together with the mechanisms that keep it safe.', cites: [30] },
        { time: '2022.08–09', title: 'Taking problems in the OSS in use upstream', text: 'Proposed to async-graphql a fix for request data lost in resolvers and primitive type support for CursorType. The two pull requests were merged in August and September.', cites: [31, 32] },
        { time: '2022.11–12', title: 'Communicating design and considering compatibility', text: 'In November, a Zenn article on alignment, spacing, lines and grouping in diagrams. In December, a proposal for schema changes that absorb old GraphQL operations in a translation layer, with a Rust prototype and the unimplemented parts.', cites: [33, 34] },
      ] },
    { years: '2023', name: 'AI and new learning', keywords: 'ChatGPT · LlamaIndex · Serverless · Solana · Rust',
      lead: 'Try AI, and add ways into learning.', note: 'Experiments in putting generative AI into systems begin at the start of the year. In the second half, the work widened to Japanese material on Solana and support for learning Rust.',
      caveat: 'The AI articles record the author’s own experiments and considerations. The collection of Japanese material also includes material by other authors.',
      entries: [
        { time: '2023.02–03', title: 'Testing what is given to an AI and what comes back', text: 'Published an experiment asking ChatGPT and LlamaIndex about the Ukagaka specification, examining how splitting and structuring the document affects the answers. For Security Hub triage, considered structured decisions and a process that includes confirmation by a person.', cites: [35, 36] },
        { time: '2023.04', title: 'Handling AI output from a program', text: 'Presented prompt techniques at ChatGPT Meetup Osaka #1. Experimented with variation in answers and introduced combining prompts with inspection, retries and correction.', cites: [37] },
        { time: '2023.08–10', title: 'Reorganising experience and learning a new field', text: 'Slides published in August discussed serverless in terms of speed of extension and fault tolerance. In September, a collection of Japanese Solana material; in October, a Zenn article explaining accounts and state updates through a CRUD implementation.', cites: [38, 39, 40] },
        { time: '2023.11–12', title: 'Making Rust and Solana something to learn by doing', text: 'Published “Rust Introduction in Solana” and “Rust Programming with AI” for Solana Developer Hub #0, introducing Rust through a counter implementation. #1 also covered Solana Pay.', cites: [41, 42] },
      ] },
    { years: '2024', name: 'Hands-on and enablement', keywords: 'Rust · Solana · PHP · Docker · Developer Experience',
      lead: 'Learn by running things, and create the conditions to go on alone.', note: 'From Solana exercises and measurement to test support for existing PHP and a retrospective on developer autonomy: supporting the next step of the people who use the technology.',
      entries: [
        { time: '2024.03', title: 'Course material from setup to publishing', text: 'For Solana Developer Hub Workshop #4, published material that walks from preparing the environment through wallet connection and minting an NFT to publishing on the web. It is built so that an app is actually made and published.', cites: [43] },
        { time: '2024.05–06', title: 'Measuring what happens inside, and how to learn Rust', text: 'The May material “Compute Units / Budget optimisation” measured Solana execution cost and examined its relation to implementation and fees. An event on 14 June covered learning Rust from type signatures and applying it to Solana.', cites: [44, 45] },
        { time: '2024.11', title: 'Making integration tests easier to write, even for old PHP', text: 'Created the testcontainers-php repository. It starts, waits for and stops Docker containers from PHP to assemble a test environment. The README, at the time of checking, states support for PHP 5.6 to 8.5.', cites: [46] },
        { time: '2024.11 · Article', title: 'Beyond automation, checking developer autonomy', text: 'A Zenn retrospective on the delegation and development support so far: rather than relying on granting permissions directly, providing constrained automation and confirming autonomy through surveys and metrics. It moves on to support that keeps improving on the basis of metrics.', cites: [47] },
      ] },
    { years: '2025', name: 'Tests and AI workflows', keywords: 'Testing · AI Agents · Refactoring · Storybook · Solana',
      lead: 'To develop faster, build the means to verify.', note: 'Updating existing PHP, testing Solana, managing tasks with AI. In different fields, verification and ways of working were turned into concrete implementations.',
      entries: [
        { time: '2025.03–04', title: 'Tests as the ground for making changes', text: 'A March Zenn article explained why testcontainers-php was built: to put in place the tests needed to update old PHP. Material for Solana Developer Hub #16, published in April, organised verification with unit tests and the Test Validator.', cites: [48, 49] },
        { time: '2025.06', title: 'Handing AI work over through tasks and records', text: 'Introduced task-driven AI development on Zenn. Goals, plans and work records are kept in files, so that work can continue from where it left off when the conversation context is lost or the agent changes.', cites: [50] },
        { time: '2025.09', title: 'Natural-language conventions as inspection and correction', text: 'Prototyped cconv, which calls Claude Code, and shared on Zenn the process and the limits of checking and fixing code against natural-language rules. Solana work continued with material on building, connecting and publishing an app for Seeker.', cites: [51, 52] },
        { time: '2025.12', title: 'Updating old assets while verifying', text: 'Migrated a personal site untouched since the end of 2014 to React and Vite, together with AI. The article records the steps and failures of screen comparison tests, componentisation and quality checks. testcontainers-php also gained a container reuse mode.', cites: [53, 54] },
      ] },
    { years: '2026', name: 'Verifying AI-assisted work', keywords: 'PHP · SQL · Storybook · AI Agents · Documentation',
      lead: 'From the power to build with AI to the power to verify and use it.', note: 'The more implementation is left to AI, the more design, inspection and records matter. The problem is examined from both PHP tooling and the author’s own way of working.',
      caveat: 'The idea of Zero Table Dependency is another author’s. What is covered here is the PHP implementation and the verification base. The connections between activities are this paper’s editorial reading.',
      entries: [
        { time: '2026.01–03', title: 'Publishing tools that connect PHP implementation and verification', text: 'An article on the development environment described how each AI is used. ztd-query-php advances a PHP implementation of Zero Table Dependency and SQL verification; storybook-php checks screen components; php-ai-toolkit supports static analysis, test output and documentation.', cites: [55, 56, 57, 58] },
        { time: '2026.05', title: 'Examining AI exploration and the quality of its output', text: 'Reported on Zenn how repeated runs, context and outside intervention affect exploration. Another article described development that combines concept work, linters, tests, audits and real use, and organised the methods that raise quality and the problems that remain.', cites: [59, 60] },
        { time: '2026.08', title: 'Handling the work of several AIs with a tool of one’s own', text: 'Built an app that manages task dependencies, pending runs, scheduled tasks and agent logs in one place, and shared the experience in an article. The article is public; the app is personal and, as stated, not planned for release.', cites: [61] },
        { time: '2026.09 · At the time of checking', title: 'Shaping output that can be read', text: 'document-design organises the hierarchy, typesetting and figures of documents and reports as a shared stylesheet. This paper uses that stylesheet. The interest that runs from Dgeni in 2014 — handing over what was built in a form that can be understood — is visible here too.', cites: [62] },
      ] },
  ],
};

const TEXT = {
  ja: {
    documentTitle: 'k_kinzal — 公開活動の記録 2014–2026',
    description: 'k_kinzalの2014年から2026年までの公開活動をたどるペーパー。doc-uiのレポート、年表、出典の完成例。',
    eyebrow: 'k_kinzal / ENGINEERING WORKS · 2014–2026',
    title: 'k_kinzal',
    stand: '複雑な技術を、使える道具と伝わる知識に変える人。',
    strengths: [['使える道具を作る', '文書生成、デプロイ、PHPのテスト環境、AI開発。'], ['安全に変える', '基盤移行、型による設計、自動テストと品質の検証。'], ['知識を伝える', 'Qiita・Zennでの発信、技術登壇、Rust・Solana教材。']],
    profile: { label: 'プロフィール', lead: '開発や運用で感じた不便を、コードで解く。', notes: ['仕組みを掘り下げ、動く形で確かめる。その過程を、OSS・記事・登壇・教材として公開する。', '2014年の初登壇から現在までの、公開活動をたどるペーパー。人物紹介は本書に収録した活動をもとにした編集上の要約。確認日：2026年9月26日。'], sidenote: ['読み方', '各期の見出しが主張、続く段落が文脈、年表が根拠。本文の番号は文末の出典を指す。'] },
    keywords: 'キーワード',
    chronology: '年表',
    results: { label: '主な成果', lead: '参画した基盤移行で示された変化。', note: '2020年の公開事例に記載された、EC2からKubernetesへの移行後の指標。チームとしての成果であり、個人単独の成果を示す数値ではない。', stats: [['20分 → 5分', 'デプロイに要する時間。移行後は5分程度。'], ['1/20', 'リリース障害時の切り戻し時間。'], ['1/10', 'リリース時のオペレーションコスト。']], caveat: '公開事例に記載されたチームの成果。個人単独の成果を示す数値ではない。', cites: [25] },
    sources: { label: '出典', lead: '公開資料をたどる。', note: '本文の番号から出典へ、各タイトルから原資料へ移動できる。印刷時はURLをこの一覧にのみ記す。', count: (n) => `${n}件の資料` },
    method: { label: '資料の扱い', notes: ['代表的な公開活動を選定。記事・書籍は公開日（原則JST）、登壇は開催日または資料公開日、PRはマージ日を使用。リポジトリの年月は作成日時で、活動開始日や公開開始日を保証しない。機能は確認時点のREADMEによる。振り返り記事の経験は、掲載年にすべて実施されたとは限らない。', '人物の表記はk_kinzalに統一し、所属・役職は掲載しない。一部の資料名を内容名・抄題へ変更した。原資料には別表記や所属情報が含まれる。'] },
  },
  en: {
    documentTitle: 'k_kinzal — A record of public work, 2014–2026',
    description: 'A paper tracing k_kinzal’s public engineering work from 2014 to 2026. A complete doc-ui example of a report with a chronology and sources.',
    eyebrow: 'k_kinzal / ENGINEERING WORKS · 2014–2026',
    title: 'k_kinzal',
    stand: 'Turns complex technology into usable tools and knowledge that carries.',
    strengths: [['Builds usable tools', 'Documentation generation, deployment, PHP test environments, AI development.'], ['Changes things safely', 'Platform migration, design through types, automated tests and quality verification.'], ['Passes knowledge on', 'Articles on Qiita and Zenn, conference talks, Rust and Solana course material.']],
    profile: { label: 'Profile', lead: 'Solves in code the inconveniences met in development and operations.', notes: ['Digs into how things work and confirms them in running form. The process is published as open source, articles, talks and course material.', 'A paper tracing public work from the first talk in 2014 to the present. The profile is an editorial summary based on the work recorded in this paper. Checked on 26 September 2026.'], sidenote: ['How to read', 'Each period’s heading is the claim, the paragraph after it the context, and the chronology the evidence. Numbers in the text point to the sources at the end.'] },
    keywords: 'Keywords',
    chronology: 'Chronology',
    results: { label: 'Main results', lead: 'The change shown by the platform migration the author joined.', note: 'Figures recorded in a 2020 published case study, after the migration from EC2 to Kubernetes. They are the team’s results, not figures for one person’s work.', stats: [['20 → 5 min', 'Time taken by a deployment. About 5 minutes after the migration.'], ['1/20', 'Time to roll back a failed release.'], ['1/10', 'Operational cost of a release.']], caveat: 'Results of the team, as recorded in the published case study. The figures do not represent one person’s work.', cites: [25] },
    sources: { label: 'Sources', lead: 'Follow the public record.', note: 'A number in the text leads to its source; each title leads to the original. In print, URLs appear only in this list.', count: (n) => `${n} sources` },
    method: { label: 'How the sources were handled', notes: ['Representative public work was selected. Articles and books are dated by publication (JST by default), talks by the event or the publication of the slides, pull requests by the merge. A repository’s year and month are its creation date and do not establish when the work or its publication began. Features are as stated in the README at the time of checking. The experience described in a retrospective was not necessarily all gained in the year it was published.', 'The author is named k_kinzal throughout; affiliations and titles are not given. Some titles have been replaced by a description of their content or shortened. The originals may use other spellings and include affiliations.'] },
  },
};

const cite = (n) => `<a class="cite" href="#src-${n}">${n}</a>`;
const cites = (ns) => ns.map(cite).join('');
const pad = (n) => String(n).padStart(2, '0');

function section(number, label, rail, field, after = '') {
  return `<section class="sec">
  <div class="rail"><h2 class="label">${pad(number)}<br>${escape(label)}</h2>${rail}</div>
  <div class="field">${field}</div>${after}
</section>`;
}

export function paperBody(lang = 'en') {
  const t = TEXT[lang];
  const periods = PERIODS[lang];
  const notes = SOURCE_NOTES[lang];
  let n = 0;
  const parts = [];
  parts.push(`<p class="eyebrow">${escape(t.eyebrow)}</p>
<h1>${escape(t.title)}</h1>
<p class="stand">${escape(t.stand)}</p>
<div class="hero">
  <div class="figures">${t.strengths.map(([head, text]) => `
    <figure><h3>${escape(head)}</h3><p>${escape(text)}</p></figure>`).join('')}
  </div>
</div>`);
  parts.push(section(++n, t.profile.label,
    `<p class="sidenote"><span class="sidenote-label">${escape(t.profile.sidenote[0])}</span>${escape(t.profile.sidenote[1])}</p>`,
    `<p class="lead">${escape(t.profile.lead)}</p>${t.profile.notes.map((p) => `\n    <p class="note">${escape(p)}</p>`).join('')}`));
  for (const period of periods) {
    const rail = [`<p class="sidenote"><span class="sidenote-label">${escape(period.name)}</span>${escape(period.keywords)}</p>`];
    if (period.focus) rail.push(`<p class="sidenote"><span class="sidenote-label">${escape(period.focus[0])}</span>${escape(period.focus[1])}</p>`);
    const entries = period.entries.map((e) => `
      <li class="timeline-item${e.tone ? ` ${e.tone}` : ''}">
        <span class="timeline-time">${escape(e.time)}</span>
        <p class="timeline-title">${escape(e.title)}</p>
        <p class="timeline-description">${escape(e.text)}${cites(e.cites)}</p>
      </li>`).join('');
    parts.push(section(++n, period.years, rail.join(''),
      `<p class="lead">${escape(period.lead)}</p>
    <p class="note">${escape(period.note)}</p>
    <ol class="timeline">${entries}
    </ol>`,
      period.caveat ? `\n  <p class="caveat">${escape(period.caveat)}</p>` : ''));
  }
  parts.push(section(++n, t.results.label, '',
    `<p class="lead">${escape(t.results.lead)}</p>
    <p class="note">${escape(t.results.note)}${cites(t.results.cites)}</p>
    <div class="stats">${t.results.stats.map(([fig, label]) => `
      <div class="stat"><b class="stat-fig">${escape(fig)}</b><span class="stat-label">${escape(label)}</span></div>`).join('')}
    </div>`,
    `\n  <p class="caveat">${escape(t.results.caveat)}</p>`));
  const sources = SOURCES.map(([title, url, date], i) => `
      <li id="src-${i + 1}"><a href="${escape(url)}"${lang === 'en' && /[ぁ-んァ-ン一-龯]/.test(title) ? ' lang="ja"' : ''}>${escape(title)}</a><span class="source-meta">${escape(notes[i][0])}${date ? ` · ${escape(date)}` : ''} · ${escape(notes[i][1])}</span></li>`).join('');
  parts.push(section(++n, t.sources.label,
    `<p class="sidenote">${escape(t.sources.count(SOURCES.length))}</p>`,
    `<p class="lead">${escape(t.sources.lead)}</p>
    <p class="note">${escape(t.sources.note)}</p>
    <ol class="sources">${sources}
    </ol>`));
  parts.push(section(++n, t.method.label, '', t.method.notes.map((p) => `<p class="note">${escape(p)}</p>`).join('\n    ')));
  return parts.join('\n');
}

export function paperPage(lang = 'en') {
  const t = TEXT[lang];
  return `<!doctype html>
<html lang="${lang}" data-dd-paper="a4" data-dd-print-urls="sources">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <title>${escape(t.documentTitle)}</title>
  <meta name="description" content="${escape(t.description)}">
  ${stylesheet.replaceAll('\n', '\n  ')}
</head>
<body>
<article class="sheet" lang="${lang}">
${paperBody(lang)}
</article>
</body>
</html>
`;
}

// What the PDF test expects to find, in reading order.
export function paperExpectations(lang = 'en') {
  const t = TEXT[lang];
  const periods = PERIODS[lang];
  return {
    headings: [t.profile.lead, ...periods.flatMap((p) => [p.lead, ...p.entries.map((e) => e.title)]), t.results.lead, t.sources.lead],
    entries: periods.flatMap((p) => p.entries.map((e) => e.text)),
    sources: SOURCES.map(([title]) => title),
    urls: SOURCES.map(([, url]) => url),
    last: t.method.notes.at(-1),
  };
}
