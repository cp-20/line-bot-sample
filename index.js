// モジュールのインポート
const server = require('express')();
const line = require('@line/bot-sdk'); // Messaging APIのSDKをインポート

// パラメータ設定
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// Webサーバー設定
server.listen(process.env.PORT || 80);

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req, res) => {
  // 先行してLINE側にステータスコード200でレスポンスする。
  res.sendStatus(200);

  // イベントオブジェクトを順次処理
  const events_processed = req.body.events
    .map((event) => {
      // メッセージでかつテキストタイプだった場合に限定
      if (event.type == 'message' && event.message.type == 'text') {
        // メッセージが「こんにちは」だった場合のみ反応
        if (event.message.text == 'こんにちは') {
          // 「こんにちは！」と返信
          return bot.replyMessage(event.replyToken, {
            type: 'text',
            text: 'こんにちは！',
          });
        }
      }

      return false;
    })
    .filter(Boolean);

  Promise.all(events_processed).then((response) => {
    console.log(`${response.length} event(s) processed.`);
  });
});
