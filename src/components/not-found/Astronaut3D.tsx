"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Self-hosted glTF astronaut rendered with three.js (already a project dep).
//
// One calm behaviour: it always floats along a slow smooth path. The cursor
// only softly pulls the centre of that path toward itself, so moving the mouse
// gently guides the astronaut without ever changing its orientation or making it
// dart. When the cursor is idle the centre eases back to the middle. Its gentle
// tumble is constant and independent of the cursor.
//
// The camera fits the model's bounding sphere with a margin, and the path stays
// inside that margin so the figure never clips on any aspect ratio.
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
    const WX = 0.1; // slow drift frequencies (different so the path loops)
    const WY = 0.07;
    const CENTER_EASE = 0.018; // how gently the float follows the cursor
    const POS_EASE = 0.06; // smoothing of the figure onto its path

    let model: THREE.Object3D | null = null;
    let radius = 1;
    let halfW = 1;
    let halfH = 1;
    let slackX = 0;
    let slackY = 0;
    const base = new THREE.Vector3();

    const ampX = () => Math.min(slackX * 0.5, radius * 2.2);
    const ampY = () => Math.min(slackY * 0.45, radius * 1.1);

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

    let centerX = 0;
    let centerY = 0;
    let centerReady = false;

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
      centerX = base.x;
      centerY = base.y;
      centerReady = true;
      frame();
    });

    // Cursor in normalized device coords (-1..1) + time of last move.
    let ndcX = 0;
    let ndcY = 0;
    let lastMove = -1e9;
    const onPointer = (e: PointerEvent) => {
      ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      ndcY = (e.clientY / window.innerHeight) * 2 - 1;
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", onPointer);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = THREE.MathUtils.clamp;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!start) start = now;
      const t = (now - start) / 1000;

      if (model && centerReady) {
        if (reduce) {
          model.position.copy(base);
          model.rotation.set(0, -0.5, 0);
        } else {
          const ax = ampX();
          const ay = ampY();

          // The resting point is wherever the cursor last was (it never snaps
          // back to the middle), plus a very slow meander so that, given enough
          // idle time, it gradually wanders to nearby spots instead of orbiting
          // one point forever. Clamped so the path stays framed.
          const restX = base.x + ndcX * halfW;
          const restY = base.y - ndcY * halfH;
          const meanderX = Math.sin(t * 0.06) * radius * 1.5;
          const meanderY = Math.cos(t * 0.045) * radius * 1;
          const targetCX = clamp(restX + meanderX, base.x - (slackX - ax), base.x + (slackX - ax));
          const targetCY = clamp(restY + meanderY, base.y - (slackY - ay), base.y + (slackY - ay));
          centerX += (targetCX - centerX) * CENTER_EASE;
          centerY += (targetCY - centerY) * CENTER_EASE;

          // Gentle local float around that resting point.
          const desX = centerX + Math.cos(t * WX) * ax;
          const desY = centerY + Math.sin(t * WY) * ay;
          model.position.x += (desX - model.position.x) * POS_EASE;
          model.position.y += (desY - model.position.y) * POS_EASE;

          // Constant, gentle tumble. Never aimed at the cursor.
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
