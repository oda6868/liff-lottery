// ================================
// とと子 ありがとうガチャ 2026（会場その場お渡し版）
// 景品割合：Tシャツ10% / コースター2枚セット10% / キーホルダー20% / エコバッグ60%
// ================================

// LIFF ログインチェック
async function liffLoginCheck() {
  if (!liff.isInClient()) {
    alert(
      "この抽選は、LINEアプリ内からご利用ください。\nブースのQRコードを読み取るか、名代 宇奈ととのLINE公式アカウントのトーク画面からアクセスしてください。"
    );
    return false;
  }
  if (!liff.isLoggedIn()) {
    liff.login();
    return false;
  }
  return true;
}

// ================================
// 当選ロジック（2026年版・ハズレなし）
// ================================
function drawLottery() {
  const rand = Math.random() * 100;

  if (rand < 10) {
    return { grade: "1等", display: "🎉【1等】とと子Tシャツ！！" };
  } else if (rand < 10 + 10) {
    return { grade: "2等", display: "✨【2等】とと子コースター 2枚セット！" };
  } else if (rand < 10 + 10 + 20) {
    return { grade: "3等", display: "😍【3等】とと子キーホルダー（好きな柄を選べます）" };
  } else {
    return { grade: "4等", display: "🍀【4等】とと子エコバッグ" };
  }
}

// ================================
// ボタン押下時の動作
// ================================
document.getElementById("drawBtn").addEventListener("click", async () => {
  const ok = await liffLoginCheck();
  if (!ok) return;

  // すでに抽選済みかチェック
  if (await hasDrawn()) {
    document.getElementById("result").textContent = "この抽選はお一人さま1回までです。";
    document.getElementById("timestamp").textContent = "";
    return;
  }

  const result = drawLottery();

  // ★ 抽選した瞬間に記録（送信などを待たない）
  await markDrawn();

  // 画面表示
  document.getElementById("result").textContent = result.display;

  // 時刻表示（スクショ使い回し対策：スタッフは時刻が直近かを確認）
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("timestamp").textContent =
    "抽選時刻 " + hh + ":" + mm + ":" + ss + "　この画面をスタッフにお見せください";

  // ボタンを無効化
  const btn = document.getElementById("drawBtn");
  btn.disabled = true;
  btn.textContent = "抽選ずみ";
  btn.style.opacity = "0.5";
});

// ================================
// 1人1回制限用（LINEユーザーID×端末）
// ================================
async function getUserKey() {
  const profile = await liff.getProfile();
  return `totoko_gacha_2026_${profile.userId}`;
}

async function hasDrawn() {
  try {
    const key = await getUserKey();
    return localStorage.getItem(key) === "1";
  } catch (e) {
    return false;
  }
}

async function markDrawn() {
  try {
    const key = await getUserKey();
    localStorage.setItem(key, "1");
  } catch (e) {
    console.error("markDrawn error", e);
  }
}
