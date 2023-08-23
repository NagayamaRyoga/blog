---
title: 【M3 Tech Blog】editorconfig-checkerを導入してコードレビュー時の摩擦を軽減する
publishedAt: 2023-08-23
tags:
    - Editor
    - EditorConfig
    - CI/CD
thumbnail: /blog/images/2023/08/23/tokyo-big-sight.jpg
externalUrl: https://www.m3tech.blog/entry/editorconfig-checker
---

【Unit4 ブログリレー 2日目】

永山です。

2023年に至ってもエディタに関する話題がプログラマ間のグルーミングツールとして機能していることからも判る通り、世には多様なエディタが存在し、またそれらを使用するプログラマが存在します。

言うまでもなく各エディタにはそれぞれ特徴や特色があり、更に異なる人物が同一のエディタを利用していたとしても、各人で設定や導入されているエディタプラグインが千差万別である以上もはや2つと同じ編集環境は存在しないと言っても過言ではありません。

好みのエディタを用いることでプログラマは作業効率の最大化を図れますが、一方で様々な編集環境が同一のコードベースを編集することはときにいくらかの不都合を生じます。

例えば以下のようなエディタの設定に起因する差異は編集時に不要な diff を生じさせ、コードレビューや編集作業のストレスの原因になります。

- 文字コード, BOMの有無
- 改行コード (LF / CRLF)
- インデンテーション (ハードタブ / ソフトタブ + タブ幅)
- ファイル末尾改行の有無
- 行末空白の自動削除の有無

