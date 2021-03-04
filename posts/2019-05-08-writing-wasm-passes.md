---
title: Binaryenを使用してWebAssemblyを操作するパスを作成する
publishedAt: 2019-05-08
tags:
    - WebAssembly
    - Binaryen
---

LLVMはLLVM IRを操作・走査できるカスタムパスの作成をサポートしており、`opt`コマンドの`-load`オプションを利用することで作成したカスタムパスを簡単に適用できます。

参考： [LLVM documentation - Writing an LLVM Pass](http://llvm.org/docs/WritingAnLLVMPass.html)

同じく、[WebAssembly](https://webassembly.org/)のライブラリ・コンパイラ基盤である[Binaryen](https://github.com/WebAssembly/binaryen)でもカスタムパスの作成はサポートされています。
しかし、LLVMにおける`opt`コマンドのような簡易的なドライバツールは付属されていないためドライバ部分もユーザが記述しなければなりません。

本稿ではWebAssembly中の定数命令の数を数える単純なコマンドラインツールの作成を通じて、以下の習得を目指します。

1. 任意のC/C++プロジェクトでBinaryenをライブラリとして利用する方法
2. WebAssemblyに対するカスタムパスの記述方法、および、その適用方法

## Binaryenとは

[Binaryen](https://github.com/WebAssembly/binaryen)はC++で記述された、WebAssembly操作するためのライブラリおよびツールチェインを提供するコンパイラ基盤です。
Binaryenが提供するツールには例えば以下のようなものがあります。

- `wasm-opt`： WebAssemblyに、あらかじめ用意された最適化パスなどを適用するためのツール。
- `wasm-as`： テキスト形式(`.wast`ファイル)のWebAssemblyをバイナリ形式(`.wasm`ファイル)へと変換するアセンブラ。
- `wasm-dis`： バイナリ形式(`.wasm`ファイル)のWebAssemblyをテキスト形式(`.wast`ファイル)へと変換する逆アセンブラ。

## カスタムパスの作成

テキスト形式(`.wast`ファイル)あるいはバイナリ形式(`.wasm`ファイル)のWebAssemblyを読み込み、その中に含まれる定数命令(`i32.const`, `i64.const`, `f32.const`, `f64.const`)を数える単純なツールを作成します。

以下のような単純なWebAssemblyモジュール`simple.wast`について、含まれる定数命令の数は1つのみなので次のような出力が得られれば成功です。

#### simple.wast

```lisp
(module
    (export "add3" (func $add3))
    (func $add3 (param i32) (result i32)
        (i32.add
            (local.get 0)
            (i32.const 3)))
)
```

#### 実行例

```shell
$ count-const simple.wast
1 const instruction(s)
```

作成したプロジェクトの一式はGitHubで公開しています。

[binaryen-const-counter](https://github.com/NagayamaRyoga/binaryen-const-counter)

## 1. ビルドルールを記述する

### 1.1. CMakeLists.txtを記述する

プロジェクトはCMakeを用いてビルドするため、[CMakeLists.txt](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/master/CMakeLists.txt)を記述する必要があります。

#### CMakeLists.txt [(1行目-13行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/CMakeLists.txt#L1-L13)

```cmake
cmake_minimum_required(VERSION 3.0.0)

project(binaryen-const-counter VERSION 1.0.0 LANGUAGES CXX)

# ビルドオプションの指定
set(CMAKE_CXX_FLAGS "-std=c++17 -Wall -Wextra -Werror -pedantic")
set(CMAKE_CXX_FLAGS_DEBUG "-g3 -O0 -pg")
set(CMAKE_CXX_FLAGS_RELEASE "-O2 -DNDEBUG -march=native")
set(CMAKE_CXX_FLAGS_RELWITHDEBINFO "-g3 -Og -pg")
set(CMAKE_CXX_FLAGS_MINSIZEREL "-Os -DNDEBUG -march=native")

if (NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif (NOT CMAKE_BUILD_TYPE)
```

ビルドオプションなどは好みに応じて指定してください。

### 1.2. Binaryenをライブラリとしてインポートする

CMakeのプラグインであるExternalProjectを用いてBinaryenをインポートします。また、`pthread`をリンクする必要があるのでそのための準備も行います。

#### CMakeLists.txt [(15行目-28行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/CMakeLists.txt#L15-L28)

```cmake
# 環境ごとのThreadライブラリを見つける
find_package(Threads REQUIRED)

# ExternalProjectを使用する
include(ExternalProject)

# Binaryenをビルド、インポートする
ExternalProject_Add(
    binaryen
    URL "https://github.com/WebAssembly/binaryen/archive/version_83.tar.gz"
    PREFIX binaryen
    INSTALL_COMMAND ""
    TEST_COMMAND ""
    CMAKE_ARGS
        -DBUILD_STATIC_LIB=ON
        -DCMAKE_BUILD_TYPE=Release
)
```

`CMAKE_ARGS -DBUILD_STATIC_LIB=ON`を指定することで静的ライブラリファイルが生成されるようにしています。

Binaryenは本稿執筆時点の最新バージョンである`version_83`をインポートしています。
Binaryenは2019年5月現在も盛んに更新がなされているので使用する時点の最新バージョンを使用することをおすすめします。

### 1.3. 生成されたBinaryenのライブラリファイルをCMakeプロジェクトとしてインポートする

`ExternalProject_Add`でインポートしたプロジェクトはそのままでは他のターゲットにリンクできません。

そのため、`IMPORTED`ターゲットを作成する作成する必要があります。

#### CMakeLists.txt [(30行目-55行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/CMakeLists.txt#L30-L55)

```cmake
# 展開されたBinaryenのソースパス、バイナリパスを取得する
ExternalProject_Get_Property(binaryen source_dir)
ExternalProject_Get_Property(binaryen binary_dir)

# IMPORTEDライブラリターゲットを追加する
add_library(binaryen::binaryen STATIC IMPORTED)
# ターゲットの依存関係を定義する
add_dependencies(binaryen::binaryen binaryen)

# インポートする静的ライブラリのパス
set(binaryen_LIBS
    ${binary_dir}/lib/libwasm.a
    ${binary_dir}/lib/libasmjs.a
    ${binary_dir}/lib/libpasses.a
    ${binary_dir}/lib/libcfg.a
    ${binary_dir}/lib/libir.a
    ${binary_dir}/lib/libemscripten-optimizer.a
    ${binary_dir}/lib/libsupport.a
    ${binary_dir}/lib/libwasm.a # 2度指定する(重要)
    Threads::Threads
)

# 存在しないディレクトリをINTERFACE_INCLUDE_DIRECTORIESに指定すると
# 警告が出るのでそれを回避するためにディレクトリを作成する
file(MAKE_DIRECTORY ${source_dir}/src)

# IMPORTEDターゲットのincludeディレクトリと静的ライブラリファイルを指定する
set_target_properties(binaryen::binaryen
    PROPERTIES
    IMPORTED_LOCATION ${binary_dir}/lib/libbinaryen.a
    INTERFACE_INCLUDE_DIRECTORIES ${source_dir}/src
    INTERFACE_LINK_LIBRARIES "${binaryen_LIBS}"
)
```

重要なのは`libwasm.a`を2回指定していることです。

`libwasm.a`と`libpasses.a`などは相互に参照しあっているため、最初と最後の両方に`libwasm.a`を指定しないとリンカエラーが発生してしまいます。

### 1.4. カスタムパスのターゲットを追加する

最後にカスタムパスをビルドするためにターゲットを追加します。

#### CMakeLists.txt [(57行目-63行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/CMakeLists.txt#L57-L63)


```cmake
# ターゲットを追加する
add_executable(count-const
    main.cpp
)

# Binaryenをリンクする
target_link_libraries(count-const
    binaryen::binaryen
)
```

以上でCMakeを使ったビルドルールの記述が完了しました。

## 2. カスタムパスを作成する

続いてBinaryenを利用してカスタムパスを作成していきます。

### 2.1. WebAssemblyモジュールを読み込む

コマンドライン引数で指定されたWebAssemblyファイルを読み込みます。

#### main.cpp [(223行目-225行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/main.cpp#L223-L225)

```cpp
// WebAssemblyモジュールを読み込む
wasm::Module module;
wasm::ModuleReader{}.read(argv[1], module);
```

WebAssemblyモジュールファイルを読み込むには、以下の関数のうちのいずれかを使用します。

- `wasm::ModuleReader::readText()`

    WebAssemblyテキストファイル(`.wast`形式)を読み込む。

- `wasm::ModuleReader::readBinary()`

    WebAssemblyバイナリファイル(`.wasm`形式)を読み込む。

- `wasm::ModuleReader::read()`

    テキストファイルかバイナリファイル化を自動で判断して読み込む。

テキストファイル(`.wast`)とバイナリファイル(`.wasm`)の両方に対応したければ`read()`を使用すればよいです。

読み込むときに注意すべき点は2つです。

#### 1. 読み込むファイルが開けなければ`exit(1)`を呼び出す

`readText()`、`readBinary()`、`read()`関数はファイルが開けない場合(存在しない場合など)には即座に`exit(EXIT_FAILURE)`を呼び出し終了します。

よりよいエラーのハンドリングを行う場合には実装を参考に自ら読み込み処理を必要があります。

#### 2. ファイル形式が間違っている場合に`wasm::ParseException`例外を投げる

`readText()`、`readBinary()`、`read()`関数はファイルの形式が間違っている場合に`wasm::ParseException`例外を投げます。

しかし、この`wasm::ParseException`は`std::exception`を**継承していない**ため注意が必要です。

### 2.2. パスを実装する

カスタムパスを実装するためには`wasm::Pass`抽象クラスを継承します。

#### main.cpp [(193行目-214行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/main.cpp#L193-L214)

```cpp
// カスタムパスクラス
class CountingPass : public wasm::Pass {
public:
    // パスが実行されるときに呼び出されるメンバ関数
    void run(wasm::PassRunner *pass_runner, wasm::Module *module) override {
        // (省略)
    }

    // このパスが実行されたときにモジュールを改変するか
    bool modifiesBinaryenIR() override {
        // このカスタムパスはモジュールを改変しないのでfalseを返す
        return false;
    }
};
```

このパスを実行するには、`wasm::PassRunner`にこのクラスを登録します。

#### main.cpp [(223行目-230行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/main.cpp#L223-L230)

```cpp
// PassRunnerにカスタムパスを登録する
wasm::PassRunner pass_runner{&module};
pass_runner.add<CountingPass>();

// カスタムパスを実行する
// CountingPass::run()が呼び出される
pass_runner.run();
```

### 2.3. 式木訪問器(Visitor)を実装する

モジュールに含まれる定数命令の数を数えるには式木訪問器(Visitor)を作成するのがもっとも簡単です。

#### main.cpp [(6行目-191行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/main.cpp#L6-L191)

```cpp
struct CountingVisitor
    : public wasm::OverriddenVisitor<CountingVisitor, int> {
    // (省略)
}
```

訪問器の基底クラスには`wasm::Visitor<>`、`wasm::OverriddenVisitor<>`などいくつかのクラスがあります。
それぞれに特徴があるのですが、基本的には`wasm::OverriddenVisitor<>`を継承するのがよいでしょう。

`wasm::OverriddenVisitor<>`の第1テンプレート引数に自身のクラス型を、第2テンプレート引数には個々の`visit`関数の返り値の型を指定します。

`visit`関数は式木の各ノードを順番に走査するためのメンバ関数です。

今回のVisitorの`visit`関数はそのノードと子ノードに含まれる定数命令の数を返します。

例として、定数命令(`i32.const`命令など)と条件分岐命令(`if`命令)の`visit`関数を挙げます。

#### 定数命令の`visit`関数 - main.cpp [(129行目-131行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/main.cpp#L129-L131)

```cpp
// 定数命令のvisit関数
int visitConst(wasm::Const *curr) {
    return 1;
}
```

`wasm::Const`は定数命令に対応するノードクラスです。

このノードは定数命令なので常に`1`を返します。

#### 条件分岐命令の`visit`関数 - main.cpp [(17行目-27行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/main.cpp#L17-L27)

```cpp
// 条件分岐命令のvisit関数
int visitIf(wasm::If *curr) {
    int count = 0; // 子ノードに含まれる定数命令の数

    // 条件式に含まれる定数命令を数える
    count += visit(curr->condition);

    // then節ブロックに含まれる定数命令を数える
    count += visit(curr->ifTrue);

    // else節ブロックに含まれる定数命令を数える
    if (curr->ifFalse)
        count += visit(curr->ifFalse);

    // 子ノードに含まれる定数命令の数を返す
    return count;
}
```

`wasm::If`は条件分岐命令(`if`命令)に対応するノードクラスです。

この命令は定数命令ではありませんが、3つのオペランドを持つためそれらのオペランド(子ノード)に含まれる定数命令を数える必要があります。

ただし、注意すべき点として一部の命令はそのオペランドの一部が**省略可能**であるため、子ノードを指すメンバ変数が`nullptr`になっていることがあります。

`If`の`ifFalse`メンバも省略可能なオペランドを表す変数であるため、走査の前にそのオペランドが`nullptr`でないことを確認しなければなりません。

### 2.4. 訪問器(Visitor)の呼び出し

最後に作成したVisitorを呼び出す必要があります。

#### main.cpp [(196行目-209行目)](https://github.com/NagayamaRyoga/binaryen-const-counter/blob/87c23aacf472c5711377a84ea88dc78addf0ffbc/main.cpp#L196-L209)

```cpp
// パスが実行されるときに呼び出されるメンバ関数
void run(wasm::PassRunner *pass_runner, wasm::Module *module) override {
    // Visitorオブジェクトを生成する
    CountingVisitor visitor;

    // モジュール内の関数に含まれる定数命令を数えていく
    int count = 0;

    for (const auto &function : module->functions) {
        count += visitor.visitFunction(function.get());
    }

    // 出力する
    std::cout << count << " const instruction(s)" << std::endl;
}
```

以上でWebAssemblyを走査できる簡単なパスを作成できました。
