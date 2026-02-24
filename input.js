export const input =
{
forward:false,
back:false,
left:false,
right:false,
boost:false,
hyper:false
}

document.addEventListener("keydown",e=>{

if(e.key==="w") input.forward=true
if(e.key==="s") input.back=true
if(e.key==="a") input.left=true
if(e.key==="d") input.right=true

if(e.shiftKey) input.boost=true

if(e.key==="h") input.hyper=true

})

document.addEventListener("keyup",e=>{

input.forward=false
input.back=false
input.left=false
input.right=false
input.boost=false
input.hyper=false

})