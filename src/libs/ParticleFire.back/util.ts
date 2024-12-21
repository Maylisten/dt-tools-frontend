import * as Three from 'three';

const randomDest = () => {
  const randomEnd = new Three.Vector3();
  randomEnd.x = Three.MathUtils.randFloatSpread(2);
  randomEnd.z = Three.MathUtils.randFloatSpread(2);
  randomEnd.y = 10;
  return randomEnd;
};

// randomly pick a position in a sphere
const randomStart = () => {
  const vec = new Three.Vector3();
  const radius = 3;
  const ang =  2 * Math.PI ;
  const phi = Math.random() * ang + Three.MathUtils.randFloatSpread(0.2 * Math.PI);
  const theta = Math.random() * ang + Three.MathUtils.randFloatSpread(0.2 * Math.PI);

  vec.x = Three.MathUtils.randFloat(0, radius * Math.sin(phi) * Math.cos(theta));
  vec.y = 0.2 * Three.MathUtils.randFloat(0, radius * Math.cos(phi));
  vec.z = Three.MathUtils.randFloat(0, radius * Math.sin(phi) * Math.sin(theta));
  return vec;
};

const randomParticleVel = (centrality) => {
  const vec = new Three.Vector3();
  const xrad = 2 * Math.PI * Math.random() + Three.MathUtils.randFloatSpread(0.4 * Math.PI);
  const zrad = 2 * Math.PI * Math.random() + Three.MathUtils.randFloatSpread(0.4 * Math.PI);
  vec.x = Math.cos(xrad);
  vec.y = centrality;
  vec.z = Math.sin(zrad);
  vec.normalize();
  return vec;
};

const random2DVec = (start, end) => {
  const pos = start.clone();
  const vec = new Three.Vector3().subVectors(end, start);
  vec.multiplyScalar(Math.random());
  pos.add(vec);
  return pos;
};

const unitDirection = (start, end) => {
  return new Three.Vector3().subVectors(end, start).normalize();
};

const rgbArrToThreeColor = (rgb) => {
  rgb = rgb.map(v => v / 256);
  return new Three.Color(rgb[0], rgb[1], rgb[2]);
};

export {
  randomDest,
  randomStart,
  random2DVec,
  randomParticleVel,
  unitDirection,
  rgbArrToThreeColor
};
