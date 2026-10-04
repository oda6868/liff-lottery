
// ==========================================
// とと子 ありがとうガチャ 2026
// 友だち追加チェックなし・会場その場お渡し版
// ==========================================

const LIFF_ID = "2008573878-b5rNR1aj";

// HTML要素
const conditionArea = document.getElementById("conditionArea");
const drawArea = document.getElementById("drawArea");
const drawBtn = document.getElementById("drawBtn");
const drawCountText = document.getElementById("drawCount");
const resultArea = document.getElementById("result");
const timestampArea = document.getElementById("timestamp");
const remainingArea = document.getElementById("remaining");

// 抽選設定
let userId = null;
let selectedDraws = 0;
let drawCount = 0;
let isReady = false;

// 日付ごとのデータを保存
function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStorageKey() {
  return `totoko_gacha_${getToday()}_${userId}`;
}

function loadDrawData() {
  try {
    const saved = localStorage.getItem(getStorageKey());
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    console.error("抽選データの読み込みに失敗しました", error);
    return null;
  }
}

function saveDrawData() {
  try {
    localStorage.setItem(
      getStorageKey(),
      JSON.stringify({
        limit: selectedDraws,
        count: drawCount
      })
    );
    return true;
  } catch (error) {
    console.error("抽選データの保存に失敗しました", error);
    alert("データを保存できませんでした。端末の設定をご確認ください。");
    return false;
  }
}

// LINEログイン確認
// 友だち追加の確認は行わない
async function liffLoginCheck() {
  try {
    if (!liff.isInClient()) {
      alert("LINEアプリ内からアクセスしてください。");
      return false;
    }

    if (!liff.isLoggedIn()) {
      liff.login();
      return false;
    }

    const profile = await liff.getProfile();
    userId = profile.userId;

    return true;
  } catch (error) {
    console.error("LINEログイン確認エラー", error);
    alert("LINEの確認に失敗しました。画面を開き直してください。");
    return false;
  }
}

// 抽選結果
function drawLottery() {
  const rand = Math.random() * 100;

  if (rand < 20) {
    return {
      grade: "1等",
      display: "🎉【1等】とと子Tシャツ！！"
    };
  } else if (rand < 80) {
    return {
      grade: "2等",
      display: "✨【2等】とと子コースター 2枚セット！"
    };
  } else if (rand < 90) {
    return {
      grade: "3等",
      display: "🍀【3等】とと子エコバッグ"
    };
  } else {
    return {
      grade: "4等",
      display: "😍【4等】とと子キーホルダー（好きな柄を選べます）"
    };
  }
}

// 抽選回数・残り回数の表示
function updateDisplay() {
  drawCountText.textContent = `${drawCount} / ${selectedDraws}`;
  remainingArea.textContent = `残り抽選回数：${Math.max(0, selectedDraws - drawCount)}回`;

  if (drawCount >= selectedDraws) {
    drawBtn.disabled = true;
    drawBtn.textContent = "抽選終了";
  } else {
    drawBtn.disabled = false;
    drawBtn.textContent = "ガチャを回す";
  }
}

// 抽選回数の選択画面
function showConditionArea() {
  conditionArea.style.display = "block";
  drawArea.style.display = "none";
}

// 抽選画面
function showDrawArea() {
  conditionArea.style.display = "none";
  drawArea.style.display = "block";
  updateDisplay();
}

// 抽選回数を選択
document.querySelectorAll(".condition-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    if (!isReady) return;

    const draws = Number(button.dataset.draws);

    if (!Number.isInteger(draws) || draws < 1 || draws > 10) {
      alert("抽選回数を正しく選択してください。");
      return;
    }

    // すでに抽選回数が設定されている場合は変更不可
    if (selectedDraws > 0) {
      alert("すでに抽選回数が設定されています。");
      return;
    }

    selectedDraws = draws;
    drawCount = 0;

    if (!saveDrawData()) {
      selectedDraws = 0;
      return;
    }

    showDrawArea();
  });
});

// 抽選ボタン
drawBtn.addEventListener("click", () => {
  if (!isReady || !userId) return;

  if (drawCount >= selectedDraws) {
    alert("本日の抽選は終了しました。");
    return;
  }

  const prize = drawLottery();

  drawCount++;

  // 抽選回数を保存できなければ結果を確定しない
  if (!saveDrawData()) {
    drawCount--;
    return;
  }

  // 最新の抽選結果を表示
  resultArea.textContent = prize.display;

  const now = new Date();
  timestampArea.textContent =
    `抽選日時：${now.toLocaleString("ja-JP")}`;

  updateDisplay();
});

// 初期化
async function init() {
  conditionArea.style.display = "none";
  drawArea.style.display = "none";
  drawBtn.disabled = true;

  try {
    await liff.init({
      liffId: LIFF_ID
    });

    const loginSuccess = await liffLoginCheck();

    if (!loginSuccess) return;

    isReady = true;

    const savedData = loadDrawData();

    if (savedData && Number.isInteger(savedData.limit) &&
        savedData.limit >= 1 && savedData.limit <= 10 &&
        Number.isInteger(savedData.count) &&
        savedData.count >= 0 &&
        savedData.count <= savedData.limit) {

      selectedDraws = savedData.limit;
      drawCount = savedData.count;
      showDrawArea();

      if (drawCount >= selectedDraws) {
        resultArea.textContent = "本日の抽選は終了しました。";
      }
    } else {
      showConditionArea();
    }
  } catch (error) {
    console.error("初期化エラー", error);
    alert("ガチャの読み込みに失敗しました。画面を開き直してください。");
  }
}

init();
