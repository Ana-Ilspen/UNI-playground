export function hud(ship)
{

document.getElementById("hud")
.innerHTML=

"Speed: "+
ship.velocity.length().toFixed(2)

}