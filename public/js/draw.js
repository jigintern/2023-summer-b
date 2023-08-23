const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let tool = "pen";

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
    switch (tool){
        case "eraser": 
        context.strokeStyle = "white";
        context.lineWidth = Number.parseInt(penWeight.value) * 2;
        break;

        default :
        context.strokeStyle = colorInput.value;
        context.lineWidth = Number.parseInt(penWeight.value);
    }
    
    isDrawing = true;
    context.beginPath();
    const point = getCanvasXY(event);
    context.moveTo(point.x, point.y);
}

function stopDrawing() {
    isDrawing = false;
    context.closePath();
}

function draw(event) {
    if (!isDrawing) return;
    const point = getCanvasXY(event);
    context.lineTo(point.x, point.y );
    context.stroke();
}

function getCanvasXY(event){
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
    return {x: canvasX, y: canvasY};
}

// ツール変更
const colorRadios = document.querySelectorAll('input[type="radio"][name="tool"]');
colorRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        tool = document.querySelector('input[name="tool"]:checked').value;
    });
});

const colorInput = document.getElementById("color");
colorInput.addEventListener("input", ()=>{
    context.strokeStyle = colorInput.value;
});

// 太さが変更されたときの処理
const penWeight = document.getElementById("penWeight");
penWeight.addEventListener('input', changeWeight);
function changeWeight() {
    context.lineWidth = Number.parseInt(penWeight.value);
};

//クリア
document.getElementById("clearCanvas").onclick = clearCanvas;

window.addEventListener("load", ()=>{
    clearCanvas();
    changeWeight();
});
