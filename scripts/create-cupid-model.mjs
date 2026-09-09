import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'node:fs';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(v => { this.result = v; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(v => { this.result = `data:${blob.type};base64,${Buffer.from(v).toString('base64')}`; this.onloadend?.(); }); }
};

const scene = new THREE.Scene();
const root = new THREE.Group(); root.name = 'Cupid_Rig'; scene.add(root);
const gold = new THREE.MeshStandardMaterial({color:0xd8a638,metalness:.8,roughness:.2});
const skin = new THREE.MeshStandardMaterial({color:0xf2ae86,roughness:.6});
const blush = new THREE.MeshStandardMaterial({color:0xe97879,roughness:.65});
const purple = new THREE.MeshStandardMaterial({color:0x5b1d86,metalness:.12,roughness:.42});
const violet = new THREE.MeshStandardMaterial({color:0x442068,metalness:.15,roughness:.35});
const blue = new THREE.MeshStandardMaterial({color:0x1c4fa1,metalness:.55,roughness:.24});
const cyan = new THREE.MeshStandardMaterial({color:0x477be9,metalness:.5,roughness:.18});
const white = new THREE.MeshStandardMaterial({color:0xffffff,roughness:.15});
const black = new THREE.MeshStandardMaterial({color:0x150b24,roughness:.2});
const rose = new THREE.MeshStandardMaterial({color:0xeb255c,metalness:.12,roughness:.3,emissive:0x4a0018,emissiveIntensity:.25});

const mesh=(geo,mat,name,parent=root,pos=[0,0,0],rot=[0,0,0],scale=[1,1,1])=>{const m=new THREE.Mesh(geo,mat);m.name=name;m.position.set(...pos);m.rotation.set(...rot);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m};
const sphere=(r,mat,name,parent,pos,scale=[1,1,1])=>mesh(new THREE.SphereGeometry(r,40,28),mat,name,parent,pos,[0,0,0],scale);
const limb=(r,len,mat,name,parent,pos,rot=[0,0,0])=>mesh(new THREE.CapsuleGeometry(r,len,12,24),mat,name,parent,pos,rot);

// Named bone hierarchy is exported inside the GLB and drives the runtime poses.
const hips=new THREE.Bone(); hips.name='hips'; hips.position.set(0,0,0); root.add(hips);
const spine=new THREE.Bone(); spine.name='spine'; spine.position.set(0,1.1,0); hips.add(spine);
const headBone=new THREE.Bone(); headBone.name='head'; headBone.position.set(0,1.0,0); spine.add(headBone);
const armL=new THREE.Bone(); armL.name='arm.L'; armL.position.set(-.72,.58,0); spine.add(armL);
const armR=new THREE.Bone(); armR.name='arm.R'; armR.position.set(.72,.58,0); spine.add(armR);
const wingL=new THREE.Bone(); wingL.name='wing.L'; wingL.position.set(-.45,.55,-.28); spine.add(wingL);
const wingR=new THREE.Bone(); wingR.name='wing.R'; wingR.position.set(.45,.55,-.28); spine.add(wingR);
const legL=new THREE.Bone(); legL.name='leg.L'; legL.position.set(-.32,-.15,0); hips.add(legL);
const legR=new THREE.Bone(); legR.name='leg.R'; legR.position.set(.32,-.15,0); hips.add(legR);

// Body and expressive face.
sphere(.72,skin,'head',headBone,[0,.42,0],[.94,1.04,.88]);
sphere(.16,skin,'ear.L',headBone,[-.7,.42,0],[.55,1,.55]); sphere(.16,skin,'ear.R',headBone,[.7,.42,0],[.55,1,.55]);
sphere(.115,white,'eye.L',headBone,[-.25,.5,.57],[1,1.22,.45]); sphere(.115,white,'eye.R',headBone,[.25,.5,.57],[1,1.22,.45]);
sphere(.065,black,'pupil.L',headBone,[-.25,.49,.655],[1,1.25,.45]); sphere(.065,black,'pupil.R',headBone,[.25,.49,.655],[1,1.25,.45]);
sphere(.055,white,'eyeSpark.L',headBone,[-.225,.53,.69],[.5,.5,.25]); sphere(.055,white,'eyeSpark.R',headBone,[.275,.53,.69],[.5,.5,.25]);
sphere(.12,blush,'cheek.L',headBone,[-.47,.26,.57],[1,.55,.25]); sphere(.12,blush,'cheek.R',headBone,[.47,.26,.57],[1,.55,.25]);
mesh(new THREE.TorusGeometry(.17,.035,10,28,Math.PI),rose,'smile',headBone,[0,.22,.63],[Math.PI,0,0]);
sphere(.12,skin,'nose',headBone,[0,.39,.66],[.45,.55,.4]);
// Dense sculptural curls.
for(let i=0;i<28;i++){const a=(i/28)*Math.PI*2, ring=i%3; sphere(.18-ring*.018,purple,`curl.${i}`,headBone,[Math.cos(a)*(.48-ring*.09),.92+Math.sin(a)*(.25-ring*.02),-.08+ring*.04],[1,1,1]);}
for(let i=0;i<8;i++) sphere(.16,purple,`forelock.${i}`,headBone,[-.42+i*.12,.77+Math.sin(i)*.07,.48],[1,1,1]);

