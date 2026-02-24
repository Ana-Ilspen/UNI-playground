export function createHUD(){
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.style.position = 'absolute';
  hud.style.bottom = '10px';
  hud.style.left = '10px';
  hud.style.color = 'white';
  hud.style.background = 'rgba(0,0,0,0.5)';
  hud.style.padding = '6px';
  hud.style.borderRadius = '5px';
  document.body.appendChild(hud);
  return hud;
}

export function updateHUD(hud, camera, selectedBody){
  if(!hud) return;
  let txt = `Camera: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)})`;
  if(selectedBody) txt += `<br>Selected: ${selectedBody.type} Mass:${selectedBody.mass}`;
  hud.innerHTML = txt;
}
