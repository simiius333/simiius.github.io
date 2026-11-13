// Three.js VisionOS / iOS 18 Refractive Glass Scene
(function () {
  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7.8);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  // Soft Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(6, 9, 7);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe8f4ff, 1.0);
  fillLight.position.set(-6, -4, 4);
  scene.add(fillLight);

  // Subtle pastel caustic point lights
  const lightSky = new THREE.PointLight(0x38bdf8, 2.5, 25);
  lightSky.position.set(-4, 3, 3);
  scene.add(lightSky);

  const lightLavender = new THREE.PointLight(0xa855f7, 2.0, 25);
  lightLavender.position.set(4, -3, 2);
  scene.add(lightLavender);

  const lightMint = new THREE.PointLight(0x34d399, 1.8, 20);
  lightMint.position.set(0, -4, 4);
  scene.add(lightMint);

  // Master group
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Optical Glass Physical Material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.02,
    roughness: 0.08,
    transmission: 0.94,
    ior: 1.5,
    reflectivity: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    transparent: true,
    opacity: 0.92,
  });

  // Frosted Satellite Glass Material
  const frostedMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf0f7ff,
    metalness: 0.05,
    roughness: 0.22,
    transmission: 0.88,
    ior: 1.46,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.86,
  });

  // 1. Central Hero Sculpture: Fluid Torus Knot with refined topology
  const knotGeo = new THREE.TorusKnotGeometry(1.5, 0.45, 180, 32, 2, 3);
  const heroKnot = new THREE.Mesh(knotGeo, glassMaterial);
  heroKnot.position.set(0, 0.15, 0);
  worldGroup.add(heroKnot);

  // 2. Floating satellite liquid glass lenses
  const floatingOrbs = [];
  const orbGeos = [
    new THREE.SphereGeometry(0.52, 40, 40),
    new THREE.SphereGeometry(0.32, 32, 32),
    new THREE.SphereGeometry(0.68, 44, 44),
    new THREE.SphereGeometry(0.25, 28, 28),
    new THREE.TorusGeometry(0.48, 0.14, 28, 56),
  ];

  const orbCoords = [
    { x: -3.5, y: 1.9, z: -1.2, speed: 0.7 },
    { x: 3.6, y: -1.5, z: -0.6, speed: 0.85 },
    { x: 2.9, y: 2.2, z: -1.8, speed: 0.6 },
    { x: -2.8, y: -2.0, z: -0.9, speed: 0.9 },
    { x: -3.9, y: -0.4, z: 0.4, speed: 0.75 },
  ];

  orbCoords.forEach((coord, idx) => {
    const geo = orbGeos[idx % orbGeos.length];
    const mat = idx % 2 === 0 ? glassMaterial : frostedMaterial;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(coord.x, coord.y, coord.z);
    worldGroup.add(mesh);
    floatingOrbs.push({
      mesh,
      origin: { ...coord },
      speed: coord.speed,
      phase: Math.random() * Math.PI * 2
    });
  });

  // Damped Smooth Mouse & Scroll Parallax
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop with Smooth Spring Damping
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Damping
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;
    scrollY += (targetScrollY - scrollY) * 0.06;

    // Organic Rotation
    heroKnot.rotation.x = elapsedTime * 0.16 + mouse.y * 0.35 + (scrollY * 0.0008);
    heroKnot.rotation.y = elapsedTime * 0.22 + mouse.x * 0.45 + (scrollY * 0.001);
    heroKnot.rotation.z = Math.sin(elapsedTime * 0.12) * 0.25;

    // Floating Lenses
    floatingOrbs.forEach((orb) => {
      const t = elapsedTime * orb.speed + orb.phase;
      orb.mesh.position.y = orb.origin.y + Math.sin(t) * 0.35;
      orb.mesh.position.x = orb.origin.x + Math.cos(t * 0.65) * 0.2;
      orb.mesh.position.z = orb.origin.z + Math.sin(t * 0.45) * 0.25;
      orb.mesh.rotation.x += 0.008;
      orb.mesh.rotation.y += 0.01;
    });

    // Orbiting Soft Lights
    lightSky.position.x = Math.sin(elapsedTime * 0.5) * 5;
    lightSky.position.y = Math.cos(elapsedTime * 0.7) * 4;

    lightLavender.position.x = Math.cos(elapsedTime * 0.6) * 5;
    lightLavender.position.y = Math.sin(elapsedTime * 0.4) * 4;

    // Camera Parallax
    camera.position.x = mouse.x * 0.45;
    camera.position.y = mouse.y * 0.35 - (scrollY * 0.0009);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
})();
