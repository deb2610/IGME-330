"use strict";

window.onload = init;

// SCRIPT SCOPED VARIABLES

// 1- here we are faking an enumeration - we'll look at another way to do this soon 
const SOUND_PATH = Object.freeze({
    sound1: "media/FinalBoss.mp3",
    sound2: "media/Legend(ft.Backchat)",
    sound3:  "media/Wonderland-RoundThree.mp3",
    sound4:  "media/GoodbyeToAWorld.mp3",
    sound5:  "media/SepticShock.mp3"
    
});

// 2 - elements on the page
let audioElement,canvasElement;

// 3 - our canvas drawing context
let drawCtx

// 4 - our WebAudio context
let audioCtx;

// 5 - nodes that are part of our WebAudio audio routing graph
let sourceNode, analyserNode, gainNode;
let biquadFilter;

// 6 - a typed array to hold the audio frequency data
const NUM_SAMPLES = 256;
// create a new array of 8-bit integers (0-255)
let audioData = new Uint8Array(NUM_SAMPLES/2); 

// 26 - these will help with our pixel effects
let invert = false;
//circle max rad
let maxRadius;
let funValue = 0;
let waveValue = 0;


//this is the visualizer objects
let showBars = false,showCircle = false,showLine = true, showBeatSaber = true, showWave = true;

//mp3
let audio_file;

//ui and canvas color theme
let color1= [255,0,0], color2 = [0,0,255];

//allow the lightshow?
let allowShow = false;

