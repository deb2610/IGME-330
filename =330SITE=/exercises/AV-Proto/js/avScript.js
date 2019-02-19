"use strict";

window.onload = init;

// SCRIPT SCOPED VARIABLES
        
// 1- here we are faking an enumeration - we'll look at another way to do this soon 
const SOUND_PATH = Object.freeze({
    sound1: "media/Final Boss.mp3",
    sound2: "media/Legend (ft. Backchat)",
    sound3:  "media/Wonderland - Round Three.mp3",
    sound4:  "media/Goodbye To A World.mp3",
    sound5:  "media/Septic Shock.mp3"

});

// 2 - elements on the page
let audioElement,canvasElement;

// UI
let playButton;

// 3 - our canvas drawing context
let drawCtx

// 4 - our WebAudio context
let audioCtx;

// 5 - nodes that are part of our WebAudio audio routing graph
let sourceNode, analyserNode, gainNode;

// 6 - a typed array to hold the audio frequency data
const NUM_SAMPLES = 256;
// create a new array of 8-bit integers (0-255)
let audioData = new Uint8Array(NUM_SAMPLES/2); 
//circle max rad
let maxRadius;
let funValue = 0;

    // 26 - these will help with our pixel effects
let invert = false, tintRed = false, noise = false, sepia = false, emboss = false; 

let showBars = false,showCircle = false,showLine = true, showBeatSaber = true;

let audio_file;
// FUNCTIONS
function init(){
    setupWebaudio();
    setupCanvas();
    setupUI();
    update();
}

function setupWebaudio(){
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // 2 - get a reference to the <audio> element on the page
    audioElement = document.querySelector("audio");
    audioElement.src = SOUND_PATH.sound4;
    
    // 3 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(audioElement);
    
    // 4 - create an analyser node
    analyserNode = audioCtx.createAnalyser();
    
    /*
    We will request NUM_SAMPLES number of samples or "bins" spaced equally 
    across the sound spectrum.
    
    If NUM_SAMPLES (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */ 
    

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = NUM_SAMPLES;
    
    // 5 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    
    // 6 - connect the nodes - we now have an audio graph
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    
    audio_file = document.querySelector("#trackSelect").value;
    console.log(audio_file);
    CalcBPM(audio_file);
}

function setupCanvas(){
    canvasElement = document.querySelector('canvas');
    drawCtx = canvasElement.getContext("2d");
}

function setupUI(){
    playButton = document.querySelector("#playButton");
    // playButton.onclick = e => {
    //     console.log(`audioCtx.state = ${audioCtx.state}`);
        
    //     // check if context is in suspended state (autoplay policy)
    //     if (audioCtx.state == "suspended") {
    //         audioCtx.resume();
    //     }

    //     if (e.target.dataset.playing == "no") {
    //         audioElement.play();
    //         e.target.dataset.playing = "yes";
    //     // if track is playing pause it
    //     } else if (e.target.dataset.playing == "yes") {
    //         audioElement.pause();
    //         e.target.dataset.playing = "no";
    //     }

    // };
    
    let volumeSlider = document.querySelector("#volumeSlider");
    volumeSlider.oninput = e => {
        gainNode.gain.value = e.target.value;
        volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
    };
    volumeSlider.dispatchEvent(new InputEvent("input"));
    
    let circleSlider = document.querySelector("#circleSlider");
    circleSlider.oninput = e => {
        //gainNode.gain.value = e.target.value;
        maxRadius = e.target.value;
        circleLabel.innerHTML = e.target.value;//Math.round((e.target.value/2 * 100));
    };

    let funSlider = document.querySelector("#funSlider");
    funSlider.oninput = e => {
        //gainNode.gain.value = e.target.value;
        funValue = e.target.value;
        funLabel.innerHTML = e.target.value;//Math.round((e.target.value/2 * 100));
    };

    circleSlider.dispatchEvent(new InputEvent("input"));
    
    document.querySelector("#trackSelect").onchange = e =>{
        audioElement.src = e.target.value;
        audio_file = e.target.value;
        console.log(audio_file);
        // pause the current track if it is playing
        // playButton.dispatchEvent(new MouseEvent("click"));
    };

    // let visRed = document.querySelector("#checkRed").onclick = e =>{
    //     tintRed = !tintRed;
    // };
    // let visInvert = document.querySelector("#checkInvert").onclick = e =>{
    //     invert = !invert;
    // };
    // let visNoise = document.querySelector("#checkNoise").onclick = e =>{
    //     noise = !noise;
    // };
    // let visSepia = document.querySelector("#checkSepia").onclick = e =>{
    //     sepia = !sepia;
    // };
    
    let visBars = document.querySelector("#Bars").onclick = e =>{
        showBars = !showBars;
    };
    let visCircles = document.querySelector("#Circles").onclick = e =>{
        showCircle = !showCircle;
    };
    let visLine = document.querySelector("#Line").onclick = e =>{
        showLine = !showLine;
    };
    let visBeatSaber = document.querySelector("#BeatSaber").onclick = e =>{
        showBeatSaber = !showBeatSaber;
    };

    
    
    // if track ends
    audioElement.onended =  _ => {
        // playButton.dataset.playing = "no";
    };
    
    document.querySelector("#fsButton").onclick = _ =>{
        requestFullscreen(canvasElement);
    };
    
}

