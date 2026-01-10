const THREE = window.THREE;

const sceneElement = document.getElementById("scene");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const scaleInput = document.getElementById("scale");
const scaleValue = document.getElementById("scaleValue");
const labelsMini = document.getElementById("labelsMini");
const trailsMini = document.getElementById("trailsMini");
const focusSelect = document.getElementById("focus");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const cameraDistance = document.getElementById("cameraDistance");
const cameraValue = document.getElementById("cameraValue");
const calendarDate = document.getElementById("calendarDate");
const controlsPanel = document.getElementById("controlsPanel");
const controlsToggle = document.getElementById("controlsToggle");
const loadingIndicator = document.getElementById("loadingIndicator");
const loadingProgress = document.getElementById("loadingProgress");
const loadingLabel = document.getElementById("loadingLabel");

const focusName = document.getElementById("focusName");
const simTimeLabel = document.getElementById("simTime");
const fpsLabel = document.getElementById("fps");

if (!THREE) {
  throw new Error("THREE is not available. Ensure vendor/three/three.min.js is loaded.");
}

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const ORBIT_SCALE = 9.5;
const SUN_RADIUS = 2.1;
const DEG_TO_RAD = Math.PI / 180;
const INCLINATION_SCALE = 5;
const EARTH_MOON_MASS_RATIO = 81.30056;
const EARTH_BARYCENTER_FACTOR = 1 / (1 + EARTH_MOON_MASS_RATIO);
const MOON_ORBIT_AU = 0.00257;
const MOON_PERIOD_DAYS = 27.321582;
const MOON_INCLINATION = 5.145 * DEG_TO_RAD;
const MOON_RADIUS = 0.4;
const MOON_ORBIT_DISTANCE = 1.6;
const MOON_ROTATION_DAYS = 27.321582;
const MOON_DISTANCE_KM = 384400;
const MOON_RADIUS_KM = 1737;
const SATELLITE_DISTANCE_MULT = 2.2;
const SATELLITE_DISTANCE_SCALE = (MOON_ORBIT_DISTANCE / MOON_DISTANCE_KM) * SATELLITE_DISTANCE_MULT;
const SATELLITE_MIN_ORBIT_FACTOR = 2.2;
const TEXTURE_BASE_PATH = isMobile ? "assets/textures/1k" : "assets/textures";
const PLANET_SEGMENTS = isMobile ? 16 : 24;
const MOON_SEGMENTS = isMobile ? 16 : 24;
const SUN_SEGMENTS = isMobile ? 24 : 32;
const RING_SEGMENTS = isMobile ? 160 : 256;
const STAR_COUNT = isMobile ? 600 : 1200;
const SATELLITE_RADIUS_SCALE = MOON_RADIUS / MOON_RADIUS_KM;

const satellites = [
  { name: "Io", parent: "Jupiter", radiusKm: 1821.6, orbitKm: 421700, orbitDays: 1.769, tiltDeg: 0.04 },
  { name: "Europa", parent: "Jupiter", radiusKm: 1560.8, orbitKm: 671100, orbitDays: 3.551, tiltDeg: 0.47 },
  { name: "Ganymede", parent: "Jupiter", radiusKm: 2634.1, orbitKm: 1070400, orbitDays: 7.155, tiltDeg: 0.2 },
  { name: "Callisto", parent: "Jupiter", radiusKm: 2410.3, orbitKm: 1882700, orbitDays: 16.689, tiltDeg: 0.28 },
  { name: "Titan", parent: "Saturn", radiusKm: 2574.7, orbitKm: 1221870, orbitDays: 15.945, tiltDeg: 0.33 },
  { name: "Rhea", parent: "Saturn", radiusKm: 763.8, orbitKm: 527100, orbitDays: 4.518, tiltDeg: 0.35 },
  { name: "Iapetus", parent: "Saturn", radiusKm: 734.5, orbitKm: 3560820, orbitDays: 79.321, tiltDeg: 15.47 },
  { name: "Dione", parent: "Saturn", radiusKm: 561.4, orbitKm: 377400, orbitDays: 2.737, tiltDeg: 0.03 },
  { name: "Titania", parent: "Uranus", radiusKm: 788.4, orbitKm: 436300, orbitDays: 8.706, tiltDeg: 0.08 },
  { name: "Oberon", parent: "Uranus", radiusKm: 761.4, orbitKm: 583500, orbitDays: 13.463, tiltDeg: 0.06 },
  { name: "Umbriel", parent: "Uranus", radiusKm: 584.7, orbitKm: 266000, orbitDays: 4.144, tiltDeg: 0.13 },
  { name: "Ariel", parent: "Uranus", radiusKm: 578.9, orbitKm: 191000, orbitDays: 2.52, tiltDeg: 0.04 },
  { name: "Triton", parent: "Neptune", radiusKm: 1353.4, orbitKm: 354800, orbitDays: -5.877, tiltDeg: 156.9 },
  { name: "Proteus", parent: "Neptune", radiusKm: 210.0, orbitKm: 117600, orbitDays: 1.122, tiltDeg: 0.0 },
  { name: "Nereid", parent: "Neptune", radiusKm: 170.0, orbitKm: 5513400, orbitDays: 360.14, tiltDeg: 7.1 },
  { name: "Larissa", parent: "Neptune", radiusKm: 97.0, orbitKm: 73500, orbitDays: 0.555, tiltDeg: 0.2 },
];

