import * as Three from 'three';
import {randomParticleVel, randomStart, rgbArrToThreeColor} from './util';
import vertexShader from './shaders/particle.vert';
import fragmentShader from './shaders/particle.frag';
import SimplexNoise from 'simplex-noise';

const MAXIMUM_PARTICLE_NUM = 6000;
const DEFAULT_PARTICLE_NUM = 3000;
const DEFAULT_SIZE = 0.6;
const MINIMUM_SIZE = 0.01;
const MAXIMUM_SIZE = 4;
const DEFAULT_SIZE_VARIANCE = 0.5;
const MAX_SIZE_VARIANCE = 1;
const MIN_SIZE_VARIANCE = 0;
const DEFUALT_ALPHA = 0.6;
const DEFAULT_SPEED = 120;
const MAX_SPEED = 200;
const MIN_SPEED = 50;
const DEFAULT_SPEED_VARIANCE = 0.5;
const MAX_SPEED_VARIANCE = 1;
const MIN_SPEED_VARIANCE = 0;
const DEFAULT_FADING_SPEED = 0.0085;
const MAXIMUM_FADING_SPEED = 0.03;
const MINIMUM_FADING_SPEED = 0.001;
const MIN_CENTRALITY = 1;
const DEFAULT_CENTRALITY = 5;
const MAX_CENTRALITY = 10;
const DEFAULT_RGB = [245.82, 102, 25];
const DEFAULT_FIRE_HEIGHT = 10;
const DEFAULT_TEXTURE_OPTION = 'gradient.png';

const TEXTURE_OPTIONS = [
  'gradient.png',
  'explosion.png',
  'flame.png',
  'symbol_02.png',
  'flame_03.png',
  'smoke_05.png',
  'star_01.png',
  'muzzle_02.png',
  'heart.png',
  'smile.png',
];

// per second
const DEFAULT_PARTICLE_SPAWN_SPEED = 1600;
const WIND_LOCATION = new Three.Vector3(0, 1, 4);

const ParticleOptions = {
  size: {
    default: DEFAULT_SIZE,
    min: MINIMUM_SIZE,
    max: MAXIMUM_SIZE,
  },
  sizeVarience: {
    default: DEFAULT_SIZE_VARIANCE,
    min: MIN_SIZE_VARIANCE,
    max: MAX_SIZE_VARIANCE,
  },
  speed: {
    default: DEFAULT_SPEED,
    min: MIN_SPEED,
    max: MAX_SPEED,
  },
  speedVarience: {
    default: DEFAULT_SPEED_VARIANCE,
    min: MIN_SPEED_VARIANCE,
    max: MAX_SPEED_VARIANCE,
  },
  centrality: {
    default: DEFAULT_CENTRALITY,
    min: MIN_CENTRALITY,
    max: MAX_CENTRALITY,
  },
  fadingSpeed: {
    default: DEFAULT_FADING_SPEED,
    min: MINIMUM_FADING_SPEED,
    max: MAXIMUM_FADING_SPEED,
  },
  color: {
    default: DEFAULT_RGB,
  },
  wind: {
    default: false,
  },
  windStrength: {
    default: 5,
    min: 1,
    max: 10,
  },
  texture: {
    default: DEFAULT_TEXTURE_OPTION,
    options: TEXTURE_OPTIONS,
  },
};

const PARTICLE_STATE = {
  DEACTIVE: 0,
  ACTIVE: 1,
};

const defaultTexture = 'gradient.png';

interface Particle {
  position: Three.Vector3;
  vel: Three.Vector3;
  speed: number;
  size: number;
}

export default class ParticleFire {
  options: Record<string, any>;
  position: Float32Array;
  vel: Float32Array;
  size: Float32Array;
  speed: Float32Array;
  alpha: Float32Array;
  particleState: Uint8Array;
  prevElapsed: number;
  time: number;
  particleNumber: number;
  numShouldGen: number;
  center: Three.Vector3;
  geometry: Three.BufferGeometry;
  material: Three.ShaderMaterial;
  particleSystem: Three.Points;

