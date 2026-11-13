// Three.js Interactive 3D Liquid Glass Scene
(function () {
  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Lighting for physical glass refractions & iridescent gloss
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight1.position.set(5, 8, 6);
  scene.add(dirLight1);

  // Colored dynamic point lights for liquid glass iridescence
  const lightCyan = new THREE.PointLight(0x00d4ff, 3.5, 20);
  lightCyan.position.set(-4, 3, 3);
  scene.add(lightCyan);

  const lightPurple = new THREE.PointLight(0xc084fc, 3.0, 20);
  lightPurple.position.set(4, -3, 2);
  scene.add(lightPurple);

  const lightPeach = new THREE.PointLight(0xffc3a0, 2.5, 15);
  lightPeach.position.set(0, -4, 4);
  scene.add(lightPeach);

  // Master group for scene objects
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Physical Liquid Glass Material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.12,
    transmission: 0.92, // Glass transmission
    ior: 1.52,          // Index of refraction (glass)
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.92,
  });

  // Secondary frosted iridescent material for satellite elements
  const frostedMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe6f0ff,
    metalness: 0.1,
    roughness: 0.28,
    transmission: 0.85,
    ior: 1.45,
    clearcoat: 0.8,
    transparent: true,
    opacity: 0.85,
  });

  // 1. Central Hero Sculpture: Fluid Glass Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.48, 140, 24, 2, 3);
  const heroKnot = new THREE.Mesh(knotGeo, glassMaterial);
  heroKnot.position.set(0, 0.2, 0);
  worldGroup.add(heroKnot);

  // 2. Floating satellite liquid bubbles / orbs
  const floatingOrbs = [];
  const orbGeos = [
    new THREE.SphereGeometry(0.55, 36, 36),
    new THREE.SphereGeometry(0.35, 32, 32),
    new THREE.SphereGeometry(0.75, 40, 40),
    new THREE.SphereGeometry(0.28, 28, 28),
    new THREE.TorusGeometry(0.5, 0.16, 24, 48),
  ];

  const orbCoords = [
    { x: -3.4, y: 1.8, z: -1.2, speed: 0.9 },
    { x: 3.6, y: -1.6, z: -0.5, speed: 1.1 },
    { x: 2.8, y: 2.4, z: -2.0, speed: 0.7 },
    { x: -2.6, y: -2.2, z: -0.8, speed: 1.3 },
    { x: -3.8, y: -0.5, z: 0.5, speed: 0.85 },
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

  // Mouse & Scroll Parallax State
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

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp for mouse and scroll
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    scrollY += (targetScrollY - scrollY) * 0.08;

    // Rotate Central Sculpture
    heroKnot.rotation.x = elapsedTime * 0.2 + mouse.y * 0.4 + (scrollY * 0.001);
    heroKnot.rotation.y = elapsedTime * 0.28 + mouse.x * 0.5 + (scrollY * 0.0015);
    heroKnot.rotation.z = Math.sin(elapsedTime * 0.15) * 0.3;

    // Animate Satellite Orbs
    floatingOrbs.forEach((orb) => {
      const t = elapsedTime * orb.speed + orb.phase;
      orb.mesh.position.y = orb.origin.y + Math.sin(t) * 0.45;
      orb.mesh.position.x = orb.origin.x + Math.cos(t * 0.7) * 0.25;
      orb.mesh.position.z = orb.origin.z + Math.sin(t * 0.5) * 0.35;
      orb.mesh.rotation.x += 0.01;
      orb.mesh.rotation.y += 0.012;
    });

    // Orbit colored lights to generate shifting caustics
    lightCyan.position.x = Math.sin(elapsedTime * 0.6) * 5;
    lightCyan.position.y = Math.cos(elapsedTime * 0.8) * 4;

    lightPurple.position.x = Math.cos(elapsedTime * 0.7) * 5;
    lightPurple.position.y = Math.sin(elapsedTime * 0.5) * 4;

    // Subtle Camera Parallax
    camera.position.x = mouse.x * 0.6;
    camera.position.y = mouse.y * 0.5 - (scrollY * 0.0012);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
})();