const planets = [
  {
    name: "Mercury",
    periodDays: 87.9691,
    radius: 0.35,
    color: "#b5a18b",
    rotationDays: 58.646,
    tiltDeg: 0.034,
    elements: {
      a0: 0.38709843,
      aDot: 0.0,
      e0: 0.20563661,
      eDot: 0.00002123,
      I0: 7.00559432,
      IDot: -0.00590158,
      L0: 252.25166724,
      LDot: 149472.67486623,
      peri0: 77.45771895,
      periDot: 0.15940013,
      node0: 48.33961819,
      nodeDot: -0.12214182,
    },
  },
  {
    name: "Venus",
    periodDays: 224.701,
    radius: 0.8,
    color: "#e5c06d",
    rotationDays: -243.025,
    tiltDeg: 177.36,
    elements: {
      a0: 0.72332102,
      aDot: -0.00000026,
      e0: 0.00676399,
      eDot: -0.00005107,
      I0: 3.39777545,
      IDot: 0.00043494,
      L0: 181.9797085,
      LDot: 58517.8156026,
      peri0: 131.76755713,
      periDot: 0.05679648,
      node0: 76.67261496,
      nodeDot: -0.27274174,
    },
  },
  {
    name: "Earth",
    periodDays: 365.256,
    radius: 0.8,
    color: "#5bb0ff",
    rotationDays: 0.99726968,
    tiltDeg: 23.44,
    elements: {
      a0: 1.00000018,
      aDot: -0.00000003,
      e0: 0.01673163,
      eDot: -0.00003661,
      I0: -0.00054346,
      IDot: -0.01337178,
      L0: 100.46691572,
      LDot: 35999.37306329,
      peri0: 102.93005885,
      periDot: 0.3179526,
      node0: -5.11260389,
      nodeDot: -0.24123856,
    },
  },
  {
    name: "Mars",
    periodDays: 686.98,
    radius: 0.6,
    color: "#de6b4f",
    rotationDays: 1.025957,
    tiltDeg: 25.19,
    elements: {
      a0: 1.52371243,
      aDot: 0.00000097,
      e0: 0.09336511,
      eDot: 0.00009149,
      I0: 1.85181869,
      IDot: -0.00724757,
      L0: -4.56813164,
      LDot: 19140.29934243,
      peri0: -23.91744784,
      periDot: 0.45223625,
      node0: 49.71320984,
      nodeDot: -0.26852431,
    },
  },
  {
    name: "Jupiter",
    periodDays: 4332.589,
    radius: 2.4,
    color: "#f2b56f",
    rotationDays: 0.41354,
    tiltDeg: 3.13,
    elements: {
      a0: 5.20248019,
      aDot: -0.00002864,
      e0: 0.0485359,
      eDot: 0.00018026,
      I0: 1.29861416,
      IDot: -0.00322699,
      L0: 34.33479152,
      LDot: 3034.90371757,
      peri0: 14.27495244,
      periDot: 0.18199196,
      node0: 100.29282654,
      nodeDot: 0.13024619,
      b: -0.00012452,
      c: 0.0606406,
      s: -0.35635438,
      f: 38.35125,
    },
  },
  {
    name: "Saturn",
    periodDays: 10759.22,
    radius: 2.1,
    color: "#f3d39b",
    ring: true,
    rotationDays: 0.444,
    tiltDeg: 26.73,
    elements: {
      a0: 9.54149883,
      aDot: -0.00003065,
      e0: 0.05550825,
      eDot: -0.00032044,
      I0: 2.49424102,
      IDot: 0.00451969,
      L0: 50.07571329,
      LDot: 1222.11494724,
      peri0: 92.86136063,
      periDot: 0.54179478,
      node0: 113.63998702,
      nodeDot: -0.25015002,
      b: 0.00025899,
      c: -0.13434469,
      s: 0.87320147,
      f: 38.35125,
    },
  },
  {
    name: "Uranus",
    periodDays: 30685.4,
    radius: 1.6,
    color: "#8bd3e6",
    rotationDays: -0.71833,
    tiltDeg: 97.77,
    elements: {
      a0: 19.18797948,
      aDot: -0.00020455,
      e0: 0.0468574,
      eDot: -0.0000155,
      I0: 0.77298127,
      IDot: -0.00180155,
      L0: 314.20276625,
      LDot: 428.49512595,
      peri0: 172.43404441,
      periDot: 0.09266985,
      node0: 73.96250215,
      nodeDot: 0.05739699,
      b: 0.00058331,
      c: -0.97731848,
      s: 0.17689245,
      f: 7.67025,
    },
  },
  {
    name: "Neptune",
    periodDays: 60189,
    radius: 1.6,
    color: "#5077ff",
    rotationDays: 0.6713,
    tiltDeg: 28.32,
    elements: {
      a0: 30.06952752,
      aDot: 0.00006447,
      e0: 0.00895439,
      eDot: 0.00000818,
      I0: 1.7700552,
      IDot: 0.000224,
      L0: 304.22289287,
      LDot: 218.46515314,
      peri0: 46.68158724,
      periDot: 0.01009938,
      node0: 131.78635853,
      nodeDot: -0.00606302,
      b: -0.00041348,
      c: 0.68346318,
      s: -0.10162547,
      f: 7.67025,
    },
  },
];

const planetRadiusByName = new Map();
planets.forEach((planet) => {
  planetRadiusByName.set(planet.name, planet.radius);
});

const state = {
  timeDays: 0,
  speed: Number(speedInput.value),
  scale: Number(scaleInput.value),
  paused: false,
  focus: "Sun",
  fps: { lastTime: performance.now(), frames: [] },
  camera: {
    yaw: 0.85,
    pitch: 0.45,
    distance: Number(cameraDistance.value),
    minDistance: 12,
    maxDistance: 260,
    target: new THREE.Vector3(0, 0, 0),
    pan: new THREE.Vector3(0, 0, 0),
    dragging: false,
    dragMode: "orbit",
    lastPointer: null,
  },
};

function getDaysSinceJ2000(date) {
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  return (date.getTime() - j2000) / 86400000;
}

function setTimeFromDateInput(value) {
  if (!value) return;
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return;
  state.timeDays = getDaysSinceJ2000(date);
}

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const deviceRatio = window.devicePixelRatio || 1;
renderer.setPixelRatio(Math.min(deviceRatio, isMobile ? 1.25 : 2));
renderer.setClearColor(0x000000, 0);
if (renderer.outputColorSpace !== undefined) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
} else {
  renderer.outputEncoding = THREE.sRGBEncoding;
}
sceneElement.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x05040b, 30, 160);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const planetTextureData = window.PLANET_TEXTURES || {};
const planetTextures = new Map();
const planetTextureCallbacks = new Map();
let fallbackEarthTexture = null;
const planetTextureFiles = {
  Sun: "sun.jpg",
  Mercury: "mercury.jpg",
  Venus: "venus.jpg",
  Earth: "earth.jpg",
  EarthClouds: "earth_clouds.jpg",
  Moon: "moon.jpg",
  Mars: "mars.jpg",
  Jupiter: "jupiter.jpg",
  Saturn: "saturn.jpg",
  SaturnRing: "saturn_ring.png",
  Uranus: "uranus.jpg",
  Neptune: "neptune.jpg",
};

const LOADING_RING_CIRCUMFERENCE = 2 * Math.PI * 15.5;

function setLoadingProgress(progress) {
  if (!loadingIndicator || !loadingProgress) return;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = LOADING_RING_CIRCUMFERENCE * (1 - clamped);
  loadingProgress.style.strokeDasharray = `${LOADING_RING_CIRCUMFERENCE}`;
  loadingProgress.style.strokeDashoffset = `${offset}`;
  if (loadingLabel) {
    loadingLabel.textContent = `${Math.round(clamped * 100)}%`;
  }
  if (clamped >= 1) {
    loadingIndicator.classList.remove("is-visible");
    loadingIndicator.setAttribute("aria-hidden", "true");
  } else {
    loadingIndicator.classList.add("is-visible");
    loadingIndicator.setAttribute("aria-hidden", "false");
  }
}

