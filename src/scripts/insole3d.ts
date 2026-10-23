// Ұлтарақтың 3D қысым картасы (Three.js). Биіктік пен түс = қысым.
// Нақты пациент деректері емес: жүріс кезіндегі қысымның жалпы схемасы.
import {
  WebGLRenderer, Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, Group, Mesh, Color,
  BufferGeometry, Float32BufferAttribute, MeshStandardMaterial, ExtrudeGeometry, Shape, Vector2, Vector3,
} from 'three';

const SOLE = 'M150 28c46 0 76 34 80 92 3 44-6 82-10 122-4 44 6 86 8 130 4 82-28 158-88 158-52 0-80-44-80-104 0-50 18-82 18-128 0-40-20-74-24-124-6-80 34-146 96-146Z';

// Қысым ошақтары (SVG координаттары): cx, cy, rx, ry, күші, жүріс фазасы
const ZONES = [
  { x: 146, y: 460, rx: 58, ry: 54, w: 1.0, ph: 0.0 },   // өкше
  { x: 198, y: 330, rx: 24, ry: 78, w: 0.45, ph: 0.25 }, // сыртқы жиек
  { x: 140, y: 168, rx: 80, ry: 48, w: 0.95, ph: 0.5 },  // табан алды
  { x: 196, y: 98, rx: 28, ry: 24, w: 0.5, ph: 0.62 },   // кіші саусақтар
  { x: 112, y: 70, rx: 30, ry: 34, w: 0.9, ph: 0.75 },   // бас бармақ
];
const TAGS = [
  { x: 112, y: 70 }, { x: 140, y: 168 }, { x: 100, y: 300 }, { x: 146, y: 460 },
];

// SVG path-ты (тек M, c, Z) нүктелер тізіміне айналдыру
function solePoints(d: string, steps = 14): Vector2[] {
  const nums = d.match(/-?\d*\.?\d+/g)!.map(Number);
  let i = 0;
  let cx = nums[i++], cy = nums[i++];
  const pts: Vector2[] = [new Vector2(cx, cy)];
  while (i + 5 < nums.length) {
    const [x1, y1, x2, y2, x, y] = nums.slice(i, i + 6).map((n, k) => n + (k % 2 ? cy : cx));
    for (let s = 1; s <= steps; s++) {
      const t = s / steps, u = 1 - t;
      pts.push(new Vector2(
        u * u * u * cx + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x,
        u * u * u * cy + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y,
      ));
    }
    cx = x; cy = y; i += 6;
  }
  return pts;
}

function inside(pts: Vector2[], x: number, y: number) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}

const css = (el: Element, name: string, fb: string) => getComputedStyle(el).getPropertyValue(name).trim() || fb;

