import * as THREE from "three";
import {FireShader} from "./FireShader";

export class Fire extends THREE.Mesh {
  constructor(fireTex: THREE.Texture, color: THREE.Color = new THREE.Color(0xeeeeee)) {
    const fireMaterial = new THREE.ShaderMaterial({
      defines: FireShader.defines,
      uniforms: THREE.UniformsUtils.clone(FireShader.uniforms),
      vertexShader: FireShader.vertexShader,
      fragmentShader: FireShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    fireTex.magFilter = fireTex.minFilter = THREE.LinearFilter;
    fireTex.wrapS = fireTex.wrapT = THREE.ClampToEdgeWrapping;

    fireMaterial.uniforms.fireTex.value = fireTex;
    fireMaterial.uniforms.color.value = color;
    fireMaterial.uniforms.invModelMatrix.value = new THREE.Matrix4();
    fireMaterial.uniforms.scale.value = new THREE.Vector3(1, 1, 1);
    fireMaterial.uniforms.seed.value = Math.random() * 19.19;

    // 调用父类构造函数
    super(new THREE.BoxGeometry(1.0, 1.0, 1.0), fireMaterial);
    this.material = fireMaterial;
  }

  update(time?: number): void {
    const material = this.material as THREE.ShaderMaterial;
    const invModelMatrix = material.uniforms.invModelMatrix.value as THREE.Matrix4;

    // 更新世界矩阵
    this.updateMatrixWorld();
    invModelMatrix.copy(new THREE.Matrix4().copy(this.matrixWorld).invert());

    // 更新时间
    if (time !== undefined) {
      material.uniforms.time.value = time;
    }

    material.uniforms.invModelMatrix.value = invModelMatrix;

    // 更新缩放
    material.uniforms.scale.value = this.scale;
  }
}

