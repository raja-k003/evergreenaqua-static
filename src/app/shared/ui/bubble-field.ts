import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject, viewChild } from '@angular/core';
import type * as ThreeNs from 'three';

type Three = typeof ThreeNs;
type Role = 'pastel' | 'light' | 'medium' | 'deep' | 'glass';
const ROLES: Role[] = ['pastel', 'light', 'medium', 'deep', 'glass'];

interface Ball {
  id: number;
  radius: number;
  mass: number;
  visualScale: number;
  role: Role;
  isGlass: boolean;
  group: ThreeNs.Group;
  mesh: ThreeNs.Mesh;
  material: ThreeNs.MeshPhysicalMaterial;
  position: ThreeNs.Vector3;
  velocity: ThreeNs.Vector3;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clampN = (v: number, m: number) => (v < -m ? -m : v > m ? m : v);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Decorative, interactive bubble field for the home hero.
 *
 * Soft spheres (some glassy, like water droplets) cluster in the middle of the hero, drift,
 * collide and are pushed away by the cursor. As the page scrolls past the hero they lose their
 * pull and fall to the floor, then regather when you scroll back up.
 *
 * Three.js is loaded lazily in the browser only (never during SSR/prerender), colours follow the
 * active theme, rendering pauses when the hero is off-screen or the tab is hidden, and visitors
 * who prefer reduced motion get a single still frame. If WebGL is unavailable nothing is drawn
 * and the hero's CSS background is all that shows.
 */
@Component({
  selector: 'app-bubble-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #cv aria-hidden="true"></canvas>`,
  styles: `
    :host { position: absolute; inset: 0; display: block; pointer-events: none; overflow: hidden; }
    canvas { display: block; width: 100%; height: 100%; opacity: 0; transition: opacity 1s ease; }
    :host(.is-ready) canvas { opacity: 1; }
  `,
})
export class BubbleField {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => void this.start());
    });
  }

  private async start(): Promise<void> {
    const canvas = this.canvasRef().nativeElement;
    const hostEl = this.host.nativeElement;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let THREE: Three;
    try {
      THREE = await import('three');
    } catch {
      return;
    }

    let renderer: ThreeNs.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // WebGL unavailable: the CSS background remains
    }

    let destroyed = false;
    let raf = 0;
    let visible = true;
    const cleanups: (() => void)[] = [];
    const mobile = innerWidth < 768;

    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 11);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x88aaff, 1.5);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(-6, 10, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.1);
    rim.position.set(8, 7, -8);
    scene.add(rim);
    const front = new THREE.DirectionalLight(0xffffff, 0.4);
    front.position.set(0, 0, 11);
    scene.add(front);

    // ---- theme colours (hex tokens only; derived colour-mix tokens can't be parsed) ----
    const pal = {} as Record<Role, ThreeNs.Color>;
    ROLES.forEach((r) => (pal[r] = new THREE.Color()));
    const readTheme = (): void => {
      const cs = getComputedStyle(document.documentElement);
      const get = (name: string, fallback: string) => {
        const v = cs.getPropertyValue(name).trim();
        return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
      };
      const primary = new THREE.Color(get('--color-primary', '#0f766e'));
      const accent = new THREE.Color(get('--color-accent', '#14b8a6'));
      const dark = cs.getPropertyValue('color-scheme').includes('dark');
      const white = new THREE.Color('#ffffff');
      pal.deep.copy(primary);
      pal.medium.copy(accent);
      pal.light.copy(accent).lerp(white, dark ? 0.25 : 0.5);
      pal.pastel.copy(accent).lerp(white, dark ? 0.45 : 0.82);
      pal.glass.copy(accent).lerp(white, 0.15);
      hemi.groundColor.copy(accent);
      for (const b of balls) applyColor(b);
    };
    const applyColor = (b: Ball): void => {
      const c = b.isGlass ? pal.glass : pal[b.role];
      b.material.color.copy(c);
      b.material.emissive.copy(c);
    };

    // ---- bubbles ----
    const balls: Ball[] = [];
    // Teardrop: a unit-radius bulb that tapers (slightly concave) to a point above it.
    const geometry = (() => {
      const H = 2.1; // tip height in bulb radii
      const a0 = Math.asin(1 / H); // where the taper leaves the bulb (tangent from the tip)
      const pts: ThreeNs.Vector2[] = [];
      const arc = mobile ? 14 : 20;
      for (let i = 0; i <= arc; i++) {
        const a = -Math.PI / 2 + (i / arc) * (Math.PI / 2 + a0);
        pts.push(new THREE.Vector2(Math.max(0, Math.cos(a)), Math.sin(a)));
      }
      const r0 = Math.cos(a0), y0 = Math.sin(a0), taper = mobile ? 8 : 12;
      for (let i = 1; i <= taper; i++) {
        const t = i / taper;
        pts.push(new THREE.Vector2(r0 * Math.pow(1 - t, 1.7), y0 + (H - y0) * t));
      }
      const g = new THREE.LatheGeometry(pts, mobile ? 28 : 40);
      g.translate(0, -0.35, 0); // centre of mass nearer the middle of the drop
      g.computeVertexNormals();
      return g;
    })();
    const count = mobile ? 34 : 68;
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const sizeF = mobile ? 0.72 : 1;
      const radius = sizeF * (r < 0.3 ? 0.27 + Math.random() * 0.12 : r < 0.8 ? 0.42 + Math.random() * 0.18 : 0.66 + Math.random() * 0.21);
      const isGlass = Math.random() < 0.18;
      let role: Role = 'glass';
      let material: ThreeNs.MeshPhysicalMaterial;
      if (isGlass) {
        material = new THREE.MeshPhysicalMaterial({
          roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, transmission: 0.95, ior: 1.485, thickness: 2.2,
          specularIntensity: 1, emissiveIntensity: 0.12, transparent: true,
        });
      } else {
        const cr = Math.random();
        role = cr < 0.25 ? 'pastel' : cr < 0.55 ? 'light' : cr < 0.85 ? 'medium' : 'deep';
        material = new THREE.MeshPhysicalMaterial({
          roughness: 0.44, metalness: 0, clearcoat: 0.24, clearcoatRoughness: 0.35, emissiveIntensity: 0.08, transparent: true,
        });
      }
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.setScalar(radius);
      const group = new THREE.Group();
      group.add(mesh);
      scene.add(group);
      balls.push({
        id: i, radius, mass: Math.pow(radius, 3), visualScale: radius, role, isGlass, group, mesh, material,
        position: new THREE.Vector3(), velocity: new THREE.Vector3(),
      });
    }
    readTheme();

    // Follow theme changes (data-theme switch or custom brand colour).
    const mo = new MutationObserver(() => readTheme());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    cleanups.push(() => mo.disconnect());

    // ---- sizing ----
    let viewW = 10;
    let viewH = 6;
    const resize = (): void => {
      const w = hostEl.clientWidth || 1;
      const h = hostEl.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.position.z;
      viewW = viewH * (w / h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hostEl);
    cleanups.push(() => ro.disconnect());

    // ---- pointer (the canvas ignores pointer events so the hero content stays clickable) ----
    const mouse = { x: 99, y: 99, down: false };
    const onMove = (e: PointerEvent): void => {
      const r = hostEl.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const onDown = (): void => void (mouse.down = true);
    const onUp = (): void => void (mouse.down = false);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('pointerup', onUp, { passive: true });
    cleanups.push(() => {
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
    });

    // ---- physics ----
    const params = { rebound: -0.3, repelForce: 0.05, repelRadius: 4.2, centerPull: 0.0035, bounciness: 0.02 };
    const v3 = () => new THREE.Vector3();
    const mouseProj = v3(), mouseWorld = v3(), prevMouseWorld = v3(), diff = v3(), cDiff = v3(), relVel = v3();
    const centerY = () => viewH * 0.2; // keep the cluster above the heading at the foot of the hero

    const scatterFar = (inward: boolean): void => {
      const R = Math.max(viewW, viewH) * 1.5;
      for (const b of balls) {
        const a = Math.random() * Math.PI * 2;
        b.position.set(Math.cos(a) * R * 1.25, Math.sin(a) * R * 0.85, (Math.random() - 0.5) * 4);
        b.group.position.copy(b.position);
        if (inward) b.velocity.set(-b.position.x, -b.position.y, -b.position.z).normalize().multiplyScalar(0.08 + Math.random() * 0.05);
        else b.velocity.set(0, 0, 0);
      }
    };

    const start = performance.now() / 1000;
    let progress = 0; // 0 at the top of the page; 1 once the hero is scrolled out
    const readScroll = (): void => {
      const h = hostEl.clientHeight || innerHeight;
      progress = clamp01(scrollY / (h * 0.9));
    };
    readScroll();
    addEventListener('scroll', readScroll, { passive: true });
    cleanups.push(() => removeEventListener('scroll', readScroll));

    const step = (time: number): void => {
      const heroF = 1 - smoothstep(0.12, 0.55, progress);
      const dropF = smoothstep(0.15, 0.7, progress);
      const entranceT = easeOutCubic(clamp01((time - start) / 2.2));
      const attractionBoost = lerp(7.5, 1, entranceT);
      const interacting = Math.abs(mouse.x) < 0.99 && Math.abs(mouse.y) < 0.99;

      mouseProj.set(mouse.x, mouse.y, 0.5).unproject(camera);
      const dir = mouseProj.sub(camera.position).normalize();
      mouseWorld.copy(camera.position).add(dir.multiplyScalar(-camera.position.z / dir.z));
      const mouseSpeed = interacting ? Math.min(3, mouseWorld.distanceTo(prevMouseWorld)) : 0;
      prevMouseWorld.copy(mouseWorld);

      const damping = lerp(0.91, 0.992, dropF);
      const clusterActive = Math.max(heroF, entranceT < 1 ? 1 : 0);
      const cy = centerY();

      for (const b of balls) {
        if (heroF > 0.01) {
          b.velocity.x += Math.sin(time * 0.4 + b.id * 1.5) * 0.0004 * b.radius * heroF;
          b.velocity.y += Math.cos(time * 0.5 + b.id * 1.2) * 0.0004 * b.radius * heroF;
          b.velocity.z += Math.sin(time * 0.35 + b.id) * 0.0001 * heroF;
        }
        const pull = params.centerPull * attractionBoost * clusterActive;
        if (pull > 0.00001) {
          b.velocity.x += (0 - b.position.x) * pull * 0.7;
          b.velocity.y += (cy - b.position.y) * pull * 1.85;
          b.velocity.z += (0 - b.position.z) * pull * 1.8;
        }
        if (dropF > 0.001) b.velocity.y -= 0.011 * dropF;
        if (interacting) {
          diff.subVectors(b.position, mouseWorld);
          const dist = diff.length();
          const rad = mouse.down ? params.repelRadius * 1.4 : params.repelRadius;
          const force = mouse.down ? params.repelForce * 1.7 : params.repelForce;
          if (dist < rad && dist > 0.0001) {
            const ratio = dist / rad;
            const sf = 1 - ratio * ratio * (3 - 2 * ratio);
            diff.normalize();
            diff.z *= 0.12;
            diff.normalize();
            b.velocity.addScaledVector(diff, sf * force * (1 + mouseSpeed * 3.2));
          }
        }
        b.velocity.multiplyScalar(damping);
        b.position.add(b.velocity);
        b.mesh.scale.setScalar(b.visualScale);
      }

      // collisions
      const collideScale = 0.28;
      for (let s = 0; s < 3; s++) {
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            const a = balls[i], b = balls[j];
            cDiff.subVectors(b.position, a.position);
            const dist = cDiff.length();
            const min = a.visualScale + b.visualScale;
            if (dist < min && dist > 0.001) {
              const overlap = min - dist;
              cDiff.multiplyScalar(1 / dist);
              const total = a.mass + b.mass;
              a.position.addScaledVector(cDiff, -overlap * (b.mass / total) * collideScale);
              b.position.addScaledVector(cDiff, overlap * (a.mass / total) * collideScale);
              relVel.subVectors(b.velocity, a.velocity);
              const along = relVel.dot(cDiff);
              if (along < -0.0001) {
                const impulse = (-(1 + params.bounciness) * along) / (1 / a.mass + 1 / b.mass);
                a.velocity.addScaledVector(cDiff, -impulse / a.mass);
                b.velocity.addScaledVector(cDiff, impulse / b.mass);
              }
            }
          }
        }
      }

      // containment (side walls, floor, ceiling, shallow depth)
      const xBound = viewW / 2 - 0.2;
      const topY = viewH / 2 - 0.05;
      const floorY = -viewH / 2 + 0.05;
      const restitution = 0.3 + 0.35 * dropF;
      for (const b of balls) {
        const r = b.visualScale;
        if (b.position.x < -xBound - r) { b.position.x = -xBound - r; b.velocity.x *= params.rebound; }
        else if (b.position.x > xBound + r) { b.position.x = xBound + r; b.velocity.x *= params.rebound; }
        if (b.position.y - r < floorY) {
          b.position.y = floorY + r;
          if (b.velocity.y < 0) b.velocity.y = -b.velocity.y * restitution;
          if (dropF > 0.3) { b.velocity.x *= 0.86; b.velocity.z *= 0.86; }
        }
        if (b.position.y + r > topY) { b.position.y = topY - r; if (b.velocity.y > 0) b.velocity.y *= params.rebound; }
        if (b.position.z < -2) { b.position.z = -2; b.velocity.z *= params.rebound; }
        else if (b.position.z > 2) { b.position.z = 2; b.velocity.z *= params.rebound; }

        // Droplets stay upright and lean into their motion, with a slow sway.
        const sway = Math.sin(time * 0.9 + b.id * 1.7) * 0.06;
        b.group.rotation.z += (clampN(-b.velocity.x * 3, 0.55) + sway - b.group.rotation.z) * 0.08;
        b.group.rotation.x += (clampN(b.velocity.y * 1.2, 0.35) - b.group.rotation.x) * 0.08;
        b.group.position.copy(b.position);
      }
    };

    const frame = (): void => {
      if (destroyed) return;
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      step(performance.now() / 1000);
      renderer.render(scene, camera);
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(hostEl);
    cleanups.push(() => io.disconnect());

    if (reduceMotion) {
      // One still frame: let the simulation settle off-screen, then draw it once.
      scatterFar(true);
      for (let i = 0; i < 700; i++) step(start + 10 + i / 60);
      renderer.render(scene, camera);
    } else {
      scatterFar(true);
      frame();
    }
    hostEl.classList.add('is-ready');

    this.destroyRef.onDestroy(() => {
      destroyed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      geometry.dispose();
      balls.forEach((b) => b.material.dispose());
      renderer.dispose();
    });
  }
}
