"use strict"

function setup() {
    let canvas = createCanvas(600, 400);
    const canvas_wrap = document.getElementById("canvas-wrap");
    canvas.parent(canvas_wrap)
    canvas.position(0, 0);
}
  
function draw() {
    fill(0);
    rect(0, 0, width, height/2);
    fill(255);
    rect(0, height/2, width, height/2);
    arc(width/2, height/2, 300, 300, PI, TWO_PI);
    fill(0);
    arc(width/2, height/2, 300, 300, 0, PI);
    arc(width/2, height/2, 290, 290, PI, TWO_PI);
    fill(255);
    arc(width/2, height/2, 290, 290, 0, PI);
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
