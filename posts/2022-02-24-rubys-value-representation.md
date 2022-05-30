---
title: 【M3 Tech Blog】Rubyの値はどう表現されるか (クイズもあるよ)
publishedAt: 2022-02-24
tags:
    - Ruby
    - C
thumbnail: /blog/images/2022/02/24/shared-string.png
externalUrl: https://www.m3tech.blog/entry/2022/02/24/110000
---

新卒の永山です。

エムスリーでは隔週金曜日に Tech Talk という社内勉強会を実施しています。
[エムスリー公式テックチャンネル 【M3 Tech Channel】](https://www.youtube.com/channel/UC_DkAOcwgmtQnJLDctci4rQ) では過去の発表のアーカイブを公開しています。

<!-- [https://www.youtube.com/channel/UC_DkAOcwgmtQnJLDctci4rQ:embed:cite] -->

今回は上記YouTubeチャンネルに公開されている私の過去の発表について紹介いたします。

[https://www.youtube.com/watch?v=fWGupvzzGHQ:embed:cite]

[:contents]

<!-- more -->

## 概要

C言語で書かれている [CRuby](https://github.com/ruby/ruby) 内でRubyの値がどのように表現されているかについての発表です。

また、CRubyでは値の表現についての様々な高速化が施されており、それによって生じる一見して非直感的なパフォーマンスの差異についても紹介しています。

例えば、以下の 1〜4 の式はどれも同じ文字列を返しますが、そのうち1つと他とでは約10倍の実行速度の差が生じます。
それはどれでしょうか？　また、そのような速度差が発生するのはなぜでしょうか？

```ruby
s = 'X' * 10030

s[ 0...10000] # 1
s[10...10010] # 2
s[20...10020] # 3
s[30...10030] # 4
```

## オススメの対象

- Rubyを書く方
- 言語処理系に興味がある方

`VALUE`, `RVALUE` などの値に関する表現はRuby処理系の導入部分であるため、普段何気なくRubyを書かれている方は、そこから一歩踏み込んでそれを実行する言語処理系に興味を持たれるためのきっかけになるかもしれません。

## 発表の補足

## 余談

発表中でも述べていますが、言語処理系や標準ライブラリなどの言語基盤に関する知識は異なる言語を利用する際にも案外役立ちます。

例えば、アライメントされたアドレスの下位bitが0であることを利用してなにかしらかの情報を表現するという発想は glibc の malloc の実装で用いられているテクニック[[^glibc-malloc]]に通ずるところがありますし、文字列などのバッファを複数のオブジェクト間で共有する高速化技法はCoW (Copy on Write) として知られています。

また、C++の標準ライブラリである `std::string` の主要な実装ではRubyと同様に短い文字列に関する最適化 (Small String Optimization)[[^sso]][[^sso2]] が行われています。

[^glibc-malloc]: [https://www.youtube.com/watch?v=0-vWT-t0UHg:title]
[^sso]: [https://cpplover.blogspot.com/2013/12/c03c11_29.html#:~:text=%E5%A4%89%E6%9B%B4%3A%20Small%2Dstring%20optimization%E3%81%AE%E8%A8%B1%E5%8F%AF:title]
[^sso2]: [https://github.com/melpon/qiita/tree/master/items/stdstring%E3%81%AESSO(Small-string%20optimization)%E3%81%8C%E3%81%A9%E3%81%86%E3%81%AA%E3%81%A3%E3%81%A6%E3%81%84%E3%82%8B%E3%81%8B%E8%AA%BF%E3%81%B9%E3%81%9F:title]

# まとめ

CRuby内部でRubyの値がどのように表現されているかについて解説しました。

また、以下の3つの値の表現に関する高速化技法について紹介しました。

- 即値による数値計算の高速化
- 文字列バッファの共有によるスライス取得の高速化
- 埋め込みバッファによる短い文字列の高速化

# We are hiring!

社外の方も Tech Talk にご参加いただけます。以下ページの「カジュアル面談はこちら」からお申し込みください。

[https://jobs.m3.com/product/:embed:cite]
