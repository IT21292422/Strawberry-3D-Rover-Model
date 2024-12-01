import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreePotScene extends Component {
  constructor(props) {
    super(props);
    this.allPotsGroup = new THREE.Group(); // New parent group for all pots
    this.potsGroup = new THREE.Group();
    this.potsAwayGroup1 = new THREE.Group();
    this.potsAwayGroup2 = new THREE.Group();
    this.moveForward = false;
    this.moveBackward = false;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.pots = [];
  }

  componentDidMount() {
    const canvas = document.getElementById("webgl");
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

    // Add all pot groups to the parent group
    this.allPotsGroup.add(this.potsGroup);
    this.allPotsGroup.add(this.potsAwayGroup1);
    this.allPotsGroup.add(this.potsAwayGroup2);
    scene.add(this.allPotsGroup);

    const galaxyPosition = {
      x: 0,
      y: 3,
      z: 10,
    };

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(galaxyPosition.x, galaxyPosition.y, galaxyPosition.z);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff,5);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff,5);
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);

    const loader = new GLTFLoader();

    loader.load("new_rover1.glb", (gltf) => {
      this.roverModel = gltf.scene;
      this.roverModel.position.set(0, -0.1, 0);
      // this.roverModel.scale.set(1.5, 2, 1.5);
      this.roverModel.scale.set(0.5, 0.5, 0.5);
      scene.add(this.roverModel);
    });

    // Load and position 10 pots
    loader.load("pot.glb", (gltf) => {
      const potTemplate = gltf.scene;
      potTemplate.scale.set(0.5, 0.5, 0.5);
      const potTemplateAway1 = gltf.scene.clone();
      potTemplateAway1.scale.set(0.5, 0.5, 0.5);
      const potTemplateAway2 = gltf.scene.clone();
      potTemplateAway2.scale.set(0.5, 0.5, 0.5);

      for (let i = 0; i < 10; i++) {
        const pot = potTemplate.clone();
        const pot1 = potTemplateAway1.clone();
        const pot2 = potTemplateAway2.clone();
        
        // Calculate position
        const position = i * 2.5; // Full circle divided into 10 parts
        
        pot.position.set(0, 0, position);
        pot1.position.set(3, 0, position);
        pot2.position.set(-3, 0, position);
        
        // Rotate pot 90 degrees around Y-axis
        pot.rotation.y = Math.PI / 2; // 90 degrees + angle to face outward
        pot1.rotation.y = Math.PI / 2; // 90 degrees + angle to face outward
        pot2.rotation.y = Math.PI / 2; // 90 degrees + angle to face outward
        
        pot.userData = { index: i };
        this.pots.push(pot);
        this.potsGroup.add(pot);
        this.potsAwayGroup1.add(pot1);
        this.potsAwayGroup2.add(pot2);
      }
    });

    this.camera.lookAt(scene.position);

    controls.enableRotate = true;
    controls.enableZoom = false;

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Move all pots if 'W' or 'S' is pressed
      if (this.moveForward) {
        this.allPotsGroup.position.z -= 0.1; // Adjust speed as needed
      }
      if (this.moveBackward) {
        this.allPotsGroup.position.z += 0.1; // Adjust speed as needed
      }

      controls.update();
      this.renderer.render(scene, this.camera);
    };
    animate();

    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('keydown', this.onKeyDown, false);
    window.addEventListener('keyup', this.onKeyUp, false);
    window.addEventListener('click', this.onMouseClick, false);
  }

  onWindowResize = () => {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  onKeyDown = (event) => {
    if (event.key.toLowerCase() === 'w') {
      this.moveForward = true;
    }
    if (event.key.toLowerCase() === 's') {
      this.moveBackward = true;
    }
  }

  onKeyUp = (event) => {
    if (event.key.toLowerCase() === 'w') {
      this.moveForward = false;
    }
    if (event.key.toLowerCase() === 's') {
      this.moveBackward = false;
    }
  }

  onMouseClick = (event) => {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Calculate objects intersecting the picking ray
    if (this.roverModel) {
      const roverIntersect = this.raycaster.intersectObject(this.roverModel, true);
    
      if (roverIntersect.length > 0) {
        console.log("Rover is clicked");
        alert('Rover is clicked');
      }
    }

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.potsGroup.children, true);

    if (intersects.length > 0) {
      // Get the first intersected object
      const object = intersects[0].object;
      // Traverse up to find the root pot object
      let potObject = object;
      while (potObject.parent && !potObject.userData.hasOwnProperty('index')) {
        potObject = potObject.parent;
      }
      if (potObject.userData.hasOwnProperty('index')) {
        console.log(`Pot ${potObject.userData.index} clicked!`);
        alert(`${potObject.userData.index} pot is clicked`)
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('click', this.onMouseClick);
  }

  render() {
    return (
      <div>
        <canvas id="webgl"></canvas>
      </div>
    );
  }
}

export default ThreePotScene;