sphere(.62,skin,'torso',spine,[0,.08,0],[.82,1.08,.68]); sphere(.38,skin,'belly',spine,[0,-.35,.22],[1.08,.9,.8]);
mesh(new THREE.CylinderGeometry(.62,.7,.72,36,1,true),violet,'toga',spine,[0,-.27,0],[0,0,.05]);
mesh(new THREE.TorusGeometry(.55,.07,12,48),gold,'belt',spine,[0,-.52,0],[Math.PI/2,0,0]);
mesh(new THREE.TorusGeometry(.72,.12,16,48,Math.PI*1.08),purple,'sash',spine,[.02,.08,.03],[0.15,.35,-.65]);
limb(.17,.72,skin,'arm.L',armL,[0,-.3,0],[0,0,-.55]); limb(.17,.72,skin,'arm.R',armR,[0,-.3,0],[0,0,.75]);
sphere(.2,skin,'hand.L',armL,[-.2,-.68,0]); sphere(.2,skin,'hand.R',armR,[.26,-.63,0]);
for(const b of [armL,armR]) mesh(new THREE.TorusGeometry(.19,.045,10,28),gold,'bracelet',b,[0,-.5,0],[Math.PI/2,0,0]);
limb(.2,.62,skin,'leg.L',legL,[0,-.42,0],[.1,0,.28]); limb(.2,.62,skin,'leg.R',legR,[0,-.42,0],[-.1,0,-.32]);
sphere(.24,skin,'foot.L',legL,[.05,-.8,.14],[1.35,.65,1.7]); sphere(.24,skin,'foot.R',legR,[-.05,-.8,.14],[1.35,.65,1.7]);

// Layered feather wings, every feather catches blue-violet rim light.
for(const [bone,sgn] of [[wingL,-1],[wingR,1]]){
  for(let i=0;i<12;i++){
    const row=Math.floor(i/4), col=i%4;
    mesh(new THREE.CapsuleGeometry(.11,.65+row*.16,8,18),row%2?cyan:blue,`feather.${sgn}.${i}`,bone,[sgn*(.25+col*.2),.15-row*.18,-.05],[.15,0,sgn*(.58+col*.08)]);
  }
}

// Hero prop: carved gold bow, string, and luminous heart arrow.
mesh(new THREE.TorusGeometry(1.0,.055,12,64,Math.PI*1.55),gold,'bow',armL,[-.45,-.55,.55],[0,.35,-1.05]);
mesh(new THREE.CylinderGeometry(.018,.018,1.82,10),white,'bowString',armL,[-.1,-.46,.55],[0,0,-.06]);
mesh(new THREE.CylinderGeometry(.025,.025,1.75,12),gold,'arrow',armR,[-.55,-.64,.7],[0,0,Math.PI/2]);
const heartShape=new THREE.Shape(); heartShape.moveTo(0,0); heartShape.bezierCurveTo(-.3,-.22,-.58,.14,0,.55); heartShape.bezierCurveTo(.58,.14,.3,-.22,0,0);
mesh(new THREE.ExtrudeGeometry(heartShape,{depth:.11,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:3}),rose,'heartArrow',armR,[-1.5,-.67,.64],[Math.PI/2,0,-Math.PI/2],[.48,.48,.48]);

root.rotation.set(.08,-.15,-.12); root.scale.setScalar(.9); root.position.y=.15;
const exporter=new GLTFExporter();
exporter.parse(scene,(data)=>{fs.mkdirSync('public/models',{recursive:true});fs.writeFileSync('public/models/cupid-rigged.glb',Buffer.from(data));console.log('Created public/models/cupid-rigged.glb');},e=>{throw e},{binary:true,onlyVisible:true});
