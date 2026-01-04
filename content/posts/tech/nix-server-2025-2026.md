---
title: 年末年始の宿題にNixOSでサーバーを構築した
publishDate: "Mon, 5 Jan 2026 GMT"
tags:
  - "nix"
  - "nixos"
isDraft: false
---

本当は年始すぐに書き始めたかったんですが、色々と欲が出てガチャガチャ弄ってる間に休みが終わってしまって隙間時間に書いてます。

大晦日にわたなれネクストシャインを地上波リアタイしたり、最後の日曜日にはわたなれ一挙ニコ生をリアタイしてたせいなので、れな子が悪いって事にしておきます。

この年末年始、ある目的でずっと組もうと思っていたサーバーをついに組みました。  
今回はそのビルドについてざっくり書いておこうと思います。

## ハード構成

- M/B
  - ASUS TUF GAMING B760M-E D4
- CPU
  - Intel Core i3-12100
- Memory
  - 恐らく前のデスクトップで使っていたであろう Team のメモリ（16GB * 2）
- ケース
  - SilverStone MILO 11
- ストレージ
  - シリコンパワー 256GB M.2 SSD
- 拡張ボード
  - Mellanox ConnectX-3 EN
  - SPARKLE Intel Arc A310 ECO
- 電源
  - SilverStone SST-TX500-G

micro-ATX にした理由ですが、元々デプロイ先（物理）の候補がメタルラック（のダブルドライバーを飾っている場所を片付ける）ぐらいしかなく、場所が限られていたのでなるべく小さくしたいという前提がありました。

なら mini-ITX でええやんとなりますが、どうしても拡張ボードを 3 枚入れたく、中途半端と言われてしまいがちな micro-ATX にしたという経緯があります。  
（ちなみにダブルドライバーは結局片付いておらず、そのすぐ下の GS924M v2 の上にほっぽちゃんが鎮座していたスペースを片付けました）

電源はツメを引っかける窪みがなくて SilverStone のケースじゃないとダメみたいなのを聞いていたんですよね。  
なので第一候補だった ANTEC のケースじゃなくてこっちにしたんですが、いざ現品が届いたら普通に窪みがあってなんやねん！　てなりました。

ConnectX-3 はヤフオクで 3 枚目を落として 10GTek の DAC ケーブルを挿してます。これでメインのデスクトップと NAS、このサーバーの間は 10G で疎通できます。（間には Allied Telesis x510 を噛ましてます）

## ソフトウェア構成

こっちが本題。

と言っても OS を NixOS にしたというだけなんですが、具体的にどういう方式でデプロイしているかを書いていきたいと思います。

最初はだいぶ探り探りだったんですが、とりあえず OS のインストールは nixos-anywhere でやりたいという漠然な思いだけはあったので、まずは NixOS のインストーラーを bootstrap するためのイメージ作りから始めました。

とはいえこちらは割と簡単で、sshd を有効化した上で自分の SSH 公開鍵を焼けばいいだけなので簡単でした。大体↓を読めば分かると思います。

https://github.com/gamoutatsumi/nix-config/blob/main/flake/parts/nixos/hosts/iso/default.nix

後は `nix build .#nixosConfigurations.headlessIso.config.system.build.isoImage` を実行して生成された ISO を dd で USB メモリに焼いて起動するだけです。

「だけ」と言いつつ実のところ何度かインストールをやり直しており、その度にキーボードとモニターを繋いでブートオーダーを調整するのが一番面倒だったので、このフェーズが個人的に一番の難関でした。  
IPMI でも使えれば楽だったんですが、ASUS の何故か約 1677 万色で光るマザーボードにそんな小洒落た機能がある訳もなく……。

そんなこんなでデプロイに使った Nix 式の一部抜粋が以下です。最低限 Intel Arc の QSV エンコードが使える程度の設定だけ残して大幅に削ってあります。

https://gist.github.com/gamoutatsumi/342fa34e3e439b68a4a9a86c64427a5e

ざっくり説明すると、以下が deploy-rs 用の定義です。

```nix
deploy = {
  nodes = {
    "<hostname>" = {
      hostname = "<server hostname>";
      profiles = {
        system = {
          user = "root";
          sshUser = "root";
          path =
            inputs.deploy-rs.lib.x86_64-linux.activate.nixos
              self.nixosConfigurations."<server hostname>";
        };
      };
    };
  };
};
```

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
