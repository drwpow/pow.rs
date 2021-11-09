import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

let pos = { x: -1, y: -1 };
let nodStart;
let resizeDebounce;
let isLoaded = false;
let lastHover;

const NOD_FRAMES = {
  5: -0.1,
  10: 0.02,
  14: -0.05,
  18: 0.02,
  24: 0,
};
const NOD_DURATION = 400;
const THREEQRTR_POSE = -1.15 * Math.PI;

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
  const camera = new THREE.OrthographicCamera();
  updateCamera();
  const textureLoader = new THREE.TextureLoader();
  const twoTone = textureLoader.load('/gradientmap.png');
  let skull;
  loader.load('/skull_shades.stl', (geometry) => {
    twoTone.minFilter = THREE.NearestFilter;
    twoTone.magFilter = THREE.NearestFilter;
    skull = new THREE.Mesh(geometry);
    const material = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: twoTone,
    });
    skull.material = material;
    skull.position.x = (window.innerWidth / 2) * 0.3333;
    skull.position.y = 100;
    skull.rotation.y = THREEQRTR_POSE;
    skull.scale.set(25, 25, 25);
    scene.add(skull);
  });

  let directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight1.position.y = 2500;
  directionalLight1.position.z = 2000;
  scene.add(directionalLight1);

  const effect = new OutlineEffect(renderer, { defaultThickness: 0.005 });

  function updateCamera() {
    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;
    camera.near = 2;
    camera.far = 5000;
    camera.position.z = 1000;
    camera.updateProjectionMatrix();
  }

  function animate() {
    requestAnimationFrame(animate);

    if (skull) {
      if (isLoaded === false) {
        document.querySelector('#canvas').classList.add('is-loaded');
        isLoaded = true;
      }

      let rotX = pos.y !== -1 ? (pos.y / window.innerHeight) * 0.5 - 0.2 : 0;
      let rotY = pos.x !== -1 ? ((pos.x - window.innerWidth / 2) / window.innerWidth) * 0.25 * Math.PI + 0.9 * THREEQRTR_POSE : THREEQRTR_POSE;

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

  document.querySelectorAll('.jump-item').forEach((el) => {
    el.addEventListener(
      'mouseover',
      () => {
        if (!nodStart && lastHover !== el.id) {
          lastHover = el.id;
          nodStart = performance.now();
        }
      },
      { bubble: false }
    );
    el.addEventListener(
      'mouseleave',
      () => {
        lastHover = undefined;
      },
      { bubble: false }
    );
  });

  window.addEventListener('mousemove', (evt) => {
    pos.x = evt.pageX;
    pos.y = evt.pageY;
  });

  document.addEventListener('click', () => {
    if (!nodStart) nodStart = performance.now();
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      updateCamera();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 20);
  });
}
init();
