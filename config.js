/* =========================================================
   接続先の設定
   ---------------------------------------------------------
   ここに書いた値は、各端末で入力しなくても最初から入ります。
     lock: true   → 下の値で固定（アプリ上で変更できません）
     gasUrl: ''   → 空欄の項目は「端末ごとに入力」できます
   ========================================================= */
window.APP_CONFIG = {
  lock: true,

  /* サーバー（Google Apps Script のウェブアプリURL）
     ← 固定しません。各端末で画面から入力してください。 */
  gasUrl: '',

  /* 記録先スプレッドシート（固定） */
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1Ye-y2W5fcYGfhowKEE10mrxL4tGOYMkypRIUM7otWgI/edit',

  /* Googleチャットの受信Webhook（固定・入力不要） */
  chatUrl: 'https://chat.googleapis.com/v1/spaces/AAAADPY8Iz4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=P5sKMjnKkwsXG-1ayP8Gu8e6jX95bSibqy0V2y4CD4g'
};
