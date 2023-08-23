"use strict"

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
    stroke(0);
    fill(127);
    circle(mouseX, mouseY,30);
}

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
});


let lines = [];
let isDrawing = false;
let nowline = null;
let tool = null;

function touchStarted() {
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
    console.log(lines);
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
        } else {
            this.type = "pen";
        }
    }

    setColor() {
        if (this.tool === "eraser") {
            this.color = "#ffffff";
        } else {
            this.color = this.colorpicker.value;
        }
    }

    setWidth() {
        if (this.eraser.checked) {
            this.width = this.widthrange.value * 3;
        } else {
            this.width = this.widthrange.value;
        }
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
