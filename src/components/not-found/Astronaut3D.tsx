"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Renders a self-hosted glTF astronaut with three.js (already a project dep).
// The camera fits the model's bounding sphere with a margin, so the whole
// figure stays framed while it slowly roams the viewport and leans toward the
// cursor. Orbit + cursor offsets share a budget kept inside the frame so it
// never clips, on any aspect ratio.
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

    let model: THREE.Object3D | null = null;
    let radius = 1;
    let slackX = 0; // how far the figure can move on X and stay framed
    let slackY = 0;
    const base = new THREE.Vector3();

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

      const halfH = dist * Math.tan(vFov / 2);
      const halfW = halfH * camera.aspect;
      slackX = Math.max(0, halfW - radius);
      slackY = Math.max(0, halfH - radius);
    };

    const loader = new GLTFLoader();
    loader.load("/models/astronaut.glb", (gltf) => {
      model = gltf.scene;
      // Add first, then flush world matrices so the bounding box covers every
      // node (legs included) before we measure and center it.
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

    // Smoothed cursor position, normalized to -1..1 across the window.
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!start) start = now;
      const t = (now - start) / 1000;
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;

      if (model) {
        if (reduce) {
          model.position.copy(base);
          model.rotation.set(0, -0.5, 0);
        } else {
          // Orbit (auto-roam) + cursor parallax share the frame budget.
          const orbX = Math.cos(t * 0.18) * slackX * 0.55;
          const orbY = Math.sin(t * 0.34) * Math.min(slackY * 0.55, radius * 0.8);
          model.position.x = base.x + orbX + curX * slackX * 0.3;
          model.position.y = base.y + orbY - curY * Math.min(slackY * 0.3, radius * 0.6);
          model.rotation.y = t * 0.28 + curX * 0.4;
          model.rotation.x = curY * 0.22;
          model.rotation.z = Math.sin(t * 0.5) * 0.05 - curX * 0.12;
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
