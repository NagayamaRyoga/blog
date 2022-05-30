---
title: 【M3 Tech Blog】dotfilesのこだわりを晒す
publishedAt: 2022-05-11
tags:
    - dotfiles
    - Shell
    - Zsh
thumbnail: /blog/images/2022/05/11/navi.png
externalUrl: https://www.m3tech.blog/entry/dotfiles-bonsai
---

Unit4の永山です。
dotfiles弄りを趣味にしています。

世にdotfilesを題材とした記事は数多く存在していますがその大半は「dotfilesを作ってみた」「こうやって管理しています」などの表層的な部分の紹介に留まり、その奥にあるべき細部のこだわりや個人の思想にまで踏み込んだ記事は数えるほどしかありません。

そこで、本記事では私のdotfilesを題材にその各構成要素について**オススメ**, **TIPS**, **こだわり**に分類し、可能な限り詳細に紹介します。

[https://github.com/NagayamaRyoga/dotfiles:cite:embed]

本記事は筆者の関心の都合上、Zshに関する項目に大きく比重を置いています。ご承知おきください。

[:contents]

<!-- more -->

# dotfilesとは

*nixのソフトウェアには、慣例的に`.`から始まるファイルに設定を記述するものが多く存在しています。

- Bash: `.bashrc`, `.bash_profile` など
- Git: `.gitconfig` 
- Vim: `.vimrc`
- etc...

dotfilesはこれらの`.`から始まる設定ファイル全般を指し、また、これらの設定ファイルを管理するリポジトリをdotfilesリポジトリと呼びます。
一般に、単にdotfilesといった場合はこのdotfilesリポジトリを意味することが多いです (以下、dotfilesリポジトリを単にdotfilesと表記します)。

余談ですが、dotfilesを育てたり剪定したりする感覚が盆栽の育成に近いことから、dotfilesを弄ることを指して「dotfiles盆栽」と表現されることがあります。

# dotfilesを作成することの利点

dotfilesを作成することには以下のような利点があります。

- 設定ファイルの変更履歴を残せる
- 複数のマシンで同じ開発体験が得られるようになる
- 新規マシンのセットアップが簡単になる

# 記事の構成

以下の節では筆者のdotfilesをもとに様々な項目について詳細に解説します ((筆者の [dotfiles](https://github.com/NagayamaRyoga/dotfiles) は macOS および Ubuntu 20.04 (on WSL2) を前提としていますが、CLIに関する大半の項目は他の環境でも適用できるはずです。))。

各項目には性質に応じて以下のいずれかのプリフィクスをつけています。

- **[オススメ]**: 従うことでなんらかの利益が得られる項目
- **[TIPS]**: ささいな利益が得られる項目、または小ネタ
- **[こだわり]**: 筆者の思想やこだわりが強く反映された項目

# Zsh編

ログインシェルにはZshを用いています。
以下ではZshの設定に関して紹介します。

## [オススメ] プラグインの管理にZinitを使う

Zshのプラグインマネージャには [Antigen](https://github.com/zsh-users/antigen) や [zplug](https://github.com/zplug/zplug) がありますが、基本的に [Zinit](https://github.com/zdharma-continuum/zinit) を用いるのがオススメです。

[https://github.com/zdharma-continuum/zinit:embed:cite]

Zinitは実行速度に優れたプラグインマネージャです。
また、プラグインの非同期読み込みに対応しており、後述するように適切にプラグインの読み込みを最適化することでZshの起動時間を非常に短くできます。

さらに特筆すべき機能として、GitHub Releasesからのプラグインのインストールに対応しています。
そのため、GitHub Releasesでプリビルトバイナリを配布しているGoやRust製のCLIツールを他のZshプラグインと同じように扱えます。

<figure class="figure-image" style="text-align: left">

```zsh
zinit wait lucid light-mode as'program' from'gh-r' for \
    pick'ripgrep*/rg' @'BurntSushi/ripgrep'
```

<figcaption>Rust製のツール [ripgrep](https://github.com/BurntSushi/ripgrep) をGitHub Releasesからインストールする例</figcaption></figure>

Zinitを利用する利点と欠点を以下にまとめます。

- 利点
  - 高速に動作する
  - プラグインを非同期読み込みできる
  - GitHub Releasesからのインストールに対応している
- 欠点
  - オプションなどの指定方法がやや複雑

### 注釈: Zinitについて

上記の3つの利点のために、この記事ではZinitをオススメしていますが、2022年現在Zinitを取り巻く状況はやや不安定です。
その経緯についてかいつまんで説明します。

Zinit はもともと Zplugin ([zdharma/zplugin](https://github.com/zdharma/zplugin) (リンク先は削除済み)) という名前で開発されていましたが、2020年1月頃に Zinit ([zdharma/zinit](https://github.com/zdharma/zinit)) へと改名されました。
その後も、[zdharma/zinit](https://github.com/zdharma/zinit) リポジトリで開発が続けられましたが、2021年10月に作者である[@psprint](https://github.com/psprint)氏が突如Zinitのリポジトリと[zdharma](https://github.com/zdharma) organizationを削除しました。

上記で紹介している [zdharma-continuum/zinit](https://github.com/zdharma-continuum/zinit) は有志によって復旧された最もポピュラーなZinitのForkで、Zinitユーザのコミュニティにより現在も開発が続けられています。

現在の [zdharma](https://github.com/zdharma) organizationと [zdharma/zinit](https://github.com/zdharma/zinit)、およびそこにリンクが記載されている [z-shell/zi](https://github.com/z-shell/zi) (こちらもZinitのFork) は第三者により再取得されたもので元作者である[@psprint](https://github.com/psprint)氏とは無関係です((https://github.com/z-shell/zi/discussions/138))。
[zdharma-continuum/zinit](https://github.com/zdharma-continuum/zinit) と [z-shell/zi](https://github.com/z-shell/zi) の中身はどちらもほぼ同一ですが、個人的な感情から [z-shell/zi](https://github.com/z-shell/zi) ではなく [zdharma-continuum/zinit](https://github.com/zdharma-continuum/zinit) の利用をオススメしています。

また、速度や機能面に対してのこだわりが薄いのであれば [zimfw/zimfw](https://github.com/zimfw/zimfw) など他のプラグインマネージャの利用を視野にいれるとよいでしょう。

## [オススメ] Zshプラグインは非同期読み込みする

Zinitでは、プラグインの読み込み時に `wait` オプションを指定することでプラグインの読み込みを非同期にできます。

プラグインの読み込みを非同期にすると、Zsh初期化時のオーバヘッドが小さくなり、起動の高速化に繋がります。

<figure class="figure-image" style="text-align: left">

```zsh
zinit wait lucid blockf light-mode for \
    @'zsh-users/zsh-autosuggestions' \
    @'zsh-users/zsh-completions' \
    @'zdharma-continuum/fast-syntax-highlighting'
```

<figcaption>Zshプラグインを非同期読み込みする例</figcaption></figure>

ただし、シェルプロンプトは同期的に読み込む必要があります。
これは、同期的に読み込まなければプロンプトの初回のレンダリングが行えないためです。

- シェルプロンプト: 同期的に読み込む
- それ以外: 非同期的に読み込む

## [オススメ] `.zshrc` に書く設定は最小限に留め、その他を遅延させる

筆者の [`.zshrc`](https://github.com/NagayamaRyoga/dotfiles/blob/main/config/zsh/.zshrc) を見ると、`.zshrc` ではZinitの初期化やプロンプトの読み込みなどのみを行っていることがわかると思います。

[https://github.com/NagayamaRyoga/dotfiles/blob/main/config/zsh/.zshrc:embed:cite]

その他のプラグインの読み込みや、エイリアスの登録などは [`.zshrc.lazy`](https://github.com/NagayamaRyoga/dotfiles/blob/main/config/zsh/.zshrc.lazy) という別ファイルに分割し、その読み込みを遅延させることで起動時間をさらに短くしています。

<figure class="figure-image" style="text-align: left">

```zsh
# $ZDOTDIR/.zshrc
zinit wait lucid light-mode as'null' \
    atinit'source "$ZDOTDIR/.zshrc.lazy"' \
    for 'zdharma-continuum/null'
```

<figcaption>`.zshrc.lazy` を非同期で読み込んでいる例</figcaption></figure>

上記で用いている[`zdharma-continuum/null`](https://github.com/zdharma-continuum/null) は遅延実行を実現するために用意されている空のリポジトリです。

では、`.zshrc.lazy` の遅延読み込みの有無でどの程度起動速度に差がでるのか見てみましょう。

まずは遅延読み込みを無効化した場合の例です。

<figure class="figure-image" style="text-align: left">

```zsh
# $ZDOTDIR/.zshrc
#zinit wait lucid light-mode as'null' \
#    atinit'source "$ZDOTDIR/.zshrc.lazy"' \
#    for 'zdharma-continuum/null'
source "$ZDOTDIR/.zshrc.lazy"
```

```zsh
$ for i in {1..5}; do time zsh -ic exit; done
zsh -ic exit  0.07s user 0.04s system 93% cpu 0.111 total
zsh -ic exit  0.07s user 0.04s system 93% cpu 0.110 total
zsh -ic exit  0.07s user 0.04s system 94% cpu 0.107 total
zsh -ic exit  0.07s user 0.04s system 93% cpu 0.108 total
zsh -ic exit  0.07s user 0.04s system 94% cpu 0.113 total
```

<figcaption>`.zshrc.lazy`を遅延読み込みしなかった場合のZshの起動時間</figcaption></figure>

続いて`.zshrc.lazy` を遅延読み込みした場合です。

<figure class="figure-image" style="text-align: left">

```zsh
$ for i in {1..5}; do time zsh -ic exit; done
zsh -ic exit  0.02s user 0.01s system 84% cpu 0.033 total
zsh -ic exit  0.02s user 0.01s system 82% cpu 0.038 total
zsh -ic exit  0.02s user 0.01s system 84% cpu 0.033 total
zsh -ic exit  0.02s user 0.01s system 85% cpu 0.033 total
zsh -ic exit  0.02s user 0.02s system 86% cpu 0.037 total
```

<figcaption>`.zshrc.lazy`を遅延読み込みした場合のZshの起動時間</figcaption></figure>

起動時間が約1/3になっています。

Shellは1日に何度も起動することになるアプリケーションであるため、起動速度の差は開発体験に直結してきます。

## [オススメ] BSD系CLIツールをGNU系に置き換える (macOS)

macOSにデフォルトでインストールされているCLIツールには歴史的経緯からBSD系のものが採用されています。

BSD系のCLIツールはコマンドラインオプションや一部の動作がGNU系と異なっており、しばしば混乱の原因になります。

一方で、現代のシェルスクリプトは多くの場合CIやDockerコンテナ内などのGNU系CLIツールがインストールされているLinux上で動作します。

ローカル環境もGNU系CLIツールで統一することで、開発時のいらぬストレスを軽減できます。

<figure class="figure-image" style="text-align: left">

```zsh
# GNU系のCLIツールをインストールする
$ brew install coreutils findutils gnu-sed grep

# .zshrc.lazy
case "$OSTYPE" in
    darwin*)
        (( ${+commands[gdate]} )) && alias date='gdate'
        (( ${+commands[gls]} )) && alias ls='gls'
        (( ${+commands[gmkdir]} )) && alias mkdir='gmkdir'
        (( ${+commands[gcp]} )) && alias cp='gcp'
        (( ${+commands[gmv]} )) && alias mv='gmv'
        (( ${+commands[grm]} )) && alias rm='grm'
        (( ${+commands[gdu]} )) && alias du='gdu'
        (( ${+commands[ghead]} )) && alias head='ghead'
        (( ${+commands[gtail]} )) && alias tail='gtail'
        (( ${+commands[gsed]} )) && alias sed='gsed'
        (( ${+commands[ggrep]} )) && alias grep='ggrep'
        (( ${+commands[gfind]} )) && alias find='gfind'
        (( ${+commands[gdirname]} )) && alias dirname='gdirname'
        (( ${+commands[gxargs]} )) && alias xargs='gxargs'
    ;;
esac
```

<figcaption>基本的なコマンドをGNU系ツールに置き換える例</figcaption></figure>

## [TIPS] 不要なコマンドをhistoryから除外する

Zshでは、`zshaddhistory` というhookを定義することでhistoryへのコマンドの登録/除外を制御できます。

`zshaddhistory` の終了ステータスが`0`の場合、直前のコマンドはhistoryに保存され、`0`以外の場合はhistoryから除外されます。

`cd` や `ls` などは多くの場合historyに保存しても役に立たないので除外しています。

<figure class="figure-image" style="text-align: left">

```zsh
zshaddhistory() {
    local line="${1%%$'\n'}"
    [[ ! "$line" =~ "^(cd|jj?|lazygit|la|ll|ls|rm|rmdir)($| )" ]]
}
```

<figcaption>`zshaddhistory`を用いて一部のコマンドをhistoryから除外する例</figcaption></figure>

## [こだわり] `$ZDOTDIR` を変更する

通常 `.zshrc` などはホームディレクトリに配置されたものが読み込まれますが、`$ZDOTDIR` という環境変数を変更することで任意のディレクトリに配置できるようになります。

`$ZDOTDIR` を変更する場合は `.zshenv` というファイルをホームディレクトリに作成します。

<figure class="figure-image" style="text-align: left">

```zsh
# ~/.zshenv
export XDG_CONFIG_HOME="$HOME/.config"
export ZDOTDIR="$XDG_CONFIG_HOME/zsh" # .zshrc や .zprofile が ~/.config/zsh から読み込まれるようになる
```

<figcaption>`$ZDOTDIR` を変更する例</figcaption></figure>

筆者は[XDG Base Directory Specification](https://wiki.archlinux.jp/index.php/XDG_Base_Directory)に従う形で`$ZDOTDIR`を設定しています。

XDG Base Directory Specificationは設定ファイルやキャッシュファイルを配置するディレクトリの構造に関する規約です((現在では[fish shell](https://fishshell.com/)、[Git](https://git-scm.com/)、[Neovim](https://neovim.io/)をはじめとする様々なソフトウェアがXDG Base Specificationに準拠しています。))。
XDG Base Directory Specificationに従うことでホームディレクトリを整理でき、また、設定ファイルなどを一箇所に集約できるため管理がしやすくなります。

# Zshプラグイン編

以下では使用しているZshプラグインのうちいくつかについて紹介・解説します。

現在、筆者は以下のようなZshプラグイン(またはCLIツール)をZinitを用いてインストールして利用しています((私は[cli/cli](https://github.com/cli/cli)などのZshプラグインではないいくつかのCLIツールもZinitを用いてインストールしています。これは、Homebrewなどのパッケージマネージャを経由せずGitHub Releasesからバイナリを直接ダウンロードすることでOS間の差分を少なくできるためです。))。


<details><summary>Zinitを用いて導入しているZshプラグイン・CLIツール</summary>

- [zsh-users/zsh-history-substring-search](https://github.com/zsh-users/zsh-history-substring-search)
- [hlissner/zsh-autopair](https://github.com/hlissner/zsh-autopair)
- [mafredri/zsh-async](https://github.com/mafredri/zsh-async)
- [zsh-users/zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
- [zsh-users/zsh-completions](https://github.com/zsh-users/zsh-completions)
- [zdharma-continuum/fast-syntax-highlighting](https://github.com/zdharma-continuum/fast-syntax-highlighting)
- [momo-lab/zsh-replace-multiple-dots](https://github.com/momo-lab/zsh-replace-multiple-dots)
- [yuki-yano/zeno.zsh](https://github.com/yuki-yano/zeno.zsh)
- [wfxr/forgit](https://github.com/wfxr/forgit)
- [dandavison/delta](https://github.com/dandavison/delta)
- [itchyny/mmv](https://github.com/itchyny/mmv)
- [BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)
- [Ryooooooga/almel](https://github.com/Ryooooooga/almel)
- [dbrgn/tealdeer](https://github.com/dbrgn/tealdeer)
- [asdf-vm/asdf](https://github.com/asdf-vm/asdf)
- [cli/cli](https://github.com/cli/cli)
- [ogham/exa](https://github.com/ogham/exa)
- [mikefarah/yq](https://github.com/mikefarah/yq)
- [rhysd/hgrep](https://github.com/rhysd/hgrep)
- [denisidoro/navi](https://github.com/denisidoro/navi)
- [mrowa44/emojify](https://github.com/mrowa44/emojify)

</details>

## [オススメ] zeno.zsh

[zeno.zsh](https://github.com/yuki-yano/zeno.zsh)は[Deno](https://deno.land/)製のZshプラグインです。

[https://github.com/yuki-yano/zeno.zsh:embed:cite]

[https://zenn.dev/yano/articles/zsh_plugin_from_deno:embed:cite]

zeno.zshは **略語展開** と **FZFを用いた補完** という2つの機能を提供します。

### 1. 略語展開

略語展開は自動展開されるaliasのような機能です (Vimmerにとっては`iab`と言った方が通じやすいかもしれせん)。

<figure class="figure-image" style="text-align: left">

```yaml
# $XDG_CONFIG_HOME/zeno/config.yml
snippets:
  - name: g
    keyword: g
    snippet: git

  - name: yyyymmdd
    keyword: yyyymmdd
    snippet: date "+%Y%m%d"
    evaluate: true # snippetをシェルスクリプトとして解釈し、その出力を展開する
    global: true # 行頭以外でも展開する (Zshのglobal alias相当)
```

```zsh
$ g<スペース>
   ↓ 即座に展開される
$ git

$ git tag yyyymmdd<エンター>
   ↓ 展開され、実行される
$ git tag 20220401
```

<figcaption>zeno.zshの略語展開の例</figcaption></figure>

略語展開では、通常のaliasとは異なり、展開後のコマンドがhistoryに保存されるという利点があります。

略語展開のみであれば、[olets/zsh-abbr](https://github.com/olets/zsh-abbr) などのZshプラグインでも実現できますが、zeno.zshではさらに展開に必要なコンテキストを指定することができます。

<figure class="figure-image" style="text-align: left">

```yaml
snippets:
  - name: git c
    keyword: c
    snippet: commit
    context:
      lbuffer: ^git\s # gitコマンドを入力しているときのみ展開する

  - name: git push -f
    keyword: -f
    snippet: --force-with-lease
    context:
      lbuffer: ^git(\s+\S+)*\s+push\s # git pushを入力しているときのみ展開する
```

```zsh
$ git c<スペース>
   ↓ 展開される
$ git commit

$ git push -f<エンター>
   ↓ 展開され、実行される
$ git push --force-with-lease

$ echo c<スペース>
   ↓ 展開されない
$ echo c
```

<figcaption>コンテキストを指定した略語展開の例</figcaption></figure>

コンテキストを指定できることで、global alias自体の利便性・有用性を保ったままグローバル名前空間の汚染を避けることができます ((様々なdotfilesを覗くと alias gs='git status' などのGitサブコマンドをaliasに登録しているのをよく見かけますが、Ghost Script (gs) をはじめとするコマンドと衝突するためあまり好みではありません。 )) 。

また、Git aliasとは異なり、historyに展開後のコマンドが保存される点でも優れています。

### 2. FZFを用いた補完

[FZF](https://github.com/junegunn/fzf) はGo製のファジーファインダーです。

zeno.zshでは任意のコマンドに対する、FZFを用いたインタラクティブな補完をカスタマイズできます ((FZFを用いた補完を実現しているZshプラグインとして [chitoku-k/fzf-zsh-completions](https://github.com/chitoku-k/fzf-zsh-completions) などがありますが、zeno.zshはYAMLを用いて任意のコマンドに対する補完を記述できるという点でよりカスタマイズ性に優れています。))。
また、デフォルトで`git-add`などのいくつかのGitコマンドなどに対する補完が組み込まれているため、ある程度設定不要でその恩恵を受けることができます。

<figure class="figure-image figure-image-fotolife" title="zeno.zsh組み込みの &#x60;git-add&#x60; のファジー補完">[f:id:ryoga-nagayama:20220329155717p:plain]<figcaption>zeno.zsh組み込みの `git-add` のファジー補完</figcaption></figure>

zeno.zshは実行にDenoのランタイムを要求しますが、作業を効率化できるため非常にオススメできるZshプラグインです。

筆者のその他のzeno.zshの設定については以下で確認できます。

[https://github.com/NagayamaRyoga/dotfiles/blob/main/config/zeno/config.yml:embed:cite]

※ zeno.zshは [zsh-users/zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) との相性が悪いため、代わりに [zdharma-continuum/fast-syntax-highlighting](https://github.com/zdharma-continuum/fast-syntax-highlighting) を使用することをオススメします。

## [オススメ] zsh-replace-multiple-dots

[momo-lab/zsh-replace-multiple-dots](https://github.com/momo-lab/zsh-replace-multiple-dots)は入力された `...` を `../..` へと展開するだけのシンプルなプラグインです。

<figure class="figure-image" style="text-align: left">

```zsh
$ cd ...
   ↓ 展開される
$ cd ../..
```

<figcaption>zsh-replace-multiple-dots の展開の例</figcaption></figure>

[https://github.com/momo-lab/zsh-replace-multiple-dots:embed:cite]

[https://qiita.com/momo-lab/items/523fc83fbfa39fa5fd60:embed:cite]

上述の[zeno.zsh](https://github.com/yuki-yano/zeno.zsh)と組み合わせることで、`...<エンター>` と入力するだけで `cd ../..` に展開されるようにしています ((Zshの setopt AUTO_CD を使う手もありますが、好みの問題で有効化していません。))。

<figure class="figure-image" style="text-align: left">

```yaml
snippets:
  - name: ..
    keyword: ..
    snippet: cd ..

  - name: ../..
    keyword: ../..
    snippet: cd ../..

  - name: ../../..
    keyword: ../../..
    snippet: cd ../../..
```

<figcaption>zsh-replace-multiple-dots と zeno.zsh を組み合わせる場合の `zeno/config.yml` の例</figcaption></figure>

また、`go test ./...` などと入力したときに `go test ./../..` と展開されるのを防ぐため、以下のようにZLEウィジェットを再登録することで `go` コマンドのみ `...` の展開を防いでいます。

<figure class="figure-image" style="text-align: left">

```zsh
replace_multiple_dots_exclude_go() {
    if [[ "$LBUFFER" =~ '^go ' ]]; then
        zle self-insert # goコマンドのみ通常通り `.` を入力する
    else
        zle .replace_multiple_dots # goコマンド以外では `...` を `../..` に展開
    fi
}

zle -N .replace_multiple_dots replace_multiple_dots
zle -N replace_multiple_dots replace_multiple_dots_exclude_go
```

<figcaption>`go` コマンドのみ zsh-replace-multiple-dots を無効化する例</figcaption></figure>

## [オススメ] コードスニペットの管理に navi を利用する

特に業務ではDBへのアクセスコマンドやプロジェクトの起動コマンドなどの雑多で小規模なコマンドを何度も入力することになります。

一方でそれらをすべて正確に、長期間に渡って記憶するのは現実的ではありませんが、忘れるたびにプロジェクトのREADMEをgrepするのも手間です。

このような場合に `history` からの検索を用いる方もいると思いますが、私はこのようなコードスニペットの管理に [denisidoro/navi](https://github.com/denisidoro/navi) を使用することをオススメします。

[https://github.com/denisidoro/navi:embed:cite]

naviはCLIのチートシート管理ツールです。
独自形式のテキストファイルでコードスニペットのチートシートを管理でき、[FZF](https://github.com/junegunn/fzf)などのファジーファインダーを用いてそれらの検索や実行が行なえます。

<figure class="figure-image figure-image-fotolife" title="naviによって管理されたチートシートの検索の様子">[f:id:ryoga-nagayama:20220329155552p:plain]<figcaption>naviによって管理されたチートシートの検索の様子</figcaption></figure>

naviを用いてコードスニペットを管理することで、`history` の上限超えなどによって以前に実行したコマンドが蒸発することを気にしなくてよくなる他、作成したチートシートを小規模な個人用のドキュメントとしても活用できます。

# Zsh小ネタ編

以下ではその他のZshに関する小ネタについて紹介します。

## [TIPS] `PATH`環境変数ではなく `path` を使う

Bashでは特定のディレクトリにPATHを通すために環境変数 `PATH` を使用しますが、Zshではこれに加えて配列変数 `path` も用意されています。

<figure class="figure-image" style="text-align: left">

```zsh
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

$ echo ${(F)path}
/usr/local/bin
/usr/bin
/bin
/usr/sbin
/sbin
```

<figcaption>Zshの配列変数 `path`</figcaption></figure>

`path` を用いると、"特定のディレクトリが存在しているときのみ、そのディレクトリを `PATH` に追加する" といったことが簡単に、読みやすく書けます。

<figure class="figure-image" style="text-align: left">

```zsh
# `$GOPATH/bin` が存在する場合のみ `PATH` に追加する
path=(
    "$GOPATH/bin"(N-/)
    "$path[@]"
)
```

<figcaption>配列変数 `path` へディレクトリを追加する例</figcaption></figure>

また、`FPATH` に対応した変数として `fpath` も用意されています。

## [TIPS] `docker` コマンドを上書きする

GitはGit aliasや `git-foo` という名前の実行可能ファイルに対してPATHを通すことでカスタムサブコマンドを定義することができますが、Dockerではそのようなことはできません。

そこで、私は以下のように `docker` コマンドを上書きしています。

<figure class="figure-image" style="text-align: left">

```zsh
docker() {
    if [ "$1" = "compose" ] || ! command -v "docker-$1" >/dev/null; then
        command docker "${@:1}" # 通常通りdockerコマンドを呼び出す
    else
        "docker-$1" "${@:2}" # docker-foo というコマンドが存在するときはそちらを起動する
    fi
}
```

<figcaption>カスタムサブコマンドを実現するための上書きされた `docker` コマンド</figcaption></figure>

<figure class="figure-image" style="text-align: left">

```zsh
# docker clean
# ExitedなDockerプロセスをすべて削除する
docker-clean() {
    command docker ps -aqf status=exited | xargs -r docker rm --
}
# docker cleani
# UntaggedなDockerイメージをすべて削除する
docker-cleani() {
    command docker images -qf dangling=true | xargs -r docker rmi --
}
# docker rm (上書き)
# 引数なしで docker rm したときはプロセスをFZFで選択して削除する
docker-rm() {
    if [ "$#" -eq 0 ]; then
        command docker ps -a | fzf --exit-0 --multi --header-lines=1 | awk '{ print $1 }' | xargs -r docker rm --
    else
        command docker rm "$@"
    fi
}
# docker rmi (上書き)
# 引数なしで docker rmi したときはイメージをFZFで選択して削除する
docker-rmi() {
    if [ "$#" -eq 0 ]; then
        command docker images | fzf --exit-0 --multi --header-lines=1 | awk '{ print $3 }' | xargs -r docker rmi --
    else
        command docker rmi "$@"
    fi
}
```

<figcaption>カスタム `docker` サブコマンドの例</figcaption></figure>

これによって、「組み込みコマンドのときは `docker foo`」「カスタムコマンドのときは `docker-bar`」 などの呼び分けを気にする必要がなくなります。

# Git編

## [オススメ] リポジトリをghqで管理する

特に業務ではたくさんのGitリポジトリで作業をする必要が発生しがちです。
そのような場合に [x-motemen/ghq](https://github.com/x-motemen/ghq) を用いることで、リポジトリの管理を効率化できます。

[https://github.com/x-motemen/ghq:embed:cite]

ghq はGitリポジトリ((正確にはSubversionなどのGit以外のVCSにも対応しています。))を管理するためのシンプルなツールです。

<figure class="figure-image" style="text-align: left">

```zsh
# $(ghq root)/github.com/NagayamaRyoga/dotfiles に
# https://github.com/NagayamaRyoga/dotfiles をクローンする
$ ghq get NagayamaRyoga/dotfiles

$ ls -al "$(ghq root)/github.com/NagayamaRyoga/dotfiles"
total 40
drwxr-xr-x  11 ryoga.nagayama  staff   352 Mar 11 18:36 .
drwxr-xr-x   3 ryoga.nagayama  staff    96 Mar 11 18:36 ..
-rw-r--r--   1 ryoga.nagayama  staff   416 Mar 11 18:36 .editorconfig
drwxr-xr-x  13 ryoga.nagayama  staff   416 Mar 11 18:36 .git
...
```

<figcaption>ghq を用いてGitHubリポジトリをクローンする例</figcaption></figure>

<figure class="figure-image" style="text-align: left">

```zsh
# ghqで管理されているすべてのリポジトリを一括で更新する
$ ghq list | ghq get --update --parallel
```

<figcaption>ghq で管理されているすべてのリポジトリを一括で更新する例</figcaption></figure>

ghq の基本的な利用方法については以下のドキュメントが詳しいです。

[https://github.com/Songmu/ghq-handbook:embed:cite]

ghq とTmuxやZLEと合わせて利用することでリポジトリの切り替えなどを劇的に効率化できます。
ghq の活用例については [[こだわり] セッションをリポジトリごとに分ける](#tmux-session) の節で紹介します。

## [TIPS] XDG Base Directory Specificationに従う

通常Gitは `~/.gitconfig` をグローバルな設定ファイルとして用いますが、GitはXDG Base Directory Specificationに準拠しているため、`$XDG_CONFIG_HOME/git/config` も同様にグローバルな設定ファイルとして利用できます。

```zsh
$ mv ~/.gitconfig "$XDG_CONFIG_HOME/git/config"
```

また、`$XDG_CONFIG_HOME/git/ignore` をグローバルな `.gitignore` として利用できるため、`git config core.excludesfile '~/.gitignore_global'` などとわざわざ明示的に指定する必要はありません。

```diff
 # $XDG_CONFIG_HOME/git/config
-[core]
-    excludesfile = ~/.gitignore_global
```

## [こだわり] `.gitconfig` を分割する

`$XDG_CONFIG_HOME/git/config` にすべての設定を記述するとごちゃつきがちです。

トピックごとに設定を分割することで設定の編集や確認がしやすくなります。

<figure class="figure-image" style="text-align: left">

```toml
[include]
    path = conf.d/alias.conf
    path = conf.d/user.conf
    path = conf.d/delta.conf
    path = conf.d/flow.conf
    path = conf.d/forgit.conf
    path = conf.d/ghq.conf
    path = conf.d/gist.conf
    path = conf.d/github.conf
    path = conf.d/local.conf
```

<figcaption>`$XDG_CONFIG_HOME/git/config` を分割する例</figcaption></figure>

`include.path` はその設定の書かれているファイルの相対パスを指定できるため、この場合 `$XDG_CONFIG_HOME/git/conf.d/*.conf` を読み込んでいることになります。

## [オススメ] `commit.verbose` に `true` を設定する

`git config commit.verbose true` とすることで `git commit` に常に `-v`/`--verbose` オプションを渡しているのと同様の動作になります。

[https://git-scm.com/docs/git-commit#Documentation/git-commit.txt--v:embed:cite]

## [オススメ] `merge.conflictStyle` に `diff3` を設定する

`git config merge.conflictStyle diff3` とすることでマージコンフリクトが発生した際に、マージ元・マージ先のみでなくマージベース (両ブランチの共通の先祖) もコンフリクトマーカーに追加されるようになります。

<figure class="figure-image figure-image-fotolife" title="&#x60;merge.conflictStyle&#x60; に &#x60;diff3&#x60; を指定した場合のマージコンフリクト">[f:id:ryoga-nagayama:20220329160812p:plain]<figcaption>`merge.conflictStyle` に `diff3` を指定した場合のマージコンフリクト</figcaption></figure>

これによって、マージ時に「以前はどのような状態であったか」がわかりやすくなります。

[https://git-scm.com/docs/git-config#Documentation/git-config.txt-mergeconflictStyle:embed:cite]

# Tmux編

## [こだわり] XDG Base Directory Specificationに従う

Tmux 3.2以降では `$XDG_CONFIG_HOME/tmux/tmux.conf` を設定ファイルとして利用できます。

```zsh
$ mv ~/.tmux.conf "$XDG_CONFIG_HOME/tmux/tmux.conf"
```

<h2 id="tmux-session">[こだわり] セッションをリポジトリごとに分ける</h2>

筆者はシェルを使う際は基本的にほぼすべての作業をTmuxセッションの中で行っていますが、その際、Gitリポジトリごとにセッションを立てるようにしています。

セッションを分けることで、リポジトリごとに作業状況や起動しているプロセスを維持できるため、別リポジトリでの作業からの復帰が簡単になります。

Tmuxセッションの起動・アタッチ・切り替えには以下のようなZLEウィジェットを使用しています。

<figure>

```zsh
# Gitリポジトリを列挙する
widget::ghq::source() {
    local session color icon green="\e[32m" blue="\e[34m" reset="\e[m" checked="\uf631" unchecked="\uf630"
    local sessions=($(tmux list-sessions -F "#S" 2>/dev/null))

    ghq list | sort | while read -r repo; do
        session="${repo//[:. ]/-}"
        color="$blue"
        icon="$unchecked"
        if (( ${+sessions[(r)$session]} )); then
            color="$green"
            icon="$checked"
        fi
        printf "$color$icon %s$reset\n" "$repo"
    done
}
# GitリポジトリをFZFで選択する
widget::ghq::select() {
    local root="$(ghq root)"
    widget::ghq::source | fzf --exit-0 --preview="fzf-preview-git ${(q)root}/{+2}" --preview-window="right:60%" | cut -d' ' -f2-
}
# FZFで選択されたGitリポジトリにTmuxセッションを立てる
widget::ghq::session() {
    local selected="$(widget::ghq::select)"
    if [ -z "$selected" ]; then
        return
    fi

    local repo_dir="$(ghq list --exact --full-path "$selected")"
    local session_name="${selected//[:. ]/-}"

    if [ -z "$TMUX" ]; then
        # Tmuxの外にいる場合はセッションにアタッチする
        BUFFER="tmux new-session -A -s ${(q)session_name} -c ${(q)repo_dir}"
        zle accept-line
    elif [ "$(tmux display-message -p "#S")" = "$session_name" ] && [ "$PWD" != "$repo_dir" ]; then
        # 選択されたGitリポジトリのセッションにすでにアタッチしている場合はGitリポジトリのルートディレクトリに移動する
        BUFFER="cd ${(q)repo_dir}"
        zle accept-line
    else
        # 別のTmuxセッションにいる場合はセッションを切り替える
        tmux new-session -d -s "$session_name" -c "$repo_dir" 2>/dev/null
        tmux switch-client -t "$session_name"
    fi
    zle -R -c # refresh screen
}
zle -N widget::ghq::session

# C-g で呼び出せるようにする
bindkey "^G" widget::ghq::session
```

<figcaption>FZFで選択したGitリポジトリにTmuxセッションを立ち上げるZLEウィジェット</figcaption></figure>

このZLEウィジェットは、ghqで管理されているGitリポジトリをFZFを用いて選択し、

1. Gitリポジトリに対応するTmuxセッションが存在しない場合は新しくセッションを起動し、アタッチする
2. Gitリポジトリに対応するTmuxセッションが存在する場合はそのセッションにアタッチする
3. すでにGitリポジトリに対応するTmuxセッションにアタッチしている場合はGitリポジトリのルートディレクトリに移動する

という動作を行います。

<figure class="figure-image figure-image-fotolife" title="&#x60;widget::ghq::select&#x60; ウィジェットによってGitリポジトリを選択している様子">[f:id:ryoga-nagayama:20220509153715p:plain]<figcaption>&#x60;widget::ghq::select&#x60; ウィジェットによってGitリポジトリを選択している様子</figcaption></figure>

上図の緑色の行はGitリポジトリに対応するTmuxセッションがすでに立ち上がっていることを表しています。

## [オススメ] lazygitを呼び出すキーバインドを設定する

[jesseduffield/lazygit](https://github.com/jesseduffield/lazygit) はTUIのGitクライアントで、CLIからグラフィカルにGitを操作できます。
類似のツールに[tig](https://github.com/jonas/tig)や[gitui](https://github.com/extrawurst/gitui)がありますが、デフォルトのレイアウトやキーバインディングが好みなためlazygitを主に利用しています。

[https://github.com/jesseduffield/lazygit:embed:cite]

以下のようにTmuxのキーバインディングを設定することで、Tmuxのpopup windowを用いて任意の操作中にlazygitを呼び出せるようにしています。

<figure class="figure-image" style="text-align: left">

```sh
# $XDG_CONFIG_HOME/tmux/tmux.conf
bind g popup -w90% -h90% -E lazygit # (prefix) gでlazygitを起動する
```

[f:id:ryoga-nagayama:20220329161051p:plain]

<figcaption>Tmuxのpopup windowでlazygitを起動している様子</figcaption></figure>

popup windowを用いることで、Tmuxのペインを分割している場合でも全画面に近いサイズでlazygitを起動できます。
また、時間のかかるコマンドを実行している最中に手早くファイルのステージングやコミットなどの操作を行うことができるため、非常に重宝しています。

# mac編

## [オススメ] macOSの設定を `defaults` コマンドでコードとして管理する

macOSでは `defaults` コマンドを用いて一部の設定をコードとして管理できます。
設定をGit管理することで、異なるmacOSマシン間の設定の差異を小さくできます。

<figure class="figure-image" style="text-align: left">

```zsh
# セットアップスクリプト

# Dock
defaults write com.apple.dock orientation right
defaults write com.apple.dock autohide -bool false
defaults write com.apple.dock tilesize -int 50
defaults write com.apple.dock magnification -bool false
defaults write com.apple.dock show-recents -bool false

# Mission Control
defaults write com.apple.dock wvous-br-corner -int 4 # 画面右下にカーソルを移動するとデスクトップを表示する
defaults write com.apple.dock mru-spaces -bool false # ワークスペースの順序をMRUにしない

killall Dock
```

<figcaption>`defaults` コマンドを使用して設定を更新する例</figcaption></figure>

## [オススメ] スニペット入力ツールを使用する

業務・趣味に限らず、同じテキストを頻繁に入力しなければならない場面は多数存在します。
例えばユーザIDやメールアドレスは日常的に入力する機会があるでしょう。

そのような文字列の入力にはスニペット入力ツールを使用すると良いでしょう ((スニペット入力ツールにパスワードを登録するのは避けましょう。))。
筆者の場合、業務で使用しているmacOSでは[Dash](https://kapeli.com/dash)のスニペット機能を、趣味のmacOSには[Espanso](https://espanso.org/)を使用しています。

<figure class="figure-image" style="text-align: left">

```txt
スニペット    テキスト
--------    ----------------------
;id         NagayamaRyoga
;mail       XXXXXX@example.com
;gh         github.com
;m3id       ryoga-nagayama
;oha        おはようございます
;owa        終わります。お疲れさまでした
;review     U4コードレビュー担当
```

<figcaption>業務PCに登録しているスニペットの例(("U4コードレビュー担当"というのはSlack上でコードレビュー担当者を割り当てるためのカスタムレスポンスのトリガーです([参考](https://www.m3tech.blog/entry/2022/03/29/110206))。))</figcaption></figure>

# その他

## [こだわり] ホームディレクトリの掃除

前節まででXDG Base Directory Specificationに従うように`.zshrc`, `.gitconfig`, `.tmux.conf`などのファイルをホームディレクトリから移動してきました。

筆者はホームディレクトリに置かれるファイルの数は少なければ少ないほどよいと考えています((ホームディレクトリはいわば部屋における床面です。物を散らかすのであれば棚の中や机の上がふさわしいでしょう。))。
というわけで、以下ではホームディレクトリに作成されるファイルを掃除していきます。

### `~/.zsh_history`

`.zsh_history` は `HISTFILE` 環境変数で保存先を変更できます。

```zsh
# $ZDOTDIR/.zshrc
export HISTFILE="$XDG_STATE_HOME/zsh_history"
```

`XDG_STATE_HOME` (`~/.local/state`) は近年XDG Base Directory Specificationに追加されたディレクトリで、ログやヒストリーファイルを保存するのに適したディレクトリです。

[https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html:embed:cite]

### `~/.node_repl_history`, `~/.sqlite_history`, `~/.mysql_history`, `~/.psql_history`

これらはそれぞれ `NODE_REPL_HISTORY`, `SQLITE_HISTORY`, `MYSQL_HISTORY`, `PSQL_HISTORY` 環境変数を設定することで保存先を変更できます。

```zsh
# $ZDOTDIR/.zshrc.lazy
export NODE_REPL_HISTORY="$XDG_STATE_HOME/node_history"
export SQLITE_HISTORY="$XDG_STATE_HOME/sqlite_history"
export MYSQL_HISTFILE="$XDG_STATE_HOME/mysql_history"
export PSQL_HISTORY="$XDG_STATE_HOME/psql_history"
```

### `~/.irb_history`

`.irb_history` は `IRBRC` 環境変数で指定される設定ファイル内で保存先を変更できます。

```zsh
# $ZDOTDIR/.zshrc.lazy
export IRBRC="$XDG_CONFIG_HOME/irb/irbrc"
```

```ruby
# $IRBRC
xdg_state_home = ENV['XDG_STATE_HOME'] || "#{ENV['HOME']}/.local/state"
IRB.conf[:HISTORY_FILE] = "#{xdg_state_home}/irb_history"
```

### `~/go`

Goの作業ディレクトリは `GOPATH` 環境変数で変更できます。

```zsh
# $ZDOTDIR/.zshrc.lazy
export GOPATH="$XDG_DATA_HOME/go"
```

ここで挙げたソフトウェア以外についても[ArchWikiのサポートセクション](https://wiki.archlinux.jp/index.php/XDG_Base_Directory#.E3.82.B5.E3.83.9D.E3.83.BC.E3.83.88)にXDG Base Directory Specificationのサポート状況や、非準拠のものにおける回避方法などがまとめられています。

# まとめ

筆者のdotfilesをもとに、オススメの設定やこだわりについて紹介しました。
今後このようなこだわりについて語る記事が増えてくれると嬉しいです。

# We are hiring!

エムスリーでは強いこだわりを持ったエンジニアを募集しています。
興味を持たれた方は下記よりお問い合わせください。

[https://jobs.m3.com/product/:embed:cite]
