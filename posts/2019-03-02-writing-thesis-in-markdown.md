---
title: 卒業論文をMarkdownで書く
publishedAt: 2019-03-02
tags:
    - Markdown
    - LaTeX
    - Pandoc
---

## はじめに

卒業論文に限らず、論文や技術文書とLaTeXは切り離すことができません。

しかしながら、TeXをそのまま書くのは面倒なので可能な限りMarkdownなどの軽量な文書形式で記述できると嬉しいですね。

そこでMarkdownからLaTeXを経由してPDFを生成するポータブルな環境を構築しました。

[https://github.com/NagayamaRyoga/recipro](https://github.com/NagayamaRyoga/recipro)

これの技術的な構成要素について簡単に説明します。

## 構成要素

### Pandoc

[Pandoc](https://pandoc.org/)はWord、LaTeX、Markdownなどの異なる文書形式間を変換するためのアプリケーションです。
上記のプロジェクトではこれに加え、ラベルなどの参照のためにPandocのプラグイン、[pandoc-crossref](http://lierdakil.github.io/pandoc-crossref/)を併用しています。

### pLaTeX

Pandocは単独でpdfLaTeXやLuaLaTeXを使ったPDF出力機能を有していますが、pdfLaTeXは日本語に対応していません。
また、使用する文書テンプレートがLuaLaTeXでのビルドに対応していなかったため今回はMarkdownから一度TeXファイルに変換し、それをpLaTeXでビルドするようにしています。

### Shellスクリプト

句読点からドット・カンマへの置換などの単純な前処理にはShellスクリプトを利用しています。

また、CSV・TSV形式の表をそのまま文書内に埋め込めるようにそれらのファイルをTeX形式に変換するのにも、同じくShellスクリプトを利用しています。
(表の埋め込みにははじめ `csvsimple` パッケージを使用していたのですが、自由度が低かったため変換された表ファイルを `\input` で読み込むようにしました)

### Makefile

ビルドプロセス全体の制御にはMakefileを利用しています。

可読性に難があるものの、柔軟さや汎用性の高さ、環境構築のしやすさを鑑みてMakefileを採用しました。

### textlint

文書の校正、表記ゆれなどの自動チェックに[textlint](https://github.com/textlint/textlint)を活用しています。
また、precommitフックにtextlintを登録することで文章の誤りや誤字がリポジトリにコミットされる可能性を軽減しています。

使用しているtextlintルールは[.textlintrc](https://github.com/NagayamaRyoga/recipro/blob/master/.textlintrc)を参照してください。

### Docker

Dockerイメージを作成して環境差を吸収し、LaTeX環境の揃っていないマシンでも論文の執筆ができるようにしました。

### CircleCI

GitHubリポジトリへのpushをフックし、自動的にビルドと校正が走るようにしました。
CIの結果はWebhookを通じてSlackに通知されます。

また、masterブランチにpushされた場合は[slackcat](http://slackcat.chat/)というアプリケーションのコマンドをCIから叩くことで、成果物のPDFを同じくSlackへ投げるようにしました。

これにより、複数の異なるPCはもちろんスマートフォンなどの端末からも常に最新のPDFファイルが参照できるようになったため、卒業論文提出直前には非常に役立ちました。

## 結び

Markdownのみで論文が書けるようになりました。

レポートなどを提出する際には以前からPandocやtextlintの利用していたのですが、今回はそれに加えてDockerイメージの作成、CIによる自動ビルドを試みました。

効率化、自動化は論文自体の質の向上にもつながるため、これからもこのような試みを継続していきたいです。
