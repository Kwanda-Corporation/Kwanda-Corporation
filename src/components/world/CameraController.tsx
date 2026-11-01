import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp } from '../../lib/noise';
import {
  clampToPlayArea,
  START_FOCUS,
  terrainHeight,
} from '../../lib/terrain';

export type NavigationApi = {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
};

type CameraControllerProps = {
  terrainRef: MutableRefObject<THREE.Mesh | null>;
  apiRef: MutableRefObject<NavigationApi | null>;
  reduced: boolean;
};

const ORANGE = '#e87532';
const DEFAULT_DISTANCE = 104;
const DEFAULT_AZIMUTH = 0.62;
const DEFAULT_ELEVATION = 0.37;
const MIN_DISTANCE = 34;
const MAX_DISTANCE = 138;
const MIN_ELEVATION = 0.14;
const MAX_ELEVATION = 1.05;
const ROUTE_POINTS = 48;

const damp = THREE.MathUtils.damp;

export function CameraController({ terrainRef, apiRef, reduced }: CameraControllerProps) {
  const { camera, gl } = useThree();

  const motion = useRef({
    focus: new THREE.Vector3(START_FOCUS.x, 0, START_FOCUS.z),
    targetFocus: new THREE.Vector3(START_FOCUS.x, 0, START_FOCUS.z),
    distance: DEFAULT_DISTANCE,
    targetDistance: DEFAULT_DISTANCE,
    azimuth: DEFAULT_AZIMUTH,
    targetAzimuth: DEFAULT_AZIMUTH,
    elevation: DEFAULT_ELEVATION,
    targetElevation: DEFAULT_ELEVATION,
    markerLife: 0,
    markerX: 0,
    markerZ: 0,
    hasTarget: false,
    initialised: false,
  });

  const markerRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pulseMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pinMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const dotMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const route = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(ROUTE_POINTS * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.LineDashedMaterial({
      color: new THREE.Color(ORANGE),
      transparent: true,
      opacity: 0,
      dashSize: 1.35,
      gapSize: 1.35,
      depthWrite: false,
      toneMapped: false,
    });
    const line = new THREE.Line(geometry, material);
    line.visible = false;
    line.frustumCulled = false;
    return line;
  }, []);

  useEffect(() => {
    const s = motion.current;
    const ground = terrainHeight(START_FOCUS.x, START_FOCUS.z) + 1.4;
    s.focus.set(START_FOCUS.x, ground, START_FOCUS.z);
    s.targetFocus.copy(s.focus);

    camera.near = 0.4;
    camera.far = 2200;
    camera.updateProjectionMatrix();

    return () => {
      route.geometry.dispose();
      (route.material as THREE.Material).dispose();
    };
  }, [camera, route]);

  useEffect(() => {
    apiRef.current = {
      zoomIn: () => {
        const s = motion.current;
        s.targetDistance = clamp(s.targetDistance * 0.82, MIN_DISTANCE, MAX_DISTANCE);
      },
      zoomOut: () => {
        const s = motion.current;
        s.targetDistance = clamp(s.targetDistance * 1.22, MIN_DISTANCE, MAX_DISTANCE);
      },
      reset: () => {
        const s = motion.current;
        const ground = terrainHeight(START_FOCUS.x, START_FOCUS.z) + 1.4;
        s.targetFocus.set(START_FOCUS.x, ground, START_FOCUS.z);
        s.targetDistance = DEFAULT_DISTANCE;
        s.targetAzimuth = DEFAULT_AZIMUTH;
        s.targetElevation = DEFAULT_ELEVATION;
        s.hasTarget = false;
        if (route) route.visible = false;
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, route]);

  useEffect(() => {
    const element = gl.domElement;
    const s = motion.current;
    const pointers = new Map<number, { x: number; y: number }>();
    let pointerDown = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let pinchDistance = 0;

    const pinch = () => {
      const values = Array.from(pointers.values());
      if (values.length < 2) return 0;
      return Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
    };

    const setDestination = (x: number, z: number) => {
      const constrained = clampToPlayArea(x, z);
      const ground = terrainHeight(constrained.x, constrained.z) + 1.4;
      s.targetFocus.set(constrained.x, ground, constrained.z);
      s.hasTarget = true;
      s.markerLife = 0;
      s.markerX = constrained.x;
      s.markerZ = constrained.z;

      if (markerRef.current) {
        markerRef.current.position.set(
          constrained.x,
          terrainHeight(constrained.x, constrained.z) + 0.2,
          constrained.z,
        );
        markerRef.current.visible = true;
      }

      const fromX = s.focus.x;
      const fromZ = s.focus.z;
      const length = Math.hypot(constrained.x - fromX, constrained.z - fromZ);

      if (length < 2.5) {
        route.visible = false;
        return;
      }

      const normalX = -(constrained.z - fromZ) / length;
      const normalZ = (constrained.x - fromX) / length;
      const bow = Math.min(20, length * 0.14);
      const midX = (fromX + constrained.x) / 2 + normalX * bow;
      const midZ = (fromZ + constrained.z) / 2 + normalZ * bow;

      const attribute = route.geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = attribute.array as Float32Array;
      for (let i = 0; i < ROUTE_POINTS; i += 1) {
        const u = i / (ROUTE_POINTS - 1);
        const inv = 1 - u;
        const x = inv * inv * fromX + 2 * inv * u * midX + u * u * constrained.x;
        const z = inv * inv * fromZ + 2 * inv * u * midZ + u * u * constrained.z;
        array[i * 3] = x;
        array[i * 3 + 1] = terrainHeight(x, z) + 0.55;
        array[i * 3 + 2] = z;
      }
      attribute.needsUpdate = true;
      route.geometry.setDrawRange(0, ROUTE_POINTS);
      route.computeLineDistances();
      route.visible = true;
    };

    const navigate = (clientX: number, clientY: number) => {
      const terrain = terrainRef.current;
      if (!terrain) return;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObject(terrain, false);
      if (hits.length === 0) return;
      setDestination(hits[0].point.x, hits[0].point.z);
    };

    const onPointerDown = (event: PointerEvent) => {
      element.setPointerCapture?.(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size === 1) {
        pointerDown = true;
        moved = false;
        startX = event.clientX;
        startY = event.clientY;
        startTime = performance.now();
        element.classList.add('is-grabbing');
      } else if (pointers.size === 2) {
        moved = true;
        pinchDistance = pinch();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;

      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size >= 2) {
        const current = pinch();
        if (current > 0 && pinchDistance > 0) {
          s.targetDistance = clamp(
            s.targetDistance * (pinchDistance / current),
            MIN_DISTANCE,
            MAX_DISTANCE,
          );
        }
        pinchDistance = current;
        moved = true;
        return;
      }

      if (!pointerDown) return;

      if (!moved && Math.hypot(event.clientX - startX, event.clientY - startY) > 7) {
        moved = true;
      }

      if (moved) {
        s.targetAzimuth -= dx * 0.0034;
        s.targetElevation = clamp(
          s.targetElevation - dy * 0.0024,
          MIN_ELEVATION,
          MAX_ELEVATION,
        );
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (element.hasPointerCapture?.(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      if (pointerDown && pointers.size === 0) {
        const elapsed = performance.now() - startTime;
        if (!moved && elapsed < 700) {
          navigate(event.clientX, event.clientY);
        }
        pointerDown = false;
        moved = false;
        pinchDistance = 0;
        element.classList.remove('is-grabbing');
      }
    };

    const onPointerCancel = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      pointerDown = false;
      pinchDistance = 0;
      element.classList.remove('is-grabbing');
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      const factor = Math.exp(delta * 0.0011);
      s.targetDistance = clamp(s.targetDistance * factor, MIN_DISTANCE, MAX_DISTANCE);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === '+' || event.key === '=') {
        s.targetDistance = clamp(s.targetDistance * 0.82, MIN_DISTANCE, MAX_DISTANCE);
      } else if (event.key === '-' || event.key === '_') {
        s.targetDistance = clamp(s.targetDistance * 1.22, MIN_DISTANCE, MAX_DISTANCE);
      } else if (event.key === '0') {
        s.targetFocus.set(
          START_FOCUS.x,
          terrainHeight(START_FOCUS.x, START_FOCUS.z) + 1.4,
          START_FOCUS.z,
        );
        s.targetDistance = DEFAULT_DISTANCE;
        s.targetAzimuth = DEFAULT_AZIMUTH;
        s.targetElevation = DEFAULT_ELEVATION;
        s.hasTarget = false;
        route.visible = false;
      }
    };

    element.style.touchAction = 'none';
    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerCancel);
    element.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerCancel);
      element.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      element.classList.remove('is-grabbing');
    };
  }, [camera, gl, raycaster, route, terrainRef]);

  useFrame((state, delta) => {
    const s = motion.current;
    const dt = Math.min(0.05, delta);
    const time = state.clock.elapsedTime;
    const focusLambda = reduced ? 40 : 2.6;
    const turnLambda = reduced ? 40 : 6;

    s.focus.x = damp(s.focus.x, s.targetFocus.x, focusLambda, dt);
    s.focus.z = damp(s.focus.z, s.targetFocus.z, focusLambda, dt);
    s.focus.y = damp(
      s.focus.y,
      terrainHeight(s.focus.x, s.focus.z) + 1.4,
      reduced ? 40 : 3.4,
      dt,
    );

    s.distance = damp(s.distance, s.targetDistance, 5.5, dt);
    s.azimuth = damp(s.azimuth, s.targetAzimuth, turnLambda, dt);
    s.elevation = damp(s.elevation, s.targetElevation, turnLambda, dt);

    const horizontal = Math.cos(s.elevation) * s.distance;
    const cameraX = s.focus.x + Math.sin(s.azimuth) * horizontal;
    const cameraZ = s.focus.z + Math.cos(s.azimuth) * horizontal;
    let cameraY = s.focus.y + Math.sin(s.elevation) * s.distance;

    const groundClearance = terrainHeight(cameraX, cameraZ) + 3.2;
    if (cameraY < groundClearance) cameraY = groundClearance;

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(s.focus.x, s.focus.y + s.distance * 0.24, s.focus.z);

    if (s.hasTarget) {
      const remaining = Math.hypot(s.focus.x - s.markerX, s.focus.z - s.markerZ);
      if (remaining < 2.4) {
        s.markerLife = damp(s.markerLife, 0, 2.6, dt);
        if (s.markerLife < 0.015) s.hasTarget = false;
      } else {
        s.markerLife = damp(s.markerLife, 1, 5, dt);
      }
    } else {
      s.markerLife = damp(s.markerLife, 0, 5, dt);
    }

    const life = s.markerLife;
    const pulse = reduced ? 0 : Math.sin(time * 3.1) * 0.05;

    if (markerRef.current) {
      markerRef.current.visible = life > 0.015;
      if (markerRef.current.visible) {
        markerRef.current.position.y = terrainHeight(s.markerX, s.markerZ) + 0.2;
      }
    }
    if (ringRef.current) ringRef.current.scale.setScalar(1 + pulse);
    if (pulseRingRef.current) pulseRingRef.current.scale.setScalar(1 + pulse * 1.8);
    if (ringMaterialRef.current) ringMaterialRef.current.opacity = life * 0.85;
    if (pulseMaterialRef.current) pulseMaterialRef.current.opacity = life * 0.18;
    if (pinMaterialRef.current) pinMaterialRef.current.opacity = life * 0.8;
    if (dotMaterialRef.current) dotMaterialRef.current.opacity = life;

    const routeMaterial = route.material as THREE.LineDashedMaterial;
    routeMaterial.opacity = life * 0.4;
    if (life < 0.01) route.visible = false;
  });

  return (
    <>
      <primitive object={route} />
      <group ref={markerRef} visible={false}>
        <mesh ref={ringRef} rotation-x={-Math.PI / 2} position={[0, 0.22, 0]}>
          <ringGeometry args={[1.35, 1.47, 48]} />
          <meshBasicMaterial
            ref={ringMaterialRef}
            color={ORANGE}
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={pulseRingRef} rotation-x={-Math.PI / 2} position={[0, 0.16, 0]}>
          <ringGeometry args={[2.1, 2.16, 48]} />
          <meshBasicMaterial
            ref={pulseMaterialRef}
            color={ORANGE}
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 6.2, 4, 1, true]} />
          <meshBasicMaterial
            ref={pinMaterialRef}
            color={ORANGE}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 6.35, 0]}>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshBasicMaterial
            ref={dotMaterialRef}
            color={ORANGE}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}
