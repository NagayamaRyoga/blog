---
title: 【M3 Tech Blog】Rubyの値はどう表現されるか (クイズもあるよ)
publishedAt: 2022-03-04
tags:
    - C
    - コンパイラ
thumbnail: /blog/images/2022/03/04/implicit-cast.png
externalUrl: https://www.m3tech.blog/entry/2022/03/04/110000
---

新卒の永山です。

エムスリーでは隔週金曜日に Tech Talk という社内勉強会を実施しています。
[エムスリー公式テックチャンネル 【M3 Tech Channel】](https://www.youtube.com/channel/UC_DkAOcwgmtQnJLDctci4rQ) では過去の発表のアーカイブを公開しています。

<!-- [https://www.youtube.com/channel/UC_DkAOcwgmtQnJLDctci4rQ:embed:cite] -->

今回は上記YouTubeチャンネルに公開されている私の過去の発表について紹介いたします。

[https://www.youtube.com/watch?v=mB1_kb_oFS4:embed:cite]

[:contents]

<!-- more -->

## 概要

C/C++のポインタや、ポインタに関する演算子である `&`演算子 と `*`演算子 について、コンパイラの実装の観点から論じることで通常とは異なる解釈を与える試みについての発表です。

コンパイラにおけるコード生成時のポインタの扱いにフォーカスし、右辺値・左辺値との関係について解説しています。

## 余談

発表中に少し触れましたが、左辺値のうちには代入演算子の左辺に置けないものがあります。

代入演算子の左辺に置けない左辺値の例:

- `const` 修飾された型を持つ変数: `const int a; a` / `int *const p; p`
- 配列変数: `int array[1]; array`
- 関数: `void f(void); f`
- 文字列リテラル: `"hello"`

これらに対する単項`&`演算子は合法なため、例えば文字列リテラルに対して`&`演算子を適用こともできます。

```c
char (*p)[6] = &"hello";
```

## まとめ

Clangを題材に、Cコンパイラにおけるコード生成の工夫と、そこから導かれる左辺値とポインタの関係について解説しました。

普段プログラムを書く際、型については意識しても左辺値/右辺値について深く考えることは少ないのではないでしょうか？

## We are hiring!

社外の方も Tech Talk にご参加いただけます。以下ページの「カジュアル面談はこちら」からお申し込みください。

[https://jobs.m3.com/product/:embed:cite]
