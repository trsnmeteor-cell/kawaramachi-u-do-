/* =========================================================
   案内券（印刷用画像）の描画
   ---------------------------------------------------------
   元画像 345x432 の比率をそのまま再現する。
   ・案内元 / ご案内先 ・日付 ・人数 ・誘導先店舗のQR
   ・受付時間は受け入れ店で記入するため空欄
   ========================================================= */
(function () {
  'use strict';

  var W_TICKET = 345, H_TICKET = 432;            // 券面の基準寸法（100mm x 125.2mm 相当）
  var PAD = 17.25;                               // 5mm の余白（1mm = 3.45px）
  var BW = W_TICKET + PAD * 2, BH = H_TICKET + PAD * 2;
  var S = 4;                                     // 描画倍率
  var F = "'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic',Meiryo,sans-serif";
  var INK = '#111111', DARK = '#464646', LINE = '#9a9a9a', FRAME = '#bdbdbd';
  var cache = {};
  /* ジャンカラ ロゴ（モノトーン・透過PNG） */
  var LOGO_SRC = 'data:image/png;base64,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';


  function fontStr(w, size) { return w + ' ' + size + 'px ' + F; }

  function fit(ctx, text, maxW, start, weight, min) {
    var s = start;
    while (s > (min || 5)) {
      ctx.font = fontStr(weight, s);
      if (ctx.measureText(text).width <= maxW) return s;
      s -= 0.4;
    }
    return Math.max(min || 5, s);
  }

  function wrap(ctx, text, maxW, weight, size) {
    ctx.font = fontStr(weight, size);
    var lines = [], cur = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (cur && ctx.measureText(cur + ch).width > maxW) { lines.push(cur); cur = ch; }
      else cur += ch;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function loadImg(src) {
    if (cache[src]) return Promise.resolve(cache[src]);
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { cache[src] = im; res(im); };
      im.onerror = function () { rej(new Error('QR画像を読み込めません')); };
      im.src = src;
    });
  }

  function fmtDate(d) {
    var p = String(d || '').split('/');
    if (p.length < 3) return '/';
    return parseInt(p[1], 10) + ' / ' + parseInt(p[2], 10);
  }

  function draw(ctx, rec, qrImg, logoImg) {
    ctx.save();
    ctx.translate(PAD, PAD);                     // 左右上下 5mm の余白
    /* 券内の座標は「券面（345x432）」基準で扱う（余白込みの BW は使わない） */
    var BW = W_TICKET;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // 用紙（白）
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-PAD, -PAD, BW, BH);

    // 外枠
    ctx.fillStyle = FRAME;
    ctx.fillRect(0, 0, BW, BH);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, 9, 327, 416);

    /* ---- ヘッダー（ロゴ） ---- */
    if (logoImg) {
      /* ロゴ全体を1枚として扱い、縦横比を保って最大サイズで配置する
         （パーツごとに拡大すると文字サイズが揃わないため） */
      var bx = 10, by = 9, bw = W_TICKET - 20, bh = 76 - by;
      var s = Math.min(bw / logoImg.width, bh / logoImg.height);
      var lw = logoImg.width * s, lh = logoImg.height * s;
      ctx.drawImage(logoImg, bx + (bw - lw) / 2, by + (bh - lh) / 2, lw, lh);
    } else {
      ctx.fillStyle = INK;
      ctx.font = fontStr('900', 30);
      ctx.fillText('ジャンカラ', BW / 2, 44);
    }

    /* ---- 行き方 ---- */
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, 76, 327, 109);
    ctx.fillStyle = INK;
    var toLabel = (rec.to || '') + 'への行き方';
    var labSize = fit(ctx, toLabel, 300, 15, '700');
    ctx.font = fontStr('700', labSize);
    ctx.fillText(toLabel, BW / 2, 96);

    // QRカード
    var qs = 66, qx = BW / 2 - qs / 2, qy = 108;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qx - 5, qy - 5, qs + 10, qs + 10);
    ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 0.5;
    ctx.strokeRect(qx - 5, qy - 5, qs + 10, qs + 10);
    if (qrImg) {
      ctx.imageSmoothingEnabled = false;
      var sm = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;   // QRは補間なしで描画（読み取り精度のため）
      ctx.drawImage(qrImg, qx, qy, qs, qs);
      ctx.imageSmoothingEnabled = sm;
      ctx.imageSmoothingEnabled = true;
    }

    /* ---- 店舗記入欄 ---- */
    ctx.fillStyle = INK;
    ctx.fillRect(9, 204, 327, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = fontStr('700', 13);
    ctx.fillText('店舗記入欄', BW / 2, 215.5);

    /* ---- 受付時間 ---- */
    ctx.fillStyle = DARK;
    ctx.fillRect(9, 226, 215, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = fontStr('700', 11);
    ctx.fillText('▼受付時間', 9 + 107.5, 240);
    ctx.font = fontStr('400', 6.4);
    ctx.fillText('※受付時間を15分以上過ぎると', 9 + 107.5, 252);
    ctx.fillText('自動キャンセルとなります。', 9 + 107.5, 260.5);

    /* 受付時間の記入枠（x224-336 / y226-266）に時刻を目一杯バランス良く収める */
    var tbX = 224, tbW = 112, tbY = 226, tbH = 40;
    var tbCx = tbX + tbW / 2, tbCy = tbY + tbH / 2;
    var tbPadX = 15, tbPadY = 9;                   // 枠内の最小余白
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tbX, tbY, tbW, tbH);

    var tRecv = String(rec.t || '');
    ctx.textAlign = 'center';
    if (tRecv) {
      // 幅・高さの両方に収まる最大サイズを求める（余白を詰める）
      var maxW = tbW - tbPadX * 2, maxH = tbH - tbPadY * 2;
      var fsz = 27;                                // 上限を抑えて少し小さく
      while (fsz > 8) {
        ctx.font = fontStr('400', fsz);            // 細めのウェイト（標準）
        var m = ctx.measureText(tRecv);
        var hApprox = fsz * 0.74;                  // 数字の実高さ概算
        if (m.width <= maxW && hApprox <= maxH) break;
        fsz -= 0.5;
      }
      ctx.fillStyle = INK;
      ctx.font = fontStr('400', fsz);
      ctx.fillText(tRecv, tbCx, tbCy + fsz * 0.03); // 光学補正で上下センター
    } else {
      ctx.fillStyle = '#8d8d8d';
      ctx.font = fontStr('700', 20);
      ctx.fillText(':', tbCx, tbCy);
    }

    /* ---- 案内元 / ご案内先 ヘッダー ---- */
    ctx.fillStyle = DARK;
    ctx.fillRect(9, 266, 327, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = fontStr('700', 9.5);
    ctx.fillText('案内元', 9 + 52.5, 276);
    ctx.fillText('→', BW / 2, 276);
    ctx.fillText('ご案内先', 230 + 53, 276);

    /* ---- 店舗名 ---- */
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, 286, 327, 80);
    ctx.strokeStyle = LINE; ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(114, 286); ctx.lineTo(114, 366);
    ctx.moveTo(230, 286); ctx.lineTo(230, 366);
    ctx.moveTo(9, 286); ctx.lineTo(9, 366);
    ctx.moveTo(336, 286); ctx.lineTo(336, 366);
    ctx.moveTo(9, 366); ctx.lineTo(336, 366);
    ctx.moveTo(9, 286); ctx.lineTo(336, 286);
    ctx.stroke();

    ctx.fillStyle = INK;
    var lSize = fit(ctx, rec.from || '', 92, 13, '700');
    var lLines = wrap(ctx, rec.from || '', 92, '700', lSize);
    var rSize = fit(ctx, rec.to || '', 92, 13, '700');
    var rLines = wrap(ctx, rec.to || '', 92, '700', rSize);
    var maxLines = Math.max(lLines.length, rLines.length);
    var lh = 17;
    var baseY = 326 - ((maxLines - 1) * lh) / 2;

    ctx.font = fontStr('700', lSize);
    lLines.forEach(function (line, i) { ctx.fillText(line, 9 + 52.5, baseY + i * lh); });
    ctx.font = fontStr('700', rSize);
    rLines.forEach(function (line, i) { ctx.fillText(line, 230 + 53, baseY + i * lh); });
    ctx.font = fontStr('700', 15);
    ctx.fillText('→', BW / 2, 326);

    /* ---- 日付 / 人数 ---- */
    ctx.fillStyle = DARK;
    ctx.fillRect(9, 366, 327, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = fontStr('700', 9.5);
    ctx.fillText('日付', 9 + 81.5, 376);
    ctx.fillText('人数', 172 + 82, 376);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, 386, 327, 39);
    ctx.strokeStyle = LINE; ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(172, 386); ctx.lineTo(172, 425);
    ctx.moveTo(9, 425); ctx.lineTo(336, 425);
    ctx.moveTo(9, 386); ctx.lineTo(9, 425);
    ctx.moveTo(336, 386); ctx.lineTo(336, 425);
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.font = fontStr('700', 14);
    ctx.fillText(fmtDate(rec.d), 9 + 81.5, 406);
    ctx.fillText((rec.n || 0) + ' 名様', 172 + 82, 406);

    /* ---- 枠線 ---- */
    ctx.strokeStyle = LINE; ctx.lineWidth = 0.6;
    ctx.strokeRect(9, 9, 327, 416);
    ctx.restore();
  }

  window.Ticket = {
    /* rec: {from,to,n,d,t} → 画像(PNG dataURL)を返す */
    build: function (rec) {
      var qr = (window.QR_IMAGES || {})[rec.to];
      var pre = qr ? loadImg(qr) : Promise.resolve(null);
      var logoP = loadImg(LOGO_SRC).catch(function () { return null; });
      return Promise.all([pre.catch(function () { return null; }), logoP]).then(function (r) {
        var img = r[0], logo = r[1];
        var cv = document.createElement('canvas');
        cv.width = BW * S; cv.height = BH * S;
        var ctx = cv.getContext('2d');
        ctx.scale(S, S);
        draw(ctx, rec, img, logo);
        return cv.toDataURL('image/png');
      });
    }
  };
})();
