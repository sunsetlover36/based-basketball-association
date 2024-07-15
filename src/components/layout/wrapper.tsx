import { Suspense, useEffect, useState, type FC, type ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Tooltip } from 'react-tooltip';
import { useActiveWalletChain } from 'thirdweb/react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  AsciiRenderer,
  Center,
  Environment,
  Fisheye,
  Float,
  GradientTexture,
  Loader,
  OrbitControls,
  PresentationControls,
  Sparkles,
  Stars,
  Text3D,
  useGLTF,
} from '@react-three/drei';
import { motion } from 'framer-motion';

import { APP_THIRDWEB_CHAIN, cn, isValidChain } from '@/lib/utils';
import { useStore } from '@/store';

import {
  ConfirmTeamDialog,
  ConfirmTrainingDialog,
  TeamDialog,
  TraitsDialog,
  EditLogoDialog,
} from './dialogs';

export const Ball = () => {
  const { nodes, materials } = useGLTF('/ball.glb');
  const [rotation, setRotation] = useState(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    setRotation(t * 0.05);
  });

  const ball = nodes['bbc_ball_body'];
  return (
    <mesh
      receiveShadow
      geometry={ball.geometry}
      material={materials['bball_Mat']}
      rotation={[rotation, 2 + rotation, Math.PI * 0.5 + rotation]}
      scale={0.1}
      position={[0, 0, 0]}
    />
  );
};
export const Experience = () => {
  const { width, height } = useWindowSize();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 1 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
      }}
    >
      <Canvas flat>
        <Suspense fallback={null}>
          <Environment
            background
            files={[
              '/env/cube_left.png', // px
              '/env/cube_right.png', // nx
              '/env/cube_up.png', // py
              '/env/cube_down.png', // ny
              '/env/cube_front.png', // pz
              '/env/cube_back.png', // nz
            ]}
          />
          <directionalLight
            castShadow
            position={[0, 0, 10]}
            intensity={0.25}
            shadow-normalBias={0.04}
            color={'orange'}
          />

          <Sparkles
            count={500}
            size={1.5}
            noise={3}
            scale={10}
            speed={0.5}
            color={'orange'}
          />

          <PresentationControls
            global
            cursor={true} // Whether to toggle cursor style on drag
            snap
            speed={1} // Speed factor
            zoom={1} // Zoom factor when half the polar-max is reached
            rotation={[0, 0, 0]} // Default rotation
            azimuth={[-Infinity, Infinity]} // Horizontal limits
            config={{ mass: 1, tension: 60, friction: 26 }} // Spring config
          >
            <Ball />
          </PresentationControls>
          <Float floatIntensity={0.5}>
            <Center disableZ>
              <Text3D
                lineHeight={0.5}
                letterSpacing={-0.025}
                position={[0, 0, 2]}
                scale={Math.max(0.125, (width / 2560) * 0.25)}
                font={'/fonts/retro-gaming.typeface.json'}
              >
                stars are emerging
                <meshBasicMaterial>
                  <GradientTexture
                    stops={[0, 1]} // As many stops as you want
                    colors={['orange', 'hotpink']} // Colors need to match the number of stops
                    size={1024} // Size is optional, default = 1024
                  />
                </meshBasicMaterial>
              </Text3D>
            </Center>
          </Float>
        </Suspense>
      </Canvas>
      <Loader />
    </motion.div>
  );
};

interface WrapperProps {
  children: ReactNode;
}
export const Wrapper: FC<WrapperProps> = ({ children }) => {
  const { pathname } = useLocation();
  const windowSize = useWindowSize();
  const chainId = useActiveWalletChain()?.id;
  const { isConfettiVisible } = useStore();

  const isCenteredContent = !['/team', '/leaderboard', '/invite'].some((path) =>
    pathname.includes(path)
  );

  useEffect(() => {
    if (chainId && !isValidChain(chainId)) {
      toast.error(`Please switch to ${APP_THIRDWEB_CHAIN.name} network!`, {
        id: 'wrong-network-error',
        icon: '⛓️',
      });
    }
  }, [chainId]);

  return (
    <>
      <div className="w-full min-h-screen relative">
        <Experience />
      </div>
    </>
  );
};

useGLTF.preload('./ball.glb');
