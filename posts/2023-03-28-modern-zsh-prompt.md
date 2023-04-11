---
title: 【M3 Tech Blog】高機能なZshプロンプトを自作する ーモダンなシェルプロンプトを構成する工夫ー
publishedAt: 2023-03-28
tags:
    - Zsh
    - Shell
    - Go
thumbnail: /blog/images/2023/03/28/jargon.png
externalUrl: https://www.m3tech.blog/entry/modern-zsh-prompt
---

永山です。

普段から趣味PC、業務PCの双方で Zsh をログインシェルとして利用しています。
エムスリー社内には [fish](https://fishshell.com) や、少数ながら [Xonsh](https://xon.sh) のユーザも存在していますが、多くのエンジニアがZshを使用しています ((エンジニアに支給されるPCは基本的にmacOSであるため))。

Zsh は fish 等に比べデフォルトで有効な機能が少なく、カスタマイズが必要である点でやや玄人志向といえます。
一方で自由度・拡張性が高くプラグイン等も潤沢である点と、このコンテナ時代では重要なPOSIX shとの高い互換性を背景に Zsh の人気は根強いものとなっています。
macOS Catalina 以降では Zsh がデフォルトのログインシェルに採用されたこともあり、今後も Zsh のユーザ数は増加していくでしょう。

ところで、Zsh の機能のうち最もよく目にするものは何でしょうか?
文字通り目視が可能な機能に限定するであれば、それは間違いなくシェルプロンプトでしょう。

しかし、Zsh のデフォルトのシェルプロンプトは非常に簡素であり、機能的にも貧弱です。

<figure class="figure-image figure-image-fotolife" title="Zsh デフォルトのシェルプロンプト (非常に質素)">[f:id:m3tech:20230328103002p:plain]<figcaption>Zsh デフォルトのシェルプロンプト (非常に質素)</figcaption></figure>

そこで、シェルプロンプトにより多くの情報を、よりグラフィカルに、より視認性高く表示できれば普段シェル上で行っている作業をより効率化できるのではないでしょうか。

以下、本記事では高機能なZshプロンプトを作成する方法とそれを支える種々の工夫について解説します。

題材として作成したZshプロンプトのプロジェクトは以下のリポジトリで公開しています。

<figure class="figure-image figure-image-fotolife" title="作成した高機能Zshプロンプト">[f:id:m3tech:20230328103005p:plain]<figcaption>作成したZshプロンプト</figcaption></figure>

[https://github.com/NagayamaRyoga/jargon:embed:cite]

[:contents]

<!-- more -->

## シェルプロンプトとは

"プロンプト" はユーザからのコンピュータに対する入力を促す記号のことです。"シェルプロンプト" はそのままシェルのプロンプトであり、デフォルトで表示される Zsh のシェルプロンプトは以下のような形式をしています。

```
ユーザ名@ホスト名 カレントディレクトリ % 
```

しかしながら、これは非常にシンプルであり、お世辞にもあまり有用とは言えません。また、視認性も良くないためコマンドの出力にプロンプトが埋もれてしまい、プロンプトの位置が (つまりコマンドの実行位置が) わからなくなってしまうこともしばしばです。

そこで、シェルプロンプトに以下のような開発に有用な情報を、グラフィカルに表示できればより開発効率が向上するのではないでしょうか？

- 直前のコマンドの終了ステータス, 実行時間
- Gitブランチ名
- Git status
- Pull Request, Merge Request の情報
- etc...

実際に上記や、その他の情報を出力可能なシェルプロンプトは多く開発され、公開されています。

[https://github.com/topics/shell-prompt:title]

## 既存の高機能シェルプロンプト

この節では、既存の知名度の高いZshプロンプトについて簡単に紹介します。

### agnoster.zsh-theme

agnoster.zsh-theme は、いわゆるPowerline系の老舗Zshプロンプトです。

<figure class="figure-image figure-image-fotolife" title="agnoster.zsh-theme (READMEより)">[f:id:m3tech:20230328103008p:plain]<figcaption>agnoster.zsh-theme (READMEより引用)</figcaption></figure>

[https://github.com/agnoster/agnoster-zsh-theme:embed:cite]

機能性はシンプルながら、Powerlineフォントによるグラフィカルなデザインは [bobthefish](https://github.com/oh-my-fish/theme-bobthefish) などの後発のシェルプロンプトに大きな影響を与えました。

### starship

[starship](https://github.com/starship/starship) は、おそらく現在最も有名なシェルプロンプトの1つです。
Rustによって実装されており、Bash, ZshのみでなくFishやPowerShellなどもサポートしています。

<figure class="figure-image figure-image-fotolife" title="starship (READMEより引用)">[f:id:m3tech:20230328103011p:plain]<figcaption>starship (READMEより引用)</figcaption></figure>

[https://github.com/starship/starship:embed:cite]

豊富な機能とTOMLファイルによるカスタマイズが可能な点が特徴です。

### Powerlevel10k

[Powerlevel10k](https://github.com/romkatv/powerlevel10k) はコアなZshユーザに人気のシェルプロンプトです。

<figure class="figure-image figure-image-fotolife" title="Powerlevel10k (READMEより引用)">[f:id:m3tech:20230328103015p:plain]<figcaption>Powerlevel10k (READMEより引用)</figcaption></figure>

[https://github.com/romkatv/powerlevel10k:embed:cite]

非同期描画 (後述) に対応しており、高い機能性と即応性を両立している完成度の高いシェルプロンプトです。
初回起動時に対話形式で柔軟なカスタマイズが可能です。

## 作成したシェルプロンプト

以下が今回作成したZshプロンプト jargon のリポジトリです。

[https://github.com/NagayamaRyoga/jargon:embed:cite]

本体はGoによって記述されており、非同期描画に対応しています。見た目は agnoster.zsh-theme に強く影響を受けています (以前は agnoster.zsh-theme をforkして使用
していたため)。

以下にそれぞれのシェルプロンプトの比較を表形式でまとめます。

|      | 対応シェル | 実装言語 | 機能性 | カスタマイズ性 | 非同期描画 |
|:----:|:--------:|:--------:|:---------|:-------------|:----------|
| **agnoster.zsh-theme** | Zsh | Zsh | △ | △ |   |
| **starship** | Bash, Zsh, Fish, ... | Rust | ◎ | ○ |   |
| **Powerlevel10k** | Zsh | Zsh | ◎ | ○ | ○ |
| **jargon** | Zsh | Go | ○ | × | ○ |


## Zshプロンプトの作成方法

以下の節ではZshプロンプトの作成方法について段階的に解説していきます。

### 基本

Zshプロンプトは `PROMPT` 環境変数によって変更できます。

```zsh
# .zshrc
PROMPT="(ΦωΦ) $ "
```

<figure class="figure-image figure-image-fotolife" title="ZshプロンプトはPROMPT環境変数によって変更できる">[f:id:m3tech:20230328103018p:plain]<figcaption>ZshプロンプトはPROMPT環境変数によって変更できる</figcaption></figure>

Gitブランチなどの、実行ごとに出力が変化する可能性のある情報を表示する場合、Zshの `precmd` フック内で `PROMPT` を設定すると良いです。

```zsh
# .zshrc
# エンターキーが押されるたびに実行される処理
prompt_precmd() {
  local branch="$(git branch --show-current)"
  PROMPT="(ΦωΦ) [${branch}] $ "
}

# precmd フックを登録する
autoload -Uz add-zsh-hook
add-zsh-hook precmd prompt_precmd
```

<figure class="figure-image figure-image-fotolife" title="Gitブランチ等を表示する場合はprecmdフックを利用する">[f:id:m3tech:20230328103020p:plain]<figcaption>Gitブランチ等を表示する場合はprecmdフックを利用する</figcaption></figure>

### 色

デフォルト色の文字列を表示するだけでは味気ないので、プロンプトを色付けしてみましょう。
文字色や背景色、文字のスタイルを変更するには、通常のCLIアプリケーションと同様に [ANSI escape code](https://en.wikipedia.org/wiki/ANSI_escape_code) を使用します。

ただし、Zshプロンプトに特有のお約束として、エスケープコードは `%{`, `%}` という文字列で囲わなければなりません (囲わなかった場合、表示崩れやカーソル位置のずれの原因になります)。

```zsh
# .zshrc
prompt_precmd() {
  local magenta=$'\e[35m' cyan=$'\e[36m' reset=$'\e[m'
  local branch="$(git branch --show-current)"
  PROMPT="%{${magenta}%}(ΦωΦ)%{${reset}%} [%{${cyan}%}${branch}%{${reset}%}] $ "
}
```

<figure class="figure-image figure-image-fotolife" title="プロンプトはANSI escape codeによって着色できる">[f:id:m3tech:20230328103023p:plain]<figcaption>プロンプトはANSI escape codeによって着色できる</figcaption></figure>

### Nerd Fonts

シェルプロンプトをよりリッチな見た目にしたい場合、[Nerd Fonts](https://www.nerdfonts.com/) を用いてアイコンを描画してみると良いでしょう。

Nerd Fonts は Unicode の Private Use Area (私用領域・外字領域) に様々なアイコン画像を含んだパッチフォントです。
現在では [exa](https://github.com/ogham/exa) や [lazygit](https://github.com/jesseduffield/lazygit) などの様々なCLIアプリケーションがNerd Fontsに対応しています。

```zsh
# .zshrc
prompt_precmd() {
  local magenta=$'\e[35m' cyan=$'\e[36m' reset=$'\e[m'
  local branch_icon=$'\ue725' # Nerd Fonts のブランチアイコン
  local branch="${branch_icon} $(git branch --show-current)"
  PROMPT="%{${magenta}%}(ΦωΦ)%{${reset}%} [%{${cyan}%}${branch}%{${reset}%}] $ "
}
```

<figure class="figure-image figure-image-fotolife" title="Nerd Fontsによってアイコンを表示できる　">[f:id:m3tech:20230328103026p:plain]<figcaption>Nerd Fontsによってアイコンを表示できる　</figcaption></figure>

見た目が華やかになってきたのではないでしょうか。

### 問題点1: 書き心地

このようにどんどんと `prompt_precmd` に処理を追加していくことでプロンプトをよりリッチなものにできますが、一方で可読性やメンテナンス性の低いシェルスクリプトで複雑な処理を書くことには苦痛が伴います。
そのため、大抵の人はある程度複雑になった時点でより書き慣れた言語で実装したいと感じることでしょう。

ところで、これまで見てきたように `PROMPT` は単なる文字列です。
そのため、適切なプロンプト文字列を出力できるのであればシェルスクリプト以外の言語を用いて実装しても問題ありません。

```zsh
prompt_precmd() {
  # PROMPT文字列が出力できるのであれば好きな言語で実装してよい
  PROMPT="$(jargon prompt)"
}
```

上述したstarshipや、今回作成したjargonはそれぞれRust、Goを用いて実装されています。

### 問題点2: 即応性

また、機能の追加に伴って異なる問題も顕在化してきます。
それがプロンプトの即応性の低下です。

プロンプトにGitに関する情報を表示するには `git branch` や `git status` のような外部コマンドを実行する必要がありますが、このようなコマンドはファイルシステムへのアクセスが必要なため通常低速です (特に `git status` を巨大なリポジトリ内で実行すると数百msほどの時間を要してしまう場合もあります)。

シェルプロンプトは `precmd` フックが完了するまで描画されないため、即応性が低下するとエンターキーを押下するごとに遅延が発生し入力体験が悪化してしまいます。

以降の節ではこの即応性に関する問題を解決するための工夫について解説します。

### プロンプトの非同期描画

先に紹介したように、Powerlevel10k などのいくつかのプロンプトは非同期描画に対応することで即応性と機能性を両立しています。

これらはGitステータスなどの実行に時間の掛かるセグメントを除外した簡易的なプロンプトを同期的に描画したあとで、完全なプロンプトを非同期に表示することで実現されています。

<figure class="figure-image figure-image-fotolife" title="非同期プロンプトの仕組み">[f:id:m3tech:20230328103028p:plain]<figcaption>即応性を向上させる非同期プロンプトの仕組み</figcaption></figure>

非同期的なシェルスクリプトの実行には [zpty](https://zsh.sourceforge.io/Doc/Release/Zsh-Modules.html#The-zsh_002fzpty-Module) と呼ばれるZsh組み込みの疑似ターミナル機能を利用します。
また、zptyをより扱いやすくラッピングしたライブラリとして [zsh-async](https://github.com/mafredri/zsh-async) があります。

zsh-async を用いた単純な非同期プロンプトの実装例を以下に示します。

```zsh
prompt_precmd() {
  # 簡易的なプロンプトを描画する
  PROMPT="$(jargon prompt --instant)"
  # 非同期に本番プロンプトを描画するzptyを起動する
  async_stop_worker prompt_async_worker
  async_start_worker prompt_async_worker -n
  async_register_callback prompt_async_worker prompt_async_callback
  async_job prompt_async_worker prompt_async_prompt
}

# precmdフックを登録する
autoload -Uz add-zsh-hook
add-zsh-hook precmd prompt_precmd

# zptyで非同期にプロンプトを描画する処理
# ここでPROMPT環境変数に代入するのではなく、標準出力に出力する
prompt_async_prompt() {
  # 本番のプロンプトを描画する
  jargon prompt
}

# zptyの処理 (prompt_async_prompt) が終了したときに呼び出される処理
# 第3引数 ($3) に prompt_async_prompt の標準出力が渡される
prompt_async_callback() {
  # PROMPT環境変数を更新する
  PROMPT="$3"
  # プロンプトを再描画する
  zle reset-prompt
}
```

### 2行以上の `RPROMPT`

Zshでは `RPROMPT` 環境変数を設定することで画面の右側にも情報を表示できます。
しかし `PROMPT` が2行以上である場合、`RPROMPT` は `PROMPT` の開始行ではなく入力カーソルの表示される位置 (つまり `PROMPT` の最終行) に表示されてしまいます。

<figure class="figure-image figure-image-fotolife" title="2行以上のプロンプトの場合, カーソルのある行にRPROMPTが表示されてしまう">[f:id:m3tech:20230328103031p:plain]<figcaption>2行以上のプロンプトの場合, カーソルのある行にRPROMPTが表示されてしまう</figcaption></figure>

また、表示が崩れてしまうため `RPROMPT` 内で改行などのカーソル位置を変える制御文字やANSI escape codeは使用できません。

そこで、jargonでは右側の1行目に表示したいコンテンツの文字列幅と画面の幅から表示位置を調整した文字列を `PROMPT` に含め、それと `RPROMPT` と併用することで擬似的に複数行の `RPROMPT` を実現しています。

<figure class="figure-image figure-image-fotolife" title="jargonでは画面幅に合わせてPROMPTを描画することで擬似的に複数行のRPOMPTを実現している">[f:id:m3tech:20230328103034p:plain]<figcaption>jargonでは画面幅に合わせてPROMPTを描画することで擬似的に複数行のRPROMPTを実現している</figcaption></figure>

## まとめ

シェルプロンプトはターミナルという制約の中で限られた時間・空間を効率的に使用し、見栄えよく情報を提示することが求められる特異なアプリケーションです。

本記事ではその実現のために現代のZshプロンプトが行っている種々の工夫を紹介しました。

シェルプロンプトをこだわり抜くことで趣味・業務を問わず日々の開発はより豊かで効率的なものになります。
また、今回サンプル実装として用意したjargonはあくまで個人的な局所解であり、決して誰もが日々使用して満足できるものではありません ((jargonはあえて環境変数や設定ファイルなどのカスタマイズの手段を一切用意しませんでした))。
そのため、ぜひ皆さんの理想を反映した自分だけのプロンプトを自作してみてください。

## We are hiring!

エムスリーでは強いこだわりを持ったエンジニアを募集しています。
興味を持たれた方は下記よりお問い合わせください。

[https://jobs.m3.com/product/:embed:cite]
