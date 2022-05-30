---
title: 【M3 Tech Blog】「Shell作れます」と言うために
publishedAt: 2022-01-04
tags:
    - D言語
    - Shell
thumbnail: /blog/images/2022/01/04/pipeline.png
externalUrl: https://www.m3tech.blog/entry/making-nosh
---

新卒の永山です。
昨今、SNSではなぜかシェルを作ることに関する言及が盛んに行われています。
そこで、本記事ではシェルの実装に関する理解を深めることを目的に簡単なシェル「nosh」<!--(("シェルもどき" といった意味合いを込めnoshと命名しました。))--> をインクリメンタルに作成したいと思います。

完成した実装は以下のリポジトリで公開しています。

[https://github.com/NagayamaRyoga/nosh:embed:cite]

実装にはD言語を用います (この記事はD言語の布教も兼ねています)。

[:contents]

<!-- more -->

## D言語について

[D言語](https://dlang.org/) はC/C++風の親しみやすいシンタックスと高い実行効率、スクリプト言語のような軽快な書き心地、強力なメタプログラミングへのサポートを備えた興味深い言語です。

D言語自体の習得、D言語処理系のインストール方法は[公式チュートリアル](https://tour.dlang.org/)を参照してください (日本語版もあります)。

[https://tour.dlang.org/:embed:cite]

また、本記事中で紹介する実装にはD言語の標準ライブラリ (Phobos) のみを用い、その他のサードパーティライブラリは使用しません。
標準ライブラリの関数・構造体などの機能や定義については[公式のドキュメント](https://dlang.org/phobos/index.html)がとても参考になります。

[https://dlang.org/phobos/index.html:embed:cite]

## 0. 処理系の概形

今回作成するシェルは、主に字句解析器 (Lexer)、構文解析器 (Parser)、評価器 (Evaluator) というモジュールからなります。

<figure class="figure-image figure-image-fotolife" title="作成する処理系の構造">[f:id:ryoga-nagayama:20211220165733p:plain]<figcaption>作成する処理系の構造</figcaption></figure>

- 字句解析器 (Lexer) : 入力をトークン列に分割する
- 構文解析器 (Parser) : トークン列を抽象構文木に変換する
- 評価器 (Evaluator) : 抽象構文木を走査することでコマンドを実行する

これが原始的なスクリプト言語処理系と同様の構造であることに気が付かれたかもしれません。
事実その通りで、シェルの実装はスクリプト言語のREPLの実装と非常に似通っています (というよりそのものです)。

## 1. プロジェクトの作成

D言語のプロジェクトは、D言語のパッケージマネージャである [DUB](https://code.dlang.org/) の提供する `dub` コマンドで対話的に作成できます。

```sh
$ dub init
Package recipe format (sdl/json) [json]:
Name [nosh]:
Description [A minimal D application.]:
...

$ tree -a .
.
├── source
│  └── app.d
├── .gitignore
└── dub.json
```

`dub init` が完了した時点では、`app.d` には Hello, world! 的なソースコードが出力されています。

```d
// source/app.d
import std.stdio;

void main()
{
	writeln("Edit source/app.d to start your project.");
}
```

また、プロジェクトのルートディレクトリで `dub -q` コマンドを実行すると、ソースコードのコンパイルと実行が行われます。

```
$ dub -q
Edit source/app.d to start your project.
```

以降では `source/` ディレクトリ以下の `app.d` を編集、あるいはその他の `*.d` ファイルを作成することでシェルを実装していきます。

## 2. 最も簡単なREPL

まずは標準入力から取得したユーザの入力をスペースで分割し、コマンドとして解釈するごくシンプルなREPLを作成してみます。

<figure class="figure-image figure-image-fotolife" title="実行の様子">[f:id:ryoga-nagayama:20211220165914p:plain]<figcaption>実行の様子</figcaption></figure>

これは以下のようなコードで実現できます。

```d
// source/app.d
import std.array : split;
import std.process : ProcessException, spawnProcess, wait;
import std.stdio : readln, stderr, write;
import std.string : chomp;

void main()
{
    const prompt = "nosh % ";

    // メインループ
    for (;;)
    {
        // 1-1. プロンプトを表示する
        write(prompt);

        // 1-2. 標準入力から1行読み込む
        const line = readln();
        if (line is null)
        {
            break;
        }

        // 2. 入力を構文解析する
        auto args = parse(line);

        if (args.length > 0)
        {
            // 3. 解析結果のコマンドを実行する
            execute(args);
        }
    }
}

// コマンド文字列を受け取り、スペースで分割する
string[] parse(string line)
{
    auto args = line.chomp.split(" ");
    return args;
}

// コマンドを実行する
void execute(string[] args)
{
    try
    {
        spawnProcess(args).wait();
    }
    catch (ProcessException e)
    {
        stderr.writeln(e.message);
    }
}
```

順に見ていきましょう。

### 2.1. 入力の取得

```d
void main()
{
    const prompt = "nosh % ";

    // メインループ
    for (;;)
    {
        // 1-1. プロンプトを表示する
        write(prompt);

        // 1-2. 標準入力から1行読み込む
        const line = readln();
        if (line is null)
        {
            break;
        }

        // 2. 入力を構文解析する
        ...

        // 3. 解析結果のコマンドを実行する
        ...
    }
}
```

メインループ内では、

1. プロンプトの表示と標準入力からの読み込み
2. 入力の構文解析
3. コマンドの実行

を繰り返し行います。

今回は入力の読み込みに標準ライブラリの [`readln()`](https://dlang.org/phobos/std_stdio.html#.readln) 関数を使用していますが、より実用的なシェルを作成する際には [GNU Readline](https://tiswww.case.edu/php/chet/readline/rltop.html) や [Editline (libedit)](https://thrysoee.dk/editline/) などのライブラリを用いるとよいでしょう。

### 2.2. 入力の分割

続いて入力を構文解析します。
といっても今回は単に1行の入力をスペースで分割するだけです。

```d
// 2. 入力を構文解析する
auto args = parse(line);

// コマンド文字列を受け取り、スペースで分割する
string[] parse(string line)
{
    auto args = line.chomp.split(" ");
    return args;
}
```

`line.chomp.split(" ")` は [UFCS (Uniform Function Call Syntax)](https://tour.dlang.org/tour/ja/gems/uniform-function-call-syntax-ufcs) という糖衣構文を用いた記述で、これは `split(chomp(line), " ")` と等値です。

このようにD言語では関数を、まるでその第1引数のメソッドであるかのように扱え、それをチェインさせることで可読性を保ったまま直感的にコードを記述できます (D言語の最も好きなポイントです)。

### 2.3. コマンドの実行

最後に、上記で分割された入力を用いてコマンドを実行します。

```d
if (args.length > 0)
{
    // 3. 解析結果のコマンドを実行する
    execute(args);
}

// コマンドを実行する
void execute(string[] args)
{
    try
    {
        spawnProcess(args).wait();
    }
    catch (ProcessException e)
    {
        stderr.writeln(e.message);
    }
}
```

[`spawnProcess()`](https://dlang.org/phobos/std_process.html#.spawnProcess)関数 と [`wait()`](https://dlang.org/phobos/std_process.html#.wait)関数 を用いると子プロセスの起動とその終了の待機が行えます。

`spawnProcess()` はプロセスの起動に失敗した際に `ProcessException` を投げるため、忘れず catch するようにしましょう。

<figure class="figure-image figure-image-fotolife" title="プロセスの起動に失敗した場合の様子">[f:id:ryoga-nagayama:20211220170325p:plain]<figcaption>プロセスの起動に失敗した場合の様子</figcaption></figure>

以上で簡単なコマンドの実行が可能になりました。
本節ではすべての処理を1つのソースコード `app.d` に記述していますが、以下の節ではさらなる機能の追加に対応できるようモジュールを分割していきます。

## 3. モジュールの分割

本節では、冒頭で紹介した構造へとモジュールを分割します。

>- 字句解析器 (Lexer) : 入力をトークン列に分割する
>- 構文解析器 (Parser) : トークン列を抽象構文木に変換する
>- 評価器 (Evaluator) : 抽象構文木を走査することでコマンドを実行する

字句解析器と構文解析器については、スペースの都合上その実装に関する詳細な解説は行わず、あくまでその入出力の構造の紹介に留めたいと思います。
実際の実装は以下のファイルを参照してください。

- 字句解析器: [lexer.d](https://github.com/NagayamaRyoga/nosh/blob/main/source/lexer.d)
- 構文解析器: [parser.d](https://github.com/NagayamaRyoga/nosh/blob/main/source/parser.d)

### 3.1. 字句解析器

字句解析器は、文字列の入力をトークンに分割します。

```d
// source/lexer.d

// トークンの種類
enum TokenKind
{
    eof,     // 入力の終端
    eol,     // 改行
    word,    // echo, "Hello", ...
}

// トークンの情報
struct Token
{
    TokenKind kind;
    string text;
    bool hasLeadingSpace;
}

// 字句解析器
class Lexer
{
    // 入力としてファイルを受け取る
    this(File input);

    // トークンを1つ読み進める
    Token read();
}
```

`Lexer` は `read()` メソッドを呼び出すごとに入力から1つずつトークンを読み出します。

### 3.2. 構文解析器

構文解析器は `Lexer` が読み出したトークン列を解析し、抽象構文木 (AST) を出力します。

今回はシンプルな再帰降下型の構文解析器を実装しました。

```d
// source/parse.d

// 構文解析器
class Parser
{
    private Lexer _lexer;

    this(File input)
    {
        _lexer = new Lexer(input);
    }

    // 入力を構文解析する
    Command parse();

    // 入力が終了したかどうか
    bool eof() const;
}
```

構文解析器の出力である抽象構文木は以下のように定義されます。

```d
// source/ast.d

/**
 * 抽象構文木のノード型
 *
 * command :==
 *      simple_command
 */
abstract class Command
{
}

/**
 * 単純なコマンドを表現するノード型
 *
 * simple_command :==
 *      command_element+
 */
class SimpleCommand : Command
{
    CommandElement[] elements;
}

/**
 * command_element :==
 *      word+
 */
class CommandElement
{
    Word[] words;
}

/**
 * word :==
 *      WORD
 */
class Word
{
    string text;
}
```

例えば、`echo abc'def'` というコマンドは、次のような構造の抽象構文木に変換されます。

<figure class="figure-image figure-image-fotolife" title="&#x60;echo abc&#x27;def&#x27;&#x60; の抽象構文木の構造">[f:id:ryoga-nagayama:20211220170434p:plain]<figcaption>&#x60;echo abc&#x27;def&#x27;&#x60; の抽象構文木の構造</figcaption></figure>

今回は字句解析器や構文解析器の実装については割愛しましたが、様々な書籍でこれらについて解説されています。
以下に、特に再帰降下型構文解析器を実装する上で参考になる書籍を紹介しておきます。

[https://www.oreilly.co.jp/books/9784873118222/:embed:cite]

Go言語を用いた、REPLを備えたスクリプト言語のインタプリタの作成方法について述べられています。
字句解析、構文解析、評価という全体的な流れが今回のnoshの構造に近く、また、構文解析の面ではシンプルで応用の効くPratt構文解析器について解説されています。

[https://www.oreilly.co.jp/books/9784873115320/:embed:cite]

構文解析、意味解析、目的コード生成の実装方法について様々なパターンが解説されています。
特に3章ではより柔軟で発展的な構文解析器の実装について述べられています。

### 3.3. 評価器

評価器は構文解析器の出力した抽象構文木を走査し、コマンドを実行します。

```d
// source/eval.d

// 評価器
class Evaluator
{
    // 抽象構文木を評価する
    void run(Command node);
}
```

抽象構文木のような木構造の走査方法については様々なアプローチが存在し、D言語での実装に関しては、以下の記事で代表的な3つの手法が考察されています。

[https://ryooooooga.hateblo.jp/entry/2017/04/29/143312:title]

今回は上記の記事の「3. 外部訪問器(型情報などによる振り分け)」を参考に評価器を実装しました。

```d
// source/ast.d

// dispatch メソッドを展開するための template
template Dispatcher()
{
    auto dispatch(string method, Args...)(Command node, auto ref Args args)
    {
        import std.algorithm : castSwitch;

        return node.castSwitch!(
            (SimpleCommand node) => mixin("this." ~ method ~ "(node, args)"),
            // ノードクラスを追加した場合はここに分岐を追加していく
        )();
    }
}
```

`Dispatcher` テンプレートの `dispatch()` メソッドは引数に与えられたノードの型情報に基づいて、処理を振り分けます。

```d
// source/eval.d

// 評価器
class Evaluator
{
    // dispatchメソッドを展開する
    mixin Dispatcher;

    // 抽象構文木を評価する
    void run(Command node)
    {
        try
        {
            // 型情報に基づいて実際の処理を eval() メソッドに振り分ける
            dispatch!"eval"(node);
        }
        catch (ProcessException e)
        {
            stderr.writeln(e.message);
        }
    }

    // 単純なコマンドを実行する
    private void eval(SimpleCommand node)
    {
        // コマンドの引数を取得する
        auto args = node.elements.map!(el => evalCommandElement(el)).array;

        // コマンドを実行する
        spawnProcess(args).wait();
    }

    private string evalCommandElement(CommandElement node)
    {
        return node.words.map!(w => evalWord(w)).join("");
    }

    private string evalWord(Word word)
    {
        return word.text;
    }
}
```

まだ `Command` クラスのサブクラスが `SimpleCommand` しか存在しないため、dispatch型Visitorの旨味が特にありませんが、ひとまずモジュールの分割ができました。

これによって、`app.d` の `main` 関数は以下のようにすっきり整理されました。

```d
// source/app.d
void main()
{
    const prompt = "nosh % ";

    auto parser = new Parser(stdin);
    auto evaluator = new Evaluator();

    while (!parser.eof)
    {
        // プロンプトを表示する
        write(prompt);

        // 入力を構文解析する
        auto command = parser.parse();

        if (command !is null)
        {
            // コマンドを実行する
            evaluator.run(command);
        }
    }
}
```

## 4. パイプ演算子の実装

UNIXシェルの強みの1つは間違いなくパイプライン処理にあります。
本節ではnoshにパイプ演算子 `|`, `|&` を実装します。

### 4.1. 字句解析器・構文解析器の拡張

`|`, `|&` を受け付けるように字句解析器を拡張します。

```diff
 // source/lexer.d
 
 // トークンの種類
 enum TokenKind
 {
     eof,     // 入力の終端
     eol,     // 改行
+    pipe,    // |
+    pipeAll, // |&
     word,    // echo, "Hello", ...
 }
```

また、パイプラインを表現する抽象構文木のノード型を追加し、これを受け付けるように構文解析器を拡張します。

```diff
 // source/ast.d
 
 /**
  * command :==
+ *      pipe_command
  *      simple_command
  */
 abstract class Command
 {
 }
 
+/**
+ * pipe_command :==
+ *      command '|' command
+ *      command '|&' command
+ */
+class PipeCommand : Command
+{
+    Command left, right;
+    bool all; // false: '|', true: '|&'
+}
 
 // dispatch メソッドを展開するための template
 template Dispatcher()
 {
     auto dispatch(string method, Args...)(Command node, auto ref Args args)
     {
         import std.algorithm : castSwitch;
 
         return node.castSwitch!(
             (SimpleCommand node) => mixin("this." ~ method ~ "(node, args)"),
+            (PipeCommand node) => mixin("this." ~ method ~ "(node, args)"),
             // ノードクラスを追加した場合はここに分岐を追加していく
         )();
     }
 }
```

`PipeCommand` ノードは `left` に `|` (あるいは `|&`) の左辺のコマンドを、`right` に右辺のコマンドを保持します。

### 4.2. 評価器の拡張

パイプラインを実装するためには、左辺のコマンドの出力を別のコマンドの入力へと渡す必要があります。

C言語の場合、`<unistd.h>` で定義される [`pipe()`](https://linuxjm.osdn.jp/html/LDP_man-pages/man2/pipe.2.html) 関数を用いて入出力用のファイルディスクリプタを作成しますが、D言語ではそのラッパーである [`std.process.pipe()`](https://dlang.org/library/std/process/pipe.html#0) 関数を使用することでこれを実現できます。

例えば、`seq 100 | tail` というコマンドと同じ処理をD言語で表現する場合、`pipe()` と `spawnProcess()` を用いて以下のように記述することでこれを実現できます。

```d
import std.process : Pipe, pipe, Pid, spawnProcess, wait;
import std.stdio : File, stdin, stdout, stderr;

// パイプを作成する
Pipe p = pipe();
File readEnd = p.readEnd;
File writeEnd = p.writeEnd;

// seq 100
// コマンドの標準出力をパイプに繋ぐ
Pid seqPid = spawnProcess(["seq", "100"], stdin, writeEnd, stderr);
// tail
// コマンドの標準入力にパイプを繋ぐ
Pid tailPid = spawnProcess(["tail"], readEnd, stdout, stderr);

// コマンドの終了を待機する
seqPid.wait();
tailPid.wait();
```

この通り、[`spawnProcess()`](https://dlang.org/phobos/std_process.html#.spawnProcess)関数 の第2引数から第4引数にはそれぞれ入出力ストリーム (`File` 構造体) を与えられます (省略された場合、デフォルトで `stdin`, `stdout`, `stderr` が渡されます)。

上記を踏まえて、今回の処理系の評価器にパイプライン処理を実装します。

```d
// source/eval.d

class Evaluator
{
    mixin Dispatcher;

    void run(Command node)
    {
        try
        {
            // 型情報に基づいて実際の処理を eval() メソッドに振り分ける
            auto pids = dispatch!"eval"(node, stdin, stdout, stderr);

            // 実行されたすべての子プロセスの終了を待機する
            foreach (pid; pids)
            {
                pid.wait();
            }
        }
        catch (ProcessException e)
        {
            stderr.writeln(e.message);
        }
    }

    private Pid[] eval(SimpleCommand node, File stdin, File stdout, File stderr)
    {
        auto args = node.elements.map!(el => evalCommandElement(el)).array;

        // コマンドを実行する
        auto pid = spawnProcess(args, stdin, stdout, stderr, null,
                Config.retainStdin | Config.retainStdout | Config.retainStderr);
        return [pid];
    }

    private Pid[] eval(PipeCommand node, File stdin, File stdout, File stderr)
    {
        // パイプを作成する
        auto p = pipe();
        auto readEnd = p.readEnd;
        auto writeEnd = p.writeEnd;

        // 左辺のプロセスを起動する
        auto leftPids = dispatch!"eval"(node.left, stdin, writeEnd, node.all ? writeEnd : stderr);

        // 右辺のプロセスを起動する
        auto rightPids = dispatch!"eval"(node.right, readEnd, stdout, stderr);

        return leftPids ~ rightPids;
    }

    ...
}
```

`eval(SimpleCommand)` から順に差分を確認していきましょう。

```diff
-    private void eval(SimpleCommand node)
+    private Pid[] eval(SimpleCommand node, File stdin, File stdout, File stderr)
     {
         auto args = node.elements.map!(el => evalCommandElement(el)).array;
 
         // コマンドを実行する
-        spawnProcess(args).wait();
+        auto pid = spawnProcess(args, stdin, stdout, stderr, null,
+                Config.retainStdin | Config.retainStdout | Config.retainStderr);
+        return [pid];
     }
```

`eval()` メソッドが引数として入出力のための `File` 構造体を受けるように変更しました。

`spawnProcess()` は引数に与えられた `File` をプロセスの起動後に `close()` してしまうのですが、今回はそうしてほしくないため第6引数に `Config.retainStdin | Config.retainStdout | Config.retainStderr` を指定することでこれを無効化しています。

また、先程は `spawnProcess(args)` で起動されたプロセスを即座に `wait` していましたが、パイプラインには並列処理が必要なため `Pid` を返り値として返し、呼び出し元 (この場合は `run()` メソッド) で `wait` するようになっています。

```diff
     void run(Command node)
     {
         try
         {
             // 型情報に基づいて実際の処理を eval() メソッドに振り分ける
-            dispatch!"eval"(node);
+            auto pids = dispatch!"eval"(node, stdin, stdout, stderr);
+
+            // 実行されたすべての子プロセスの終了を待機する
+            foreach (pid; pids)
+            {
+                pid.wait();
+            }
         }
         catch (ProcessException e)
         {
             stderr.writeln(e.message);
         }
     }
```

最後に `eval(PipeCommand)` の実装です。

`pipe()` を用いて両辺のプロセスの入出力を繋ぐことでパイプライン処理を実現しています。

```d
    private Pid[] eval(PipeCommand node, File stdin, File stdout, File stderr)
    {
        // パイプを作成する
        auto p = pipe();
        auto readEnd = p.readEnd;
        auto writeEnd = p.writeEnd;

        // 左辺のプロセスを起動する
        auto leftPids = dispatch!"eval"(node.left, stdin, writeEnd, node.all ? writeEnd : stderr);

        // 右辺のプロセスを起動する
        auto rightPids = dispatch!"eval"(node.right, readEnd, stdout, stderr);

        return leftPids ~ rightPids;
    }
```

以上でnoshにパイプ演算子 `|`, `|&` を実装できました！　動作を確認してみましょう。

<figure class="figure-image figure-image-fotolife" title="パイプラインの動作">[f:id:ryoga-nagayama:20211221182345p:plain]<figcaption>パイプラインの動作((D言語くんの表示には [https://gist.github.com/kotet/1e200c8f004bdd9ef67871eebd9ed811:title] を使用しています。))</figcaption></figure>

## まとめ

実用的とは言い難いですが、パイプライン処理が可能な、簡単な "シェルもどき" をD言語を用いて作成しました。
特に、パイプ演算子の実装はリダイレクトなどの今回実装していない機能を実現する場合にも参考になるはずです。

また、D言語は昨今の発展著しい多様なプログラミング言語と比較するとモダンと言い難いような面も様々あるものの、「書いていて楽しい」という一点においてなかなか憎めない言語です。
この記事をきっかけに、1人でも多くの方がD言語に興味を持っていただけると嬉しいです。

## We are hiring!

エムスリーでは「Shell作れます」というエンジニアを募集しています。
興味を持たれた方は下記よりお問い合わせください。

[https://jobs.m3.com/product/:embed:cite]
