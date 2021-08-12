

class Particle{
    constructor(/*canvas,ctx,*/ array,param) {
        this.canvas = document.querySelector("#canvas1")
        this.canvas.width = 1200;
        this.canvas.height = 480;
        this.ctx = this.canvas.getContext("2d");
        //this.canvas = canvas;
        //this.ctx = ctx;
        this.array = array
        this.param = param;
        this.animate();
    }
    update(){

    }
    draw(){
        //const maxElem = Math.max.apply(null,this.array)
        const numElem = this.array.length;
        const elemWidth = this.canvas.width / numElem;
        let gap = Math.min(elemWidth/3,3);

        for(let i = 0; i< this.array.length; i++){
            if(this.param.swaps.elem1 === this.array[i])
            {
                this.ctx.fillStyle = "rgb(255,255,255)";
                this.param.swaps.elem1 = null;
            }
            else if(this.param.swaps.elem2 === this.array[i])
            {
                this.ctx.fillStyle = "rgb(255,255,255)";
                this.param.swaps.elem2 = null;
            }
            else {
                this.ctx.fillStyle = `hsl(${this.array[i] * 360 / numElem},100%,50%`;
            }
            this.ctx.fillRect(i*elemWidth,this.canvas.height,elemWidth - gap, -(this.array[i]*(this.canvas.height) / numElem))
        }
        this.ctx.fillStyle = "white"
        this.ctx.font = "10px Verdana"
        this.ctx.fillText(`Comparisons: ${this.param.comparisons} `, 10, 20)
    }
    animate(){
        this.ctx.fillStyle = `rgba(0,0,0,${this.param.blurEffect})`;
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
        this.draw();
        requestAnimationFrame(() => {this.animate()} )
    }
}