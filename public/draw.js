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
    const rect = event.target.getBoundingClientRect()
    context.moveTo(event.clientX - rect.offsetLeft, event.clientY - rect.offsetTop);
}

function stopDrawing() {
    isDrawing = false;
    context.closePath();
}

function draw(event) {
    if (!isDrawing) return;

    const rect = event.target.getBoundingClientRect();

    // ブラウザ上での座標を求める
    const   viewX = event.clientX - rect.left,
            viewY = event.clientY - rect.top;

    // 表示サイズとキャンバスの実サイズの比率を求める
    const   scaleWidth =  canvas.clientWidth / canvas.width,
            scaleHeight =  canvas.clientHeight / canvas.height;

    // ブラウザ上でのクリック座標をキャンバス上に変換
    const   canvasX = Math.floor( viewX / scaleWidth ),
            canvasY = Math.floor( viewY / scaleHeight );

    context.lineTo(canvasX, canvasY );
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
    const data = canvas.toDataURL("image/png", 0.5);
    console.log(data.length,data);

    //仮でダウンロード
    const a = document.createElement("a");
    a.href = data
    a.download = "image.png";
    //a.click();
};

window.onload = ()=>{
    clearCanvas();
    changeWeight();
};