// FUNCTIONS to start the app and load everything
function init(){
    setupWebaudio();
    setupCanvas();
    setupUI();
    update();
}
//this sets up the the Web Audio Api stuff
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

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = NUM_SAMPLES;
    
    // 5 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "allpass";    

    // connect the nodes together
    //source to bi
    sourceNode.connect(biquadFilter);
    //bi to gain
    biquadFilter.connect(gainNode)
    //gain to anal
    gainNode.connect(analyserNode);
    //anal to dest
    analyserNode.connect(audioCtx.destination);

    audio_file = document.querySelector("#trackSelect").value;
    //console.log(audio_file);
}
//this creates the canvas context
function setupCanvas(){
    canvasElement = document.querySelector('canvas');
    drawCtx = canvasElement.getContext("2d");
}
//this sets up the events for the UI
function setupUI(){
    //this fixes an error
    audioCtx.resume().then(() => {
        //console.log('Playback resumed successfully');
      });
    //vol slider event
    let volumeSlider = document.querySelector("#volumeSlider");
    volumeSlider.oninput = e => {
        gainNode.gain.value = e.target.value;
        volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
    };
    volumeSlider.dispatchEvent(new InputEvent("input"));
    // circle slider event
    let circleSlider = document.querySelector("#circleSlider");
    circleSlider.oninput = e => {
        maxRadius = e.target.value;
        circleLabel.innerHTML = e.target.value;
    };
    // fun slider event
    let funSlider = document.querySelector("#funSlider");
    funSlider.oninput = e => {
        funValue = e.target.value;
        funLabel.innerHTML = e.target.value;
    };
    //wave slider event
    let waveSlider = document.querySelector("#waveSlider");
    waveSlider.oninput = e => {
        waveValue = e.target.value;
        waveLabel.innerHTML = e.target.value;
    };

    circleSlider.dispatchEvent(new InputEvent("input"));
    
    document.querySelector("#trackSelect").onchange = e =>{
        audioElement.src = e.target.value;
        audio_file = e.target.value;
        allowShow = false;
        if(e.target.value == "media/GoodbyeToAWorld.mp3"){
            DisplayModal();
        }
        //console.log(audio_file);
    };

    //all of these are the checkboxes for visualizers
    let visInvert = document.querySelector("#checkInvert").onclick = e =>{
        invert = !invert;
    };    
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
    let visWave = document.querySelector("#Wave").onclick = e =>{
        showWave = !showWave;
    };
    //fullscreen
    document.querySelector("#fsButton").onclick = _ =>{
        requestFullscreen(canvasElement);
    };
    //change track
    if(document.querySelector("#trackSelect").value == "media/GoodbyeToAWorld.mp3"){
        DisplayModal();
    }
    
}
//runs everyframe and shows on canvas
function update() { 
    // this schedules a call to the update() method in 1/60 seconds
    requestAnimationFrame(update);
   
   // populate the audioData with the frequency data
   analyserNode.getByteFrequencyData(audioData);
 
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
   
   //stage line grad
   let gradLines = drawCtx.createRadialGradient(canvasElement.width/2, canvasElement.height/2, 0, canvasElement.width/2, canvasElement.height/2, 300);
   gradLines.addColorStop(0, makeColor(color2[0]/4+180,color2[1]/4+180,color2[2]/4+180,255));
   gradLines.addColorStop(.5, makeColor(color2[0]/4+160,color2[1]/4+160,color2[2]/4+160,255));
   gradLines.addColorStop(1, makeColor(color2[0]/2+100,color2[1]/2+100,color2[2]/2+100,255));
   drawCtx.strokeStyle = gradLines;

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
    let grad = drawCtx.createRadialGradient(canvasElement.width/2, canvasElement.height/2, 0, canvasElement.width/2, canvasElement.height/2, 300);
    grad.addColorStop(0, makeColor(color2[0]/4+180,color2[1]/4+180,color2[2]/4+180,255));
    grad.addColorStop(.7, makeColor(0,0,0,0));
    drawCtx.fillStyle = grad;
    drawCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // this shows the waveform
    if(showWave){
        analyserNode.getByteTimeDomainData(audioData); // waveform data
        let grad = drawCtx.createRadialGradient(canvasElement.width/2, canvasElement.height/2, 0, canvasElement.width/2, canvasElement.height/2, 300);
        grad.addColorStop(0, makeColor(color2[0]/4+180,color2[1]/4+180,color2[2]/4+180,255));
        grad.addColorStop(.5, makeColor(color2[0]/4+160,color2[1]/4+160,color2[2]/4+160,255));
        drawCtx.strokeStyle = grad;
        drawCtx.lineWidth = 2;
        funValue = document.querySelector("#funSlider").value;
        let waveY = 3*canvasElement.height/4;
        let waveStartX = 1*canvasElement.width/4;
        let waveEndX = 3*canvasElement.width/4;
        
        drawCtx.beginPath();
        moveTo(waveStartX,waveY);
        drawCtx.strokeStyle = makeColor(255,255,255,255);
        drawCtx.bezierCurveTo(waveStartX, waveY, canvasElement.width/2, audioData[waveValue]+175, waveEndX, waveY);
        drawCtx.strokeStyle = grad;
        drawCtx.stroke();
        
        analyserNode.getByteFrequencyData(audioData);

    }
    for(let i=0; i<audioData.length; i++) { 
        
        if(showCircle){
            let percent = audioData[i] / 255; 
            let circleRadius = percent * maxRadius; 
            
            //dark color1
            drawCtx.beginPath(); 
            drawCtx.fillStyle = makeColor(color1[0]-50,color1[1]-50,color1[2]-50,.2-percent/10.0);
            drawCtx.arc(0,0, circleRadius * 1.5,0,2 *Math.PI,false);
            drawCtx.fill();
            drawCtx.closePath();
            //color2
            drawCtx.beginPath(); 
            drawCtx.fillStyle = makeColor(color1[0],color1[1],color1[2],.3-percent/5.0);
            drawCtx.arc(0,0, circleRadius * .5,0,2 *Math.PI,false);
            drawCtx.fill();
            drawCtx.closePath();

            //dark color2
            drawCtx.beginPath(); 
            drawCtx.fillStyle = makeColor(color2[0]-50,color2[1]-50,color2[2]-50,.2-percent/10.0);
            drawCtx.arc(canvasElement.width,0, circleRadius * 1.5,0,2 *Math.PI,false);
            drawCtx.fill();
            drawCtx.closePath();
            //color2
            drawCtx.beginPath(); 
            drawCtx.fillStyle = makeColor(color2[0],color2[1],color2[2],.3-percent/5.0);
            drawCtx.arc(canvasElement.width,0, circleRadius * .5,0,2 *Math.PI,false);
            drawCtx.fill();
            drawCtx.closePath();

        }
        //shows the rectangle bars
        if(showBars){
        // the higher the amplitude of the sample (bin) the taller the bar
        drawCtx.fillStyle = makeColor(color1[0],color1[1],color1[2],.5); 
        // remember we have to draw our bars left-to-right and top-down
        drawCtx.fillRect(i * (barWidth + barSpacing),topSpacing + 200-audioData[i],barWidth,barHeight); 
        
        //inverted bars
        drawCtx.fillStyle = makeColor(color2[0],color2[1],color2[2],.5); 
        
        // the higher the amplitude of the sample (bin) the taller the bar
        // remember we have to draw our bars left-to-right and top-down
        drawCtx.fillRect(640 - i * (barWidth + barSpacing),topSpacing + 200-audioData[i] ,barWidth,barHeight); 
        }
        
        
    }
    //beatsaber
    if(showBeatSaber){        
        // Manipulate it again
        drawCtx.save();
        drawBeatSaber(drawCtx,2*canvasElement.width/8,canvasElement.height/2,50+audioData[30]*.5  ,color1[0],color1[1],color1[2]);
        drawBeatSaber(drawCtx,6*canvasElement.width/8,canvasElement.height/2,50+audioData[70]*.5  ,color2[0],color2[1],color2[2]);
        drawCtx.restore();
        //-audioData[0]*.5 
    }
    //shows the gradient freq line
    if(showLine){
        let grad = drawCtx.createLinearGradient(0, 0, 600, 0);
            grad.addColorStop(0, makeColor(color1[0],color1[1],color1[2],255));
            grad.addColorStop(1, makeColor(color2[0],color2[1],color2[2],255));
        drawCtx.strokeStyle = grad; 
        drawCtx.lineWidth = 2;
        drawCtx.beginPath();
        funValue = document.querySelector("#funSlider").value;
        funLabel.innerHTML = funValue;
        for(let i=0; i<audioData.length; i++) { 
            moveTo(0,200);
            drawCtx.strokeStyle = makeColor(255,255,255,255);
            //console.log("Fun: "+funValue)
            drawCtx.lineTo(i*6,390- (audioData[i]*funValue));
            drawCtx.strokeStyle = grad;//makeColor(audioData[i]+250,audioData[i]+20,audioData[i]+100,255);
            drawCtx.stroke();
        }
    }
    //method calls to the other scripts
    manipulatePixels(drawCtx);
    bpmAnimate();
    ModUI();
    ModAudio();
    

}

