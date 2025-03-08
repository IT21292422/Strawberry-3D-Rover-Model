import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useGetCurrentOperationStatus } from "../../utils/api";
import StatusCard from "../StatusCard/StatusCard";
import { FlowerData, RoverStatus } from "../../types/types";

interface Props {
  roverId: string;
}

const RoverScene = ({ roverId }: Props) => {
  const canvasRef = useRef(null);
  const allPotsGroup = useRef(new THREE.Group());
  const potsGroup = useRef(new THREE.Group());
  const potsAwayGroup1 = useRef(new THREE.Group());
  const potsAwayGroup2 = useRef(new THREE.Group());
  const flowersGroup = useRef(new THREE.Group());
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const pots = useRef<THREE.Group[]>([]);
  const roverModel = useRef<THREE.Group | null>(null);

  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [potCount, setPotCount] = useState(10);
  const [status, setStatus] = useState<RoverStatus | undefined>();

  const statusRef = useRef(status);

  const { data: operationStatus } = useGetCurrentOperationStatus(roverId);

  useEffect(() => {
    if (operationStatus) {
      setStatus(operationStatus[0]?.roverStatus);
    }
  }, [operationStatus]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const flowerCoordinates = [
    { x: 0.5949, y: 0.2887, confidence: 0.4 },
    { x: 0.3687, y: 0.2971, confidence: 0.34 },
    { x: 0.2749, y: 0.4298, confidence: 0.77 },
    { x: 0.7056, y: 0.4312, confidence: 0.88 },
  ];

  const flowerss = [
    {
      id: 80,
      rover_id: 1,
      random_id: 1,
      battery_status: 12.3,
      temp: 12.3,
      humidity: 12.3,
      blob_url:
        "https://strawprojectimages101.blob.core.windows.net/strawberryimages/94987597-a59a-4df8-ab50-c99d38648a5a.jpeg",
      image_data:
        '[{"x":0.5949,"y":0.2887,"confidence":0.4},{"x":0.3687,"y":0.2971,"confidence":0.34},{"x":0.2749,"y":0.4298,"confidence":0.77},{"x":0.7056,"y":0.4312,"confidence":0.88}]',
      created_at: {
        $date: "2025-02-01T08:18:06.938Z",
      },
    },
    {
      id: 81,
      rover_id: 1,
      random_id: 1,
      battery_status: 12.3,
      temp: 12.3,
      humidity: 12.3,
      blob_url:
        "https://strawprojectimages101.blob.core.windows.net/strawberryimages/87a2d6b4-3018-4d6c-9d5f-b0e0280a32e9.jpeg",
      image_data:
        '[{"x":0.5949,"y":0.2887,"confidence":0.4},{"x":0.3687,"y":0.2971,"confidence":0.34},{"x":0.2749,"y":0.4298,"confidence":0.77},{"x":0.7056,"y":0.4312,"confidence":0.88}]',
      created_at: {
        $date: "2025-02-01T08:18:27.704Z",
      },
    },
    {
      _id: {
        $oid: "679ddbcb5b22281b227f0078",
      },
      id: 83,
      rover_id: 1,
      random_id: 1,
      battery_status: 12.3,
      temp: 12.3,
      humidity: 12.3,
      blob_url:
        "https://strawprojectimages101.blob.core.windows.net/strawberryimages/bbcc6a6c-dfb1-4efc-b17f-c6260d03653c.jpeg",
      image_data:
        '[{"x":0.5949,"y":0.2887,"confidence":0.4},{"x":0.3687,"y":0.2971,"confidence":0.34},{"x":0.2749,"y":0.4298,"confidence":0.77},{"x":0.7056,"y":0.4312,"confidence":0.88}]',
      created_at: {
        $date: "2025-02-01T08:30:01.524Z",
      },
    },
  ];

  const removeOldPots = () => {
    while (pots.current.length > potCount) {
      const removedPot = pots.current.shift();
      if (removedPot) {
        potsGroup.current.remove(removedPot);
      }

      const removedPot1 = potsAwayGroup1.current.children.shift();
      if (removedPot1) {
        potsAwayGroup1.current.remove(removedPot1);
      }

      const removedPot2 = potsAwayGroup2.current.children.shift();
      if (removedPot2) {
        potsAwayGroup2.current.remove(removedPot2);
      }
    }
  };

  const addNewPots = () => {
    const loader = new GLTFLoader();
    loader.load("pot.glb", (gltf) => {
      const potTemplate = gltf.scene;
      potTemplate.scale.set(0.5, 0.5, 0.5);

      for (let i = potCount - 5; i < potCount; i++) {
        const pot = potTemplate.clone();
        const pot1 = potTemplate.clone();
        const pot2 = potTemplate.clone();

        const position = i * 2.5;
        pot.position.set(0, 0, position);
        pot1.position.set(3, 0, position);
        pot2.position.set(-3, 0, position);

        pot.rotation.y = Math.PI / 2;
        pot1.rotation.y = Math.PI / 2;
        pot2.rotation.y = Math.PI / 2;

        pot.userData = { index: i };
        pots.current.push(pot);
        potsGroup.current.add(pot);
        potsAwayGroup1.current.add(pot1);
        potsAwayGroup2.current.add(pot2);
      }
      removeOldPots();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderer.current = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

    allPotsGroup.current.add(potsGroup.current);
    allPotsGroup.current.add(potsAwayGroup1.current);
    allPotsGroup.current.add(potsAwayGroup2.current);
    allPotsGroup.current.add(flowersGroup.current);
    scene.add(allPotsGroup.current);

    const galaxyPosition = { x: 0, y: 3, z: -10 };
    camera.current = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.current.position.set(
      galaxyPosition.x,
      galaxyPosition.y,
      galaxyPosition.z
    );

    const controls = new OrbitControls(
      camera.current,
      renderer.current.domElement
    );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);

    const loader = new GLTFLoader();

    loader.load("flower.glb", (gltf) => {
      const flowerTemplate = gltf.scene;
      flowerTemplate.scale.set(0.2, 0.2, 0.2);
      flowerCoordinates.forEach((coord, index) => {
        const flower = flowerTemplate.clone();
        flower.position.x = (coord.x - 0.5) * 2.5;
        flower.position.z = (coord.y - 0.5) * 2.5;
        flower.position.y = 1 + index * 0.2;
        flower.rotation.y = Math.random() * Math.PI;
        flowersGroup.current.add(flower);
      });
    });

    loader.load("rover.glb", (gltf) => {
      roverModel.current = gltf.scene;
      roverModel.current.position.set(0, -0.1, 0);
      roverModel.current.scale.set(0.5, 0.5, 0.5);
      scene.add(roverModel.current);
    });

    let potTemplate: THREE.Group<THREE.Object3DEventMap>;
    loader.load("pot.glb", (gltf) => {
      potTemplate = gltf.scene;
      potTemplate.scale.set(0.5, 0.5, 0.5);
      const potTemplateAway1 = gltf.scene.clone();
      potTemplateAway1.scale.set(0.5, 0.5, 0.5);
      const potTemplateAway2 = gltf.scene.clone();
      potTemplateAway2.scale.set(0.5, 0.5, 0.5);

      for (let i = -10; i < potCount; i++) {
        const pot = potTemplate.clone();
        const pot1 = potTemplateAway1.clone();
        const pot2 = potTemplateAway2.clone();

        const position = i * 2.5;
        pot.position.set(0, 0, position);
        pot1.position.set(3, 0, position);
        pot2.position.set(-3, 0, position);

        pot.rotation.y = Math.PI / 2;
        pot1.rotation.y = Math.PI / 2;
        pot2.rotation.y = Math.PI / 2;

        pot.userData = { index: i };
        pots.current.push(pot);
        potsGroup.current.add(pot);
        potsAwayGroup1.current.add(pot1);
        potsAwayGroup2.current.add(pot2);
      }
    });

    camera.current.lookAt(scene.position);
    controls.enableRotate = true;
    controls.enableZoom = false;

    const animate = () => {
      requestAnimationFrame(animate);

      if (moveForward.current) {
        allPotsGroup.current.position.z -= 0.1;
      }
      if (moveBackward.current) {
        allPotsGroup.current.position.z += 0.1;
      }

      if (statusRef.current === RoverStatus.START) {
        allPotsGroup.current.position.z -= 0.01;
        // if (allPotsGroup.current.position.z < -10) {
        //   allPotsGroup.current.position.z = -1;
        // }
        if (Math.abs(allPotsGroup.current.position.z) > potCount - 10) {
          setPotCount((prev) => prev + 5);
          addNewPots();
        }
      }

      controls.update();
      renderer.current.render(scene, camera.current);
    };
    animate();

    const onWindowResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "w") moveForward.current = true;
      if (event.key.toLowerCase() === "s") moveBackward.current = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "w") moveForward.current = false;
      if (event.key.toLowerCase() === "s") moveBackward.current = false;
    };

    const onMouseClick = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera.current);

      if (roverModel.current) {
        const roverIntersect = raycaster.current.intersectObject(
          roverModel.current,
          true
        );
        if (roverIntersect.length > 0) {
          console.log("Rover is clicked");
          alert("Rover is clicked");
        }
      }

      const intersects = raycaster.current.intersectObjects(
        potsGroup.current.children,
        true
      );
      if (intersects.length > 0) {
        let potObject = intersects[0].object;
        while (
          potObject.parent &&
          !potObject.userData.hasOwnProperty("index")
        ) {
          potObject = potObject.parent;
        }
        if (potObject.userData.hasOwnProperty("index")) {
          console.log(`Pot ${potObject.userData.index} clicked!`);
          alert(`${potObject.userData.index} pot is clicked`);
        }
      }
    };

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("click", onMouseClick);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("click", onMouseClick);
      renderer.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (flowers.length > 0) {
      const loader = new GLTFLoader();
      loader.load("flower.glb", (gltf) => {
        const flowerTemplate = gltf.scene;
        flowerTemplate.scale.set(0.2, 0.2, 0.2);

        flowers.forEach((coord) => {
          const flower = flowerTemplate.clone();

          // Convert relative coordinates to scene positions
          const potIndex = Math.floor((potCount - 5) / 2); // Roughly near the rover
          const pot = pots.current[potIndex];

          if (pot) {
            flower.position.set(
              pot.position.x + (coord.x - 0.5) * 2.5,
              1,
              pot.position.z + (coord.y - 0.5) * 2.5
            );
            flowersGroup.current.add(flower);
          }
        });
      });
    }
  }, [flowers]);

  return (
    <div>
      <StatusCard status={status ?? 0} />
      <canvas ref={canvasRef} id="webgl" />
    </div>
  );
};

export default RoverScene;
