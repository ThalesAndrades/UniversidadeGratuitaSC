import { useRef, useEffect, memo } from 'react';

/* ── Brand palette ─────────────────────────────────────────────────────────── */
const BRAND = {
  green: [143, 190, 63] as const,
  blue:  [27, 95, 173]  as const,
  gold:  [232, 185, 49]  as const,
};

const PALETTE = [BRAND.green, BRAND.blue, BRAND.gold];

/* ── Node definition ───────────────────────────────────────────────────────── */
interface N {
  /** base position in % of canvas */
  bx: number; by: number;
  /** orbit radii in % */
  rx: number; ry: number;
  /** angular speed (rad/s) — slow */
  spd: number;
  /** phase offset */
  ph: number;
  /** visual radius px */
  r: number;
  /** rgb tuple */
  c: readonly [number, number, number];
  /** pulse speed & phase */
  ps: number; pp: number;
}

/**
 * 18 nodes distributed in a ring around the card center.
 * The card occupies roughly the central 45% width × 60% height,
 * so nodes orbit outside that zone — in the "atmosphere" around it.
 */
function seedNodes(): N[] {
  const out: N[] = [];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;

    /* elliptical base: wider horizontally to fill widescreen,
       taller ring to clear the card vertically */
    const ringX = 42 + (i % 3) * 4;   // 42-50 % from center
    const ringY = 44 + (i % 4) * 3.5; // 44-54 %

    out.push({
      bx: 50 + Math.cos(a) * ringX,
      by: 50 + Math.sin(a) * ringY,
      rx: 1.2 + Math.random() * 2.8,
      ry: 0.8 + Math.random() * 2.2,
      spd: 0.04 + Math.random() * 0.07, // very slow: full orbit = 60-150 s
      ph:  Math.random() * Math.PI * 2,
      r:   1.2 + Math.random() * 2,
      c:   PALETTE[i % 3],
      ps:  0.25 + Math.random() * 0.35,
      pp:  Math.random() * Math.PI * 2,
    });
  }
  return out;
}

/* ── Component ─────────────────────────────────────────────────────────────── */
function NetworkConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<N[]>(seedNodes());
  const rafRef    = useRef(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d', { alpha: true });
    if (!ctx) return;

    const nodes = nodesRef.current;
    const t0 = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ── Resize handler ── */
    const resize = () => {
      const parent = cvs.parentElement;
      if (!parent) return;
      const { width: w, height: h } = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width  = w * dpr;
      cvs.height = h * dpr;
      cvs.style.width  = w + 'px';
      cvs.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs.parentElement!);

    /* ── Render loop ── */
    const draw = (now: number) => {
      const t = reducedMotion.matches ? 0 : (now - t0) / 1000;
      const w = cvs.clientWidth;
      const h = cvs.clientHeight;

      ctx.clearRect(0, 0, w, h);

      /* Compute current positions */
      const pos: { x: number; y: number; n: N }[] = [];
      for (const n of nodes) {
        const x = (n.bx + Math.sin(t * n.spd + n.ph) * n.rx) * w / 100;
        const y = (n.by + Math.cos(t * n.spd * 0.7 + n.ph + 0.5) * n.ry) * h / 100;
        pos.push({ x, y, n });
      }

      /* ── Connections ── */
      const maxDist = Math.min(w, h) * 0.22;

      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d > maxDist) continue;

          const fade = 1 - d / maxDist;
          /* Breathing: connection opacity pulses slowly */
          const breath = 0.7 + 0.3 * Math.sin(t * 0.15 + i + j);
          const alpha = 0.09 * fade * fade * breath; // quadratic falloff = soft edges

          const [r, g, b] = pos[i].n.c;
          ctx.beginPath();
          ctx.moveTo(pos[i].x, pos[i].y);
          ctx.lineTo(pos[j].x, pos[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.6 + fade * 0.4;
          ctx.stroke();
        }
      }

      /* ── Nodes ── */
      for (const { x, y, n } of pos) {
        const pulse = 0.55 + 0.45 * Math.sin(t * n.ps + n.pp);
        const [r, g, b] = n.c;
        const a = 0.22 * pulse;

        /* Soft glow halo */
        const gR = n.r * 4;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, gR);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a * 0.45})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.12})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(x, y, gR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        /* Core dot */
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

export default memo(NetworkConstellation);
