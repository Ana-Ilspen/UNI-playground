import {DATABASE} from "./celestialDatabase.js"
import {spawnObject} from "./spawner.js"

const list=document.getElementById("databaseList")
const search=document.getElementById("searchBox")

const placard=document.getElementById("infoPlacard")
const infoName=document.getElementById("infoName")
const infoDesc=document.getElementById("infoDesc")


export function initDatabaseUI(){

render()

search.oninput=render

document.getElementById("collapseBtn").onclick=()=>{

document.getElementById("databasePanel")
.classList.toggle("collapsed")

}

}


function render(){

list.innerHTML=""

DATABASE.forEach(cat=>{

const catDiv=document.createElement("div")

catDiv.className="category"
catDiv.innerText=cat.category

const container=document.createElement("div")

catDiv.onclick=()=>{

container.style.display=
container.style.display==="none"?
"block":"none"

}

list.appendChild(catDiv)
list.appendChild(container)


cat.objects.forEach(obj=>{

if(
!obj.name.toLowerCase()
.includes(search.value.toLowerCase())
)return

const div=document.createElement("div")

div.className="object"
div.innerText=obj.name


div.onclick=()=>{

infoName.innerText=obj.name
infoDesc.innerText=obj.desc

placard.classList.remove("hidden")

}


div.draggable=true

div.ondragend=(e)=>{

spawnObject(obj)

}


container.appendChild(div)

})

})

}
