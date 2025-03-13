import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  useGetCurrentOperationStatus,
  useGetCurrentStatus,
} from "../../utils/api";
import StatusCard from "../StatusCard/StatusCard";
import { RoverStatus } from "../../types/types";
import InfoPanel from "../InfoPanel/InfoPanel";
import ImageCard from "../ImageCard/ImageCard";

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

  const [potCount] = useState(10);
  const [status, setStatus] = useState<RoverStatus | undefined>();
  const [isMoving, setIsMoving] = useState(true);

  const isMovingRef = useRef(isMoving);

  const statusRef = useRef(status);

  const { data: operationStatus } = useGetCurrentOperationStatus(roverId);

  const { data: currentStatus } = useGetCurrentStatus(roverId);

  useEffect(() => {
    if (operationStatus) {
      setStatus(operationStatus[0]?.roverStatus);
    }
  }, [operationStatus]);

  useEffect(() => {
    statusRef.current = status;
    if (status === RoverStatus.START) {
      setIsMoving(true);
      isMovingRef.current = true;
      const moveInterval = setInterval(() => {
        setIsMoving((prev) => !prev);
        isMovingRef.current = !isMovingRef.current;
      }, 3000);

      return () => clearInterval(moveInterval);
    }
  }, [status]);

  useEffect(() => {
    if (currentStatus?.coordinates) {
      try {
        const coordinates = JSON.parse(currentStatus.coordinates);
        if (flowersGroup.current) {
          while (flowersGroup.current.children.length > 0) {
            flowersGroup.current.clear();
          }
        }
        const loader = new GLTFLoader();
        loader.load("flower.glb", (gltf) => {
          const flowerTemplate = gltf.scene;
          flowerTemplate.scale.set(0.2, 0.2, 0.2);

          coordinates.forEach((coord: any) => {
            const flower = flowerTemplate.clone();
            flower.position.x = (coord.x - 0.5) * 2;
            flower.position.z = (coord.y - 0.5) * 2;
            flower.position.y = 0.7;
            flower.rotation.y = Math.random() * Math.PI;
            flowersGroup.current.add(flower);
          });
        });
      } catch (error) {
        console.error("Error in parsing coordinates", error);
      }
    }
  }, [currentStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (renderer.current) return;
    renderer.current = new THREE.WebGLRenderer({ canvas, antialias: true });
    if (renderer.current) {
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    }
    renderer.current.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xadd8e6);

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

    loader.load("rover.glb", (gltf) => {
      roverModel.current = gltf.scene;
      roverModel.current.position.set(0, -0.1, 0);
      roverModel.current.scale.set(0.5, 0.5, 0.5);
      scene.add(roverModel.current);
    });

    let potTemplate: THREE.Group<THREE.Object3DEventMap>;
    loader.load("bush.glb", (gltf) => {
      potTemplate = gltf.scene;
      potTemplate.scale.set(1, 1, 1);
      const potTemplateAway1 = gltf.scene.clone();
      potTemplateAway1.scale.set(1, 1, 1);
      const potTemplateAway2 = gltf.scene.clone();
      potTemplateAway2.scale.set(1, 1, 1);

      for (let i = -3; i < potCount; i++) {
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

      if (statusRef.current === RoverStatus.START && isMovingRef.current) {
        allPotsGroup.current.position.z -= 0.01;
        if (allPotsGroup.current.position.z < -10) {
          allPotsGroup.current.position.z = -1;
        }
      }

      controls.update();
      if (renderer.current && camera.current) {
        renderer.current.render(scene, camera.current);
      }
    };
    animate();

    const onWindowResize = () => {
      if (camera.current) {
        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();
      }
      if (renderer.current) {
        renderer.current.setSize(window.innerWidth, window.innerHeight);
      }
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

      if (camera.current) {
        raycaster.current.setFromCamera(mouse.current, camera.current);
      }

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

  return (
    <div>
      <StatusCard status={status ?? 0} />
      <InfoPanel receivedData={currentStatus} />
      <ImageCard base64Image={currentStatus?.processed_image} />
      <canvas ref={canvasRef} id="webgl" />
    </div>
  );
};

export default RoverScene;
