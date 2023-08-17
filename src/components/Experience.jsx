import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  Box,
  Text,
  useCursor,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cactoro } from "./Cactoro";
import { DragonEvolved } from "./Dragon_Evolved";
import { Fish } from "./Fish";
import { MeshPhysicalMaterial } from "three";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  useCursor(hovered);
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <MonsterStage
        name=""
        color="#38adcf"
        texture={
          "textures/anime_art_style_a_water_based_pokemon_like_environ.jpg"
        }
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        
      </MonsterStage>
      
    </>
  );
};

const MonsterStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();
  const boxRef = useRef(); // Reference to the Box mesh

  // Rotation animation state
  const [isInside, setIsInside] = useState(false);
  const targetRotation = isInside ? Math.PI : 0;
  const initialRotation = boxRef.current?.rotation.y || 0;

  // Update rotation on every frame
  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);

    // Update the rotation based on whether the cube is inside or not
    const newRotation = THREE.MathUtils.lerp(
      boxRef.current.rotation.y,
      targetRotation,
      0.1
    );
    boxRef.current.rotation.y = newRotation;
  });

  return (
    <group {...props}>
      <Text
        font="fonts/Caprasimo-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.3, 1]}
        anchorY={"bottom"}
      >
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <Box
        ref={boxRef}
        name={name}
        args={[2, 2, 2]}
        onDoubleClick={() => {
          setActive(active === name ? null : name);
          setIsInside(!isInside); // Toggle inside state
        }}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}
      >
        <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide}>
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </Box>
    </group>
  );
};