"use strict"
//p5.js
function setup() {
    let canvas = createCanvas(600, 400);
    const canvas_wrap = document.getElementById("canvas-wrap");
    canvas.parent(canvas_wrap);
    frameRate(30);
    canvas.position(0, 0);
}
  
function draw() {
    background(255);

    //draw lines
    for(let l of lines){
        l.draw();
    }

    //pointer
    tool.draw();
}

//on load
window.addEventListener("load", ()=>{
    //スマホのスクロールを無効化
    const canvas = document.getElementById('canvas-wrap');
    canvas.ontouchstart = (event)=> {
        event.preventDefault();
    };
    canvas.ontouchmove = (event)=> {
        event.preventDefault();
    };

    //tool
    tool = new Tool();


    // undo redu
    document.getElementById("undo").addEventListener("click", ()=>{
        if(lines.length <= 0) {
            return;
        }
        delline.push(lines.pop())
    });
    document.getElementById("redo").addEventListener("click", ()=>{
        if(delline.length <= 0) {
            return;
        }
        lines.push(delline.pop());        
    });
});


let lines = [];
let delline = [];
let isDrawing = false;
let nowline = null;
let tool = null;

function touchStarted() {
    if(mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height){
        //console.log("out of canvs");
        return;
    }
    isDrawing = true;
    const l = new Line(tool.type, tool.color, tool.width);
    lines.push(l);
    nowline = l;
}
function touchMoved() {
    if (!isDrawing) {
        return;
    }
    nowline.addPoint(mouseX,mouseY);
}
function touchEnded() {
    isDrawing = false;
}

class Tool {
    constructor(){
        this.pen = document.getElementById("pen");
        this.eraser = document.getElementById("eraser");
        this.colorpicker = document.getElementById("color");
        this.widthrange = document.getElementById("penWeight");

        this.pen.addEventListener("input", ()=>{
            this.setType();
        });
        this.eraser.addEventListener("input", ()=>{
            this.setType();
        });
        this.colorpicker.addEventListener("input", ()=>{
            this.setColor();
        });
        this.widthrange.addEventListener("input", ()=>{
            this.setWidth();
        });

        this.type = "pen";
        this.color = "#000000";
        this.width = "2";

    }

    setType() {
        if(this.pen.checked) {
            this.type = "pen";
        } else if(this.eraser.checked) {
            this.type = "eraser";
        }
        this.setColor();
        this.setWidth();

    }

    setColor() {
        if (this.type === "eraser") {
            this.color = "#ffffff";
        } else {
            this.color = this.colorpicker.value;
        }
    }

    setWidth() {
        if (this.type === "eraser") {
            this.width = this.widthrange.value * 3;
        } else {
            this.width = this.widthrange.value;
        }
    }

    draw() {
        if(this.type === "eraser") {
            stroke("#000000");
            strokeWeight(1);
        } else {
            noStroke();
        }
        fill(this.color);
        circle(mouseX, mouseY, this.width);
    }
}

class Point {
    constructor(_x = 0, _y = 0){
        this.x = _x;
        this.y = _y;
    }
}

class Line {
    constructor(_tooltype, _color, _width){
        this.tooltype = _tooltype;
        this.color = _color;
        this.width = _width;
        this.points = [];
    }

    addPoint(x,y) {
        if(y !== undefined) {
            this.addPoint(new Point(x,y));
            return;
        }
        this.points.push(x);
    }

    draw() {
        //色を設定
        stroke(this.color);
        //太さを設定
        strokeWeight(this.width);

        if(this.points.length === 1){
            const p1 = this.points[0];
            line(p1.x, p1.y, p1.x, p1.y);
            return;
        }

        //線を描画
        for(let i = 0; i < this.points.length - 1; i++){
            const p1 = this.points[i];
            const p2 = this.points[i+1];

            line(p1.x, p1.y, p2.x, p2.y);
        }
    }
}
