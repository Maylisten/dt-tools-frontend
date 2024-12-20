import * as THREE from 'three';
import {HemisphereLight} from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export class BaseScene {
  container: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  hemiLight: HemisphereLight;
  dirLight: THREE.DirectionalLight;
  floor: THREE.Mesh;
  controls: OrbitControls;
  stats: Stats;
  renderCallbacks: (() => void)[] = [];
  active: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = this.initRenderer(container);
    this.scene = this.initScene();
    this.camera = this.initCamera(container);
    this.controls = this.initControls(this.renderer, this.camera);
    this.hemiLight = this.initHemiLight(this.scene);
    this.dirLight = this.initDirLight(this.scene);
    this.floor = this.initFloor(this.scene);
    this.stats = this.initStats(container);
    this.addWindowListeners();
    this.startAnimate();
    // this.addBox();
  }

  initRenderer(container: HTMLElement) {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    renderer.setAnimationLoop(() => {
      this.render();
    });
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
    camera.position.set(1, 2, -3);
    camera.lookAt(0, 1, 0);
    return camera;
  }

  initHemiLight(scene: THREE.Scene) {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    return hemiLight;
  }

  initDirLight(scene: THREE.Scene) {
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(-3, 10, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);
    return dirLight;
  }

  initFloor(scene: THREE.Scene) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({
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
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();
    return controls;
  }

  initStats(container: HTMLElement) {
    const stats = new Stats();
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
    this.renderer.render(this.scene, this.camera);
    this.renderCallbacks.forEach(callback => callback());
  }

  destroy() {
    this.stopAnimate();
    window.removeEventListener("resize", this.windowResizeHandler);
    this.scene?.clear();
  }
}

