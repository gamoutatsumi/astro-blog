---
title: 年末年始の宿題にNixOSでサーバーを構築した
publishDate: "Mon, 5 Jan 2026 GMT"
tags:
  - "nix"
  - "nixos"
  - "infra"
isDraft: false
---

本当は年始すぐに書き始めたかったんですが、色々と欲が出てガチャガチャ弄ってる間に休みが終わってしまったので隙間時間に書いてます。

大晦日にわたなれネクストシャインを地上波リアタイしたり、最後の日曜日にはわたなれ一挙ニコ生をリアタイしてたせいなので、れな子が悪いって事にしておきます。

さて、この年末年始にアニメ見る以外で何をしていたかという話ですが、ある目的でずっと組もうと思っていたサーバーをついに組みました。  
今回はそのビルドについてざっくり書いておこうと思います。

## ハード構成

- M/B
  - ASUS TUF GAMING B760M-E D4
- CPU
  - Intel Core i3-12100
- Memory
  - 恐らく前のデスクトップで使っていたであろう Team のメモリ（16GB * 2）
- ストレージ
  - Silicon Power 256GB M.2 SSD
- 拡張ボード
  - Mellanox ConnectX-3 EN
  - SPARKLE Intel Arc A310 ECO
- 電源
  - SilverStone SST-TX500-G
- ケース
  - SilverStone MILO 11

micro-ATX にした理由ですが、元々デプロイ先（物理）の候補がメタルラック（のダブルドライバーを飾っている場所を片付ける）ぐらいしかなく、場所が限られていたのでなるべく小さくしたいという前提がありました。

なら mini-ITX でええやんとなりますが、どうしても拡張ボードを 3 枚入れたくて中途半端と言われてしまいがちな micro-ATX にしたという経緯があります。

実は今使っている NAS は mini-ITX のマザボを使って M.2 から PCIe を出すケーブルを使って強引に拡張ボードを 2 枚挿してるんですが、3 枚となるとそんな力技でもどうにもなりませんしね……。  
（しかもちょっと斜めってるせいで DAC ケーブルがうまく抜けない）

~~（ちなみにダブルドライバーは結局片付いておらず、そのすぐ下の GS924M v2 の上にほっぽちゃんが鎮座していたスペースを片付けました。こういうのもあって最近は場所を取るようなグッズはほとんど買ってないです。金ないし）~~

電源はツメを引っかける窪みがなくて SilverStone のケースじゃないとダメみたいなのを聞いていたんですよね。  
なので第一候補だった ANTEC のケースじゃなくてこっちにしたんですが、いざ現品が届いたら普通に窪みがあってなんやねん！　てなりました。

ConnectX-3 はヤフオクで 3 枚目を落として 10GTek の DAC ケーブルを挿してます。  
これでメインのデスクトップと NAS、このサーバーの間は 10G で疎通できます。（間にはヤフオクで落とした Allied Telesis x510 を噛ましてます。ヤフオク万歳！）

基本的には見たままエンコード（+色々やらせる）サーバーです。そのうち Amatsukaze Server も動かせるようにしたい。

## デプロイ周り

こっちが本題。

と言っても OS を NixOS にしたというだけなんですが、具体的にどういう方式でデプロイしているかを書いていきたいと思います。

最初はだいぶ探り探りだったんですが、とりあえず OS のインストールは nixos-anywhere でやりたいという漠然な思いだけはあったので、まずは NixOS のインストーラーを bootstrap するためのイメージ作りから始めました。

とはいえこちらは割と簡単で、sshd を有効化した上で自分の SSH 公開鍵を焼けばいいだけなので簡単でした。大体↓を読めば分かると思います。

https://github.com/gamoutatsumi/nix-config/blob/main/flake/parts/nixos/hosts/iso/default.nix

後は `nix build .#nixosConfigurations.headlessIso.config.system.build.isoImage` を実行して生成された ISO を dd で USB メモリに焼いて起動するだけです。

「だけ」と言いつつ実のところ何度かインストールをやり直しており、その度にキーボードとモニターを繋いでブートオーダーを調整するのが一番面倒だったので、このフェーズが個人的に一番の難関でした。  
IPMI でも使えれば楽だったんですが、ASUS の何故か約 1677 万色で光るマザーボードにそんな小洒落た機能がある訳もなく……。今からでも JetKVM 買おうか真剣に悩んでます。  
NAS は Supermicro のマザーボードだから管理しやすいんですけどね。

### 管理ツール

最終的に以下の組み合わせに落ち着きました。

- 設定ファイル
  - Nix（NixOS サーバーのため）
- 初期デプロイ（OS インストール）
  - nixos-anywhere
- 設定変更
  - deploy-rs
- secret 管理
  - sops-nix

### 実際に書いたもの

そんなこんなでデプロイに使った Nix 式の一部抜粋が以下です。本当はもっとサービスの設定とか書いてあるんですが、とりあえず最低限 Intel Arc の QSV エンコードが使える程度の設定だけ残して大幅に削ってあります。

https://gist.github.com/gamoutatsumi/342fa34e3e439b68a4a9a86c64427a5e

基本的には各種ツールのドキュメントをそのままなぞっただけなので、コードそのものの説明はしません。

### Tips

ユーザーを定義する際に root ユーザーでも鍵認証でログインできるようにしておくと、以後 deploy-rs を実行する時にパスワードプロンプトが出なくて便利です。

```nix
users = {
  mutableUsers = false;
  users = {
    root = {
      openssh = {
        authorizedKeys = {
          keys = [
            "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBFRrDiS89ueVv8c6AR9O5Css16oW0Tx/ufz9juokqPb gamoutatsumi@tat-nixos-desktop"
          ];
        };
      };
    };
    gamoutatsumi = {
      isNormalUser = true;
      openssh = {
        authorizedKeys = {
          keys = [
            "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBFRrDiS89ueVv8c6AR9O5Css16oW0Tx/ufz9juokqPb gamoutatsumi@tat-nixos-desktop"
          ];
        };
      };
      extraGroups = [
        "wheel"
        "video"
        "render"
      ];
      hashedPasswordFile = config.sops.secrets.hashedPassword.path;
    };
  };
};
```

`hashedPasswordFile` は見たままですが sops-nix です。最初 OpenSSL で適当にアルゴリズム指定せず生成したハッシュを使ったら通らなくて、何度かインストールやり直しました。  
いつの間にかハッシュアルゴリズムの制限でもできてたんですかね。マジで覚えてないです。

最終的に Stackoverflow かどっかで見かけて SHA512 を使うようにしたら通りました。これで一度は諦めて `mutableUsers = true` にしたんですよね。

sops-nix については気が向いたらなんか書くかもしれないです。とはいえドキュメント通りで基本はいいはずです。（ハッシュアルゴリズムの罠とか踏まなければ）

## まとめ

NixOS 以前に `/etc/shadow` の仕様に引っかかったりとだいぶいらん苦労をした部分が多々ありましたが、最後には Nix で immutable なサーバーを組めて非常に満足してます。

このサーバーで実際に動かしてるサービスについても書けたらなんか書きます。

ちょくちょく出てた NAS についても気が向いたら書きたいですね。（もう 2, 3 年前に組んだやつなのでだいぶ忘れてますが）

という事で、年末年始 9 連休はこういう事をやってましたよという記事でした。今年もよろしくお願いします。

今年の抱負とかは特にないですが、今年は年明けから 3 ヶ月連続でミクライブに参戦するので、体調には気をつけたいですね。（去年はマジミラ仙台→大阪を敢行した直後に熱出して咳が長引いたりと散々だったので）
