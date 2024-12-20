// import * as THREE from 'three';
// import {HemisphereLight} from 'three';
//
// import Stats from 'three/addons/libs/stats.module.js';
// import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
// import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
// import {Sky} from 'three/addons/objects/Sky.js';
//
// export class BaseScene {
//   container: HTMLElement;
//   renderer: THREE.WebGLRenderer;
//   scene: THREE.Scene;
//   camera: THREE.PerspectiveCamera;
//   hemiLight: HemisphereLight;
//   dirLight: THREE.DirectionalLight;
//   sun: THREE.Vector3;
//   sky: Sky;
//   floor: THREE.Mesh;
//   controls: OrbitControls;
//   stats: Stats;
//   gui: GUI;
//   parameters = {
//     elevation: 50,
//     azimuth: 180
//   };
//
//   constructor(container: HTMLElement) {
//     this.container = container;
//     this.renderer = this.initRenderer(container);
//     this.scene = this.initScene();
//     this.camera = this.initCamera(container);
//     this.controls = this.initControls(this.renderer, this.camera);
//     this.hemiLight = this.initHemiLight(this.scene);
//     this.dirLight = this.initDirLight(this.scene);
//     // this.sun = this.initSun();
//
//     // this.sky = this.initSky(this.scene);
//     this.floor = this.initFloor(this.scene);
//     this.stats = this.initStats(container);
//     // this.gui = this.initGui();
//     this.addWindowListeners();
//     this.animate();
//
//     // this.addBox();
//   }
//
//   initRenderer(container: HTMLElement) {
//     const renderer = new THREE.WebGLRenderer({antialias: true});
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(container.clientWidth, container.clientHeight);
//     renderer.shadowMap.enabled = true;
//     container.appendChild(renderer.domElement);
//     return renderer;
//   }
//
//   initScene() {
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xa0a0a0);
//     scene.fog = new THREE.Fog(0xa0a0a0, 10, 100);
//     return scene;
//   }
//
//   initCamera(container: HTMLElement) {
//     const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 100);
//     camera.position.set(1, 2, -3);
//     camera.lookAt(0, 1, 0);
//     return camera;
//   }
//
//   initHemiLight(scene: THREE.Scene) {
//     const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
//     hemiLight.position.set(0, 20, 0);
//     scene.add(hemiLight);
//     return hemiLight;
//   }
//
//   initDirLight(scene: THREE.Scene) {
//     const dirLight = new THREE.DirectionalLight(0xffffff, 3);
//     dirLight.position.set(-3, 10, -10);
//     dirLight.castShadow = true;
//     dirLight.shadow.camera.top = 2;
//     dirLight.shadow.camera.bottom = -2;
//     dirLight.shadow.camera.left = -2;
//     dirLight.shadow.camera.right = 2;
//     dirLight.shadow.camera.near = 0.1;
//     dirLight.shadow.camera.far = 40;
//     scene.add(dirLight);
//     return dirLight;
//   }
//
//   initSun() {
//     const sun = new THREE.Vector3();
//     return sun;
//   }
//
//   initSky(scene: THREE.Scene) {
//     const sky = new Sky();
//     sky.scale.setScalar(10000);
//     scene.add(sky);
//     const skyUniforms = sky.material.uniforms;
//     skyUniforms['turbidity'].value = 10;
//     skyUniforms['rayleigh'].value = 2;
//     skyUniforms['mieCoefficient'].value = 0.005;
//     skyUniforms['mieDirectionalG'].value = 0.8;
//     return sky;
//   }
//
//   updateSun() {
//     const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
//     const sceneEnv = new THREE.Scene();
//
//     let renderTarget: THREE.WebGLRenderTarget | undefined;
//
//     const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation);
//     const theta = THREE.MathUtils.degToRad(this.parameters.azimuth);
//
//     this.sun.setFromSphericalCoords(1, phi, theta);
//
//     this.sky.material.uniforms['sunPosition'].value.copy(this.sun);
//
//     if (renderTarget !== undefined) {
//       renderTarget.dispose();
//     }
//     sceneEnv.add(this.sky);
//     renderTarget = pmremGenerator.fromScene(sceneEnv);
//     this.scene.add(this.sky);
//     this.scene.environment = renderTarget.texture;
//   }
//
//   initFloor(scene: THREE.Scene) {
//     const mesh = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({
//       color: 0xcbcbcb,
//       depthWrite: false
//     }));
//     mesh.rotation.x = -Math.PI / 2;
//     mesh.receiveShadow = true;
//     scene.add(mesh);
//     return mesh;
//   }
//
//   initControls(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.maxPolarAngle = Math.PI * 0.495;
//     controls.target.set(0, 10, 0);
//     controls.minDistance = 40.0;
//     controls.maxDistance = 200.0;
//     controls.update();
//     return controls;
//   }
//
//   initStats(container: HTMLElement) {
//     const stats = new Stats();
//     container.appendChild(stats.dom);
//     return stats;
//   }
//
//   initGui() {
//     const gui = new GUI();
//     const folderSky = gui.addFolder('Sky');
//     folderSky.add(this.parameters, 'elevation', 0, 90, 0.1).onChange(this.updateSun.bind(this));
//     folderSky.add(this.parameters, 'azimuth', -180, 180, 0.1).onChange(this.updateSun.bind(this));
//     folderSky.open();
//     return gui;
//   }
//
//   addWindowListeners() {
//     window.addEventListener('resize', this.onWindowResize.bind(this));
//   }
//
//   addBox() {
//     const geometry = new THREE.BoxGeometry(3, 3, 3);
//     const material = new THREE.MeshStandardMaterial({roughness: 0});
//     const mesh = new THREE.Mesh(geometry, material);
//     this.scene.add(mesh);
//   }
//
//   onWindowResize() {
//     this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
//     this.camera.updateProjectionMatrix();
//     this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
//   }
//
//   animate() {
//     // this.updateSun();
//     this.renderer.setAnimationLoop(() => {
//       this.render();
//     });
//   }
//
//   render() {
//     // const time = performance.now() * 0.001;
//     this.stats.update();
//     this.renderer.render(this.scene, this.camera);
//   }
// }
//
