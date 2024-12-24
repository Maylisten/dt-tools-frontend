uniform sampler2D tex;
uniform vec3 color;
varying float v_alpha;

void main() {
    gl_FragColor = vec4(color, v_alpha) * texture2D(tex, gl_PointCoord);
}
