'use client';

import { MobileTechItem, mobileTechList } from '@/lib';
import {
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Pre-computed 3D Orbital Constellation positions
interface SphereNode {
  item: MobileTechItem;
  // Base 3D coordinates on unit orbit
  x0: number;
  y0: number;
  z0: number;
  // Dynamic projected coordinates
  x: number;
  y: number;
  z: number;
  screenX: number;
  screenY: number;
  scale: number;
  alpha: number;
}

interface HistoryPoint {
  x: number;
  y: number;
  time: number;
}

// 3x3 matrix multiplication helper
function multiply3x3(A: number[][], B: number[][]): number[][] {
  const R = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      R[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
    }
  }
  return R;
}

// Orthonormalize matrix to eliminate accumulated floating-point inaccuracies
function orthonormalize(M: number[][]) {
  let l0 = Math.hypot(M[0][0], M[0][1], M[0][2]);
  if (l0 > 1e-6) {
    M[0][0] /= l0;
    M[0][1] /= l0;
    M[0][2] /= l0;
  }
  const dot01 = M[1][0] * M[0][0] + M[1][1] * M[0][1] + M[1][2] * M[0][2];
  M[1][0] -= dot01 * M[0][0];
  M[1][1] -= dot01 * M[0][1];
  M[1][2] -= dot01 * M[0][2];
  let l1 = Math.hypot(M[1][0], M[1][1], M[1][2]);
  if (l1 > 1e-6) {
    M[1][0] /= l1;
    M[1][1] /= l1;
    M[1][2] /= l1;
  }
  M[2][0] = M[0][1] * M[1][2] - M[0][2] * M[1][1];
  M[2][1] = M[0][2] * M[1][0] - M[0][0] * M[1][2];
  M[2][2] = M[0][0] * M[1][1] - M[0][1] * M[1][0];
}

// Camera-relative delta rotation (Euler-free, infinite 3D spin in every direction)
function getDeltaRotation(ax: number, ay: number): number[][] {
  const cosX = Math.cos(ax);
  const sinX = Math.sin(ax);
  const cosY = Math.cos(ay);
  const sinY = Math.sin(ay);

  return [
    [cosY, 0, sinY],
    [sinX * sinY, cosX, -sinX * cosY],
    [-cosX * sinY, sinX, cosX * cosY],
  ];
}

// Arbitrary axis-angle rotation (Rodrigues formula) for great-circle flight navigation
function getAxisAngleRotation(ax: number, ay: number, az: number, angle: number): number[][] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  return [
    [t * ax * ax + c, t * ax * ay - s * az, t * ax * az + s * ay],
    [t * ax * ay + s * az, t * ay * ay + c, t * ay * az - s * ax],
    [t * ax * az - s * ay, t * ay * az + s * ax, t * az * az + c],
  ];
}

