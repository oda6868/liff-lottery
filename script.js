const LIFF_ID = 'YOUR_LIFF_ID_HERE'; // あとで本物のLIFF IDに書き換え

const prizes = [
  { name: "🎉1等：うな丼ダブル無料",        probability: 1.5 },
  { name: "🥇2等：うな重無料",              probability: 2.5 },
  { name: "🥈3等：Tシャツ or 湯呑み",       probability: 7 },
  { name: "🥉4等：コースター or エコバッグ", probability: 20 },
  { name: "🎁5等：キーホルダー",            probability: 69 },
];

// 確率に応じて景品を1つ返す
function drawPrize() {
  const rand = Math.random() * 100; // 0〜100未満
  let cumulative = 0;
  for (const prize of prizes) {
    cumulative += prize.probability;
    if (rand < cumulative) {
      return prize;
    }
  }
  // 念のため
  return prizes[prizes.length - 1];
}

async function initLiff() {
  await liff.init({ liffId: LIFF_ID });

  const btn = document.getElementById('drawBtn');
  const resultEl = document.getElementById('result');

  btn.addEventListener('click', async () => {
    const prize = drawPrize();

    // ① 画面に表示
    resultEl.textContent = `あなたの結果：${prize.name}`;

    // ② LINEメッセージも送信
    try {
      await liff.sendMessages([
