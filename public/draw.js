const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let isDrawing = false;

// Canvasを白く塗りつぶす
function clearCanvas() {
    context.fillStyle = 'white'; // 塗りつぶす色を白に設定
    context.fillRect(0, 0, canvas.width, canvas.height); // Canvas全体を塗りつぶす
}

// マウスボタンが押されたとき
canvas.addEventListener('mousedown', startDrawing);

// マウスボタンが離されたとき、またはキャンバスから外れたとき
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// マウスが移動したとき
canvas.addEventListener('mousemove', draw);

function startDrawing(event) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

function stopDrawing() {
    isDrawing = false;
    context.closePath();
}

function draw(event) {
    if (!isDrawing) return;
    context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    context.stroke();
}

// 色ラジオボタンが変更されたときの処理
const colorRadios = document.querySelectorAll('input[type="radio"][name="color"]');
colorRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedColor = document.querySelector('input[name="color"]:checked').value;
        context.strokeStyle = selectedColor; // 選択した色を描画の色に設定
    });
});

// 太さが変更されたときの処理
const penWeight = document.getElementById("penWeight");
penWeight.addEventListener('input', changeWeight);
function changeWeight() {
    context.lineWidth = Number.parseInt(penWeight.value);
};

//クリア
document.getElementById("clearCanvas").onclick = clearCanvas;

//出力
document.getElementById("outputCanvas").onclick = ()=>{
    const data = canvas.toDataURL("image/png", 1);
    //console.log(date);

    //仮でダウンロード
    const a = document.createElement("a");
    a.href = data
    a.download = "image.png";
    a.click();
};

window.onload = ()=>{
    clearCanvas();
    changeWeight();
};