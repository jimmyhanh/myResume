import * as THREE from './vendor/three.module.min.js';

// Ceramic lucky cat modeled after the supplied front-view reference.
export function createLuckyCat() {
  const statue = new THREE.Group(); statue.name = 'lucky-cat';
  const mat = (color, metalness = 0, roughness = .38) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const white = mat('#faf7f4'), red = mat('#c83235'), green = mat('#147d42');
  const black = mat('#262124'), pink = mat('#df9299'), gold = mat('#e3af4d', .55, .32);
  const sphere = new THREE.SphereGeometry(1, 40, 28);
  function oval(parent, material, position, scale) {
    const mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(...position); mesh.scale.set(...scale); parent.add(mesh); return mesh;
  }
  function line(points, radius, material, parent = statue) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius, 8, false), material);
    parent.add(mesh); return mesh;
  }
  oval(statue, white, [0,-.47,0], [.54,.63,.4]);
  const head = oval(statue, white, [0,.73,0], [.84,.78,.55]);
  head.name = 'lucky-cat-head';

  // Rounded white ears with a flush, inset red face.
  const earShape = new THREE.Shape();
  earShape.moveTo(-.29,-.28);
  earShape.bezierCurveTo(-.32,.08,-.22,.75,-.08,.85);
  earShape.bezierCurveTo(.06,.75,.32,.08,.3,-.28);
  earShape.quadraticCurveTo(0,-.38,-.29,-.28);
  const earGeometry = new THREE.ExtrudeGeometry(earShape,{ depth:.14, bevelEnabled:true, bevelSegments:4, bevelSize:.035, bevelThickness:.025, curveSegments:24, steps:1 });
  for (const side of [-1,1]) {
    const ear = new THREE.Group(); ear.name = side < 0 ? 'lucky-left-ear' : 'lucky-right-ear';
    ear.position.set(side*.51,1.28,-.055); ear.rotation.z = side * -.12;
    const shell = new THREE.Mesh(earGeometry,white); ear.add(shell);
    const insert = new THREE.Mesh(new THREE.ShapeGeometry(earShape,24),red);
    insert.scale.set(.72,.77,1); insert.position.set(0,.015,.166); ear.add(insert);
    statue.add(ear);
    oval(statue,white,[side*.33,-.98,.2],[.24,.115,.28]);
    for (const offset of [-.065,.035]) {
      line([[side*.33+offset,-.955,.462],[side*.33+offset,-1.01,.451]],.007,mat('#ddd8d4'));
    }
  }
  oval(statue,mat('#9e352c'),[0,1.48,.035],[.18,.025,.12]);

  // Conform the painted face to the head instead of floating in front of it.
  function faceZ(x,y) { return .55 * Math.sqrt(Math.max(.001,1-(x/.84)**2-((y-.73)/.78)**2)); }
  function faceLine(points, radius=.013) {
    return line(points.map(([x,y])=>[x,y,faceZ(x,y)+.012]),radius,black);
  }
  function facePatch(shape, material, offset) {
    const geometry = new THREE.ShapeGeometry(shape,32);
    const positions = geometry.attributes.position;
    for (let i=0;i<positions.count;i++) positions.setZ(i,faceZ(positions.getX(i),positions.getY(i))+offset);
    geometry.computeVertexNormals();
    const patch = new THREE.Mesh(geometry,material); statue.add(patch);
  }
  for (const side of [-1,1]) {
    function eyeShape(scale) {
      const shape = new THREE.Shape();
      const p = (x,y) => [side*(.35+(x-.35)*scale), .84+(y-.84)*scale];
      shape.moveTo(...p(.13,.66));
      shape.bezierCurveTo(...p(.11,.91),...p(.21,1.1),...p(.36,1.09));
      shape.bezierCurveTo(...p(.53,1.09),...p(.57,.83),...p(.64,.7));
      shape.quadraticCurveTo(...p(.38,.59),...p(.13,.66));
      return shape;
    }
    facePatch(eyeShape(1),black,.008);
    facePatch(eyeShape(.83),white,.013);
    const pupil = new THREE.Shape();
    pupil.absellipse(side*.345,.825,.145,.187,0,Math.PI*2,false,0);
    facePatch(pupil,black,.019);
    for (let i=0;i<3;i++) {
      const x=side*(.25+i*.075), y=1.08-Math.abs(i-1)*.025;
      faceLine([[x,y],[x+side*.008,y+.065]],.011);
    }
    faceLine([[side*.145,1.065],[side*.19,1.13]],.012);
    for (let i=0;i<3;i++) {
      const y=.49-i*.12;
      faceLine([[side*.35,y],[side*.5,y+.008],[side*.67,y-.005]],.014);
    }
  }
  oval(statue,black,[0,.55,faceZ(0,.55)+.02],[.068,.04,.033]);
  faceLine([[0,.52],[0,.42],[-.17,.29]],.017);
  faceLine([[0,.42],[.17,.29]],.017);

  const bib = new THREE.Shape();
  bib.moveTo(-.43,.08); bib.quadraticCurveTo(0,.16,.43,.08);
  bib.quadraticCurveTo(.26,-.22,0,-.34); bib.quadraticCurveTo(-.26,-.22,-.43,.08);
  const bibMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(bib,{depth:.025,bevelEnabled:true,bevelSize:.025,bevelThickness:.018,bevelSegments:3,steps:1}),green);
  bibMesh.position.z=.34;statue.add(bibMesh);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(.43,.055,12,48),red);
  collar.rotation.x=Math.PI/2;collar.position.y=.07;statue.add(collar);
  oval(statue,gold,[0,-.035,.452],[.135,.135,.11]);
  oval(statue,black,[0,-.042,.561],[.025,.026,.008]);
  line([[0,-.057,.56],[0,-.16,.528]],.009,black);

  // Oval coin with horizontal ridges and the reference's vertical lettering.
  oval(statue,gold,[0,-.56,.39],[.35,.48,.105]);
  const coinCanvas=document.createElement('canvas');coinCanvas.width=384;coinCanvas.height=512;
  const ctx=coinCanvas.getContext('2d');
  ctx.fillStyle='#201d19';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='900 128px "Yu Gothic", "Meiryo", sans-serif';
  ['\u5343','\u4e07','\u4e21'].forEach((character,i)=>ctx.fillText(character,192,104+i*144));
  const texture=new THREE.CanvasTexture(coinCanvas);texture.colorSpace=THREE.SRGBColorSpace;
  const lettering=new THREE.Mesh(new THREE.PlaneGeometry(.255,.77),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
  lettering.position.set(0,-.56,.501);statue.add(lettering);
  for(let i=0;i<8;i++) {
    const y=-.92+i*.105,dy=(y+.56)/.48;
    const width=.35*Math.sqrt(Math.max(0,1-dy*dy));
    line([[-width*.95,y,.412],[-width*.62,y,.465],[0,y,.39+.105*Math.sqrt(1-dy*dy)],[width*.62,y,.465],[width*.95,y,.412]],.007,mat('#bd8835',.45));
  }
  // The resting paw overlaps the edge of the coin as in the reference.
  const resting=oval(statue,white,[.42,-.29,.38],[.225,.19,.21]);resting.rotation.z=.35;

  // Viewer-left raised paw, with its wave confined outside the head silhouette.
  line([[-.4,-.5,.02],[-.67,-.27,.025],[-.88,.03,.035]],.16,white);
  const wavingPaw=new THREE.Group();wavingPaw.name='waving-paw';wavingPaw.position.set(-.88,.03,.035);statue.add(wavingPaw);
  oval(wavingPaw,white,[0,.13,.015],[.16,.29,.22]);
  oval(wavingPaw,white,[-.045,.37,.04],[.2,.25,.24]);
  oval(wavingPaw,pink,[-.045,.33,.225],[.08,.085,.025]);
  for(const [x,y] of [[-.145,.43],[-.045,.51],[.055,.46]]) oval(wavingPaw,pink,[x,y,.209],[.048,.055,.022]);
  statue.scale.setScalar(.6);
  return { statue, wavingPaw };
}
