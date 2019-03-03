//make dom objects for color targets
let articleObj = document.querySelector("article");
let headObj = document.querySelector("header");
let footObj = document.querySelector("footer");
let sliderObjs = document.querySelectorAll(".slider::-webkit-slider-thumb");
let checkObjs = document.querySelectorAll(".checkbox");
let radioObjs = document.querySelectorAll(".colorSel");

let rads = document.querySelectorAll(".colorSel");
//console.log(rads);
for (let i=0; i<rads.length; i++) {
        
    rads[i].onchange = function() {
        setGlobalColor(this.value);
    };
}
//sets the theme based on the radio selection form main
function setGlobalColor(colorSelection){
    //console.log( colorSelection  + ' is the color scheme');
    if(colorSelection == "radClassic"){
        color1 = [255,0,0];
        color2 = [0,0,255];
    }
    if(colorSelection == "radPopstar"){
        color1 = [255,0,0];
        color2 = [180,0,255];
    }
    if(colorSelection == "radVapor"){
        color1 = [255,100,200];
        color2 = [70,255,200];
    }
    if(colorSelection == "radFollieFire"){
        color1 = [255,0,0];
        color2 = [245,150,5];
    }
    changeUI();
    
}
//changes the UI colors to mach the canvas
function changeUI(){
    let rgb1 = makeColor(color1[0]-100,color1[1]-100,color1[2]-100,255);
    let rgb2 = makeColor(color2[0]-100,color2[1]-100,color2[2]-100,255);

    articleObj.style.backgroundColor = rgb1;
    headObj.style.backgroundColor = rgb2; 
    footObj.style.backgroundColor = rgb2;

    for (let i=0; i<sliderObjs.length; i++) {
        sliderObjs[i].style.background = rgb2;
    }
}