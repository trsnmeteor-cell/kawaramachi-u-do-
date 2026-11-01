/* =========================================================
   接続先の設定（管理者用・全項目固定）
   ---------------------------------------------------------
   ここに書いた値が、初めてアプリを開いた端末にも自動で入ります。
   スタッフはURLを開くだけで、入力は一切不要です。

   ・編集したいときは、URLの末尾に ?unlock=1 を付けて開く
     （例: https://…/index.html?unlock=1）
   ========================================================= */
window.APP_CONFIG = {
  lock: true,

  /* サーバー（Google Apps Script のウェブアプリURL） */
  gasUrl: 'https://script.google.com/macros/s/AKfycbxkEDfVjRceQMDzvSb2UiguSt9uEDugtAa6FhQdi605LB47l1ajqqihP11-_SVuAi2e/exec',

  /* 記録先スプレッドシート */
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1Ye-y2W5fcYGfhowKEE10mrxL4tGOYMkypRIUM7otWgI/edit',

  /* Googleチャットの受信Webhook */
  chatUrl: 'https://chat.googleapis.com/v1/spaces/AAAADPY8Iz4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=P5sKMjnKkwsXG-1ayP8Gu8e6jX95bSibqy0V2y4CD4g'
};
