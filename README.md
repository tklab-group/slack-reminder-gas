# slack reminder gas

gasでslackにゼミのリマインダを送る

## deploy

1. clone, download library, login to clasp

```
$ git clone https://github.com/gihachi/slack-reminder-gas.git
$ npm install
$ # コマンドラインツールからgasにログインしていない場合
$ npm run clasp-login
```
2. gasプロジェクトを作成

```
$ npm run clasp-create -- <project name>
```

3. ./resourceにproduct.jsを配置

slackのincoming webhookのurl等を記述する.

develop用にdevelop.jsも作って良い

product.js(develop.js)には以下を記述

```
var config = {
    startupPostUrl : StartupReminderで通知するslackのincoming webhook url (別途取得する必要あり)
    seminarPostUrl : SeminarReminderで通知するslackのincoming webhook url (別途取得する必要あり)
    calendarId : 通知する予定が記述されたgoogle calendarのcalendar id
    spreadsheetId : 発表者をspreadsheetで管理している場合, spreadsheetのid
    a1Notion : 発表者, 発表日が記述されてる範囲のa1 notion
    dateIndex : a1notion範囲内で発表日が記述されている行番号(a1 notion範囲の左端が0)
    speakerIndex : a1notion範囲内で発表者が記述されている行番号(a1 notion範囲の左端が0)
}
```

4. gasにデプロイ

```
$ npm run build-prod
$ # develop.jsの内容を使いたい時は npm run build-dev
$ npm run clasp-push
```

デプロイすると3つの関数を実行できるようになる.

## 3つの関数

3つの関数が用意されている. それぞれの関数の内容は以下の通り.

- dayBeforeRemind()
  - 次の日のイベントのリマインドを送る
- beforeEventRemind()
  - イベントの直前にリマインドを送る. 関数起動の10分後以内にリマインドするイベントがあればリマインドを送る
- setBeforeRemind()
  - Google Calendarの次の日の予定を確認して直前にリマインドが必要なイベントがあれば, イベントの開始10分前にbeforeEventRemind()が起動するようにトリガーを設定する
  - 同時にすでに登録されていたbeforeEventRemind()を全て削除する
    - 本当はdayBeforeRemind()にトリガーを設置する処理を含めたかったが, トリガーの発動時間や, すでに発動しているかどうかなどは取得できなかったため, トリガー設定用の関数を別に作成している.

初めて関数を起動する時(または関数を発動せずにトリガーを設定した時), Googleの認証を行う必要がある.


## トリガーの設定

トリガーを設定して関数を定期的に実行することができる

1. script.google.comにアクセスして作成したプロジェクトからトリガーのページに移動
2. dayBeforeRemind()を1日1回発動するように設定
3. setBeforeRemind()を1日1回発動するように設定
   -  この関数が起動するとbeforeEventRemind()のトリガーを全て消してしまう, すなわち, その日に通知すべきリマインドのトリガーを消してしまう可能性があるため, 23-24時の間に設定すると良い

### beforeEventRemind()がうまく動かない場合

setBeforeRemind()で設定したbeforeEventRemind()のトリガーが動作しない場合がある.

この現象が続く場合はsetBeforeRemid()のトリガー設定をやめて, beforeRemind()を10分おきに起動するように設定する.

## リマインドの方法

Googleカレンダー内のイベントに以下の内容を書くと```seminarPostUrl```に書いたURLにpostする形でslackにリマインドを送る.

```
REMINDER{(リマインドする内容)}
```

また, 以下の文字列を書くとイベントの直前にリマインドを送る.

```
BEFIRE_REMIND
```

さらに, 以下の文字列がある場合はGoogle spreadsheetから発表者の名前を検索してリマインド内容に含める.

```
SPREADSHEET
```

また, ```REMINDER```を```STARTUP```に変えると```startupPostUrl```に設定したURLにリマインドをpostする. (今は使ってない)

