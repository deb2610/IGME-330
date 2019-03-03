//this method animated the canvas elements to do a lightshow if the sone has on configured
function bpmAnimate(){
  let time = document.querySelector("audio").currentTime;
  //console.log(time);
  let currentSong = document.querySelector("#trackSelect").value;
  if(currentSong == "media/GoodbyeToAWorld.mp3" && allowShow){
    if(time > -1.0){//0.00
      showBars =false;
      showCircle = false;
      showWave = false;
      showLine = false;
      showBeatSaber = true;
    }
    if(time > 30){//0:30
      showWave = true;
    }
    if(time > 45){//0:30
      showLine = true;
    }
    if(time > 105.0){//1:45
      showLine = false;
      showWave = false;
    }
    if(time > 135.0){//2:25
      showWave = true;
    }
    if(time > 163.0){//2:43
      showWave = false;
      showBars = true;
    }
    if(time > 180.0){//3:00
      showLine = true;
    }
    if(time > 181.0){
      document.querySelector("#funSlider").value = .6;
    }
    if(time > 182.0){
      document.querySelector("#funSlider").value = .5;
    }
    if(time > 183.0){
      document.querySelector("#funSlider").value = .7;
    }
    if(time > 184.0){
      document.querySelector("#funSlider").value = .85;
    }
    if(time > 185.0){
      document.querySelector("#funSlider").value =1;
    }
    if(time > 215){//3:35
      showBars = false;
    }
    if(time > 218){//3:38
      showLine = false;
    }
    if(time > 225){//3:45
      showCircle = true;
    }
    if(time > 226){//3:46
      showWave = true;
    }
    if(time > 227){//3:47
      showBars = true;
      showLine = true;
      document.querySelector("#funSlider").value =.3;
    }
    if(time > 240){//4:00
      showBars = false;
      showLine = false;
      showCircle = false;
      showWave = false;
    }
    if(time > 241){//4:00
      showBars = false;
      showLine = true;
      showCircle = true;
      showWave = false;
    }
    if(time > 242){//4:00
      showBars = false;
      showLine = false;
      showCircle = false;
      showWave = false;
    }
    if(time > 243){//4:00
      showBars = true;
      showLine = true;
      showCircle = true;
      showWave = true;
    }
    if(time > 300){//5:00
      showBars = false;
      showCircle = false;
      showWave = false;
    }
    if(time > 320){
      showLine = false;
    }
    if(time >= 330){//5:30
      document.querySelector("#Bars").checked = false;
      document.querySelector("#Circles").checked = false;
      document.querySelector("#Wave").checked = false;
      document.querySelector("#Line").checked = true;
      document.querySelector("#funSlider").value =.5;

      showLine = true;
      allowShow = false;
    }


  }

  
}
//this changes the UI is a lightshow is active, disabling most options
function ModUI(){

  let cSection = document.querySelector("#circleSect");
  let wSection = document.querySelector("#waveSect");
  let fSection = document.querySelector("#funSect");

  let vSection = document.querySelector("#visualizers");

  if(allowShow){
    cSection.style.display = "none";
    wSection.style.display = "none";
    fSection.style.display = "none";

    vSection.style.display = "none";
  }
  else{
    cSection.style.display = "block";
    wSection.style.display = "block";
    fSection.style.display = "block";

    vSection.style.display = "block";
  }

}
//this method modifies the audio to filter it.
function ModAudio(){
  let rads = document.querySelectorAll(".aMod");
  //console.log(rads);
  for (let i=0; i<rads.length; i++) {
      
      rads[i].onchange = function() {
        biquadFilter.type = this.value;
      };
  }
}
