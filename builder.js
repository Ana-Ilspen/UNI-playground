export function builder(createPlanet)
{

const panel =
document.getElementById("builder")

panel.innerHTML=`

Mass
<input id="mass" value="500">

Radius
<input id="radius" value="5">

<button id="create">Create Planet</button>

`

document.getElementById("create").onclick=()=>
{

createPlanet(
Number(mass.value),
Number(radius.value)
)

}

}