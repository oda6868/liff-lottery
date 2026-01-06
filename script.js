// ================================
// LIFF ログインチェック
// ================================
async function liffLoginCheck() {
  // LINEアプリ内で開いているかチェック
  if (!liff.isInClient()) {
    alert(
      "この抽選は、LINEアプリ内からご利用ください。\n名代 宇奈ととのLINE公式アカウントのトーク画面からアクセスしてください。"
    );
    return false;
  }

  // 未ログインならログイン
  if (!liff.isLoggedIn()) {
    liff.login();
    return false; // ログインに飛ぶのでここで一旦終了
  }

  return true;
}

// ================================
// 当選ロジック（表示用＋送信用）
// ================================
function drawLottery() {
  const rand = Math.random() * 100;

  if (rand < 1.5) {
    return {
      display: "🎉【1等】うな丼ダブル無料！！",
      sendText: "1等：うな丼ダブル無料 に当選！※NO.234e35t35r"
    };
  } else if (rand < 1.5 + 2.5) {
    return {
      display: "✨【2等】うな重無料！",
      sendText: "2等：うな重無料 に当選！※No.20t74te935"
    };
  } else if (rand < 1.5 + 2.5 + 7) {
    return {
      display: "😍【3等】Tシャツ or 湯呑み",
      sendText: "3等：Tシャツ or 湯呑み に当選！※NO.244f4e4"
    };
  } else if (rand < 1.5 + 2.5 + 7 + 20) {
    return {
      display: "😊【4等】コースター or エコバック",
      sendText: "4等：コースターorエコバックに当選！※No.432g84t"
    };
  } else {
    return {
      display: "🍀【5等】キーホルダー",
      sendText: "5等：キーホルダー に当選！※No.20f457g5"
    };
  }
}

// ================================
// ボタン押下時の動作
// ================================
document.getElementById("drawBtn").addEventListener("click", async () => {
  console.log("抽選ボタン押された");

  const ok = await liffLoginCheck();
  console.log("liffLoginCheck:", ok);
  if (!ok) return;

  // ★ ここから追加：すでに抽選済みかチェック
  if (await hasDrawn()) {
    document.getElementById("result").textContent = "この抽選は1人1回までです。";
    return;
  }
  // ★ 追加ここまで

  const result = drawLottery();

  // 画面表示
  document.getElementById("result").textContent = result.display;

  try {
    await liff.sendMessages([
      {
        type: "text",
        text: result.sendText
      }
    ]);

    // ★ ここで抽選済みとして保存
    await markDrawn();

    alert("抽選結果をトークに送信しました。トーク画面をご確認ください。");
  } catch (e) {
    console.error("メッセージ送信エラー", e);
    alert(
      "このページはLINEアプリ内ブラウザ専用です。\n\n" +
      "SafariやChromeなどの外部ブラウザではご利用いただけません。\n\n" +
      "恐れ入りますが、名代 宇奈ととのLINE公式アカウントのリッチメニューから、もう一度リンクを開いてください。"
    );
  }
});

// ================================
// 1人1回制限用（同一端末・同一LINEブラウザ）
// ================================
async function getUserKey() {
  const profile = await liff.getProfile();
  return `unatoto_lottery_2026_${profile.userId}`;
}

async function hasDrawn() {
  const key = await getUserKey();
  return localStorage.getItem(key) === "1";
}

async function markDrawn() {
  const key = await getUserKey();
  localStorage.setItem(key, "1");
}