loadingManager.onStart = () => {
  setLoadingProgress(0);
};

loadingManager.onProgress = (_url, itemsLoaded, itemsTotal) => {
  if (itemsTotal > 0) {
    setLoadingProgress(itemsLoaded / itemsTotal);
  }
};

loadingManager.onLoad = () => {
  setLoadingProgress(1);
};

function dataUrlToBlob(dataUrl) {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return null;
  const header = dataUrl.slice(0, commaIndex);
  const base64 = dataUrl.slice(commaIndex + 1);
  const match = header.match(/data:(.*);base64/);
  if (!match) return null;
  const mime = match[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

function configureTexture(texture) {
  if (!texture) return;
  if (texture.colorSpace !== undefined) {
    texture.colorSpace = THREE.SRGBColorSpace;
  } else {
    texture.encoding = THREE.sRGBEncoding;
  }
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  texture.anisotropy = Math.min(maxAniso, isMobile ? 2 : 8);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
}

function computeLumaVariance(context, width, height) {
  const sampleX = 8;
  const sampleY = 4;
  const data = context.getImageData(0, 0, width, height).data;
  const samples = [];
  for (let y = 0; y < sampleY; y += 1) {
    for (let x = 0; x < sampleX; x += 1) {
      const px = Math.floor((x / (sampleX - 1)) * (width - 1));
      const py = Math.floor((y / (sampleY - 1)) * (height - 1));
      const idx = (py * width + px) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      samples.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
    }
  }
  const mean = samples.reduce((sum, v) => sum + v, 0) / samples.length;
  const variance =
    samples.reduce((sum, v) => sum + (v - mean) * (v - mean), 0) / samples.length;
  return variance;
}

function createFallbackBandedTexture(colors) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  colors.forEach((stop) => {
    gradient.addColorStop(stop[0], stop[1]);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  configureTexture(texture);
  return texture;
}

function applyContrast(ctx, width, height, factor) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const contrast = factor;
  const intercept = 128 * (1 - contrast);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] * contrast + intercept));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrast + intercept));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrast + intercept));
  }
  ctx.putImageData(imageData, 0, 0);
}

function createCanvasTextureFrom(imageLike, name) {
  const maxSize = 1024;
  const sourceWidth = imageLike.width || imageLike.naturalWidth;
  const sourceHeight = imageLike.height || imageLike.naturalHeight;
  if (!sourceWidth || !sourceHeight) return null;
  const scale = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageLike, 0, 0, width, height);
  if (name === "Saturn") {
    applyContrast(ctx, width, height, 1.25);
  }
  const variance = computeLumaVariance(ctx, width, height);
  if (variance < 40 && name === "Saturn") {
    return createFallbackBandedTexture([
      [0, "#d9c9a5"],
      [0.2, "#c7b185"],
      [0.4, "#e1cda0"],
      [0.6, "#c5b08a"],
      [0.8, "#e6d4a8"],
      [1, "#c9b28a"],
    ]);
  }
  if (variance < 25 && name === "Uranus") {
    return createFallbackBandedTexture([
      [0, "#9fd7e5"],
      [0.5, "#7cc5d8"],
      [1, "#6ab3cc"],
    ]);
  }

  const texture = new THREE.CanvasTexture(canvas);
  configureTexture(texture);
  return texture;
}

function createFallbackEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.fillStyle = "#1b4f9c";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const rand = (() => {
    let seed = 42;
    return () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  })();

  context.fillStyle = "#3fa34d";
  for (let i = 0; i < 120; i += 1) {
    const x = rand() * canvas.width;
    const y = rand() * canvas.height;
    const r = 6 + rand() * 26;
    context.beginPath();
    context.ellipse(x, y, r, r * 0.7, rand() * Math.PI, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "rgba(194,164,102,0.75)";
  for (let i = 0; i < 60; i += 1) {
    const x = rand() * canvas.width;
    const y = rand() * canvas.height;
    const r = 4 + rand() * 18;
    context.beginPath();
    context.ellipse(x, y, r, r * 0.6, rand() * Math.PI, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "rgba(240, 240, 240, 0.9)";
  context.beginPath();
  context.ellipse(canvas.width * 0.25, 18, 90, 16, 0, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.ellipse(canvas.width * 0.75, canvas.height - 18, 90, 16, 0, 0, Math.PI * 2);
  context.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createFallbackSaturnTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const rand = (() => {
    let seed = 1337;
    return () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  })();

  const stops = [
    [0, "#d7c6a2"],
    [0.12, "#cbb28d"],
    [0.28, "#e0cca1"],
    [0.45, "#c7b08a"],
    [0.62, "#e6d4a8"],
    [0.78, "#cdb58f"],
    [0.92, "#e0cfa6"],
    [1, "#c9b28a"],
  ];
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  stops.forEach((stop) => gradient.addColorStop(stop[0], stop[1]));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.12;
  for (let y = 0; y < canvas.height; y += 4) {
    const bandNoise = (rand() - 0.5) * 24;
    ctx.fillStyle = `rgba(160, 140, 110, ${0.08 + rand() * 0.08})`;
    ctx.fillRect(0, y + bandNoise, canvas.width, 2);
  }

  ctx.globalAlpha = 0.2;
  for (let i = 0; i < 240; i += 1) {
    const x = rand() * canvas.width;
    const y = rand() * canvas.height;
    const r = 8 + rand() * 40;
    ctx.fillStyle = `rgba(200, 180, 140, ${0.08 + rand() * 0.15})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.8, r * 0.5, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "rgba(230, 220, 200, 0.2)";
  ctx.beginPath();
  ctx.ellipse(canvas.width * 0.52, canvas.height * 0.28, 120, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  configureTexture(texture);
  return texture;
}

function createFallbackUranusTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#a7dcec");
  gradient.addColorStop(0.5, "#7cc5d8");
  gradient.addColorStop(1, "#6cb6cf");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.1;
  for (let y = 0; y < canvas.height; y += 6) {
    ctx.fillStyle = "rgba(120, 190, 210, 0.15)";
    ctx.fillRect(0, y, canvas.width, 2);
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  configureTexture(texture);
  return texture;
}

function createRingFadeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.12, "rgba(255,255,255,0.35)");
  gradient.addColorStop(0.22, "rgba(255,255,255,0.75)");
  gradient.addColorStop(0.32, "rgba(255,255,255,1)");
  gradient.addColorStop(0.68, "rgba(255,255,255,1)");
  gradient.addColorStop(0.78, "rgba(255,255,255,0.75)");
  gradient.addColorStop(0.88, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function loadPlanetTexture(name, onLoad) {
  if (planetTextures.has(name)) {
    const cached = planetTextures.get(name);
    if (cached) {
      onLoad(cached);
    } else {
      const callbacks = planetTextureCallbacks.get(name) || [];
      callbacks.push(onLoad);
      planetTextureCallbacks.set(name, callbacks);
    }
    return;
  }

  const fileName = planetTextureFiles[name];
  if (fileName) {
    const url = `${TEXTURE_BASE_PATH}/${fileName}`;
    planetTextures.set(name, null);
    planetTextureCallbacks.set(name, [onLoad]);
    textureLoader.load(
      url,
      (texture) => {
        configureTexture(texture);
        planetTextures.set(name, texture);
        const callbacks = planetTextureCallbacks.get(name) || [];
        callbacks.forEach((cb) => cb(texture));
        planetTextureCallbacks.delete(name);
      },
      undefined,
      () => {
        const fallback =
          name === "Saturn"
            ? createFallbackSaturnTexture()
            : name === "Uranus"
            ? createFallbackUranusTexture()
            : null;
        planetTextures.set(name, fallback);
        const callbacks = planetTextureCallbacks.get(name) || [];
        callbacks.forEach((cb) => cb(fallback));
        planetTextureCallbacks.delete(name);
      }
    );
    return;
  }

  const dataUrl = planetTextureData[name];
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    planetTextures.set(name, null);
    return;
  }

  planetTextures.set(name, null);
  planetTextureCallbacks.set(name, [onLoad]);

  const blob = dataUrlToBlob(dataUrl);
  if (!blob) {
    planetTextures.set(name, null);
    planetTextureCallbacks.delete(name);
    return;
  }

  const finalizeTexture = (imageLike) => {
    const texture = createCanvasTextureFrom(imageLike, name);
    if (!texture) {
      planetTextures.set(name, null);
      planetTextureCallbacks.delete(name);
      return;
    }
    planetTextures.set(name, texture);
    const callbacks = planetTextureCallbacks.get(name) || [];
    callbacks.forEach((cb) => cb(texture));
    planetTextureCallbacks.delete(name);
  };

  const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|android/i.test(navigator.userAgent);
  const forceImagePath = name === "Saturn";
  if (window.createImageBitmap && !isSafari && !forceImagePath) {
    if (name === "Saturn") {
      console.log("[Saturn] texture decode: createImageBitmap");
    }
    createImageBitmap(blob)
      .then((bitmap) => {
        if (name === "Saturn") {
          console.log("[Saturn] bitmap size", bitmap.width, bitmap.height);
        }
        finalizeTexture(bitmap);
      })
      .catch(() => {
        if (name === "Saturn") {
          const fallback = createFallbackSaturnTexture();
          planetTextures.set(name, fallback);
          const callbacks = planetTextureCallbacks.get(name) || [];
          callbacks.forEach((cb) => cb(fallback));
          planetTextureCallbacks.delete(name);
        } else {
          planetTextures.set(name, null);
          planetTextureCallbacks.delete(name);
        }
      });
  } else {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    const blobUrl = URL.createObjectURL(blob);
    image.onload = () => {
      if (name === "Saturn") {
        console.log("[Saturn] texture decode: Image");
        console.log("[Saturn] image size", image.naturalWidth, image.naturalHeight);
      }
      if (!image.naturalWidth || !image.naturalHeight) {
        planetTextures.set(name, null);
        planetTextureCallbacks.delete(name);
        URL.revokeObjectURL(blobUrl);
        return;
      }
      if (image.decode) {
        image
          .decode()
          .then(() => {
            finalizeTexture(image);
            URL.revokeObjectURL(blobUrl);
          })
          .catch(() => {
            finalizeTexture(image);
            URL.revokeObjectURL(blobUrl);
          });
      } else {
        finalizeTexture(image);
        URL.revokeObjectURL(blobUrl);
      }
    };
    image.onerror = () => {
      if (name === "Saturn") {
        console.log("[Saturn] texture decode: error");
      }
      if (name === "Saturn") {
        const fallback = createFallbackSaturnTexture();
        planetTextures.set(name, fallback);
        const callbacks = planetTextureCallbacks.get(name) || [];
        callbacks.forEach((cb) => cb(fallback));
        planetTextureCallbacks.delete(name);
      } else {
        planetTextures.set(name, null);
        planetTextureCallbacks.delete(name);
      }
      URL.revokeObjectURL(blobUrl);
    };
    image.src = blobUrl;
  }
}

fallbackEarthTexture = createFallbackEarthTexture();
configureTexture(fallbackEarthTexture);

const ambient = new THREE.AmbientLight(0xffffff, 0.08);
scene.add(ambient);

const sunLight = new THREE.PointLight(0xffd27d, 6.2, 360, 1.6);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const starGeometry = new THREE.BufferGeometry();
const starCount = STAR_COUNT;
const starPositions = new Float32Array(starCount * 3);
const starSizes = new Float32Array(starCount);
for (let i = 0; i < starCount; i += 1) {
  const band = Math.random() < 0.7;
  const radius = Math.random() * 220 + 80;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 60;
  const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 60;
  const y = band ? (Math.random() - 0.5) * 40 : (Math.random() - 0.5) * 180;
  starPositions[i * 3] = x;
  starPositions[i * 3 + 1] = y;
  starPositions[i * 3 + 2] = z;
  starSizes[i] = (band ? 0.6 : 0.4) + Math.random() * 1.2;
}
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

const starCanvas = document.createElement("canvas");
starCanvas.width = 128;
starCanvas.height = 128;
const starCtx = starCanvas.getContext("2d");
const starGradient = starCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
starGradient.addColorStop(0, "rgba(255,255,255,1)");
starGradient.addColorStop(0.3, "rgba(255,255,255,0.9)");
starGradient.addColorStop(0.6, "rgba(255,255,255,0.4)");
starGradient.addColorStop(1, "rgba(255,255,255,0)");
starCtx.fillStyle = starGradient;
starCtx.fillRect(0, 0, 128, 128);
const starTexture = new THREE.CanvasTexture(starCanvas);

const starVertexShader = `
  attribute float size;
  varying float vAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = length(mvPosition.xyz);
    vAlpha = clamp(1.0 - dist / 420.0, 0.2, 1.0);
    gl_PointSize = size * (220.0 / dist);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  uniform sampler2D pointTexture;
  varying float vAlpha;
  void main() {
    vec4 color = texture2D(pointTexture, gl_PointCoord);
    gl_FragColor = vec4(color.rgb, color.a * vAlpha);
  }
`;

const starMaterial = new THREE.ShaderMaterial({
  uniforms: {
    pointTexture: { value: starTexture },
  },
  vertexShader: starVertexShader,
  fragmentShader: starFragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffc57a,
  emissive: 0xff8a4b,
  emissiveIntensity: 0.8,
});
loadPlanetTexture("Sun", (texture) => {
  sunMaterial.map = texture;
  sunMaterial.emissiveMap = texture;
  sunMaterial.color = new THREE.Color(0xffffff);
  sunMaterial.needsUpdate = true;
});
const sun = new THREE.Mesh(new THREE.SphereGeometry(SUN_RADIUS, SUN_SEGMENTS, SUN_SEGMENTS), sunMaterial);
sun.userData.rotationDays = 25.38;
sun.userData.name = "Sun";
scene.add(sun);
const sunGlowCanvas = document.createElement("canvas");
sunGlowCanvas.width = 256;
sunGlowCanvas.height = 256;
const sunGlowContext = sunGlowCanvas.getContext("2d");
const glowGradient = sunGlowContext.createRadialGradient(128, 128, 20, 128, 128, 120);
glowGradient.addColorStop(0, "rgba(255, 210, 125, 0.7)");
glowGradient.addColorStop(0.4, "rgba(255, 160, 90, 0.35)");
glowGradient.addColorStop(1, "rgba(255, 140, 70, 0)");
sunGlowContext.fillStyle = glowGradient;
sunGlowContext.fillRect(0, 0, 256, 256);
const sunGlowTexture = new THREE.CanvasTexture(sunGlowCanvas);
const sunGlow = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: sunGlowTexture,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
);
sunGlow.scale.set(6, 6, 1);
sun.add(sunGlow);
const sunAxis = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -3.6, 0), new THREE.Vector3(0, 3.6, 0)]),
  new THREE.LineBasicMaterial({ color: 0xffd9a6, transparent: true, opacity: 0.35 })
);
sunAxis.rotation.x = 7.25 * DEG_TO_RAD;
sun.add(sunAxis);

const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

const planetGroup = new THREE.Group();
scene.add(planetGroup);

const labelGroup = new THREE.Group();
scene.add(labelGroup);

const trailGroup = new THREE.Group();
scene.add(trailGroup);

const planetMeshes = new Map();
const labelSprites = new Map();
const satelliteMeshes = new Map();
let moonMesh = null;
let moonLabel = null;
let moonHighlight = null;
let earthCloudMesh = null;
const highlightVertexShader = `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const highlightFragmentShader = `
  uniform vec3 sunPosition;
  uniform vec3 highlightColor;
  uniform float intensityScale;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec3 lightDir = normalize(sunPosition - vWorldPos);
    float ndotl = max(dot(vWorldNormal, lightDir), 0.0);
    float intensity = pow(ndotl, 0.5);
    float alpha = intensity * 0.6 * intensityScale;
    gl_FragColor = vec4(highlightColor * intensity, alpha);
  }
`;

function normalizeRadians(angle) {
  const twoPi = Math.PI * 2;
  let result = angle % twoPi;
  if (result > Math.PI) result -= twoPi;
  if (result < -Math.PI) result += twoPi;
  return result;
}

function solveKepler(M, e) {
  let E = M;
  for (let i = 0; i < 8; i += 1) {
    const delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-6) break;
  }
  return E;
}

function computeElements(planet, centuries) {
  const base = planet.elements;
  return {
    a: base.a0 + base.aDot * centuries,
    e: base.e0 + base.eDot * centuries,
    I: (base.I0 + base.IDot * centuries) * DEG_TO_RAD,
    L: (base.L0 + base.LDot * centuries) * DEG_TO_RAD,
    peri: (base.peri0 + base.periDot * centuries) * DEG_TO_RAD,
    node: (base.node0 + base.nodeDot * centuries) * DEG_TO_RAD,
    b: (base.b || 0) * DEG_TO_RAD,
    c: (base.c || 0) * DEG_TO_RAD,
    s: (base.s || 0) * DEG_TO_RAD,
    f: (base.f || 0) * DEG_TO_RAD,
  };
}

function computeHeliocentricPosition(planet, timeDays) {
  const centuries = timeDays / 36525;
  const elements = computeElements(planet, centuries);
  const omega = elements.peri - elements.node;
  const meanAnomaly =
    elements.L -
    elements.peri +
    elements.b * centuries * centuries +
    elements.c * Math.cos(elements.f * centuries) +
    elements.s * Math.sin(elements.f * centuries);
  const M = normalizeRadians(meanAnomaly);
  const E = solveKepler(M, elements.e);

  const xPrime = elements.a * (Math.cos(E) - elements.e);
  const yPrime = elements.a * Math.sqrt(1 - elements.e * elements.e) * Math.sin(E);

  const cosO = Math.cos(elements.node);
  const sinO = Math.sin(elements.node);
  const cosI = Math.cos(elements.I);
  const sinI = Math.sin(elements.I);
  const cosW = Math.cos(omega);
  const sinW = Math.sin(omega);

  const xEcl = (cosW * cosO - sinW * sinO * cosI) * xPrime + (-sinW * cosO - cosW * sinO * cosI) * yPrime;
  const yEcl = (cosW * sinO + sinW * cosO * cosI) * xPrime + (-sinW * sinO + cosW * cosO * cosI) * yPrime;
  const zEcl = sinW * sinI * xPrime + cosW * sinI * yPrime;

  return new THREE.Vector3(
    xEcl * ORBIT_SCALE,
    zEcl * ORBIT_SCALE * INCLINATION_SCALE,
    yEcl * ORBIT_SCALE
  );
}

function createOrbitLine(planet, timeDays, opacity) {
  const points = [];
  const segments = 180;
  for (let i = 0; i <= segments; i += 1) {
    const dayOffset = (planet.periodDays * i) / segments;
    points.push(computeHeliocentricPosition(planet, timeDays + dayOffset));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity, transparent: true });
  return new THREE.LineLoop(geometry, material);
}

function getEarthBarycenterOffset(timeDays) {
  const angle = (timeDays / MOON_PERIOD_DAYS) * Math.PI * 2;
  const x = Math.cos(angle) * MOON_ORBIT_AU;
  const y = Math.sin(angle) * MOON_ORBIT_AU;
  const z = 0;
  const tiltY = y * Math.cos(MOON_INCLINATION) - z * Math.sin(MOON_INCLINATION);
  const tiltZ = y * Math.sin(MOON_INCLINATION) + z * Math.cos(MOON_INCLINATION);
  return new THREE.Vector3(x, tiltZ, tiltY).multiplyScalar(-EARTH_BARYCENTER_FACTOR * ORBIT_SCALE);
}

function getMoonOffset(timeDays) {
  const angle = (timeDays / MOON_PERIOD_DAYS) * Math.PI * 2;
  const x = Math.cos(angle) * MOON_ORBIT_DISTANCE;
  const y = Math.sin(angle) * MOON_ORBIT_DISTANCE;
  const z = 0;
  const tiltY = y * Math.cos(MOON_INCLINATION) - z * Math.sin(MOON_INCLINATION);
  const tiltZ = y * Math.sin(MOON_INCLINATION) + z * Math.cos(MOON_INCLINATION);
  return new THREE.Vector3(x, tiltZ, tiltY);
}

function getSatelliteOffset(satellite, timeDays) {
  const parentRadius = planetRadiusByName.get(satellite.parent) || 1;
  const minOrbit = parentRadius * SATELLITE_MIN_ORBIT_FACTOR;
  const orbit = Math.max(satellite.orbitKm * SATELLITE_DISTANCE_SCALE, minOrbit);
  const angle = (timeDays / satellite.orbitDays) * Math.PI * 2 + (satellite.phase || 0);
  const x = Math.cos(angle) * orbit;
  const y = Math.sin(angle) * orbit;
  const z = 0;
  const tilt = (satellite.tiltDeg || 0) * DEG_TO_RAD;
  const tiltY = y * Math.cos(tilt) - z * Math.sin(tilt);
  const tiltZ = y * Math.sin(tilt) + z * Math.cos(tilt);
  return new THREE.Vector3(x, tiltZ, tiltY);
}

function createLabelSprite(text) {
  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, size, size);
  context.fillStyle = "rgba(255,255,255,0.9)";
  context.font = "36px Space Grotesk";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(8, 8, 1);
  return sprite;
}

function createAxisLine(length) {
  const points = [new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, length, 0)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xb9d8ff, transparent: true, opacity: 0.35 });
  return new THREE.Line(geometry, material);
}

function buildScene() {
  orbitGroup.clear();
  planetGroup.clear();
  labelGroup.clear();
  trailGroup.clear();
  planetMeshes.clear();
  labelSprites.clear();
  satelliteMeshes.clear();
  moonMesh = null;
  moonLabel = null;
  moonHighlight = null;
  earthCloudMesh = null;

  planets.forEach((planet) => {
    const orbit = createOrbitLine(planet, 0, 0.2);
    orbitGroup.add(orbit);

    const pivot = new THREE.Group();
    pivot.rotation.x = (planet.tiltDeg || 0) * DEG_TO_RAD;
    planetGroup.add(pivot);

    const geometry = new THREE.SphereGeometry(planet.radius, PLANET_SEGMENTS, PLANET_SEGMENTS);
    const materialOptions = { color: planet.color, roughness: 0.6, metalness: 0.08 };
    const wantsTexture = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"].includes(
      planet.name
    );
    if (planet.name === "Earth" && fallbackEarthTexture) {
      materialOptions.map = fallbackEarthTexture;
      materialOptions.color = 0xffffff;
    }
    const material = new THREE.MeshStandardMaterial(materialOptions);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.name = planet.name;
    pivot.add(mesh);

    const highlightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunPosition: { value: new THREE.Vector3(0, 0, 0) },
        highlightColor: { value: new THREE.Color(wantsTexture ? 0xffffff : planet.color) },
        intensityScale: { value: planet.name === "Saturn" ? 0.7 : planet.name === "Uranus" ? 0.75 : 1 },
      },
      vertexShader: highlightVertexShader,
      fragmentShader: highlightFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const highlightMesh = new THREE.Mesh(
      new THREE.SphereGeometry(planet.radius * 1.04, PLANET_SEGMENTS, PLANET_SEGMENTS),
      highlightMaterial
    );
    mesh.add(highlightMesh);

    const axisLength = planet.radius * 1.6 + 0.6;
    const axisLine = createAxisLine(axisLength);
    pivot.add(axisLine);

    planetMeshes.set(planet.name, { pivot, mesh, highlight: highlightMaterial });

    if (wantsTexture) {
      loadPlanetTexture(planet.name, (texture) => {
        material.map = texture;
        material.color = new THREE.Color(0xffffff);
        if (["Jupiter", "Neptune"].includes(planet.name)) {
          material.emissiveMap = texture;
          material.emissiveIntensity = 0.24;
          material.emissive = new THREE.Color(0xffffff);
        }
        material.needsUpdate = true;
      });
    }

    if (planet.name === "Earth") {
      const cloudMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });
      const cloudMesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius * 1.04, PLANET_SEGMENTS + 4, PLANET_SEGMENTS + 4),
        cloudMaterial
      );
      mesh.add(cloudMesh);
      earthCloudMesh = cloudMesh;
      loadPlanetTexture("EarthClouds", (texture) => {
        cloudMaterial.map = texture;
        cloudMaterial.needsUpdate = true;
      });
    }

    if (planet.ring) {
      const ringInner = planet.radius + 2.0;
      const ringOuter = planet.radius + 3.8;
      const ringGeometry = new THREE.RingGeometry(ringInner, ringOuter, RING_SEGMENTS, 1);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0,
        depthWrite: false,
        depthTest: false,
        alphaTest: 0.02,
      });
      const positions = ringGeometry.attributes.position;
      const uv = new Float32Array(positions.count * 2);
      for (let i = 0; i < positions.count; i += 1) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const radius = Math.sqrt(x * x + y * y);
        const angle = Math.atan2(y, x);
        uv[i * 2] = angle / (Math.PI * 2) + 0.5;
        uv[i * 2 + 1] = (radius - ringInner) / (ringOuter - ringInner);
      }
      ringGeometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2.2;
      ring.renderOrder = 0;
      mesh.add(ring);
      mesh.renderOrder = 1;
      ringMaterial.alphaMap = createRingFadeTexture();

      loadPlanetTexture("SaturnRing", (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        ringMaterial.map = texture;
        ringMaterial.needsUpdate = true;
      });
    }

    const label = createLabelSprite(planet.name);
    labelGroup.add(label);
    labelSprites.set(planet.name, label);
  });

  satellites.forEach((satellite, index) => {
    const radius = satellite.radiusKm * SATELLITE_RADIUS_SCALE;
    const geometry = new THREE.SphereGeometry(radius, PLANET_SEGMENTS, PLANET_SEGMENTS);
    const material = new THREE.MeshStandardMaterial({
      color: 0xd7d9e2,
      roughness: 0.7,
      metalness: 0.04,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.name = satellite.name;
    mesh.userData.parent = satellite.parent;
    const parentEntry = planetMeshes.get(satellite.parent);
    if (parentEntry) {
      parentEntry.pivot.add(mesh);
    } else {
      planetGroup.add(mesh);
    }

    const highlightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunPosition: { value: new THREE.Vector3(0, 0, 0) },
        highlightColor: { value: new THREE.Color(0xffffff) },
        intensityScale: { value: 1 },
      },
      vertexShader: highlightVertexShader,
      fragmentShader: highlightFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const highlightMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.05, PLANET_SEGMENTS, PLANET_SEGMENTS),
      highlightMaterial
    );
    mesh.add(highlightMesh);

    const label = createLabelSprite(satellite.name);
    labelGroup.add(label);

    satelliteMeshes.set(satellite.name, {
      mesh,
      label,
      data: { ...satellite, phase: (index / satellites.length) * Math.PI * 2 },
    });
  });

  const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, MOON_SEGMENTS, MOON_SEGMENTS);
  const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6e1d8,
    roughness: 0.65,
    metalness: 0.05,
    emissive: 0x1a1a1a,
    emissiveIntensity: 0.12,
  });
  moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.userData.name = "Moon";
  planetGroup.add(moonMesh);
  loadPlanetTexture("Moon", (texture) => {
    moonMaterial.map = texture;
    moonMaterial.color = new THREE.Color(0xffffff);
    moonMaterial.needsUpdate = true;
  });

  moonHighlight = new THREE.ShaderMaterial({
    uniforms: {
      sunPosition: { value: new THREE.Vector3(0, 0, 0) },
      highlightColor: { value: new THREE.Color(0xffffff) },
      intensityScale: { value: 1 },
    },
    vertexShader: highlightVertexShader,
    fragmentShader: highlightFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const moonHighlightMesh = new THREE.Mesh(
    new THREE.SphereGeometry(MOON_RADIUS * 1.05, 24, 24),
    moonHighlight
  );
  moonMesh.add(moonHighlightMesh);

  moonLabel = createLabelSprite("Moon");
  labelGroup.add(moonLabel);
}

function updateLabelsVisibility() {
  if (!labelsMini) return;
  const enabled = labelsMini.classList.contains("is-active");
  labelGroup.visible = enabled;
  labelsMini.setAttribute("aria-pressed", String(enabled));
}

function updateTrailsVisibility() {
  if (!trailsMini) return;
  const enabled = trailsMini.classList.contains("is-active");
  orbitGroup.visible = enabled;
  trailGroup.visible = false;
  trailsMini.setAttribute("aria-pressed", String(enabled));
}

function updateScale() {
  const scale = state.scale;
  orbitGroup.scale.set(scale, scale, scale);
  planetGroup.scale.set(scale, scale, scale);
  labelGroup.scale.set(scale, scale, scale);
  trailGroup.scale.set(scale, scale, scale);
}

function setFocus(name) {
  state.focus = name;
  focusName.textContent = name;
  focusSelect.value = name;
  state.camera.pan.set(0, 0, 0);
  applyViewPreset("iso");
}

function setSpeed(value) {
  const levels = [1, 50000, 500000, 5000000, 10000000];
  const index = Math.min(levels.length - 1, Math.max(0, Number(value) - 1));
  state.speed = levels[index];
  speedValue.textContent = `${state.speed}x`;
}

function setScale(value) {
  state.scale = Number(value);
  scaleValue.textContent = `${state.scale.toFixed(2)}x`;
  updateScale();
}

function clampCameraDistance() {
  state.camera.distance = Math.min(
    state.camera.maxDistance,
    Math.max(state.camera.minDistance, state.camera.distance)
  );
}

function updateCameraDistance(value) {
  state.camera.distance = Number(value);
  clampCameraDistance();
  cameraValue.textContent = Math.round(state.camera.distance);
  cameraDistance.value = Math.round(state.camera.distance);
}

function applyViewPreset(preset) {
  if (preset === "top") {
    state.camera.pitch = 1.35;
    state.camera.yaw = 0.6;
  } else if (preset === "side") {
    state.camera.pitch = 0.2;
    state.camera.yaw = 0;
  } else {
    state.camera.pitch = 0.5;
    state.camera.yaw = 0.85;
  }
}

function updateFocusTarget() {
  if (state.focus === "Sun") {
    state.camera.target.set(0, 0, 0).add(state.camera.pan);
    return;
  }
  if (state.focus === "Moon" && moonMesh) {
    state.camera.target.copy(moonMesh.position).add(state.camera.pan);
    return;
  }
  const entry = planetMeshes.get(state.focus);
  if (entry) {
    state.camera.target.copy(entry.pivot.position).add(state.camera.pan);
  }
}

function updateCameraPosition() {
  const pitch = Math.max(-1.25, Math.min(1.25, state.camera.pitch));
  const yaw = state.camera.yaw;
  const distance = state.camera.distance;
  updateFocusTarget();

  const x = state.camera.target.x + distance * Math.cos(pitch) * Math.cos(yaw);
  const y = state.camera.target.y + distance * Math.sin(pitch);
  const z = state.camera.target.z + distance * Math.cos(pitch) * Math.sin(yaw);

  camera.position.set(x, y, z);
  camera.lookAt(state.camera.target);
}

function getDistanceScale(distance) {
  const boost = Math.min(0.9, Math.max(0, (distance - 60) / 180));
  return 1 + boost;
}

function updatePlanetPositions(delta) {
  if (!state.paused) {
    const deltaSeconds = delta / 1000;
    state.timeDays += (deltaSeconds * state.speed) / 86400;
  }

  planets.forEach((planet) => {
    let position = computeHeliocentricPosition(planet, state.timeDays);
    if (planet.name === "Earth") {
      position = position.clone().add(getEarthBarycenterOffset(state.timeDays));
    }
    const entry = planetMeshes.get(planet.name);
    if (!entry) return;
    entry.pivot.position.copy(position);
    const distance = camera.position.distanceTo(entry.pivot.position);
    const scaleBoost = getDistanceScale(distance);
    entry.mesh.scale.setScalar(scaleBoost);
    if (planet.rotationDays) {
      const rotation = (state.timeDays / planet.rotationDays) * Math.PI * 2;
      entry.mesh.rotation.y = rotation;
    }
    if (planet.name === "Earth" && earthCloudMesh) {
      earthCloudMesh.rotation.y += 0.002;
    }
    const label = labelSprites.get(planet.name);
    if (label) {
      label.position.set(position.x + 2, position.y + 2.2, position.z);
    }
  });

  if (moonMesh) {
    const earthEntry = planetMeshes.get("Earth");
    if (earthEntry) {
      const moonPosition = earthEntry.pivot.position.clone().add(getMoonOffset(state.timeDays));
      moonMesh.position.copy(moonPosition);
      const distance = camera.position.distanceTo(moonPosition);
      const scaleBoost = getDistanceScale(distance);
      moonMesh.scale.setScalar(scaleBoost);
      moonMesh.rotation.y = (state.timeDays / MOON_ROTATION_DAYS) * Math.PI * 2;
      if (moonLabel) {
        moonLabel.position.set(moonPosition.x + 1.2, moonPosition.y + 1, moonPosition.z);
      }
    }
  }

  satellites.forEach((satellite) => {
    const entry = satelliteMeshes.get(satellite.name);
    if (!entry) return;
    const parentEntry = planetMeshes.get(satellite.parent);
    if (!parentEntry) return;
    const offset = getSatelliteOffset(satellite, state.timeDays);
    const position = parentEntry.pivot.position.clone().add(offset);
    entry.mesh.position.copy(offset);
    const distance = camera.position.distanceTo(position);
    const scaleBoost = getDistanceScale(distance);
    entry.mesh.scale.setScalar(scaleBoost);
    entry.label.position.set(position.x + 0.8, position.y + 0.8, position.z);
  });

  simTimeLabel.textContent = `${Math.round(state.timeDays)} days`;
}

function updateTrails() {
  trailGroup.clear();
}

function updateFps(timestamp) {
  const delta = timestamp - state.fps.lastTime;
  state.fps.lastTime = timestamp;
  state.fps.frames.push(1000 / delta);
  if (state.fps.frames.length > 20) {
    state.fps.frames.shift();
  }
  const avg = state.fps.frames.reduce((sum, value) => sum + value, 0) / state.fps.frames.length;
  fpsLabel.textContent = `${avg.toFixed(0)} fps`;
}

function resize() {
  const { width, height } = sceneElement.getBoundingClientRect();
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const meshes = Array.from(planetMeshes.values()).map((entry) => entry.mesh);
  meshes.push(sun);
  if (moonMesh) meshes.push(moonMesh);
  const intersects = raycaster.intersectObjects(meshes, true);
  if (intersects.length > 0) {
    for (const hit of intersects) {
      let current = hit.object;
      while (current) {
        const targetName = current.userData && current.userData.name;
        if (targetName) {
          setFocus(targetName);
          return;
        }
        current = current.parent;
      }
    }
  }
}

function onPointerDown(event) {
  state.camera.dragging = true;
  state.camera.lastPointer = { x: event.clientX, y: event.clientY };
  state.camera.dragMode = event.button === 2 || event.shiftKey ? "pan" : "orbit";
}

function onPointerMove(event) {
  if (!state.camera.dragging || !state.camera.lastPointer) return;
  const dx = event.clientX - state.camera.lastPointer.x;
  const dy = event.clientY - state.camera.lastPointer.y;

  if (state.camera.dragMode === "orbit") {
    state.camera.yaw -= dx * 0.005;
    state.camera.pitch -= dy * 0.005;
  } else {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
    const up = new THREE.Vector3().copy(camera.up).normalize();
    const panSpeed = state.camera.distance * 0.002;
    state.camera.pan.addScaledVector(right, -dx * panSpeed);
    state.camera.pan.addScaledVector(up, dy * panSpeed);
  }

  state.camera.lastPointer = { x: event.clientX, y: event.clientY };
}

function onPointerUp() {
  state.camera.dragging = false;
  state.camera.lastPointer = null;
}

function onWheel(event) {
  event.preventDefault();
  state.camera.distance += event.deltaY * 0.05;
  clampCameraDistance();
  updateCameraDistance(state.camera.distance);
}

function animate(timestamp) {
  if (!animate.lastTimestamp) animate.lastTimestamp = timestamp;
  const delta = timestamp - animate.lastTimestamp;
  animate.lastTimestamp = timestamp;

  updatePlanetPositions(delta);
  if (sun.userData.rotationDays) {
    sun.rotation.y = (state.timeDays / sun.userData.rotationDays) * Math.PI * 2;
  }
  updateCameraPosition();
  renderer.render(scene, camera);
  updateFps(timestamp);
  requestAnimationFrame(animate);
}

function populateFocus() {
  focusSelect.innerHTML = "";
  const sunOption = document.createElement("option");
  sunOption.value = "Sun";
  sunOption.textContent = "Sun";
  focusSelect.appendChild(sunOption);
  planets.forEach((planet) => {
    const option = document.createElement("option");
    option.value = planet.name;
    option.textContent = planet.name;
    focusSelect.appendChild(option);
  });
  const moonOption = document.createElement("option");
  moonOption.value = "Moon";
  moonOption.textContent = "Moon";
  focusSelect.appendChild(moonOption);
}

function init() {
  populateFocus();
  buildScene();
  updateLabelsVisibility();
  updateTrailsVisibility();
  updateTrails();
  updateScale();

  resize();
  updateCameraDistance(cameraDistance.value);
  if (calendarDate) {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    calendarDate.value = iso;
    setTimeFromDateInput(iso);
  }
}

speedInput.addEventListener("input", (event) => {
  setSpeed(event.target.value);
});

scaleInput.addEventListener("input", (event) => {
  setScale(event.target.value);
});

if (labelsMini) {
  labelsMini.classList.add("is-active");
  labelsMini.addEventListener("click", () => {
    labelsMini.classList.toggle("is-active");
    updateLabelsVisibility();
  });
}

if (trailsMini) {
  trailsMini.addEventListener("click", () => {
    trailsMini.classList.toggle("is-active");
    updateTrailsVisibility();
    updateTrails();
  });
}

focusSelect.addEventListener("change", (event) => {
  setFocus(event.target.value);
});

pauseButton.addEventListener("click", () => {
  state.paused = !state.paused;
  pauseButton.textContent = state.paused ? "Resume" : "Pause";
});

resetButton.addEventListener("click", () => {
  setFocus("Sun");
  state.timeDays = 0;
  state.camera.pan.set(0, 0, 0);
  applyViewPreset("iso");
  updateCameraDistance(100);
});

cameraDistance.addEventListener("input", (event) => {
  updateCameraDistance(event.target.value);
});

if (calendarDate) {
  calendarDate.addEventListener("change", (event) => {
    setTimeFromDateInput(event.target.value);
  });
}

document.querySelectorAll("button[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    applyViewPreset(button.dataset.view);
  });
});

window.addEventListener("resize", resize);
renderer.domElement.addEventListener("click", onClick);
renderer.domElement.addEventListener("pointerdown", onPointerDown);
renderer.domElement.addEventListener("pointermove", onPointerMove);
renderer.domElement.addEventListener("pointerup", onPointerUp);
renderer.domElement.addEventListener("pointerleave", onPointerUp);
renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());
renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

if (controlsToggle && controlsPanel) {
  controlsToggle.addEventListener("click", () => {
    controlsPanel.classList.toggle("is-collapsed");
  });

  document.addEventListener("click", (event) => {
    if (controlsPanel.classList.contains("is-collapsed")) return;
    if (controlsPanel.contains(event.target)) return;
    controlsPanel.classList.add("is-collapsed");
  });
}

setSpeed(speedInput.value);
setScale(scaleInput.value);
updateLabelsVisibility();
updateTrailsVisibility();
init();
applyViewPreset("iso");
requestAnimationFrame(animate);
