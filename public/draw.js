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