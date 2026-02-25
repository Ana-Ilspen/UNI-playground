import {camera} from "./main.js";

let hyperspace=false;

window.addEventListener("keydown",(e)=>{

if(e.key==="h"){

hyperspace=!hyperspace;

}

});

function update(){

if(hyperspace){

camera.position.z-=2000;

}

requestAnimationFrame(update);

}

update();