export function initInsole3D(root: HTMLElement) {
  const box = root.querySelector<HTMLElement>('.scan3d');
  const canvas = box?.querySelector('canvas');
  if (!box || !canvas) return;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return; // WebGL жоқ: 2D сурет қалады
  }
  root.classList.add('is3d');
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const S = 1 / 100; // SVG бірлігі → 3D
  const toX = (x: number) => (x - 154) * S;
  const toZ = (y: number) => (y - 290) * S;
  const H = 0.95; // ең үлкен биіктік

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  scene.add(new HemisphereLight(0xffffff, 0x9fb8c8, 1.6));
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.position.set(-2, 5, 3);
  scene.add(sun);

  const pts = solePoints(SOLE);
  const group = new Group();
  scene.add(group);

  // Ұлтарақ табаны (қалыңдығы бар)
  const shape = new Shape(pts.map((p) => new Vector2(toX(p.x), -toZ(p.y))));
  const slabGeo = new ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 4 });
  slabGeo.rotateX(-Math.PI / 2);
  slabGeo.translate(0, -0.18, 0);
  const slabMat = new MeshStandardMaterial({ roughness: 0.75, metalness: 0 });
  group.add(new Mesh(slabGeo, slabMat));

  // Қысым беті: тор, тек табан ішіндегі үшбұрыштар
  const NX = 96, NY = 168;
  const x0 = 34, x1 = 274, y0 = 20, y1 = 548;
  const pos: number[] = [], col: number[] = [], inMask: boolean[] = [], svgXY: number[] = [];
  for (let j = 0; j <= NY; j++) {
    for (let i = 0; i <= NX; i++) {
      const sx = x0 + ((x1 - x0) * i) / NX, sy = y0 + ((y1 - y0) * j) / NY;
      inMask.push(inside(pts, sx, sy));
      svgXY.push(sx, sy);
      pos.push(toX(sx), 0, toZ(sy));
      col.push(1, 1, 1);
    }
  }
  const at = (i: number, j: number) => j * (NX + 1) + i;
  // Шеттегі сыртқы нүктелерді контурға жабыстырамыз: беттің шеті тегіс болады
  const near: number[] = [];
  for (let j = 0; j <= NY; j++) {
    for (let i = 0; i <= NX; i++) {
      const k = at(i, j);
      if (inMask[k]) continue;
      let edge = false;
      for (let dj = -1; dj <= 1 && !edge; dj++) for (let di = -1; di <= 1; di++) {
        const ii = i + di, jj = j + dj;
        if (ii >= 0 && jj >= 0 && ii <= NX && jj <= NY && inMask[at(ii, jj)]) { edge = true; break; }
      }
      if (edge) near.push(k);
    }
  }
  for (const k of near) {
    const sx = svgXY[2 * k], sy = svgXY[2 * k + 1];
    let best = Infinity, bx = sx, by = sy;
    for (let q = 0; q < pts.length; q++) {
      const a = pts[q], c = pts[(q + 1) % pts.length];
      const vx = c.x - a.x, vy = c.y - a.y;
      const t = Math.max(0, Math.min(1, ((sx - a.x) * vx + (sy - a.y) * vy) / (vx * vx + vy * vy || 1)));
      const px = a.x + vx * t, py = a.y + vy * t, d = (px - sx) ** 2 + (py - sy) ** 2;
      if (d < best) { best = d; bx = px; by = py; }
    }
    svgXY[2 * k] = bx; svgXY[2 * k + 1] = by;
    pos[3 * k] = toX(bx); pos[3 * k + 2] = toZ(by);
    inMask[k] = true;
  }
  const idx: number[] = [];
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1);
      if (inMask[a] && inMask[b] && inMask[c]) idx.push(a, c, b);
      if (inMask[b] && inMask[c] && inMask[d]) idx.push(b, c, d);
    }
  }
  const geo = new BufferGeometry();
  const posAttr = new Float32BufferAttribute(pos, 3);
  const colAttr = new Float32BufferAttribute(col, 3);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('color', colAttr);
  geo.setIndex(idx);
  const surfMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.05 });
  const surf = new Mesh(geo, surfMat);
  group.add(surf);

  // Түстер CSS токендерінен (қараңғы тақырыпқа да сай)
  const cLow = new Color(), cMid = new Color(), cHigh = new Color(), tmp = new Color();
  const readColors = () => {
    cLow.set(css(root, '--mint', '#EAF5F1'));
    cMid.set(css(root, '--green', '#258477'));
    cHigh.set('#173372');
    slabMat.color.set(css(root, '--surface', '#ffffff')).lerp(cLow, 0.35);
  };
  readColors();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', readColors);
  addEventListener('themechange', readColors);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Жүріс: өкше → табан алды → бас бармақ, 2.4 с цикл
  const pressure = (x: number, y: number, t: number) => {
    let p = 0;
    for (const z of ZONES) {
      const dx = (x - z.x) / z.rx, dy = (y - z.y) / z.ry;
      const g = Math.exp(-(dx * dx + dy * dy) * 1.6);
      const phase = reduce ? 1 : 0.55 + 0.45 * Math.cos(2 * Math.PI * (t - z.ph));
      p += z.w * g * phase;
    }
    return Math.min(1, p);
  };

  const update = (t: number) => {
    const P = posAttr.array as Float32Array, C = colAttr.array as Float32Array;
    for (let k = 0, n = inMask.length; k < n; k++) {
      if (!inMask[k]) continue;
      const p = pressure(svgXY[2 * k], svgXY[2 * k + 1], t);
      P[3 * k + 1] = p * H;
      if (p < 0.5) tmp.copy(cLow).lerp(cMid, p / 0.5);
      else tmp.copy(cMid).lerp(cHigh, (p - 0.5) / 0.5);
      C[3 * k] = tmp.r; C[3 * k + 1] = tmp.g; C[3 * k + 2] = tmp.b;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    geo.computeVertexNormals();
  };

  // Белгілер: 3D нүктені экранға проекциялау
  const tags = [...box.querySelectorAll<HTMLElement>('.tag')];
  const v = new Vector3();
  const placeTags = (t: number) => {
    const w = box.clientWidth, h = box.clientHeight;
    TAGS.forEach((tg, i) => {
      v.set(toX(tg.x), pressure(tg.x, tg.y, t) * H + 0.08, toZ(tg.y));
      group.localToWorld(v);
      v.project(camera);
      const tw = tags[i].offsetWidth / 2;
      const px = Math.max(tw, Math.min(w - tw, (v.x * 0.5 + 0.5) * w));
      tags[i].style.transform = `translate(${px}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -130%)`;
    });
  };

  const resize = () => {
    const w = box.clientWidth, h = box.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(box);
  resize();

  // Камера: жоғарыдан қиғаш; саусақпен бұруға болады
  camera.position.set(0, 6.4, 7.6);
  camera.lookAt(0, 0.1, -0.25);
  let yaw = -0.5, drag = false, lastX = 0, userYaw = 0;
  box.addEventListener('pointerdown', (e) => { drag = true; lastX = e.clientX; box.setPointerCapture(e.pointerId); });
  box.addEventListener('pointermove', (e) => { if (drag) { userYaw += (e.clientX - lastX) * 0.01; lastX = e.clientX; } });
  const end = () => { drag = false; };
  box.addEventListener('pointerup', end);
  box.addEventListener('pointercancel', end);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);

  const start = performance.now();
  const frame = (now: number) => {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = (now - start) / 2400;
    yaw = reduce ? -0.5 : -0.5 + Math.sin(t * 0.9) * 0.35;
    group.rotation.y = yaw + userYaw;
    if (!reduce || t < 0.05) update(t % 1);
    renderer.render(scene, camera);
    placeTags(t % 1);
  };
  update(0);
  requestAnimationFrame(frame);
}
