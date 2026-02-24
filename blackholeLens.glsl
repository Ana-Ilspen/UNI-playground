// blackholeLens.glsl
uniform sampler2D tDiffuse;    // Rendered scene
uniform vec3 blackHolePos;     // Position in screen space
uniform float strength;        // Lensing strength

varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    // Transform screen UV to center around black hole
    vec2 dir = uv - vec2(0.5); // Black hole at center for simplicity
    float r = length(dir);
    
    // Prevent divide by zero
    float factor = strength / (r*r + 0.001);
    
    // Apply radial distortion
    uv -= dir * factor;

    vec4 color = texture2D(tDiffuse, uv);
    gl_FragColor = color;
}
