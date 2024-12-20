import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {Water} from 'three/addons/objects/Water.js';
import {Sky} from 'three/addons/objects/Sky.js';

export class WaterScene {
  container: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  sun: THREE.Vector3;
  water: Water;
  sky: Sky;
  mesh: THREE.Mesh;
  controls: OrbitControls;
  stats: Stats;
  gui: GUI;
  parameters = {
    elevation: 2,
    azimuth: 180
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setAnimationLoop(this.animate.bind(this));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.container.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    this.camera.position.set(30, 30, 100);
    this.sun = new THREE.Vector3();
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    this.water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('textures/waternormals.png', function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: this.scene.fog !== undefined
      }
    );
    this.water.rotation.x = -Math.PI / 2;
    this.scene.add(this.water);

    this.sky = new Sky();
    this.sky.scale.setScalar(10000);
    this.scene.add(this.sky);
    const skyUniforms = this.sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;
    this.updateSun();

    const geometry = new THREE.BoxGeometry(30, 30, 30);
    const material = new THREE.MeshStandardMaterial({roughness: 0});

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 40.0;
    this.controls.maxDistance = 200.0;
    this.controls.update();

    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);

    this.gui = new GUI();
    const folderSky = this.gui.addFolder('Sky');
    folderSky.add(this.parameters, 'elevation', 0, 90, 0.1).onChange(this.updateSun.bind(this));
    folderSky.add(this.parameters, 'azimuth', -180, 180, 0.1).onChange(this.updateSun.bind(this));
    folderSky.open();

    const waterUniforms = this.water.material.uniforms;

    const folderWater = this.gui.addFolder('Water');
    folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
    folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
    folderWater.open();

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  updateSun() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const sceneEnv = new THREE.Scene();

    let renderTarget: THREE.WebGLRenderTarget | undefined;

    const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation);
    const theta = THREE.MathUtils.degToRad(this.parameters.azimuth);

    this.sun.setFromSphericalCoords(1, phi, theta);

    this.sky.material.uniforms['sunPosition'].value.copy(this.sun);
    this.water.material.uniforms['sunDirection'].value.copy(this.sun).normalize();

    if (renderTarget !== undefined) {
      renderTarget.dispose();
    }
    sceneEnv.add(this.sky);
    renderTarget = pmremGenerator.fromScene(sceneEnv);
    this.scene.add(this.sky);
    this.scene.environment = renderTarget.texture;
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    this.render();
    this.stats.update();
  }

  render() {
    const time = performance.now() * 0.001;

    this.mesh.position.y = Math.sin(time) * 20 + 5;
    this.mesh.rotation.x = time * 0.5;
    this.mesh.rotation.z = time * 0.51;

    this.water.material.uniforms['time'].value += 1.0 / 60.0;
    this.renderer.render(this.scene, this.camera);
  }
}

