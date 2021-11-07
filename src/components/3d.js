import * as THREE from 'three';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

let pos = { x: -1, y: -1 };
let nodStart;
let resizeDebounce;
let isLoaded = false;

const NOD_FRAMES = {
  5: -0.1,
  10: 0.02,
  14: -0.05,
  18: 0.02,
  24: 0,
};
const NOD_DURATION = 400;

function easeOutQuint(x) {
  return 1 - (1 - x) ** 5;
}

function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.querySelector('#canvas').appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const loader = new STLLoader();
  const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 2, 5000);
  camera.position.z = 1000;
  const textureLoader = new THREE.TextureLoader();
  let skull;
  loader.load('/skull_shades.stl', (geometry) => {
    const twoTone = textureLoader.load('/gradientmap.png');
    twoTone.minFilter = THREE.NearestFilter;
    twoTone.magFilter = THREE.NearestFilter;
    const material = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: twoTone,
    });
    skull = new THREE.Mesh(geometry, material);
    skull.position.x = (window.innerWidth / 2) * 0.3333;
    skull.position.y = 100;
    skull.rotation.y = -1.15 * Math.PI;
    skull.scale.set(35, 35, 35);
    scene.add(skull);
  });

  let directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight1.position.y = 2500;
  directionalLight1.position.z = 2000;
  scene.add(directionalLight1);

  const effect = new OutlineEffect(renderer, { defaultThickness: 0.005 });

  function animate() {
    requestAnimationFrame(animate);

    if (skull) {
      if (isLoaded === false) {
        document.querySelector('#canvas').classList.add('is-loaded');
        isLoaded = true;
      }

      let rotX = pos.y !== -1 ? (pos.y / window.innerHeight) * 0.5 - 0.2 : 0;
      let rotY = pos.x !== -1 ? (pos.x / window.innerWidth) * 1.3 - window.innerWidth / 2.2 : -1.15 * Math.PI;

      if (nodStart > 0) {
        const diff = performance.now() - nodStart;
        const currentFrame = Math.floor((24 * diff) / 1000);
        let prevKeyframe = 0;
        let nextKeyframe = 0;
        let last = 0;
        let next = 0;
        for (const [k, v] of Object.entries(NOD_FRAMES)) {
          last = next;
          next = v;
          prevKeyframe = nextKeyframe;
          nextKeyframe = parseInt(k, 10);
          if (currentFrame < k) break;
        }
        skull.rotation.x = rotX + easeOutQuint((currentFrame - prevKeyframe) / (nextKeyframe - prevKeyframe)) * (next - last);
        if (diff > NOD_DURATION) {
          nodStart = undefined;
        }
      } else {
        skull.rotation.x = rotX;
      }
      skull.rotation.y = rotY;
    }
    effect.render(scene, camera);
  }

  animate();

  window.addEventListener('mouseover', (evt) => {
    if (!evt.target) return;
    if (evt.target.classList.contains('jump-item') || (evt.target.parentNode && evt.target.parentNode.classList && evt.target.parentNode.classList.contains('jump-item'))) {
      if (!nodStart) {
        nodStart = performance.now();
      }
    }
  });

  window.addEventListener('mousemove', (evt) => {
    pos.x = evt.pageX;
    pos.y = evt.pageY;
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 10);
  });
}
init();