以下、本記事では上記のような編集環境に起因する摩擦の解消に有効なツールである [EditorConfig](https://editorconfig.org/) と [editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker) について紹介します。

<figure class="figure-image figure-image-fotolife" title="東京ビッグサイト会議棟">[f:id:ryoga-nagayama:20230816180701j:plain]<figcaption>本文とは関係ない無意味画像</figcaption></figure>

[:contents]

<!-- more -->


## 1. はじめに

昨今では主要な言語に対してコードフォーマッターが存在していて、CIによってコードが正しくフォーマットされているかを継続的にチェックすることが当たり前となっています。
言語によってはコア機能としてコードフォーマッターが用意されていることも珍しくなくなってきました。

しかしながら、フォーマッターの存在しない言語やプレーンテキストなどの場合にはやはり前述したような設定に揺らぎが発生し得ます。

> - 文字コード, BOMの有無
> - 改行コード (LF / CRLF)
> - インデンテーション (ハードタブ / ソフトタブ + タブ幅)
> - ファイル末尾改行の有無
> - 行末空白の自動削除の有無

これらの差異を放置した場合、後々コードを編集した際に意図しないdiffが発生しコードレビュー時などのノイズになってしまうことがあります。

<figure class="figure-image figure-image-fotolife" title="誰も幸せにならないレビュー指摘">[f:id:ryoga-nagayama:20230815184228p:plain:alt=「末尾改行を追加してください。」というレビューコメント]<figcaption>誰も幸せにならないレビュー指摘</figcaption></figure>

また、この種のコード品質に本質的に寄与しない指摘はレビュー者と被レビュー者の双方にとってつまらないものです。

このような編集環境の差異に起因する問題を解決するためのツールの1つが [EditorConfig](https://editorconfig.org/) です。


## 2. EditorConfig

[EditorConfig](https://editorconfig.org/) は名前の通り「エディタの設定」を記述するiniライクなファイル形式、およびそれの読み込みをサポートするエディタプラグイン群です。

[https://editorconfig.org/:embed:cite]

適切なエディタプラグインを導入して (もしくは EditorConfig にデフォルトで対応しているエディタを使用して)、下記のような `.editorconfig` ファイルを設置したディレクトリ以下のファイルを開くと、自動的にエディタの設定を指定された通りに変更してくれます。

また、Prettierなどの一部のコードフォーマッターは EditorConfig をサポートしており ((https://prettier.io/docs/en/api.html#prettierresolveconfigfilepath--options)) 、`.editorconfig` に従うようにフォーマットに関する設定を自動的に書き換えてくれます。

```yaml
# .editorconfig
root = true
 
[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true # 行末の空白文字を自動削除する
insert_final_newline = true # ファイル末尾に改行を挿入する
 
[*.md]
trim_trailing_whitespace = false # Markdown では行末の空白を削除しない
 
[*.go]
indent_style = tab # Goファイルはハードタブ
indent_size = 4
 
[*.{yaml,yml}]
indent_style = space
indent_size = 2 # YAMLは2スペースでインデント
```

つまり、このように `.editorconfig` を作成し、リポジトリに配置するだけでプロジェクトに参画する全員のエディタの設定を統一できます。**とはなりません**。

何故ならば EditorConfig を組み込みでサポートしているエディタは少数で、VSCodeを含む多くのエディタでは適切なプラグインを導入する必要があるためです。

プラグインを導入していない素のVSCodeやVimで編集してしまっては `.editorconfig` ファイルはなんの意味も持ちません。

そこで、EditorConfig の導入を促すなんらかの仕組みが必要になります。その手段となるのが [editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker) です。

## 3. editorconfig-checker

[editorconfig-checker](https://github.com/editorconfig-checker/editorconfig-checker) は、ファイルが EditorConfig に従って保存されているかを検査するGo製のCLIツールです。

[https://github.com/editorconfig-checker/editorconfig-checker:embed:cite]

### 使用方法

プロジェクトのルートディレクトリで `editorconfig-checker` コマンドを実行するだけでそのディレクトリ以下の全てのファイルが自動的にチェックされます。

```sh
$ editorconfig-checker
a.ts:
        Wrong line endings or new final newline
b.ts:
        3: Trailing whitespace
        6: Wrong amount of left-padding spaces(want multiple of 2)

3 errors found
```

### 無視設定

場合によって、機械生成されたコードなど一部のファイルをチェックから除外したい場合があります。

そのような場合は、ドキュメントの [Excluding Files](https://github.com/editorconfig-checker/editorconfig-checker#excluding-files) セクションにある通り `.ecrc` というファイルの `.Exclude` フィールドに除外するファイルのパターンを追加します。

```json
// .ecrc
{
  "Exclude": [
    "^src/generated/"
  ]
}
```

ただし、 `.Exclude` に指定できるパターンはglobではなく正規表現であるため注意が必要です。

### GitLab CI への導入

エムスリー社内の一部のプロジェクトではこの editorconfig-checker を CI に組み込んで利用しています。

GitLab CI を利用する場合、以下のようにCIジョブを定義することで簡単に editorconfig-checker による継続的検査を実現できます。

```yaml
# .gitlab-ci.yml
editorconfig-checker:
  image: centos:latest
  variables:
    EC_VERSION: 2.7.0 # バージョンの指定 (省略可能)
    OS: linux
    ARCH: amd64
  script:
    - if [[ -n "$EC_VERSION" ]]; then download="download/${EC_VERSION}"; else download="latest/download"; fi
    - curl -L -C - "https://github.com/editorconfig-checker/editorconfig-checker/releases/${download}/ec-${OS}-${ARCH}.tar.gz" | tar zxv
    - mv "./bin/ec-${OS}-${ARCH}" /usr/local/bin/editorconfig-checker
    - editorconfig-checker
```

また、このジョブを以下の記事のようにテンプレート化することでプロジェクトへの導入を簡単にしています。

- [https://docs.gitlab.com/ee/development/cicd/templates.html:title]
- [https://www.m3tech.blog/entry/2022/06/13/142100:title]
- [https://www.m3tech.blog/entry/2023/01/01/120000:title]


```yaml
# .gitlab-ci.yml
# CIテンプレートの読み込み
include:
  - project: m3/ci-templates
    file: editorconfig-checker/editorconfig-checker.yml

# テンプレートを利用してジョブを定義
editorconfig-checker:
  extends: .editorconfig-checker
```

## 4. まとめ

editorconfig-checker を導入することで、コードが EditorConfig に従って書かれていることを継続的に保証できます。

それによって、コードの作成者やレビュアーはコードに関する本質的な議論に集中できるようになります。

一方で、 editorconfig-checker を導入する場合は同時にドキュメントなどを通じてチームメンバーに対して EditorConfig に関する啓蒙とエディタプラグインなどの導入方法の案内を行いましょう。

## 参考文献

[https://srz-zumix.blogspot.com/2019/03/editorconfig.html:embed:cite]

editorconfig-checker に関しての注意点と、代替ツールである [eclint](https://github.com/jednano/eclint) ((eclint は現在 public archived)) について紹介されています。

## We're hiring!

エムスリーでは開発体験の向上に取り組むエンジニアを募集しています。 興味を持たれた方は下記よりお問い合わせください。

[https://jobs.m3.com/product/:embed:cite]
