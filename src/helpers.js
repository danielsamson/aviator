import Sea from "./Sea.js";
import AirPlane from "./AirPlane.js";
import Sky from "./Sky.js";

function createCamera(WIDTH, HEIGHT) {
  // Create the camera
  let aspectRatio = WIDTH / HEIGHT;
  let fieldOfView = 60;
  let nearPlane = 1;
  let farPlane = 10000;

  let camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  // Set the position of the camera
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  return camera;
}

function createScene() {
  // Create the scene
  const scene = new THREE.Scene();

  // Add a fog effect to the scene; same color as the
  // background color used in the style sheet
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
  return scene;
}

function createRenderer(WIDTH, HEIGHT) {
  // Create the renderer
  let renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true,

    // Activate the anti-aliasing; this is less performant,
    // but, as our project is low-poly based, it should be fine :)
    antialias: true
  });

  // Define the size of the renderer; in this case,
  // it will fill the entire screen
  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;
  return renderer;
}

function createContainer(renderer) {
  // Add the DOM element of the renderer to the
  // container we created in the HTML
  let container = document.getElementById("world");
  container.appendChild(renderer.domElement);
  return container;
}

export function setup() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera
  // and the size of the renderer.
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const scene = createScene();
  const camera = createCamera(WIDTH, HEIGHT);
  const renderer = createRenderer(WIDTH, HEIGHT);
  const container = createContainer(renderer);

  return {
    WIDTH,
    HEIGHT,
    scene,
    camera,
    renderer,
    container
  };
}

export function createLights(root) {
  if (!root) {
    console.error("createLights: No root added");
    return;
  }

  // A hemisphere light is a gradient colored light;
  // the first parameter is the sky color, the second parameter is the ground color,
  // the third parameter is the intensity of the light
  const hemisphereLight = new THREE.HemisphereLight("#aaaaaa", "#000000", 0.9);

  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
  const shadowLight = new THREE.DirectionalLight("#ffffff", 0.9);

  // Set the direction of the light
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, just add them to the scene
  root.add(hemisphereLight);
  root.add(shadowLight);

  return {
    hemisphereLight,
    shadowLight
  };
}

export function createSea(root) {
  if (!root) {
    console.error("createSea: No root added");
    return;
  }
  const sea = new Sea();

  // push it a little bit at the bottom of the scene
  sea.mesh.position.y = -600;

  // add the mesh of the sea to the scene
  root.add(sea.mesh);
  return sea;
}

// Now we instantiate the sky and push its center a bit
// towards the bottom of the screen
export function createSky(root) {
  if (!root) {
    console.error("createSky: No root added");
    return;
  }

  const sky = new Sky();
  sky.mesh.position.y = -600;
  root.add(sky.mesh);
  return sky;
}

export function createPlane(root) {
  if (!root) {
    console.error("createPlane: No root added");
    return;
  }

  const airplane = new AirPlane();
  airplane.mesh.scale.set(0.25, 0.25, 0.25);
  airplane.mesh.position.y = 100;

  root.add(airplane.mesh);
  return airplane;
}

export function normalize(v, vmin, vmax, tmin, tmax) {
  const nv = Math.max(Math.min(v, vmax), vmin);
  const dv = vmax - vmin;
  const pc = (nv - vmin) / dv;
  const dt = tmax - tmin;
  const tv = tmin + pc * dt;
  return tv;
}

export function createControls(gui, objects) {
  const lf = gui.addFolder("Lights");
  const slf = lf.addFolder("Shadow Light");
  const hlf = lf.addFolder("Hemisphere Light");

  const { hemisphereLight, shadowLight } = objects.lights;

  const controls = {
    shadowLight: {
      color: shadowLight.color.getHex(),
      x: shadowLight.position.x,
      y: shadowLight.position.y,
      z: shadowLight.position.z
    },
    hemisphereLight: { color: hemisphereLight.color.getHex() }
  };

  slf
    .add(controls.shadowLight, "x", -400, 400)
    .onChange(e => (shadowLight.position.x = e));

  slf
    .add(controls.shadowLight, "y", -400, 400)
    .onChange(e => (shadowLight.position.y = e));

  slf
    .add(controls.shadowLight, "z", -400, 400)
    .onChange(e => (shadowLight.position.z = e));

  slf
    .addColor(controls.shadowLight, "color")
    .onChange(e => (shadowLight.color = new THREE.Color(e)));

  hlf
    .addColor(controls.hemisphereLight, "color")
    .onChange(e => (hemisphereLight.color = new THREE.Color(e)));
}
