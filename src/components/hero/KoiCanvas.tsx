"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Pointer = { x: number; y: number };

const ASPECT = 980 / 1749; // hero-koi.webp

const KOI_VERT = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  float t = uTime;
  // suyun içinde yavaş, yumuşak dalgalanma (şeritler daha çok savrulur)
  p.x += sin(uv.y * 6.0 + t * 0.8 + uv.x * 3.0) * 0.009
       + sin(uv.y * 2.4 - t * 0.5) * 0.014 * uv.y;
  p.y += sin(uv.x * 5.0 + t * 0.9) * 0.006;
  p.z += sin(uv.x * 5.0 + uv.y * 4.0 - t) * 0.06;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const KOI_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(uMap, vUv);
  gl_FragColor = vec4(c.rgb * 1.04, c.a * uOpacity);
  #include <colorspace_fragment>
}
`;

function Koi({ pointer, reduced }: { pointer: React.RefObject<Pointer>; reduced: boolean }) {
  const map = useTexture("/photos/hero-koi.webp", (t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const cur = useRef({ x: 0, y: 0 });
  const uniforms = useMemo(
    () => ({ uMap: { value: map }, uTime: { value: 0 }, uOpacity: { value: 1 } }),
    [map],
  );
  const { viewport } = useThree();

  useFrame((state) => {
    const m = mesh.current;
    const u = mat.current?.uniforms;
    if (!m || !u) return;
    const t = state.clock.elapsedTime * (reduced ? 0.3 : 1);
    u.uTime.value = t;
    // Opaklık: ilk saniyelerde yumuşak giriş
    u.uOpacity.value = Math.min(1, state.clock.elapsedTime / 1.4);

    const p = pointer.current ?? { x: 0, y: 0 };
    const c = cur.current;
    c.x += (p.x - c.x) * 0.04;
    c.y += (p.y - c.y) * 0.04;

    const vw = viewport.width;
    const vh = viewport.height;
    const mobile = vw < 4;
    let h = vh * (mobile ? 0.62 : 1.02);
    let w = h * ASPECT;
    if (w > vw * 1.02) {
      w = vw * 1.02;
      h = w / ASPECT;
    }
    m.scale.set(w, h, 1);
    m.position.set(c.x * 0.12 + Math.sin(t * 0.3) * 0.04, (mobile ? 1.0 : 0) + Math.sin(t * 0.55) * 0.07, 0);
    m.rotation.set(-c.y * 0.12, c.x * 0.22, Math.sin(t * 0.35) * 0.02);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1, 44, 78]} />
      <shaderMaterial
        ref={mat}
        vertexShader={KOI_VERT}
        fragmentShader={KOI_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const BUBBLE_VERT = /* glsl */ `
uniform float uTime;
uniform float uW;
uniform float uH;
uniform float uPx;
attribute float aSpeed;
attribute float aSize;
attribute float aPhase;
void main() {
  vec3 p = position;
  float y = fract(p.y * 0.5 + 0.5 + uTime * aSpeed);
  p.y = (y - 0.5) * uH * 1.15;
  p.x = p.x * uW * 0.52 + sin(uTime * 0.7 + aPhase) * 0.14;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * uPx * (260.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const BUBBLE_FRAG = /* glsl */ `
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float ring = smoothstep(0.5, 0.42, d) * (0.1 + 0.9 * smoothstep(0.26, 0.47, d));
  float hl = smoothstep(0.12, 0.0, length(c - vec2(-0.16, -0.16))) * 0.9;
  float a = clamp(ring * 0.5 + hl, 0.0, 1.0);
  gl_FragColor = vec4(vec3(0.75, 0.9, 1.0), a);
}
`;

function Bubbles({ count, reduced }: { count: number; reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, gl } = useThree();

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    // Seed'li üreteç: render sırasında saf kalır, her yüklemede aynı düzen.
    let s = 1337;
    const rand = () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rand() * 2 - 1;
      pos[i * 3 + 1] = rand() * 2 - 1;
      pos[i * 3 + 2] = -1.5 + rand() * 3.5;
      speed[i] = 0.018 + rand() * 0.035;
      size[i] = 0.1 + Math.pow(rand(), 2.5) * 0.45;
      phase[i] = rand() * 10;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uW: { value: 6 }, uH: { value: 4 }, uPx: { value: 1 } }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime * (reduced ? 0.3 : 1);
    u.uW.value = viewport.width;
    u.uH.value = viewport.height;
    u.uPx.value = gl.getPixelRatio();
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={BUBBLE_VERT}
        fragmentShader={BUBBLE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function KoiCanvas({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  // Bileşen yalnızca istemcide yüklenir (ssr: false), bu yüzden window güvenle okunabilir.
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={className}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7], fov: 32, near: 0.1, far: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <Bubbles count={26} reduced={reduced} />
        <Suspense fallback={null}>
          <Koi pointer={pointer} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
