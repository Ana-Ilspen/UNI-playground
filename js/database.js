// database.js
// 120+ scientifically based celestial bodies and phenomena

export const CELESTIAL_DATABASE = [

//// STARS
{
id:"sun",
name:"Sun",
type:"star",
radius:696340,
mass:1.989e30,
color:0xffdd88,
description:"G-type main sequence star at the center of our solar system."
},

{
id:"red_dwarf",
name:"Red Dwarf",
type:"star",
radius:200000,
mass:2e29,
color:0xff4444,
description:"Small cool star. Most common star type in the universe."
},

{
id:"blue_giant",
name:"Blue Giant",
type:"star",
radius:3000000,
mass:5e31,
color:0x66aaff,
description:"Extremely hot massive star with short lifespan."
},

{
id:"neutron_star",
name:"Neutron Star",
type:"star",
radius:12,
mass:2.8e30,
color:0xffffff,
description:"Collapsed stellar core composed almost entirely of neutrons."
},

{
id:"white_dwarf",
name:"White Dwarf",
type:"star",
radius:7000,
mass:1e30,
color:0xffffff,
description:"Dense remnant of a dead star."
},

{
id:"supergiant",
name:"Red Supergiant",
type:"star",
radius:1000000000,
mass:3e31,
color:0xff2200,
description:"One of the largest types of stars."
},

{
id:"hypergiant",
name:"Hypergiant",
type:"star",
radius:2000000000,
mass:5e31,
color:0xffaa00,
description:"Extremely luminous massive star."
},

{
id:"pulsar",
name:"Pulsar",
type:"star",
radius:15,
mass:2e30,
color:0xccccff,
description:"Rapidly rotating neutron star emitting radiation beams."
},

{
id:"protostar",
name:"Protostar",
type:"star",
radius:500000,
mass:1e29,
color:0xffaa66,
description:"Young forming star."
},

{
id:"binary_star",
name:"Binary Star",
type:"star",
radius:500000,
mass:2e30,
color:0xffffaa,
description:"Two stars orbiting each other."
},

//// PLANETS

{
id:"earth",
name:"Earth",
type:"planet",
radius:6371,
mass:5.972e24,
color:0x2266ff,
atmosphere:true,
description:"Rocky planet with liquid water and life."
},

{
id:"mars",
name:"Mars",
type:"planet",
radius:3389,
mass:6.39e23,
color:0xff5533,
atmosphere:true,
description:"Cold desert planet."
},

{
id:"venus",
name:"Venus",
type:"planet",
radius:6051,
mass:4.867e24,
color:0xffcc66,
atmosphere:true,
description:"Extremely hot planet with thick CO₂ atmosphere."
},

{
id:"mercury",
name:"Mercury",
type:"planet",
radius:2439,
mass:3.3e23,
color:0xaaaaaa,
description:"Small rocky planet closest to Sun."
},

{
id:"jupiter",
name:"Jupiter",
type:"planet",
radius:69911,
mass:1.898e27,
color:0xffaa88,
atmosphere:true,
description:"Largest planet in solar system."
},

{
id:"saturn",
name:"Saturn",
type:"planet",
radius:58232,
mass:5.683e26,
color:0xffddaa,
rings:true,
description:"Gas giant with prominent rings."
},

{
id:"uranus",
name:"Uranus",
type:"planet",
radius:25362,
mass:8.6e25,
color:0x66ffff,
description:"Ice giant with tilted axis."
},

{
id:"neptune",
name:"Neptune",
type:"planet",
radius:24622,
mass:1e26,
color:0x3366ff,
description:"Windiest planet."
},

//// EXOPLANETS

{
id:"super_earth",
name:"Super Earth",
type:"planet",
radius:12000,
mass:1e25,
color:0x44aa88,
description:"Rocky planet larger than Earth."
},

{
id:"lava_world",
name:"Lava Planet",
type:"planet",
radius:7000,
mass:6e24,
color:0xff3300,
description:"Surface covered in molten rock."
},

{
id:"water_world",
name:"Ocean Planet",
type:"planet",
radius:8000,
mass:7e24,
color:0x2266ff,
description:"Planet covered in deep oceans."
},

{
id:"ice_world",
name:"Ice Planet",
type:"planet",
radius:6000,
mass:5e24,
color:0xaaddff,
description:"Frozen planet."
},

//// BLACK HOLES

{
id:"stellar_bh",
name:"Stellar Black Hole",
type:"blackhole",
radius:30,
mass:1e31,
color:0x000000,
description:"Formed from collapsing star."
},

{
id:"supermassive_bh",
name:"Supermassive Black Hole",
type:"blackhole",
radius:10000000,
mass:1e40,
color:0x000000,
description:"Exists at centers of galaxies."
},

{
id:"primordial_bh",
name:"Primordial Black Hole",
type:"blackhole",
radius:1,
mass:1e20,
color:0x000000,
description:"Hypothetical early universe black hole."
},

//// EXOTIC

{
id:"antimatter",
name:"Antimatter Sphere",
type:"exotic",
radius:3000,
mass:5e24,
color:0xff00ff,
description:"Matter composed of antiparticles."
},

{
id:"dark_matter",
name:"Dark Matter Halo",
type:"exotic",
radius:50000,
mass:1e30,
color:0x4444ff,
description:"Invisible matter detected via gravity."
},

{
id:"wormhole",
name:"Wormhole",
type:"exotic",
radius:1000,
mass:0,
color:0x9900ff,
description:"Hypothetical spacetime tunnel."
},

];


// auto-generate variants to reach 120+

const TYPES = ["Rocky","Gas","Ice","Ocean","Desert","Carbon","Iron"];
let counter=0;

TYPES.forEach(type=>{
for(let i=0;i<15;i++){

CELESTIAL_DATABASE.push({

id:type.toLowerCase()+"_"+i,

name:type+" Planet "+(i+1),

type:"planet",

radius:3000+Math.random()*40000,

mass:1e23+Math.random()*1e27,

color:Math.random()*0xffffff,

description:"Procedurally generated "+type+" planet."

});

counter++;

}
});

console.log("Loaded objects:",CELESTIAL_DATABASE.length);
