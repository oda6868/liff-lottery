// LIFF ログインチェック
async function liffLoginCheck() {
  if (!liff.isLoggedIn()) {
    liff.login(); // ログインしていなければログイン画面へ
  }
}

// 抽選実行
function drawLottery() {
  const rand = Math.random() * 100;

  if (rand < 1.5) {
    return "🎉【1等】うな丼ダブル無料！！";
  } else if (rand < 1.5 + 2.5) {
    return "✨【2等】うな重無料！";
  } else if (rand < 1.5 + 2.5 + 7) {
    return "😆【3等】Tシャツ or 湯呑み";
  } else if (rand < 1.5 + 2.5 + 7 + 20) {
    return "😊【4等】コースター or エコバッグ";
  } else {
    return "👍【5等】キーホルダー";
  }
}

// 押されたときの動作
document.getElementById("drawBtn").addEventListener("click", async () => {
  await liffLoginCheck(); // ちゃんとログインした上で
  document.getElementById("result").textContent = drawLottery();
});