  constructor(options: Record<string, any>) {
    this.options = {
      size: DEFAULT_SIZE,
      sizeVarience: DEFAULT_SIZE_VARIANCE,
      speed: DEFAULT_SPEED,
      speedVarience: DEFAULT_SPEED_VARIANCE,
      fadingSpeed: DEFAULT_FADING_SPEED,
      particleNum: DEFAULT_PARTICLE_NUM,
      centrality: DEFAULT_CENTRALITY,
      color: DEFAULT_RGB,
      wind: false,
      windStrength: 10,
      texture: DEFAULT_TEXTURE_OPTION,
    };

    this.bulkSetAttrs(options);

    this.position = new Float32Array(MAXIMUM_PARTICLE_NUM * 3);
    this.vel = new Float32Array(MAXIMUM_PARTICLE_NUM * 3);
    this.size = new Float32Array(MAXIMUM_PARTICLE_NUM);
    this.speed = new Float32Array(MAXIMUM_PARTICLE_NUM);
    this.alpha = new Float32Array(MAXIMUM_PARTICLE_NUM);
    this.particleState = new Uint8Array(MAXIMUM_PARTICLE_NUM);

    this.prevElapsed = 0;
    this.time = 0;
    this.particleNumber = 0;
    this.numShouldGen = 0.0;

    this.init();

    this.center = new Three.Vector3(0, 0, 0);
    this.geometry = new Three.BufferGeometry();

    this.geometry.setAttribute('position', new Three.BufferAttribute(this.position, 3));
    this.geometry.setAttribute('size', new Three.BufferAttribute(this.size, 1));
    this.geometry.setAttribute('alpha', new Three.BufferAttribute(this.alpha, 1));

    const texture = this.loadTexture(defaultTexture);
    texture.wrapS = Three.ClampToEdgeWrapping;
    texture.wrapT = Three.ClampToEdgeWrapping;
    texture.minFilter = Three.LinearFilter;

    const uniforms = {
      tex: {
        value: texture,
      },
      color: {
        value: rgbArrToThreeColor(this.options.color),
      },
    };

    this.material = new Three.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      blending: Three.CustomBlending,
      depthTest: false,
      transparent: true,
    });

    this.material.blending = Three.CustomBlending;
    this.material.blendSrc = Three.SrcAlphaFactor;
    this.material.blendDst = Three.DstAlphaFactor;

    this.particleSystem = new Three.Points(this.geometry, this.material);
  }

  setAttr(key: string, val: any): void {
    if (Object.hasOwn(this.options, key) && val !== undefined && this.options[key] !== val) {
      if (key === 'color') {
        this.options[key] = rgbArrToThreeColor(val);
        this.material.uniforms.color.value = this.options[key];
      } else {
        if (key === 'texture') {
          this.material.uniforms.tex.value = this.loadTexture(val);
        }
        this.options[key] = val;
      }
    }
  }

  bulkSetAttrs(options: Record<string, any>): void {
    for (const k in options) {
      this.setAttr(k, options[k]);
    }
  }

  setParticleNum(num: number): void {
    if (num !== this.options.particleNum) {
      for (let i = 0; i < MAXIMUM_PARTICLE_NUM; i++) {
        if (i < num && this.particleState[i] === PARTICLE_STATE.DEACTIVE) {
          this.particleState[i] = PARTICLE_STATE.ACTIVE;
          this.alpha[i] = 0;
        }
        if (i >= num && this.particleState[i] === PARTICLE_STATE.ACTIVE) {
          this.particleState[i] = PARTICLE_STATE.DEACTIVE;
          this.alpha[i] = 0;
        }
      }
      this.options.particleNum = num;
    }
  }

  loadTexture(name: string): Three.Texture {
    const loader = new Three.TextureLoader();
    return loader.load(`textures/fire/${name}`);
  }

  init(): void {
    for (let i = 0; i < MAXIMUM_PARTICLE_NUM; i++) {
      this.alpha[i] = 0;
      this.particleState[i] = PARTICLE_STATE.DEACTIVE;
    }
  }

  appendParticle(): void {
    const i = this.particleNumber;
    this.particleState[i] = PARTICLE_STATE.ACTIVE;

    const index = i * 3;
    const particle = this.createParticle();

    this.position[index] = particle.position.x;
    this.position[index + 1] = particle.position.y;
    this.position[index + 2] = particle.position.z;

    this.vel[index] = particle.vel.x;
    this.vel[index + 1] = particle.vel.y;
    this.vel[index + 2] = particle.vel.z;

    this.size[i] = particle.size;
    this.speed[i] = particle.speed;
    this.alpha[i] = DEFUALT_ALPHA;
    this.particleNumber += 1;
  }

  createParticle(): Particle {
    const start = randomStart();
    const vel = randomParticleVel(this.options.centrality);
    const speed = this.options.speed + Three.MathUtils.randFloatSpread(
      this.options.speed * this.options.speedVarience
    );
    const size = this.options.size + Three.MathUtils.randFloatSpread(
      this.options.size * this.options.sizeVarience
    );
    return {
      position: start,
      vel,
      speed,
      size,
    };
  }

  update(elapsed: number): void {
    const pos = this.particleSystem.geometry.attributes.position.array;
    const alpha = this.particleSystem.geometry.attributes.alpha.array;
    const noiseGen = new SimplexNoise(elapsed);

    const elapsedMs = elapsed - this.prevElapsed;
    this.prevElapsed = elapsed;

    if (this.particleNumber < this.options.particleNum) {
      this.numShouldGen += elapsedMs * DEFAULT_PARTICLE_SPAWN_SPEED;
      while (this.numShouldGen > 0.0) {
        this.appendParticle();
        this.numShouldGen -= 1.0;
      }
    }

    for (let i = 0; i < this.particleNumber; i++) {
      const index = i * 3;

      if (alpha[i] <= 0) {
        const particle = this.createParticle();

        pos[index] = particle.position.x;
        pos[index + 1] = particle.position.y;
        pos[index + 2] = particle.position.z;

        this.vel[index] = particle.vel.x;
        this.vel[index + 1] = particle.vel.y;
        this.vel[index + 2] = particle.vel.z;

        this.speed[i] = particle.speed;
        this.size[i] = particle.size;
        alpha[i] = 0.6;
      } else {
        const speed = this.speed[i] / 1000;

        if (!this.options.wind) {
          pos[index] += this.vel[index] * speed;
          pos[index + 1] += this.vel[index + 1] * speed;
          pos[index + 2] += this.vel[index + 2] * speed;
        } else {
          const currentPos = new Three.Vector3(pos[index], pos[index + 1], pos[index + 2]);
          const currentVel = new Three.Vector3(this.vel[index], this.vel[index + 1], this.vel[index + 2]);
          const windDirect = new Three.Vector3().subVectors(WIND_LOCATION, currentPos);
          const windStrength = windDirect.length();
          const turbulence = noiseGen.noise3D(pos[index], 100, pos[index + 2]);

          windDirect
            .normalize()
            .addScalar(turbulence)
            .multiplyScalar(Math.tanh(this.options.windStrength / windStrength));

          currentVel
            .add(windDirect)
            .normalize();

          pos[index] += currentVel.x * speed;
          pos[index + 1] += currentVel.y * speed;
          pos[index + 2] += currentVel.z * speed;
        }

        const fadeFactor = new Three.Vector2(pos[index], pos[index + 2]).length();
        alpha[i] -= this.options.fadingSpeed + Math.tanh(1.5 * fadeFactor) * 0.01;
      }
    }

    this.particleSystem.geometry.attributes.size.needsUpdate = true;
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    this.particleSystem.geometry.attributes.alpha.needsUpdate = true;
  }
}

export {ParticleOptions};
