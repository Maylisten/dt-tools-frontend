import * as Three from 'three';

// randomDest: Returns a random destination in the 3D space
const randomDest = (): Three.Vector3 => {
  const randomEnd = new Three.Vector3();
  randomEnd.x = Three.MathUtils.randFloatSpread(2);
  randomEnd.z = Three.MathUtils.randFloatSpread(2);
  randomEnd.y = 10;
  return randomEnd;
};

// randomStart: Randomly pick a position in a sphere
const randomStart = (): Three.Vector3 => {
  const vec = new Three.Vector3();
  const radius = 3;
  const ang = 2 * Math.PI;
  const phi = Math.random() * ang + Three.MathUtils.randFloatSpread(0.2 * Math.PI);
  const theta = Math.random() * ang + Three.MathUtils.randFloatSpread(0.2 * Math.PI);

  vec.x = Three.MathUtils.randFloat(0, radius * Math.sin(phi) * Math.cos(theta));
  vec.y = 0.2 * Three.MathUtils.randFloat(0, radius * Math.cos(phi));
  vec.z = Three.MathUtils.randFloat(0, radius * Math.sin(phi) * Math.sin(theta));
  return vec;
};

// randomParticleVel: Randomly generate a particle velocity vector based on a centrality value
const randomParticleVel = (centrality: number): Three.Vector3 => {
  const vec = new Three.Vector3();
  const xrad = 2 * Math.PI * Math.random() + Three.MathUtils.randFloatSpread(0.4 * Math.PI);
  const zrad = 2 * Math.PI * Math.random() + Three.MathUtils.randFloatSpread(0.4 * Math.PI);
  vec.x = Math.cos(xrad);
  vec.y = centrality;
  vec.z = Math.sin(zrad);
  vec.normalize();
  return vec;
};

// random2DVec: Returns a random position between two 2D points
const random2DVec = (start: Three.Vector3, end: Three.Vector3): Three.Vector3 => {
  const pos = start.clone();
  const vec = new Three.Vector3().subVectors(end, start);
  vec.multiplyScalar(Math.random());
  pos.add(vec);
  return pos;
};

// unitDirection: Returns the unit direction vector from start to end
const unitDirection = (start: Three.Vector3, end: Three.Vector3): Three.Vector3 => {
  return new Three.Vector3().subVectors(end, start).normalize();
};

// rgbArrToThreeColor: Converts an RGB array to a Three.js Color object
const rgbArrToThreeColor = (rgb: number[]): Three.Color => {
  rgb = rgb.map(v => v / 256); // Normalize the values
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
