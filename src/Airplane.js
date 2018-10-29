import colors from "./colors.js";

import { normalize } from "./helpers.js";

class AirPlane {
  constructor() {
    this.mesh = new THREE.Object3D();

    // Create the cabin
    let geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    let matCockpit = new THREE.MeshPhongMaterial({
      color: colors.red,
      flatShading: true
    });

    let cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    // Create the engine
    let geomEngine = new THREE.BoxGeometry(100, 50, 50, 1, 1, 1);
    let matEngine = new THREE.MeshPhongMaterial({
      color: colors.white,
      flatShading: true
    });

    let engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Create the tail
    let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    let matTailPlane = new THREE.MeshPhongMaterial({
      color: colors.red,
      flatShading: true
    });

    let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // Create the wing
    let geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    let matSideWing = new THREE.MeshPhongMaterial({
      color: colors.red,
      flatShading: true
    });

    let sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    // propeller
    let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    let matPropeller = new THREE.MeshPhongMaterial({
      color: colors.brown,
      flatShading: true
    });

    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // blades
    let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    let matBlade = new THREE.MeshPhongMaterial({
      color: colors.brownDark,
      flatShading: true
    });

    let blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(100, 0, 0);
    this.mesh.add(this.propeller);
  }

  update(mousePos) {
    // let's move the airplane between -100 and 100 on the horizontal axis,
    // and between 25 and 175 on the vertical axis,
    // depending on the mouse position which ranges between -1 and 1 on both axes;
    // to achieve that we use a normalize function (see below)

    const targetX = normalize(mousePos.x, -1, 1, -100, 100);
    const targetY = normalize(mousePos.y, -1, 1, 25, 175);

    // update the airplane's position
    this.mesh.position.y = targetY;
    this.mesh.position.x = targetX;
    this.propeller.rotation.x += 0.9;
  }
}

export default AirPlane;
