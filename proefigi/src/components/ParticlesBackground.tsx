import Particles from "@tsparticles/react";
import { useEffect, useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import { initParticlesEngine } from "@tsparticles/react";

export default function ParticlesBackground() {

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        background: {
          color: "transparent"
        },
        fullScreen: {
          enable: false
        },
        particles: {
          number: {
            value: 80
          },
          color: {
            value: "#00c6ff"
          },
          links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4
          },
          move: {
            enable: true,
            speed: 2
          },
          size: {
            value: { min: 1, max: 4 }
          }
        }
      }}
    />
  );
}