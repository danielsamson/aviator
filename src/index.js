import colors from "./colors.js";

import {
  createLights,
  createPlane,
  setup,
  createSea,
  createSky,
  createControls,
  normalize
} from "./helpers.js";

window.addEventListener("load", () => new Game(), false);

function Game() {
  this.gui = new dat.GUI();

  this.state = { mousePos: { x: 0, y: 0 } };

  this.vars = {
    scene: null,
    camera: null,
    // fieldOfView: null,
    // aspectRatio: null,
    // nearPlane: null,
    // farPlane: null,
    WIDTH: null,
    HEIGHT: null,
    renderer: null,
    container: null
  };

  // set up the scene, the camera and the renderer
  this.vars = { ...setup() };

  // add the objects
  this.objects = {
    lights: createLights(this.vars.scene),
    plane: createPlane(this.vars.scene),
    sea: createSea(this.vars.scene),
    sky: createSky(this.vars.scene)
  };

  createControls(this.gui, this.objects);

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  this.loop = this.loop.bind(this);
  this.loop();

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
  window.addEventListener("resize", this.handleWindowResize.bind(this), false);

  document.addEventListener(
    "mousemove",
    this.handleMouseMove.bind(this),
    false
  );
}

Game.prototype.handleMouseMove = function() {
  // here we are converting the mouse position value received
  // to a normalized value varying between -1 and 1;
  // this is the formula for the horizontal axis:
  let x = -1 + (event.clientX / this.vars.WIDTH) * 2;

  // for the vertical axis, we need to inverse the formula
  // because the 2D y-axis goes the opposite direction of the 3D y-axis
  let y = 1 - (event.clientY / this.vars.HEIGHT) * 2;
  this.state.mousePos = { x, y };
};

Game.prototype.loop = function() {
  const { renderer, scene, camera } = this.vars;
  const { sea, sky, plane } = this.objects;

  plane.update(this.state.mousePos);

  sea.mesh.rotation.z += 0.005;
  sky.mesh.rotation.z += 0.01;

  // render the scene
  renderer.render(scene, camera);

  // call the loop function again
  requestAnimationFrame(this.loop);
};

Game.prototype.handleWindowResize = function() {
  // this.vars ={...this.vars, }
  // update height and width of the renderer and the camera
  this.vars.HEIGHT = window.innerHeight;
  this.vars.WIDTH = window.innerWidth;
  this.vars.renderer.setSize(this.vars.WIDTH, this.vars.HEIGHT);
  this.vars.camera.aspect = this.vars.WIDTH / this.vars.HEIGHT;
  this.vars.camera.updateProjectionMatrix();
};
