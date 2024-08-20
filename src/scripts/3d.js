import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

let pos = { x: -1, y: -1 };
let nodStart;
let isLoaded = false;
let isRockingOut = false;
let lastHover;

const NOD_FRAMES = {
  0: 0,
  5: -0.1,
  10: 0.02,
  14: -0.05,
  18: 0.02,
  24: 0,
};
const NOD_DURATION = 400;
const THREEQRTR_POSE = -1.15 * Math.PI;

let isTouchActive = false;

function easeOutQuint(x) {
  return 1 - (1 - x) ** 5;
}

function init() {
  THREE.ColorManagement.enabled = true;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
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
    let scale = Math.max(12, Math.min(window.innerWidth / 50, 25));
    skull.scale.set(scale, scale, scale);
    scene.add(skull);
  });

  let directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
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

  function animate(frame) {
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

    if (isRockingOut) {
      directionalLight1.position.x = Math.sin((Math.PI * frame) / 1000) * 2500;
      directionalLight1.position.z = Math.cos((Math.PI * frame) / 1000) * 2000;
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
      { bubble: false },
    );
    el.addEventListener(
      'mouseleave',
      () => {
        lastHover = undefined;
      },
      { bubble: false },
    );
  });

  let lastMouseMove;
  window.addEventListener('mousemove', (evt) => {
    if (isTouchActive) return;
    if (lastMouseMove) cancelAnimationFrame(lastMouseMove);
    lastMouseMove = requestAnimationFrame(() => {
      pos.x = evt.pageX;
      pos.y = evt.pageY;
    });
  });
  window.addEventListener('touchstart', () => {
    isTouchActive = true;
  });
  window.addEventListener('touchend', () => {
    isTouchActive = false;
  });
  let lastTouchMove;
  window.addEventListener('touchmove', (evt) => {
    if (lastTouchMove) cancelAnimationFrame(lastTouchMove);
    lastTouchMove = requestAnimationFrame(() => {
      pos.x = evt.touches[0].pageX;
      pos.y = evt.touches[0].pageY;
    });
  });

  document.addEventListener('click', () => {
    if (!nodStart) nodStart = performance.now();
  });

  let lastResize;
  window.addEventListener('resize', () => {
    if (lastResize) cancelAnimationFrame(lastResize);
    lastResize = requestAnimationFrame(() => {
      updateCamera();
      renderer.setSize(window.innerWidth, window.innerHeight);
      let scale = Math.max(12, Math.min(window.innerWidth / 50, 25));
      skull.scale.set(scale, scale, scale);
    });
  });

  let keyBuffer = [];
  let bufferTimeout;
  const success = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  const playlist = ['bgm_qotsa_ytiawadbiflam', 'bgm_cob_cob', 'bgm_ws_bat', 'bgm_m_tm', 'bgm_bg_wss', 'bgm_if_pm', 'btm_ptv_amiw', 'bgm_vom_mk', 'bgm_as_aum', 'bgm_sf_btia', 'bgm_fs_rq', 'bgm_ws_bat'];
  let lastPlayed;
  window.addEventListener('keyup', (evt) => {
    clearTimeout(bufferTimeout);
    bufferTimeout = setTimeout(() => {
      keyBuffer = [];
    }, 2000);

    const next = keyBuffer.length;
    if (evt.code === success[next]) {
      keyBuffer.push(evt.code);

      if (keyBuffer.length === success.length) {
        isRockingOut = true;
        function playNext(audioEl) {
          let next = playlist[Math.floor(Math.random() * playlist.length)];
          while (next === lastPlayed) next = playlist[Math.floor(Math.random() * playlist.length)]; // don’t dupe
          audioEl.src = `https://drewhost.s3.amazonaws.com/${next}.mp3`;
          audioEl.play();
          lastPlayed = next;
        }

        let audioEl;
        if (document.querySelector('audio')) {
          audioEl = document.querySelector('audio');
        } else {
          audioEl = document.createElement('audio');
          document.body.appendChild(audioEl);
        }

        playNext(audioEl);
        audioEl.addEventListener('ended', () => {
          playNext(audioEl);
        });
        document.querySelector('#canvas').classList.add('is-rocking-out');
      }
    } else {
      keyBuffer = [];
    }
  });
}
init();
