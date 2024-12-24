import * as THREE from 'three';
import {Object3D, Scene} from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {Sky} from 'three/addons/objects/Sky.js';

// import GUI from "three/examples/jsm/libs/lil-gui.module.min";

export class BaseScene {
  container: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  floor: THREE.Mesh;
  controls: OrbitControls;
  stats: Stats;
  renderCallbacks: (() => void)[] = [];
  active: boolean = false;
  sun: THREE.Vector3 | undefined;
  // sky: Sky;
  // parameters = {
  //   elevation: 6,
  //   azimuth: 180
  // };

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = this.initRenderer(container);
    this.scene = this.initScene();
    this.camera = this.initCamera(container);
    this.controls = this.initControls(this.renderer, this.camera);
    this.floor = this.initFloor(this.scene);
    this.stats = this.initStats(container);
    // this.sun = this.initSun();
    // this.sky = this.initSky(this.scene);
    this.addWindowListeners();
    this.startAnimate();
    // this.initGui();
  }

  initRenderer(container: HTMLElement) {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    container.appendChild(renderer.domElement);
    renderer.setAnimationLoop(() => {
      this.render();
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    return renderer;
  }

  initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 100);
    return scene;
  }

  initCamera(container: HTMLElement) {
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 100);
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  initFloor(scene: THREE.Scene) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshPhongMaterial({
      color: 0xcbcbcb,
      depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  initControls(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 0, 0);
    controls.minDistance = 1.0;
    controls.maxDistance = 60.0;
    controls.update();
    return controls;
  }

  initStats(container: HTMLElement) {
    const stats = new Stats();
    stats.dom.style.position = "absolute";
    container.appendChild(stats.dom);
    return stats;
  }

  addWindowListeners() {
    window.addEventListener('resize', this.windowResizeHandler);
  }

  addBox() {
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshStandardMaterial({roughness: 0});
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  windowResizeHandler = (function (this: BaseScene) {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }).bind(this);

  startAnimate() {
    this.active = true;
  }

  stopAnimate() {
    this.active = false;
  }

  render() {
    if (!this.active) {
      return;
    }
    this.stats.update();
    this.renderCallbacks.forEach(callback => callback());
    // this.updateSun();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.stopAnimate();
    window.removeEventListener("resize", this.windowResizeHandler);
    this.renderer.dispose();
    this.scene.clear();
  }

  add(object?: Object3D) {
    if (!object) return;
    this.scene?.add(object);
  }

  remove(object?: Object3D) {
    if (!object) return;
    this.scene?.remove(object);
  }

  addRenderCallback(callback: () => void) {
    this.renderCallbacks.push(callback);
  }

  removeRenderCallback(callback: () => void) {
    this.renderCallbacks = this.renderCallbacks.filter(cb => cb !== callback);
  }

  initSun() {
    return new THREE.Vector3();
  }

  initSky(scene: Scene) {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;
    return sky;
  }

  // updateSun() {
  //   const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
  //   const sceneEnv = new THREE.Scene();
  //
  //   let renderTarget: THREE.WebGLRenderTarget | undefined;
  //
  //   const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation);
  //   const theta = THREE.MathUtils.degToRad(this.parameters.azimuth);
  //
  //   this.sun.setFromSphericalCoords(1, phi, theta);
  //
  //   this.sky.material.uniforms['sunPosition'].value.copy(this.sun);
  //
  //   if (renderTarget !== undefined) {
  //     renderTarget.dispose();
  //   }
  //   sceneEnv.add(this.sky);
  //   renderTarget = pmremGenerator.fromScene(sceneEnv);
  //   this.scene.add(this.sky);
  //   this.scene.environment = renderTarget.texture;
  // }

  // initGui() {
  //   const gui = new GUI();
  //   const folderSky = gui.addFolder('Sky');
  //   folderSky.add(this.parameters, 'elevation', 0, 90, 0.1).onChange(this.updateSun.bind(this));
  //   folderSky.add(this.parameters, 'azimuth', -180, 180, 0.1).onChange(this.updateSun.bind(this));
  //   folderSky.open();
  //
  //   // const waterUniforms = this.water.material.uniforms;
  //   //
  //   // const folderWater = this.gui.addFolder('Water');
  //   // folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
  //   // folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
  //   // folderWater.open();
  //
  //   return gui;
  // }
}

