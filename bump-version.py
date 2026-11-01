#!/usr/bin/env python3
"""
バージョンを一括更新するスクリプト（リリース作業用）

使い方:
    python3 tools/bump-version.py 1.2.0 "登録画面に◯◯を追加"

やっていること:
    index.html  の APP_VERSION を更新
    sw.js       の VERSION を更新（＝ブラウザが更新を検知するきっかけ）
    version.json の version / build / notes を更新

この3つを揃えて更新するのが、各端末へ自動で新版を届ける条件です。
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    new = sys.argv[1].strip()
    notes = sys.argv[2].strip() if len(sys.argv) > 2 else ""

    if not re.fullmatch(r"\d+\.\d+\.\d+", new):
        print(f"バージョンは x.y.z 形式で指定してください: {new}")
        return 1

    # index.html
    p = ROOT / "index.html"
    s = p.read_text(encoding="utf-8")
    s2, n1 = re.subn(r"(var APP_VERSION = ')[^']+(';)", r"\g<1>" + new + r"\g<2>", s, count=1)
    if not n1:
        print("index.html に APP_VERSION が見つかりません")
        return 1
    p.write_text(s2, encoding="utf-8")

    # sw.js
    p = ROOT / "sw.js"
    s = p.read_text(encoding="utf-8")
    s2, n2 = re.subn(r"(const VERSION = ')[^']+(';)", r"\g<1>" + new + r"\g<2>", s, count=1)
    if not n2:
        print("sw.js に VERSION が見つかりません")
        return 1
    p.write_text(s2, encoding="utf-8")

    # version.json
    p = ROOT / "version.json"
    data = {"version": new, "build": date.today().isoformat(), "notes": notes}
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"更新しました → v{new}")
    print("  index.html / sw.js / version.json")
    print("  このフォルダをそのまま再アップロードすれば、各端末は自動で新版に切り替わります。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
