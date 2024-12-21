attribute float size;
attribute float alpha;

varying float v_alpha;

void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 600.0 * size / length(mvPos.xyz);
    v_alpha = alpha;
}