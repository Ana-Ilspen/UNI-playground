const btn =
document.getElementById("infoBtn")

const panel =
document.getElementById("infoPanel")

btn.onclick=()=>
{

panel.style.display =
panel.style.display==="block"
?"none":"block"

panel.innerHTML=`

CONTROLS

WASD = thrust

SHIFT = boost

H = hyperspace

Create planets using builder

Gravity is real

Land by touching planet

`

}