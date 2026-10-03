```javascript
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
  } else if (rand < 20) {
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
```
