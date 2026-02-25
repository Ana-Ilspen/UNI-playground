import {objects,scene} from "./main.js";

export function saveUniverse(){

let data=objects.map(o=>({

pos:o.position,
data:o.userData

}));

localStorage.setItem("universe",
JSON.stringify(data));

}

export function loadUniverse(){

let data=JSON.parse(
localStorage.getItem("universe")
);

data.forEach(d=>{

// recreate

});

}

window.saveUniverse=saveUniverse;
window.loadUniverse=loadUniverse;