function update() { 
    // this schedules a call to the update() method in 1/60 seconds
    requestAnimationFrame(update);
    
    /*
    Nyquist Theorem
    http://whatis.techtarget.com/definition/Nyquist-Theorem
    The array of data we get back is 1/2 the size of the sample rate 
    */
   
   // populate the audioData with the frequency data
   // notice these arrays are passed "by reference" 
   analyserNode.getByteFrequencyData(audioData);
   
   // OR
   //analyserNode.getByteTimeDomainData(audioData); // waveform data
   
   // DRAW!
   drawCtx.clearRect(0,0,800,600);  
   let barWidth = 10;
   let barSpacing = .1;
   let barHeight = 100;
   let topSpacing = 100;
   // background
   
   //stage
   drawCtx.fillStyle = "#222222"
   drawCtx.beginPath();
   drawCtx.moveTo(canvasElement.width/2, canvasElement.height/2);
   drawCtx.lineTo(canvasElement.width/4, 3*canvasElement.height/4);
   drawCtx.lineTo(3*canvasElement.width/4, 3*canvasElement.height/4);
   drawCtx.fill();

   drawCtx.fillRect(canvasElement.width/4, 3*canvasElement.height/4,50,100);
   drawCtx.fillRect(3*canvasElement.width/4, 3*canvasElement.height/4,-50,100);
   
   var gradLines = drawCtx.createRadialGradient(canvasElement.width/2, canvasElement.height/2, 0, canvasElement.width/2, canvasElement.height/2, 300);
   gradLines.addColorStop(0, makeColor(60,115,145,255));
   gradLines.addColorStop(.5, makeColor(115,200,230,255));
   gradLines.addColorStop(1, makeColor(200,255,255,255));

   drawCtx.strokeStyle = gradLines;

//    drawCtx.strokeStyle = "#86C9D2";

   drawCtx.lineWidth = 5;
   //stage line
   drawCtx.beginPath();
   drawCtx.moveTo(canvasElement.width/4,3*canvasElement.height/4);
   drawCtx.lineTo((canvasElement.width/2),canvasElement.height/2);
   drawCtx.lineTo((3*canvasElement.width/4),(3*canvasElement.height/4));
   drawCtx.stroke();
   
   //leftlines
   drawCtx.lineWidth = 3;
   drawCtx.beginPath();
   drawCtx.moveTo(0,canvasElement.height-20);
   drawCtx.lineTo((canvasElement.width/2)-20,canvasElement.height/2);
   drawCtx.lineTo((canvasElement.width/2)+25,0);
   drawCtx.stroke();

   drawCtx.beginPath();
   drawCtx.moveTo(0,20);
   drawCtx.lineTo((canvasElement.width/2)-30,(canvasElement.height/2)-10);  
   drawCtx.stroke();


   //right lines
   drawCtx.beginPath();
   drawCtx.moveTo(canvasElement.width,canvasElement.height-20);
   drawCtx.lineTo((canvasElement.width/2)+20,canvasElement.height/2);
   drawCtx.lineTo((canvasElement.width/2)-25,0);
   drawCtx.stroke();

   drawCtx.beginPath();
   drawCtx.moveTo(canvasElement.width,20);
   drawCtx.lineTo((canvasElement.width/2)+30,(canvasElement.height/2)-10);  
   drawCtx.stroke();
   
   // Create gradient overlay
    var grad = drawCtx.createRadialGradient(canvasElement.width/2, canvasElement.height/2, 0, canvasElement.width/2, canvasElement.height/2, 300);
    grad.addColorStop(0, makeColor(0,170,225,200));
    grad.addColorStop(.7, makeColor(0,0,0,0));
    drawCtx.fillStyle = grad;
    drawCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // loop through the data and draw!
    for(let i=0; i<audioData.length; i++) { 
        
        if(showCircle){
            let percent = audioData[i] / 255; 
            let circleRadius = percent * maxRadius; 
            
            //dark redish
            drawCtx.beginPath(); 
            drawCtx.fillStyle = makeColor(200,0,0,.2-percent/10.0);
            drawCtx.arc(0,0, circleRadius * 1.5,0,2 *Math.PI,false);
            drawCtx.fill();
            drawCtx.closePath();
            //red
            drawCtx.beginPath(); 
            drawCtx.fillStyle = makeColor(255,0,0,.3-percent/5.0);
            drawCtx.arc(0,0, circleRadius * .5,0,2 *Math.PI,false);
            drawCtx.fill();
            drawCtx.closePath();

            //dark redish
            drawCtx.beginPath(); 
            drawCtx.fillStyle = makeColor(0,0,200,.2-percent/10.0);
            drawCtx.arc(canvasElement.width,0, circleRadius * 1.5,0,2 *Math.PI,false);
            drawCtx.fill();
            drawCtx.closePath();
            //red
            drawCtx.beginPath(); 
            drawCtx.fillStyle = makeColor(0,0,255,.3-percent/5.0);
            drawCtx.arc(canvasElement.width,0, circleRadius * .5,0,2 *Math.PI,false);
            drawCtx.fill();
            drawCtx.closePath();

        }
        if(showBars){
        // the higher the amplitude of the sample (bin) the taller the bar
        // remember we have to draw our bars left-to-right and top-down
        drawCtx.fillRect(i * (barWidth + barSpacing),topSpacing + 200-audioData[i],barWidth,barHeight); 
        
        //inverted red
        drawCtx.fillStyle = 'rgba(255,0,0,0.6)'; 
        
        // the higher the amplitude of the sample (bin) the taller the bar
        // remember we have to draw our bars left-to-right and top-down
        drawCtx.fillRect(640 - i * (barWidth + barSpacing),topSpacing + 200-audioData[i] ,barWidth,barHeight); 
        }
        
        
    }
    //beatsaber
    if(showBeatSaber){        
        // Manipulate it again
        drawCtx.save();
        drawBeatSaber(drawCtx,2*canvasElement.width/8,canvasElement.height/2,50+audioData[30]*.5  ,255,0,0);
        drawBeatSaber(drawCtx,6*canvasElement.width/8,canvasElement.height/2,50+audioData[70]*.5  ,0,0,255 );
        drawCtx.restore();
        //-audioData[0]*.5 
    }
    if(showLine){
        var grad = drawCtx.createLinearGradient(0, 0, 600, 0);
            grad.addColorStop(0, "red");
            grad.addColorStop(1, "blue");
        drawCtx.strokeStyle = grad; 
        drawCtx.lineWidth = 2;
        drawCtx.beginPath();
        funValue = document.querySelector("#funSlider").value;

        for(let i=0; i<audioData.length; i++) { 
            moveTo(0,200);
            drawCtx.strokeStyle = makeColor(255,255,255,255);
            //console.log("Fun: "+funValue)
            drawCtx.lineTo(i*6,390- (audioData[i]*funValue));
            drawCtx.strokeStyle = grad;//makeColor(audioData[i]+250,audioData[i]+20,audioData[i]+100,255);
            drawCtx.stroke();
        }
    }


    manipulatePixels(drawCtx);


} 


// HELPER FUNCTIONS
function makeColor(red, green, blue, alpha){
    var color='rgba('+red+','+green+','+blue+', '+alpha+')';
    return color;
}

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
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
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
function manipulatePixels(ctx){
    let imageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);

    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    for(let i = 0; i < length; i+=4){
        if(tintRed){
            data[i] = data[i] +100;
        }
        if(invert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i+1] = 255 - green;
            data[i+2] = 255 - blue;
            //data[i+3] is alpha
        }
        if(noise && Math.random() < .10){
            data[i] = data[i+1] = data[i+2] = 128;
            data[i+3] = 255;
        }
        // 34 - sepia
        if (sepia){
        // You write this!
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = ((red * .393) + (green * .769) + (blue * .189));
            data[i+1] = ((red * .349) + (green * .686) + (blue * .168));
            data[i+2] = ((red * .272) + (green * .534) + (blue * .131));
        }
        //emboss
        if(emboss){
            for(let i = 0; i < length; i++){
                if(i%4 ==3) continue;
                data[i] = 127 + 2*data[i] - data[i+4] - data[i+width*4];
            }
        }
    }

    
    ctx.putImageData(imageData,0,0);
}