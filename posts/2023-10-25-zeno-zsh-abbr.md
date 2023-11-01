---
title: 【M3 Tech Blog】zeno.zsh を活用して Node.js パッケージマネージャの違いを吸収する
publishedAt: 2023-10-25
tags:
    - dotfiles
    - Shell
    - Zsh
    - Deno
# thumbnail: /blog/images/2023/10/25/zeno-zsh-abbr.jpg
externalUrl: https://www.m3tech.blog/entry/zeno-zsh-abbr
---

永山です。

神話の時代、[天を衝く巨塔](https://babeljs.io/)を築こうとした高慢な人類の Node.js パッケージマネージャは様々に引き裂かれたと言われています。
現代においてよく使用されているものだけでも [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/) などがあり、エムスリー社内でもプロジェクトによってどのパッケージマネージャが採用されているかはバラバラです。

それぞれのパッケージマネージャは異なるコマンドラインインタフェース (`npm` / `yarn` / `pnpm`) によって操作する必要があるため、作業するプロジェクトによって適切なコマンドを呼び分けなければなりません。めんどくさ。

本記事では Zsh プラグインである [zeno.zsh](https://github.com/yuki-yano/zeno.zsh) を用いてこれらパッケージマネージャの差異を吸収することで快適な開発体験を実現する方法、およびその過程で模索した zeno.zsh の設定ファイルの TypeScript 化の試みについて紹介します。

[:contents]

<!-- more -->

## zeno.zsh について

[zeno.zsh](https://github.com/yuki-yano/zeno.zsh) は [Deno](https://deno.land/) 製の Zsh プラグインです。

[https://github.com/yuki-yano/zeno.zsh:embed:cite]

[https://zenn.dev/yano/articles/zsh_plugin_from_deno:embed:cite]

zeno.zshは 略語展開 (Abbrev snippet) と FZFを用いた補完 (Fuzzy completion) という2つの機能を提供します。
それぞれの詳細やインストール方法については [zeno.zsh の README](https://github.com/yuki-yano/zeno.zsh) や 上記[記事](https://zenn.dev/yano/articles/zsh_plugin_from_deno)を参照してください。

また、[本ブログの過去記事](https://www.m3tech.blog/entry/dotfiles-bonsai#%E3%82%AA%E3%82%B9%E3%82%B9%E3%83%A1-zenozsh)でも簡単に紹介を行っております。

[https://www.m3tech.blog/entry/dotfiles-bonsai#%E3%82%AA%E3%82%B9%E3%82%B9%E3%83%A1-zenozsh:embed:cite]

以下では zeno.zsh の機能のうち、略語展開 に焦点を合わせその活用方法について紹介します。

## Node.js パッケージマネージャの違いによる消耗

前述の通り、開発時はプロジェクトで採用している Node.js パッケージマネージャによって適切なコマンドを呼び分けなければなりません。

```sh
# このプロジェクトは pnpm で管理されている
$ ls
node_modules  src  package.json  pnpm-lock.yaml

# 手癖で呼ぶコマンドを間違えた
$ npm install react
^C
$ pnpm install react
```

複数のプロジェクトを切り替えつつ作業するような場合は、それらで採用されているパッケージマネージャについて正しく記憶して (もしくは都度確認して) コマンドを呼び分けねばなりません。
このことが作業をする上で少なからず苦痛になっていきます。

そこで、zeno.zsh の 略語展開 を活用することでこのような消耗を避けることができます。

## evaluateの活用

略語展開の設定の `evaluate` を `true` にすると展開時に任意のコマンドを実行でき、その標準出力を略語の展開結果として利用できます。

```yaml
# $ZENO_HOME/config.yml
snippets:
  - name: yyyymmdd
    keyword: yyyymmdd
    snippet: date "+%Y%m%d"
    evaluate: true # snippetをコマンドとして解釈し、その出力を展開する
    context: { global: true } # 行頭以外でも展開する (Zshのglobal alias相当)
```

```sh
$ git tag yyyymmdd<エンター>
   ↓ 展開され、実行される
$ git tag 19700101
```

この機能を利用し、 `npm` と入力された際に `npm` / `yarn` / `pnpm` から適切なコマンドに展開されるようにしてみます。

```yaml
# $ZENO_HOME/config.yml
snippets:
  - name: npm
    keyword: npm
    snippet: zsh -c "$HOME/.config/zeno/scripts/package-manager.ts"
    evaluate: true
```

上記のように設定すると `npm<SP>` と入力されたときに、 `$HOME/.config/zeno/scripts/package-manager.ts` に設置されたスクリプトの出力に置き換えられるようになります。
(`evaluate: true` のとき `snippet` の内容に対し Deno のプロセス内で引数の分割と実行 (`Deno.run()`) が行われます。そのためパイプライン処理や環境変数の展開などを行いたい場合、この例のように `zsh -c "..."` としなければなりません。)

拡張子が `.ts` であることからわかるように今回は zeno.zsh のランタイムとして要求される Deno を利用し、 TypeScript を用いてこのスクリプトを実装しました。

```typescript
#!/usr/bin/env -S deno run --allow-read
// ~/.config/zeno/scripts/package-manager.ts

import { dirname } from "https://deno.land/std/path/mod.ts";

const detectPackageManager = async (cwd: string) => {
  const packageManagers = [
    { name: "npm", lockFile: "package-lock.json" },
    { name: "yarn", lockFile: "yarn.lock" },
    { name: "pnpm", lockFile: "pnpm-lock.yaml" },
  ];

  for (let dir = cwd;;) {
    for (const { name, lockFile } of packageManagers) {
      try {
        const info = await Deno.lstat(`${dir}/${lockFile}`);
        if (info.isFile) {
          return name;
        }
      } catch (_err) {
        // ignore
      }
    }

    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  return "npm";
};

console.log(await detectPackageManager(Deno.cwd()));
```

上記のスクリプトでは現在のディレクトリから親ディレクトリを順にたぐり、最初に出現したlockファイルの種類を用いてパッケージマネージャを推定しています。

```sh
# このプロジェクトは pnpm で管理されている
$ ls
node_modules  src  package.json  pnpm-lock.yaml

# 何も考えず npm でOK
$ npm install react
  ↓ 展開
$ pnpm install react
```

これによりパッケージの種類に関わらず常に `npm` とタイプすれば良くなりました。

## contextを利用したサブコマンドの展開

しかしながら、各CLIにはそれぞれコマンドやフラグなどに差異があります。
例えば、npm/pnpm を用いて依存ライブラリを導入する際は `npm install` / `pnpm install` サブコマンドを使用しますが、Yarn の場合には `yarn add` を呼び出さなければなりません。

このような違いの吸収にも略語展開は有用です。

```yaml
# $ZENO_HOME/config.yml
snippets:
  - name: yarn i
    keyword: i
    snippet: add
    context: { lbuffer: '^yarn\s' } # yarnコマンドの入力中のみ展開される

  - name: npm i
    keyword: i
    snippet: install
    context: { lbuffer: '^(npm|pnpm)\s' } # npm/pnpmコマンドの入力中のみ展開される
```

```sh
$ yarn i
  ↓ 展開される
$ yarn add

$ npm i
  ↓ 展開される
$ npm install
```

上記のように `context` で展開に必要な文脈を指定することで特定のコマンドの入力中にのみ展開される略語を定義できます。

`context` は以下のような型を持つオブジェクトで `buffer` / `lbuffer` / `rbuffer` はそれぞれ正規表現として解釈されます。
それぞれはZLEによって定義される変数 `$BUFFER` (現在の入力内容全体) / `$LBUFFER` (現在の入力内容のうちカーソルより左にある文字列) / `$RBUFFER` (カーソルより右の文字列) と比較され、全てがマッチする場合のみzeno.zshはsnippetを展開します ((lbuffer 以外を指定することはそうそうありません ))。

```typescript
// https://github.com/yuki-yano/zeno.zsh/blob/7d2500a830290f9b4cbca7203e8e30f177bd3187/src/type/settings.ts#L12
type Context = {
    global?: boolean;
    buffer?: string;
    lbuffer?: string;
    rbuffer?: string;
}
```

## npm-scriptsの展開と設定の動的生成

`npm` では npm-scripts の実行に `run` サブコマンドを使用します。

```sh
$ cat package.json
{
  "scripts": {
    "lint": "eslint"
  }
}

$ npm run lint
> eslint
...
```

`yarn` や `pnpm` も同様の `run` サブコマンドを持ちますが、`run` を省略しても scripts を実行してくれます (( [https://yarnpkg.com/cli/run:title], [https://pnpm.io/ja/cli/run:title] ))。

```sh
$ npm lint # run が必須
Unknown command: "lint"

$ yarn lint # run は省略可能
>yarn run v...
>$ eslint

$ pnpm lint # run は省略可能
> eslint
```

`yarn` や `pnpm` でも常に `run` を使用するように癖を付けても良いのですが、せっかくなので `npm` でも `run` を省略できればより便利です。

### 頻出する npm-scripts の略語を登録する

さてこのような場合最初に思いつくのは、頻繁に使用する npm-scripts をコンテキスト付きの略語として登録することです。

```yaml
# $ZENO_HOME/config.yml
snippets:
  # よく使用する npm-scripts
  - name: npm run fmt
    keyword: fmt
    snippet: run fmt
    context: { lbuffer: '^npm\s+\S+$' } # npm fmt のみ展開する
```

```sh
$ npm fmt
  ↓ 展開
$ npm run fmt
```

ですが、プロジェクトごとにscriptsの名前が微妙に異なっていたり (例: `fmt`/`format`, `lint`/`eslint`) 、特定のプロジェクトでのみ頻繁に使用するscriptsが存在していたりしたときにそれらをいちいち全て登録するのは骨が折れます。

そのため存在している全てのnpm-scriptsを略語として登録できないかを考えました。

###  zeno.zsh の設定を動的に生成する

そこで、Zshの起動時とカレントディレクトリの移動時 (`chpwd` フック) に `package.json` を元にzeno.zshの設定ファイル `$ZENO_HOME/config.yaml` を動的に生成することを試みました((.zshrc内で使用している mktemp はGNUとBSDで動作が異なりますが mktemp -d -t zeno.XXXXXX と書けば両方で動作します。 ))。

```diff
 # .zshrc
-export ZENO_HOME="$XDG_CONFIG_HOME/zeno"
+export ZENO_HOME="$(mktemp -d -t zeno.XXXXXX)" # Zshプロセスごとに独立したディレクトリを使用する
+export ZENO_CONFIG_HOME="$XDG_CONFIG_HOME/zeno"
 export ZENO_ENABLE_SOCK=1
 # export ZENO_DISABLE_BUILTIN_COMPLETION=1
 export ZENO_GIT_CAT="bat --color=always"
 export ZENO_GIT_TREE="exa --tree"

 # zeno.zshの初期化
+"$ZENO_CONFIG_HOME/config.ts" # config.yaml を生成する
 source "<path-to-zeno>/zeno.zsh"

 bindkey ' '  zeno-auto-snippet
 bindkey '^M' zeno-auto-snippet-and-accept-line

+# ディレクトリを移動したときの処理
+__zeno_chpwd() {
+    "$ZENO_CONFIG_HOME/config.ts" # config.yaml を生成する
+    zeno-restart-server # 設定ファイルの再読み込みのためzeno.zshのサーバープロセスを再起動する
+}
+add-zsh-hook chpwd __zeno_chpwd
```

上記で実行している `$ZENO_CONFIG_HOME/config.ts` は実行すると動的に設定を生成し、 `$ZENO_HOME/config.yaml` に保存します ((最終行を見るとYAMLファイルにJSONを出力しています。これは一見デタラメに見えますがYAMLはJSONのスーパーセットであるため問題なく動作します。正しくYAMLを出力したい場合は https://deno.land/std/encoding/yaml.ts をimportしましょう。))。

```typescript
#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env
// $ZENO_CONFIG_HOME/config.ts
import {
  Settings,
  Snippet,
  UserCompletionSource,
} from "https://raw.githubusercontent.com/yuki-yano/zeno.zsh/main/src/type/settings.ts";
import { dirname } from "https://deno.land/std/path/mod.ts";

type PackageJSON = {
  scripts?: Record<string, string>;
};

// 最も近い親ディレクトリに存在する package.json を読み込む
const readPackageJSON = async (
  cwd: string,
): Promise<PackageJSON | undefined> => {
  for (let dir = cwd;;) {
    try {
      const path = `${dir}/package.json`;
      return JSON.parse(await Deno.readTextFile(path));
    } catch (_err) {
      // ignore
    }

    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  return undefined;
};

const npmSnippets: ReadonlyArray<Snippet> = await (async () => {
  const scripts = (await readPackageJSON(Deno.cwd()))?.scripts ?? {};

  // npm <script> → npm run <script> を存在する全てのscriptsについて定義する
  const scriptSnippets: ReadonlyArray<Snippet> = Object.keys(scripts)
    .filter((name) => !["start", "test"].includes(name)) // ただし start, test を除く
    .map((name) => ({
      name: `npm ${name}`,
      keyword: name,
      snippet: `run ${name}`,
      context: {
        lbuffer: "^npm\\s+\\S+$",
      },
    }));

  return [
    { // npm → npm/yarn/pnpm
      name: "npm",
      keyword: "npm",
      snippet: 'zsh -c "$ZENO_CONFIG_HOME/scripts/package-manager.ts"',
      evaluate: true,
    },
    { // yarn i → yarn add
      name: "yarn i",
      keyword: "i",
      snippet: "add",
      context: {
        lbuffer: "^yarn\\s",
      },
    },
    ...scriptSnippets,
  ];
})();

const settings: Settings = {
  snippets: [
    ...npmSnippets,
  ],
  completions: [],
};

await Deno.writeTextFile(
  `${Deno.env.get("ZENO_HOME")}/config.yml`,
  JSON.stringify(settings, null, 2),
);
```

これにより `npm` コマンドでも `run` を省略できるようになりました。

```sh
$ cat package.json
{
  "scripts": {
    "dev": "next"
  }
}

$ npm dev # .scripts.dev が存在する
  ↓ 展開
$ npm run dev
```

`config.ts` の設定 (`settings`) の型には[zeno.zshが内部で定義しているもの](https://raw.githubusercontent.com/yuki-yano/zeno.zsh/main/src/type/settings.ts)を使用しています。
これにより設定の追加時も型情報の補完が効くという副次的なメリットが得られました。

## まとめ

zeno.zshの略語展開に焦点を当て機能を紹介するとともに、開発体験の向上のために筆者が行っている工夫について紹介しました。

また設定ファイルの動的生成の可能性について検証し、npm-scriptsを展開する略語の自動定義を実現しました。
これによって、「特定のOSでのみ展開される略語」などの条件付きの略語も比較的簡単に定義できるようになりました。

```typescript
// macOSでのみ有効な略語
const macOSSnippets: ReadonlyArray<Snippet> = Deno.build.os === "darwin"
  ? [
    {
      name: "chrome",
      keyword: "chrome",
      snippet: 'open -a "Google Chrome"',
    },
  ]
  : [];

const settings: Settings = {
  snippets: [
    ...npmSnippets,
    ...macOSSnippets,
  ],
  completions: [],
};
```

一方でこのような使用方法はzeno.zshで本来想定されているものではなく、思いがけない誤動作をする可能性がある点に留意する必要があります。

本記事中ではコードや設定を部分的に省略しています。
実際に筆者が運用している設定等は以下のdotfilesから確認できます。

[https://github.com/NagayamaRyoga/dotfiles/tree/4c367df16683c1cbcdce604ad01457b7e3940d11:embed:cite]

## We are hiring!

エムスリーではZshプラグインが好きなエンジニアを募集しています。 興味を持たれた方は下記よりお問い合わせください。

[https://jobs.m3.com/engineer/:embed:cite]
