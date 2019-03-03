// HELPER FUNCTIONS

//this creates a color from rgb values
function makeColor(red, green, blue, alpha){
    var color='rgba('+red+','+green+','+blue+', '+alpha+')';
    return color;
}
//executes fullscreen
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};
//this creates a beatsaber block
function drawBeatSaber(ctx,x,y,size,r,g,b){
    x=x-(size/2);
    y=y-(size/2);

    let radius = size/5;
    ctx.lineWidth = size/10;
    ctx.strokeStyle = makeColor(r-100,g-100,b-100,255);
    ctx.fillStyle = makeColor(r,g,b,255);
    // Different radii for each corner, others default to 0
    roundRect(ctx, x, y, size, size, radius, true);
    ctx.fillStyle = makeColor(255,255,255,255);

    ctx.beginPath();
    ctx.moveTo(x+(size*.15), y+(size*.20));
    ctx.lineTo(x+(size*.85), y+(size*.20));
    ctx.lineTo(x+(size*.5), y+(size*.4));
    ctx.fill();
    
}
//this code was sourced from https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
    stroke = true;
    }
    if (typeof radius === 'undefined') {
    radius = 5;
    }
    if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
    let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (let side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
    }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
    ctx.fill();
    }
    if (stroke) {
    ctx.stroke();
    }

};
//this does the photoshop-like effects
function manipulatePixels(ctx){
    let imageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);

    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    for(let i = 0; i < length; i+=4){
        
        if(invert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i+1] = 255 - green;
            data[i+2] = 255 - blue;
            //data[i+3] is alpha
        }
    }

    
    ctx.putImageData(imageData,0,0);
}
//This code was sourced from W3 schools tutorial for making nice models
//https://www.w3schools.com/w3css/w3css_modal.asp
let modal = document.querySelector('#myModal');

// Get the <span> element that closes the modal
let close = document.querySelector(".close");
let yes = document.querySelector("#btnYes");
let no = document.querySelector("#btnNo");

// When the user clicks the button, open the modal 
function DisplayModal(){
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
close.onclick = function() {
    modal.style.display = "none";
}
yes.onclick = function() {
    allowShow = true;
    modal.style.display = "none";
}
no.onclick = function() {
    allowShow = false;
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
