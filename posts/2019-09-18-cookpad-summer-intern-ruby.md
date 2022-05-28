---
title: Cookpad Summer Internship 2019 高難易度コースに参加した
publishedAt: 2019-09-18
tags:
    - Ruby
# thumbnail: images/2019-09-18-cookpad-summer-intern-ruby.png
ogpImage: images/2019-09-18-cookpad-summer-intern-ruby.png
---

2019年8月16日から2019年9月13日まで、インターンとしてクックパッド株式会社でRuby処理系の開発を経験しました。

このインターンシップの目標は[MRI](https://github.com/ruby/ruby/) (Matz' Ruby Implementation、CRubyのこと) 中の機能の1つである、InstructionSequenceのバイナリ出力機能を改善することであり、実際に4週間かけてこの課題に取り組みこれを達成しました。

最終的にRuby本体に対して[Pull-Request](https://github.com/ruby/ruby/pull/2450)と改善の内容とその評価をまとめた[チケット](https://bugs.ruby-lang.org/issues/16163)を発行しました。

~~PRは2019年12月にリリースが予定されているRuby 2.7までにマージされる予定です。~~
9月19日にマージされました。

より詳細なデータは上記のチケットにまとめていますが、これがマージされればRailsアプリケーションのキャッシュサイズが70%以上小さくなります。

これまでRubyではFizzBuzzもろくに書いたことがありませんでしたがせっかくRuby処理系とその実装について深く学ぶことができました。
また、内部の実装を覗くことで20年以上も開発の続けられてきたOSSであってもまだまだ改善できる余地が残されていることをなんとなく悟ったのでこれからも貢献していきたいです。

[09/28追記]

[クックパッド開発者ブログ](https://techlife.cookpad.com/) に記事を公開しました。
課題や実装についてより詳細に解説しています。

[Ruby中間表現のバイナリ出力を改善する - クックパッド開発者ブログ](https://techlife.cookpad.com/entry/2019/09/26/143000)
