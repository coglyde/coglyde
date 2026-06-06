"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Self-hosted glTF astronaut rendered with three.js (already a project dep).
//
// Motion: it always slowly eases toward the cursor, with a small constant hover
// added on top. No modes and no snapping, so when the cursor stops it just keeps
// gliding the rest of the way and gently bobs in place where you are. Orientation
// is a slow, constant tumble, never aimed at the cursor.
//
// The camera fits the model's bounding sphere with a margin and every target is
// clamped inside it, so the figure never clips on any aspect ratio.
export function Astronaut3D({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8b9cff, 1.4);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const MARGIN = 2.5; // smaller = bigger astronaut
    const FOLLOW_EASE = 0.02; // slow, gentle catch-up toward the cursor
    const WX = 0.45; // subtle hover frequencies
    const WY = 0.33;

    const clamp = THREE.MathUtils.clamp;

    let model: THREE.Object3D | null = null;
    let radius = 1;
    let halfW = 1;
    let halfH = 1;
    let slackX = 0;
    let slackY = 0;
    const base = new THREE.Vector3();

    const ampX = () => Math.min(slackX, radius * 0.35); // subtle hover only
    const ampY = () => Math.min(slackY, radius * 0.25);

    const frame = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      const vFov = (camera.fov * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const fov = Math.min(vFov, hFov);
      const dist = (radius / Math.sin(fov / 2)) * MARGIN;
      camera.position.set(0, 0, dist);
      camera.near = Math.max(0.1, dist - radius * 4);
      camera.far = dist + radius * 4;
      camera.updateProjectionMatrix();

      halfH = dist * Math.tan(vFov / 2);
      halfW = halfH * camera.aspect;
      slackX = Math.max(0, halfW - radius);
      slackY = Math.max(0, halfH - radius);
    };

    const loader = new GLTFLoader();
    loader.load("/models/astronaut.glb", (gltf) => {
      model = gltf.scene;
      scene.add(model);
      model.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(model, true);
      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);
      model.position.sub(sphere.center);
      base.copy(model.position);
      radius = sphere.radius || 1;
      frame();
    });

    // Cursor in normalized device coords (-1..1). Moving re-engages pursuit.
    let ndcX = 0;
    let ndcY = 0;
    const onPointer = (e: PointerEvent) => {
      ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      ndcY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!start) start = now;
      const t = (now - start) / 1000;

      if (model) {
        if (reduce) {
          model.position.copy(base);
          model.rotation.set(0, -0.5, 0);
        } else {
          const cursorX = clamp(base.x + ndcX * halfW, base.x - slackX, base.x + slackX);
          const cursorY = clamp(base.y - ndcY * halfH, base.y - slackY, base.y + slackY);

          // Target = cursor + a small constant hover. Easing slowly toward it
          // means it lags and catches up after you stop, then just bobs in place.
          const desX = clamp(cursorX + Math.sin(t * WX) * ampX(), base.x - slackX, base.x + slackX);
          const desY = clamp(cursorY + Math.sin(t * WY) * ampY(), base.y - slackY, base.y + slackY);
          model.position.x += (desX - model.position.x) * FOLLOW_EASE;
          model.position.y += (desY - model.position.y) * FOLLOW_EASE;

          // Constant gentle tumble. Never aimed at the cursor.
          model.rotation.y = t * 0.2;
          model.rotation.z = Math.sin(t * 0.5) * 0.05;
          model.rotation.x = Math.sin(t * 0.35) * 0.04;
        }
      }
      renderer.render(scene, camera);
    };

    frame();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", frame);
      window.removeEventListener("pointermove", onPointer);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
