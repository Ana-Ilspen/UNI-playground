export function applyDrag(ship,planet)
{

const d =
ship.position.distanceTo(
planet.position
)

if(d < planet.radius*1.2)
{

ship.velocity.multiplyScalar(.99)

}

}