```javascript
// ================================
// とと子 ありがとうガチャ 2026
// 会場その場お渡し版
//
// 景品割合：
// Tシャツ10%
// コースター2枚セット15%
// キーホルダー5%
// エコバッグ70%
//
// 抽選回数：
// 1～10回まで選択可能
//
// 抽選回数は「1日単位」で管理。
// 土日両日参加の場合、それぞれの日に抽選可能。
// ================================

let maxDraws = 0;
let drawCount = 0;
let isDrawing = false;


// ================================
// LIFF ログインチェック
// ================================

async function liffLoginCheck() {
  if (!liff.isInClient()) {
    alert(
      "この抽選は、LINEアプリ内からご利用ください。\n" +
      "ブースのQRコードを読み取るか、名代 宇奈ととのLINE公式アカウントのトーク画面からアクセスしてください。"
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
// 当選ロジック
// ================================

function drawLottery() {
  const rand = Math.random() * 100;

  if (rand < 10) {
    return {
      grade: "1等",
      display: "🎉【1等】とと子Tシャツ！！"
    };
  } else if (rand < 25) {
    return {
      grade: "2等",
      display: "✨【2等】とと子コースター 2枚セット！"
    };
  } else if (rand < 30) {
    return {
      grade: "3等",
      display: "😍【3等】とと子キーホルダー（好きな柄を選べます）"
    };
  } else {
    return {
      grade: "4等",
      display: "🍀【4等】とと子エコバッグ"
    };
  }
}


// ================================
// LINEユーザーID取得
// ================================

async function getUserKey() {
  const profile = await liff.getProfile();

  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const dateKey = `${year}-${month}-${day}`;

  return `totoko_gacha_2026_${dateKey}_${profile.userId}`;
}


// ================================
// 今日の抽選情報を取得
// ================================

async function getDrawData() {
  try {
    const key = await getUserKey();
    const data = localStorage.getItem(key);

    if (!data) {
      return {
        maxDraws: 0,
        drawCount: 0
      };
    }

    return JSON.parse(data);

  } catch (e) {
    console.error("getDrawData error", e);

    return {
      maxDraws: 0,
      drawCount: 0
    };
  }
}


// ================================
// 今日の抽選情報を保存
// ================================

async function saveDrawData() {
  try {
    const key = await getUserKey();

    localStorage.setItem(
      key,
      JSON.stringify({
        maxDraws: maxDraws,
        drawCount: drawCount
      })
    );

  } catch (e) {
    console.error("saveDrawData error", e);
  }
}


// ================================
// 参加条件選択
// ================================

document.querySelectorAll(".condition-btn").forEach(button => {

  button.addEventListener("click", async () => {

    const ok = await liffLoginCheck();

    if (!ok) return;

    const draws = Number(button.dataset.draws);

    const data = await getDrawData();

    if (data.drawCount > 0) {
      document.getElementById("conditionArea").style.display = "none";
      document.getElementById("drawArea").style.display = "block";

      maxDraws = data.maxDraws;
      drawCount = data.drawCount;

      updateDrawArea();

      return;
    }

    maxDraws = draws;
    drawCount = 0;

    await saveDrawData();

    document.getElementById("conditionArea").style.display = "none";
    document.getElementById("drawArea").style.display = "block";

    updateDrawArea();
  });

});


// ================================
// 抽選ボタン
// ================================

document.getElementById("drawBtn").addEventListener("click", async () => {

  if (isDrawing) return;

  const ok = await liffLoginCheck();

  if (!ok) return;

  if (drawCount >= maxDraws) {
    finishLottery();
    return;
  }

  isDrawing = true;

  const btn = document.getElementById("drawBtn");

  btn.disabled = true;
  btn.style.opacity = "0.5";
  btn.textContent = "抽選中…";


  // 抽選

  const result = drawLottery();

  drawCount++;

  await saveDrawData();


  // 結果表示

  document.getElementById("result").textContent =
    result.display;


  // 抽選時刻

  const now = new Date();

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("timestamp").textContent =
    "抽選時刻 " +
    hh + ":" +
    mm + ":" +
    ss +
    "　この画面をスタッフにお見せください";


  // 残り回数

  updateDrawArea();

  isDrawing = false;
});


// ================================
// 画面更新
// ================================

function updateDrawArea() {

  const remaining = maxDraws - drawCount;

  document.getElementById("drawCount").textContent =
    `本日の抽選回数：${maxDraws}回`;

  document.getElementById("remaining").textContent =
    remaining > 0
      ? `残り ${remaining}回`
      : "本日の抽選は終了しました";

  const btn = document.getElementById("drawBtn");

  if (remaining > 0) {

    if (drawCount === 0) {
      btn.textContent = "抽選する";
    } else {
      btn.textContent = "もう一度抽選する";
    }

    btn.disabled = false;
    btn.style.opacity = "1";

  } else {

    btn.disabled = true;
    btn.textContent = "抽選終了";
    btn.style.opacity = "0.5";

  }
}


// ================================
// 抽選終了
// ================================

function finishLottery() {

  document.getElementById("remaining").textContent =
    "本日の抽選は終了しました";

  const btn = document.getElementById("drawBtn");

  btn.disabled = true;
  btn.textContent = "抽選終了";
  btn.style.opacity = "0.5";
}
```
