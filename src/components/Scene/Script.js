import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { gsap } from "gsap";

//Global variables
let currentRef = null;

let sceneParams = {
  bgColor : 0x2893b5
}

// timeline
const timeLine = new gsap.timeline({
  defaults: { duration: 1 },
});

// GUI Controls
const gui = new dat.GUI({ width: 600 });

// Drone Parts
const droneParts = {
  motor: new THREE.Group(),
  helices: new THREE.Group(),
  base: new THREE.Group(),
  camaras: new THREE.Group(),
};

//Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(sceneParams.bgColor);
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(-7, 5, 10);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);
renderer.outputColorEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setPixelRatio(2);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

// Loader
const loadingManager = new THREE.LoadingManager(() => {
  castShadows();
});

const gltfLoader = new GLTFLoader(loadingManager);

// Cast and Receive shadows
const castShadows = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.envMapItensity = 0.38;
    }
  });
};

// Base Plane shadow
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(5, 5),
  new THREE.ShadowMaterial({
    opacity: 0.3,
  })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.75;

scene.add(plane);

//Animate the scene
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  const movement = Math.sin(elapsedTime);
  droneParts.base.position.y = movement * 0.05;
  droneParts.helices.position.y = movement * 0.05;
  droneParts.motor.position.y = movement * 0.05;
  droneParts.camaras.position.y = movement * 0.05;

  try {
    for (let i = 0; i < droneParts.helices.children.length; i++) {
      droneParts.helices.children[i].rotation.y = elapsedTime * 0.5;
    }
  } catch (error) {}

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

// Lights
const light1 = new THREE.DirectionalLight(0xfcfcfc, 4.3);
light1.position.set(0, 6, 1);
light1.castShadow = true;
light1.shadow.mapSize.set(2048, 2048);
light1.shadow.bias = -0.00131;
scene.add(light1);

const ambientLight = new THREE.AmbientLight(0x208080, 0.61);
scene.add(ambientLight);

const envMap = new THREE.CubeTextureLoader().load([
  "./envmap/px.png",
  "./envmap/nx.png",
  "./envmap/py.png",
  "./envmap/ny.png",
  "./envmap/pz.png",
  "./envmap/nz.png",
]);

scene.environment = envMap;

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  gui.destroy();
  scene.dispose();
  currentRef.removeChild(renderer.domElement);
};

// Load Groups
export const loadGroups = () => {
  scene.add(droneParts.motor);
  scene.add(droneParts.camaras);
  scene.add(droneParts.helices);
  scene.add(droneParts.base);
};

// Load Models
export const loadModels = (rute, group) => {
  gltfLoader.load(rute, (gltf) => {
    while (gltf.scene.children.length) {
      droneParts[group].add(gltf.scene.children[0]);
    }
  });
};

// Remove old models
export const removeOldModels = (rute, group) => {
  //get a reference
  const oldModels = new THREE.Group();
  while (droneParts[group].children.length) {
    oldModels.add(droneParts[group].children[0]);
  }

  // remove childs
  while (droneParts[group].children.length) {
    droneParts[group].remove(droneParts[group].children[0]);
  }

  oldModels.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.dispose();
      child.geometry.dispose();
    }
  });
  console.log(renderer.info);

  loadModels(rute, group);
};

// Debuggeo
const cubeForDebugging = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.1, 0.1, 0.1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

// scene.add(cubeForDebugging);

// target
gui
  .add(cubeForDebugging.position, "x")
  .min(-10)
  .max(10)
  .step(0.00001)
  .name("target x")
  .onChange(() => {
    orbitControls.target.x = cubeForDebugging.position.x;
  });

gui
  .add(cubeForDebugging.position, "y")
  .min(-10)
  .max(10)
  .step(0.00001)
  .name("target y")
  .onChange(() => {
    orbitControls.target.y = cubeForDebugging.position.y;
  });

gui
  .add(cubeForDebugging.position, "z")
  .min(-10)
  .max(10)
  .step(0.00001)
  .name("target z")
  .onChange(() => {
    orbitControls.target.z = cubeForDebugging.position.z;
  });

// GUI Camera
gui.add(camera.position, "x").min(-10).max(10).step(0.00001).name("Cam x");

gui.add(camera.position, "y").min(-10).max(10).step(0.00001).name("Cam y");

gui.add(camera.position, "z").min(-10).max(10).step(0.00001).name("Cam z");

// Zoom
gui
  .add(camera, "zoom")
  .min(1)
  .max(10)
  .step(0.0001)
  .name("Zoom")
  .onChange(() => {
    camera.updateProjectionMatrix()
  });

  // background color 
  
  
  gui.addColor(sceneParams,'bgColor' ).onChange(()=>{
    scene.background.set(sceneParams.bgColor)
  })


// GSAP Animation
export const gsapAnimation = (targetPos, camPos, zoom) => {
  timeLine
    .to(orbitControls.target, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
    })
    .to(camera.position, {
      x: camPos.x,
      y: camPos.y,
      z: camPos.z,
    },"-=1.0")
    .to(camera, {
      zoom: zoom,
      onUpdate: () => camera.updateProjectionMatrix(),
    },"-=1.0");
};


// Reset animation 
export const resetAnimation = ()=>{
  gsapAnimation(
    {
      x:0,
      y:0,
      z:0
    },
    {
      x:-7,
      y:5,
      z:10
    },
    1
  )
}