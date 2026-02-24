export function collide(ship,planet)
{

const d =
ship.position.distanceTo(
planet.position
)

if(d < planet.radius+1)
{

ship.velocity.set(0,0,0)

}

}