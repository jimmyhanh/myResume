import * as THREE from './vendor/three.module.min.js';
import { createLuckyCat } from './lucky-cat.js';

export function createCatAccessories(scene) {
  const root = new THREE.Group();
  root.name = 'cat-accessories';
  scene.add(root);
  const material = (color, metalness = 0, roughness = .5) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const red = material('#cf343d'), yarnMaterial = material('#d99681');
  const white = material('#fff6df', .06, .28);
  const dark = material('#383136'), pink = material('#df9c9f'), gray = material('#939bad');
  const sphere = new THREE.SphereGeometry(1, 24, 16);
  function oval(parent, mat, position, scale) {
    const mesh = new THREE.Mesh(sphere, mat);
    mesh.position.set(...position); mesh.scale.set(...scale); parent.add(mesh); return mesh;
  }
  function tube(parent, points, radius, mat) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius, 8, false), mat);
    parent.add(mesh); return mesh;
  }

  const yarn = new THREE.Group(); yarn.name = 'yarn-ball'; root.add(yarn);
  oval(yarn, yarnMaterial, [0, 0, 0], [.36, .36, .36]);
  for (let i = 0; i < 9; i++) {
    const winding = new THREE.Mesh(new THREE.TorusGeometry(.357, .013, 6, 48), yarnMaterial);
    winding.rotation.set(i * .41, i * .71, i * .19); yarn.add(winding);
  }
  tube(yarn, [[0,-.32,0],[.25,-.4,.1],[.51,-.37,.12],[.66,-.5,.06]], .019, yarnMaterial);

  const bowl = new THREE.Group(); bowl.name = 'food-bowl'; root.add(bowl);
  // Closed cross-section with a visible inner wall and a thick ceramic rim.
  const profile = [[0,0],[.4,0],[.48,.035],[.58,.3],[.57,.35],[.52,.35],[.44,.12],[0,.12]].map(p => new THREE.Vector2(...p));
  const vessel = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), red);
  bowl.add(vessel);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.545,.027,8,48), white);
  rim.rotation.x = Math.PI / 2; rim.position.y = .34; bowl.add(rim);
  const food = material('#82522f');
  for (let i = 0; i < 17; i++) {
    const angle = i * 2.39996, radius = .34 * Math.sqrt(i / 17);
    oval(bowl, food, [Math.cos(angle)*radius,.17 + (i % 3)*.018,Math.sin(angle)*radius], [.071,.047,.057]);
  }
  // Small paw mark on the front of the bowl.
  oval(bowl, white, [0,.15,.506],[.073,.052,.013]);
  for (const x of [-.09,0,.09]) oval(bowl, white, [x,.24,.547],[.027,.03,.012]);

  const mouse = new THREE.Group(); mouse.name = 'mouse-toy'; root.add(mouse);
  oval(mouse, gray, [0,0,0],[.29,.2,.45]);
  oval(mouse, pink, [0,-.015,.43],[.06,.045,.055]);
  for (const side of [-1,1]) {
    oval(mouse, gray, [side*.18,.18,.14],[.125,.14,.065]);
    oval(mouse, pink, [side*.18,.185,.191],[.078,.088,.018]);
    oval(mouse, dark, [side*.15,.085,.32],[.024,.024,.024]);
  }
  tube(mouse, [[0,0,-.38],[.2,0,-.63],[.38,.04,-.74],[.28,.1,-.91]], .023, pink);

  const { statue, wavingPaw } = createLuckyCat();
  root.add(statue);

  let span=2.7;
  function resize(camera) {
    const halfWidth=Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z*camera.aspect;
    span=THREE.MathUtils.clamp(halfWidth-1,1.55,3.25);
    const scale=halfWidth<3.4?.78:1;
    yarn.scale.setScalar(scale);bowl.scale.setScalar(scale);mouse.scale.setScalar(scale);statue.scale.setScalar(.6*scale);
  }
  function update(time, progress) {
    yarn.position.set(-span,.9+Math.sin(time*1.05)*.1,-.55);
    yarn.rotation.set(.15,time*.16+progress*.6,-.2);
    bowl.position.set(-span*.84,-1.05+Math.sin(time*.85+1)*.075,.05);
    bowl.rotation.set(.32,-.3+Math.sin(time*.45)*.09,-.12);
    mouse.position.set(span,.98+Math.sin(time*.95+2)*.1,-.5);
    mouse.rotation.set(.18,-.5+Math.sin(time*.6)*.15,.22);
    statue.position.set(span*.88,-.57+Math.sin(time*.8+3)*.07,.05);
    statue.rotation.set(.02,-.06+Math.sin(time*.45)*.045,.02);
    wavingPaw.rotation.x=.1+Math.sin(time*2)*.18;
  }
  update(0,0);
  return { resize, update };
}