export default function MobileSphereTechStack() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedTech, setSelectedTech] = useState<MobileTechItem>(mobileTechList[1]); // Default to React
  const [isInteracting, setIsInteracting] = useState(false);

  // 3x3 Orthonormal Rotation Matrix representing the orientation of the 3D globe (Google Earth trackball)
  const matrixRef = useRef<number[][]>([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);

  // Angular velocities around screen X (pitch) and screen Y (yaw)
  const velRef = useRef({
    velX: 0,
    velY: 0.0020, // gentle ambient spin
  });

  // Programmatic rotation target (for smooth shortest-arc great circle transitions)
  const targetNodeIndexRef = useRef<number | null>(null);

  // Selected & Centered tracking refs for fast 60/120fps synchronization without render thrashing
  const selectedTechIdRef = useRef<string>(mobileTechList[1].id);
  const centeredNodeIdRef = useRef<string>(mobileTechList[1].id);
  const lastStateUpdateTimeRef = useRef<number>(0);

  // Drag tracking & Velocity history buffer
  const touchStateRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startTime: 0,
    hasMoved: false,
  });
  const historyRef = useRef<HistoryPoint[]>([]);

  // Generate 3D spherical positions for all tech nodes using Fibonacci golden spiral
  const nodesRef = useRef<SphereNode[]>([]);

  useEffect(() => {
    const N = mobileTechList.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const phi = 2 * Math.PI * (1 - 1 / goldenRatio); // golden angle ~2.39996 rad

    nodesRef.current = mobileTechList.map((item, i) => {
      // Fibonacci sphere distribution for uniform spherical 3D coverage
      const y0 = 1 - (i / (N - 1)) * 2; // from 1 (north pole) to -1 (south pole)
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y0 * y0));
      const theta = phi * i;

      const x0 = Math.cos(theta) * radiusAtY;
      const z0 = Math.sin(theta) * radiusAtY;

      return {
        item,
        x0,
        y0,
        z0,
        x: x0,
        y: y0,
        z: z0,
        screenX: 0,
        screenY: 0,
        scale: 1,
        alpha: 1,
      };
    });

    // Initialize rotation matrix so React (item index 1) is front and center [0, 0, 1]
    const reactNode = nodesRef.current[1];
    if (reactNode) {
      const uZ = [reactNode.x0, reactNode.y0, reactNode.z0];
      const lenZ = Math.hypot(uZ[0], uZ[1], uZ[2]) || 1;
      uZ[0] /= lenZ;
      uZ[1] /= lenZ;
      uZ[2] /= lenZ;

      let uX = [uZ[2], 0, -uZ[0]];
      let lenX = Math.hypot(uX[0], uX[1], uX[2]);
      if (lenX < 1e-4) {
        uX = [1, 0, 0];
      } else {
        uX[0] /= lenX;
        uX[1] /= lenX;
        uX[2] /= lenX;
      }
      const uY = [
        uZ[1] * uX[2] - uZ[2] * uX[1],
        uZ[2] * uX[0] - uZ[0] * uX[2],
        uZ[0] * uX[1] - uZ[1] * uX[0],
      ];

      matrixRef.current = [
        [uX[0], uX[1], uX[2]],
        [uY[0], uY[1], uY[2]],
        [uZ[0], uZ[1], uZ[2]],
      ];
    }
  }, []);

  // Pre-generate background satellite signal points for rich celestial depth
  const satellitesRef = useRef<Array<{ x0: number; y0: number; z0: number }>>([]);
  useEffect(() => {
    const count = 30;
    const sats = [];
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.80 + Math.random() * 0.25;
      const sinPhi = Math.sin(phi);
      sats.push({
        x0: r * sinPhi * Math.cos(theta),
        y0: r * Math.cos(phi),
        z0: r * sinPhi * Math.sin(theta),
      });
    }
    satellitesRef.current = sats;
  }, []);

  // Smooth programmatic animation to a specific technology index
  const animateToIndex = (index: number) => {
    const node = nodesRef.current[index];
    if (!node) return;

    targetNodeIndexRef.current = index;
    velRef.current.velX = 0;
    velRef.current.velY = 0;

    const item = mobileTechList[index];
    selectedTechIdRef.current = item.id;
    centeredNodeIdRef.current = item.id;
    setSelectedTech(item);
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameCount = 0;

    const updateDimensions = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width || 340;
      height = Math.min(440, Math.max(320, width * 0.95));

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });

    // Render loop
    const render = () => {
      frameCount++;
      const touch = touchStateRef.current;
      const vel = velRef.current;

      // 1. Inertia & Ambient rotation physics (infinite in all axes, Google Earth style)
      if (!touch.isDown) {
        if (targetNodeIndexRef.current !== null) {
          const targetNode = nodesRef.current[targetNodeIndexRef.current];
          if (targetNode) {
            const M = matrixRef.current;
            // Target node's current projected vector in screen space
            const px = M[0][0] * targetNode.x0 + M[0][1] * targetNode.y0 + M[0][2] * targetNode.z0;
            const py = M[1][0] * targetNode.x0 + M[1][1] * targetNode.y0 + M[1][2] * targetNode.z0;
            const pz = M[2][0] * targetNode.x0 + M[2][1] * targetNode.y0 + M[2][2] * targetNode.z0;

            // We want (px, py, pz) to rotate towards (0, 0, 1)
            // Screen-space rotation axis: P x (0, 0, 1) = (py, -px, 0)
            const axisX = py;
            const axisY = -px;
            const axisLen = Math.hypot(axisX, axisY);

            if (axisLen > 0.002) {
              const angle = Math.atan2(axisLen, pz);
              const stepAngle = Math.min(angle, Math.max(0.002, angle * 0.14));
              const stepRot = getAxisAngleRotation(axisX / axisLen, axisY / axisLen, 0, stepAngle);
              matrixRef.current = multiply3x3(stepRot, matrixRef.current);
            } else {
              targetNodeIndexRef.current = null;
            }
          } else {
            targetNodeIndexRef.current = null;
          }
        } else {
          // Continuous infinite inertia physics
          const stepRot = getDeltaRotation(vel.velX, vel.velY);
          matrixRef.current = multiply3x3(stepRot, matrixRef.current);

          // Fluid deceleration decay
          const friction = 0.958;
          vel.velX *= friction;
          vel.velY *= friction;

          // Seamless transition into ambient slow cruise when momentum settles
          if (Math.hypot(vel.velX, vel.velY) < 0.0014) {
            const ambient = 0.0018;
            vel.velY = vel.velY * 0.94 + ambient * 0.06;
            vel.velX *= 0.94;
          }
        }
      }

      // Periodically orthonormalize matrix to preserve exact geometry indefinitely
      if (frameCount % 15 === 0) {
        orthonormalize(matrixRef.current);
      }

      const M = matrixRef.current;
      const centerX = width / 2;
      const centerY = height / 2;
      const sphereRadius = Math.min(width, height) * 0.41;
      const fov = 380;

      ctx.clearRect(0, 0, width, height);

      // 1. Atmospheric globe backdrop
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.12,
        centerX,
        centerY,
        sphereRadius * 1.15
      );
      bgGrad.addColorStop(0, 'rgba(78, 133, 191, 0.09)');
      bgGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
      bgGrad.addColorStop(0.85, 'rgba(10, 15, 25, 0.4)');
      bgGrad.addColorStop(1, 'rgba(9, 9, 9, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.08, 0, Math.PI * 2);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Subtle outer globe boundary ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Rotate and project background satellite signals
      satellitesRef.current.forEach((sat) => {
        const x1 = M[0][0] * sat.x0 + M[0][1] * sat.y0 + M[0][2] * sat.z0;
        const y1 = M[1][0] * sat.x0 + M[1][1] * sat.y0 + M[1][2] * sat.z0;
        const z2 = M[2][0] * sat.x0 + M[2][1] * sat.y0 + M[2][2] * sat.z0;

        const scale = fov / (fov + z2 * sphereRadius);
        const sx = centerX + x1 * sphereRadius * scale;
        const sy = centerY + y1 * sphereRadius * scale;
        const alpha = Math.max(0.08, (z2 + 1) / 2) * 0.35;

        ctx.beginPath();
        ctx.arc(sx, sy, 1.2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(137, 170, 204, ${alpha})`;
        ctx.fill();
      });

      // 3. Rotate and project primary Technology Nodes
      const projectedNodes = nodesRef.current.map((node) => {
        const x1 = M[0][0] * node.x0 + M[0][1] * node.y0 + M[0][2] * node.z0;
        const y1 = M[1][0] * node.x0 + M[1][1] * node.y0 + M[1][2] * node.z0;
        const z2 = M[2][0] * node.x0 + M[2][1] * node.y0 + M[2][2] * node.z0;

        node.x = x1;
        node.y = y1;
        node.z = z2;

        const scale = fov / (fov + z2 * sphereRadius);
        node.scale = scale;
        node.screenX = centerX + x1 * sphereRadius * scale;
        node.screenY = centerY + y1 * sphereRadius * scale;

        const normalizedZ = (z2 + 1) / 2; // 0 (back) to 1 (front)
        node.alpha = Math.max(0.20, Math.pow(normalizedZ, 1.2));

        return node;
      });

      // 4. Automatic Center Node Detection & Highlighting
      // Find the node currently closest to the front-facing screen center
      let frontCenterNode: SphereNode | null = null;
      let minCenterScore = Infinity;

      for (let i = 0; i < projectedNodes.length; i++) {
        const node = projectedNodes[i];
        if (node.z > -0.05) { // foreground / front-facing hemisphere
          const dx = node.screenX - centerX;
          const dy = node.screenY - centerY;
          // Weighted distance: horizontal centering is primary, depth (z) adds priority
          const dist = Math.hypot(dx, dy * 1.5);
          const score = dist - node.z * 35;
          if (score < minCenterScore) {
            minCenterScore = score;
            frontCenterNode = node;
          }
        }
      }

      if (frontCenterNode) {
        centeredNodeIdRef.current = frontCenterNode.item.id;

        // Automatically update the selected tech in React state
        if (frontCenterNode.item.id !== selectedTechIdRef.current) {
          const now = Date.now();
          // Real-time update throttled so high-speed flicks don't stutter
          if (now - lastStateUpdateTimeRef.current > 55 || Math.abs(vel.velY) < 0.015) {
            lastStateUpdateTimeRef.current = now;
            selectedTechIdRef.current = frontCenterNode.item.id;
            setSelectedTech(frontCenterNode.item);
          }
        }
      }

      // 5. Draw Central HUD Target Reticle (Tactical Observatory Crosshair + Corner Brackets)
      ctx.save();
      const activeHex = frontCenterNode ? frontCenterNode.item.accentHex : '#4E85BF';
      const reticlePulse = (Math.sin(Date.now() * 0.004) + 1) / 2; // 0 to 1

      // Subtle 3D astrolabe latitude guide ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, sphereRadius * 0.94, Math.max(4, Math.abs(sphereRadius * 0.94 * sinX)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Observatory Crosshair Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 18, centerY);
      ctx.lineTo(centerX - 7, centerY);
      ctx.moveTo(centerX + 7, centerY);
      ctx.lineTo(centerX + 18, centerY);
      ctx.moveTo(centerX, centerY - 18);
      ctx.lineTo(centerX, centerY - 7);
      ctx.moveTo(centerX, centerY + 7);
      ctx.lineTo(centerX, centerY + 18);
      ctx.stroke();

      // Tactical Corner Brackets around center target [ + ]
      const bDist = 20;
      const bLen = 6;
      ctx.strokeStyle = `${activeHex}${Math.round((0.35 + reticlePulse * 0.45) * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      // Top-Left
      ctx.moveTo(centerX - bDist, centerY - bDist + bLen);
      ctx.lineTo(centerX - bDist, centerY - bDist);
      ctx.lineTo(centerX - bDist + bLen, centerY - bDist);
      // Top-Right
      ctx.moveTo(centerX + bDist - bLen, centerY - bDist);
      ctx.lineTo(centerX + bDist, centerY - bDist);
      ctx.lineTo(centerX + bDist, centerY - bDist + bLen);
      // Bottom-Left
      ctx.moveTo(centerX - bDist, centerY + bDist - bLen);
      ctx.lineTo(centerX - bDist, centerY + bDist);
      ctx.lineTo(centerX - bDist + bLen, centerY + bDist);
      // Bottom-Right
      ctx.moveTo(centerX + bDist - bLen, centerY + bDist);
      ctx.lineTo(centerX + bDist, centerY + bDist);
      ctx.lineTo(centerX + bDist, centerY + bDist - bLen);
      ctx.stroke();

      // Central reticle guide circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.strokeStyle = `${activeHex}33`;
      ctx.stroke();
      ctx.restore();

      // 6. Draw constellation connection mesh between nearby nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        const n1 = projectedNodes[i];
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n2 = projectedNodes[j];

          // 3D Euclidean distance on unit sphere
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dz = n1.z - n2.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Connect neighboring nodes across the 3D Fibonacci constellation
          const shouldConnect = dist3D < 0.88;

          if (shouldConnect) {
            const avgZ = (n1.z + n2.z) / 2;
            const lineAlpha = Math.max(0.04, ((avgZ + 1) / 2) * 0.26);

            const isConnectedToActive =
              n1.item.id === centeredNodeIdRef.current || n2.item.id === centeredNodeIdRef.current;

            ctx.beginPath();
            ctx.moveTo(n1.screenX, n1.screenY);
            ctx.lineTo(n2.screenX, n2.screenY);

            if (isConnectedToActive && avgZ > -0.2) {
              ctx.strokeStyle = activeHex;
              ctx.globalAlpha = Math.min(0.85, lineAlpha * 3.4);
              ctx.lineWidth = 1.3;
            } else {
              ctx.strokeStyle = '#FFFFFF';
              ctx.globalAlpha = lineAlpha;
              ctx.lineWidth = 0.7;
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // 7. Sort nodes by Z (back to front painter's algorithm)
      const sortedNodes = [...projectedNodes].sort((a, b) => a.z - b.z);

      // 8. Draw nodes and badges (All 16 nodes permanently active)
      sortedNodes.forEach((node) => {
        const isCentered = node.item.id === centeredNodeIdRef.current;
        const isFront = node.z > 0;
        const baseRadius = (isCentered ? 5.8 : 3.8) * node.scale;
        const nodeAlpha = node.alpha;

        // Outer glow halo for front nodes or centered node
        if (isCentered || isFront) {
          const haloGrad = ctx.createRadialGradient(
            node.screenX,
            node.screenY,
            0,
            node.screenX,
            node.screenY,
            baseRadius * (isCentered ? 4.0 : 2.4)
          );

          if (isCentered) {
            haloGrad.addColorStop(0, `${node.item.accentHex}aa`);
            haloGrad.addColorStop(1, `${node.item.accentHex}00`);
          } else if (node.item.type === 'data') {
            haloGrad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
            haloGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          } else if (node.item.type === 'learning') {
            haloGrad.addColorStop(0, 'rgba(234, 179, 8, 0.4)');
            haloGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
          } else {
            haloGrad.addColorStop(0, 'rgba(78, 196, 191, 0.4)');
            haloGrad.addColorStop(1, 'rgba(78, 196, 191, 0)');
          }

          ctx.beginPath();
          ctx.arc(
            node.screenX,
            node.screenY,
            baseRadius * (isCentered ? 4.0 : 2.4),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = haloGrad;
          ctx.fill();
        }

        // Inner solid node circle
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, baseRadius, 0, Math.PI * 2);
        if (isCentered) {
          ctx.fillStyle = '#FFFFFF';
        } else if (node.item.type === 'data') {
          ctx.fillStyle = `rgba(16, 185, 129, ${nodeAlpha})`;
        } else if (node.item.type === 'learning') {
          ctx.fillStyle = `rgba(234, 179, 8, ${nodeAlpha})`;
        } else {
          ctx.fillStyle = `rgba(78, 133, 191, ${nodeAlpha})`;
        }
        ctx.fill();

        // Node outline border
        ctx.strokeStyle = '#090909';
        ctx.lineWidth = 1.2 * node.scale;
        ctx.stroke();

        // Target reticle radar ring for CENTERED node
        if (isCentered) {
          const pulse = (Math.sin(Date.now() * 0.005) + 1) / 2; // 0 to 1
          const ringRadius = baseRadius * (2.4 + pulse * 0.8);

          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `${node.item.accentHex}${Math.round((0.45 + pulse * 0.45) * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Subtle dashed outer target ring
          ctx.save();
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, ringRadius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }

        // 9. Typography labels
        const shouldShowLabel = isCentered || node.z > -0.25;

        if (shouldShowLabel) {
          const fontSize = Math.max(9, Math.min(12, Math.round(10.5 * node.scale)));
          ctx.font = isCentered
            ? `bold ${fontSize + 1}px monospace`
            : `600 ${fontSize}px sans-serif`;

          const text = node.item.name;
          const textY = node.screenY + (isCentered ? 16 : 14) * node.scale;

          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          ctx.strokeStyle = 'rgba(9, 9, 9, 0.9)';
          ctx.lineWidth = 3.2;
          ctx.strokeText(text, node.screenX, textY);

          if (isCentered) {
            ctx.fillStyle = '#FFFFFF';
          } else if (isFront) {
            ctx.fillStyle = `rgba(245, 245, 245, ${Math.max(0.5, nodeAlpha)})`;
          } else {
            ctx.fillStyle = `rgba(141, 141, 141, ${nodeAlpha * 0.75})`;
          }
          ctx.fillText(text, node.screenX, textY);
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const container = containerRef.current;
    const preventSelect = (e: Event) => e.preventDefault();
    if (container) {
      container.addEventListener('selectstart', preventSelect);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animId);
      if (container) {
        container.removeEventListener('selectstart', preventSelect);
      }
    };
  }, []);

  // Touch & Pointer gesture listeners with velocity-based inertia tracking
  const handleStart = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    touchStateRef.current = {
      isDown: true,
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastY: clientY,
      startTime: Date.now(),
      hasMoved: false,
    };
    historyRef.current = [{ x: clientX, y: clientY, time: Date.now() }];
    targetNodeIndexRef.current = null; // User takes immediate manual control

    velRef.current.velX = 0;
    velRef.current.velY = 0;
    setIsInteracting(true);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!touchStateRef.current.isDown) return;
    const state = touchStateRef.current;
    const now = Date.now();

    const deltaX = clientX - state.lastX;
    const deltaY = clientY - state.lastY;

    const totalDist = Math.hypot(clientX - state.startX, clientY - state.startY);
    if (totalDist > 3) {
      state.hasMoved = true;
    }

    // Record pointer history for velocity calculation
    historyRef.current.push({ x: clientX, y: clientY, time: now });
    const cutoff = now - 100;
    while (historyRef.current.length > 2 && historyRef.current[0].time < cutoff) {
      historyRef.current.shift();
    }

    // Infinite Google Earth 3D trackball rotation:
    // Dragging right spins around screen Y; dragging down rolls top toward camera around screen X
    const sensitivity = 0.0065;
    const ax = -deltaY * sensitivity; // Pitch
    const ay = deltaX * sensitivity;  // Yaw

    const deltaRot = getDeltaRotation(ax, ay);
    matrixRef.current = multiply3x3(deltaRot, matrixRef.current);

    state.lastX = clientX;
    state.lastY = clientY;
  }, []);

  const handleEnd = useCallback(() => {
    const state = touchStateRef.current;
    if (!state.isDown) return;
    state.isDown = false;
    setIsInteracting(false);

    const now = Date.now();
    const touchDuration = now - state.startTime;

    const history = historyRef.current;
    let releaseVx = 0;
    let releaseVy = 0;

    if (history.length >= 2) {
      const newest = history[history.length - 1];
      let sample = history[0];
      for (let i = history.length - 2; i >= 0; i--) {
        if (newest.time - history[i].time <= 75) {
          sample = history[i];
        } else {
          break;
        }
      }
      const dt = newest.time - sample.time;
      if (dt > 6) {
        releaseVx = (newest.x - sample.x) / dt; // px per millisecond
        releaseVy = (newest.y - sample.y) / dt;
      }
    }

    if (state.hasMoved) {
      // Transfer drag velocity to rotational inertia
      const flickFactor = 0.007;
      const computedVelY = releaseVx * flickFactor;
      const computedVelX = -releaseVy * flickFactor;

      // Clamp velocity to a comfortable premium range
      velRef.current.velY = Math.max(-0.06, Math.min(0.06, computedVelY));
      velRef.current.velX = Math.max(-0.06, Math.min(0.06, computedVelX));
    } else {
      // Tap detection to select / center node
      if (touchDuration < 350 && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const tapX = state.startX - rect.left;
        const tapY = state.startY - rect.top;

        let closestNode: SphereNode | null = null;
        let minDistance = 40;

        nodesRef.current.forEach((node) => {
          const dist = Math.hypot(node.screenX - tapX, node.screenY - tapY);
          const depthPenalty = node.z < 0 ? 15 : 0;
          if (dist + depthPenalty < minDistance) {
            minDistance = dist + depthPenalty;
            closestNode = node;
          }
        });

        if (closestNode) {
          const tappedItem = (closestNode as SphereNode).item;
          const index = mobileTechList.findIndex((t) => t.id === tappedItem.id);
          if (index !== -1) {
            animateToIndex(index);
          }
        }
      }
    }

    // Ensure currently centered node is immediately synchronized to state on release
    if (centeredNodeIdRef.current !== selectedTechIdRef.current) {
      const currentCentered = mobileTechList.find((t) => t.id === centeredNodeIdRef.current);
      if (currentCentered) {
        selectedTechIdRef.current = currentCentered.id;
        setSelectedTech(currentCentered);
      }
    }
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse handlers for desktop/emulator testing
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (touchStateRef.current.isDown) {
      e.preventDefault();
      if (typeof window !== 'undefined' && window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
    }
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    handleEnd();
  };

  // Reset view to React
  const handleResetView = () => {
    animateToIndex(1);
  };

  // Step next/prev technology
  const handleStepTech = (dir: 1 | -1) => {
    const currentIndex = mobileTechList.findIndex((t) => t.id === selectedTech.id);
    const nextIndex = (currentIndex + dir + mobileTechList.length) % mobileTechList.length;
    animateToIndex(nextIndex);
  };

  return (
    <div
      className="w-full flex flex-col items-center select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* 1. Header Bar: Orbit Status & Quick Controls */}
      <div className="w-full flex flex-col gap-2.5 mb-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#89AACC] font-bold">
              16 technologies mapped
            </span>
          </div>
          <button
            onClick={handleResetView}
            className="flex items-center gap-1.5 px-3 py-1 rounded-[6px_2px_6px_2px] bg-[#141820] border border-white/10 text-muted-text text-[10px] font-mono hover:text-white transition-colors active:scale-95"
            aria-label="Reset 3D constellation orientation"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center justify-between px-2 pt-1 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[2px] bg-[#3E78B2]" />
              <span className="font-mono text-[9px] text-muted-text uppercase">Core</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[2px] bg-[#10B981]" />
              <span className="font-mono text-[9px] text-muted-text uppercase">Data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[2px] bg-amber-500" />
              <span className="font-mono text-[9px] text-muted-text uppercase">Learning</span>
            </div>
          </div>

          <span className="font-mono text-[9px] text-muted-text/80 italic">
            {isInteracting ? 'Orbiting in 3D...' : 'Drag freely in 3D'}
          </span>
        </div>
      </div>

      {/* 2. Interactive 3D Sphere Canvas Viewport */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        className="relative w-full aspect-square max-w-[420px] my-1 flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none"
        />

        {/* Guidance Overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-[6px_2px_6px_2px] bg-[#0E1218]/90 border border-white/10 text-[9px] font-mono text-muted-text/90 whitespace-nowrap select-none">
          Infinite 3D Trackball • Drag in any direction
        </div>
      </div>

      {/* 3. Bottom Attached Detail Card */}
      <div className="w-full mt-2 select-none">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full p-5 rounded-[18px_4px_18px_4px] bg-[#11141B] border border-white/10 shadow-xl text-left relative overflow-hidden transition-[border-color] duration-300 select-none"
          style={{
            borderColor: `${selectedTech.accentHex}40`,
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* Top accent stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300"
            style={{
              backgroundColor: selectedTech.accentHex,
            }}
          />

          {/* Header: Title and Badges */}
          <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-[2px] transition-all duration-300 shrink-0"
                  style={{
                    backgroundColor: selectedTech.accentHex,
                  }}
                />
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-text font-bold">
                  {`${selectedTech.category} • ${selectedTech.type}`}
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-[#F5F5F5] tracking-tight">
                {selectedTech.name}
              </h3>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="px-2.5 py-1 rounded-[6px_2px_6px_2px] bg-[#161B24] border border-white/10 font-mono text-[10px] font-bold text-[#F5F5F5]">
                {selectedTech.experience}
              </span>
              <span
                className="font-mono text-[9px] font-bold transition-colors duration-300"
                style={{ color: selectedTech.accentHex }}
              >
                {selectedTech.level}% PROFICIENCY
              </span>
            </div>
          </div>

          {/* Description Body */}
          <p className="font-sans text-xs text-muted-text leading-relaxed mb-4 relative z-10 min-h-[2.5rem]">
            {selectedTech.description}
          </p>

          {/* Bottom Meta & Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 relative z-10">
            {selectedTech.relatedProject ? (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#89AACC]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[170px]">
                  Shipped in <strong>{selectedTech.relatedProject.name}</strong>
                </span>
              </div>
            ) : (
              <div className="text-[10px] font-mono text-muted-text">
                Production Tested
              </div>
            )}

            {/* Prev / Next Node navigation shortcuts */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleStepTech(-1)}
                aria-label="Previous skill"
                className="px-2.5 py-1 rounded-[6px_2px_6px_2px] bg-[#161B24] border border-white/10 text-muted-text text-[11px] font-mono hover:text-white active:scale-90 transition-transform"
              >
                PREV
              </button>
              <button
                onClick={() => handleStepTech(1)}
                aria-label="Next skill"
                className="px-2.5 py-1 rounded-[6px_2px_6px_2px] border text-[11px] font-mono font-bold hover:text-white active:scale-90 transition-all"
                style={{
                  backgroundColor: `${selectedTech.accentHex}20`,
                  borderColor: `${selectedTech.accentHex}60`,
                  color: selectedTech.accentHex,
                }}
              >
                NEXT
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
