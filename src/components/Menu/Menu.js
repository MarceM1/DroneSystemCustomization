import React from "react";
import "./styles.css";
import { gsapAnimation, removeOldModels, resetAnimation } from "../Scene/Script";

const motors = [
  {
    name: "Motor1",
    group: "motor",
    rute: "./model/motor/Motor1.gltf",
  },
  {
    name: "Motor2",
    group: "motor",
    rute: "./model/motor/Motor2.gltf",
  },
  {
    name: "Motor3",
    group: "motor",
    rute: "./model/motor/Motor3.gltf",
  },
];

const helices = [
  {
    name: "Helice1",
    group: "helices",
    rute: "./model/helices/Helice1.gltf",
  },
  {
    name: "Helice2",
    group: "helices",
    rute: "./model/helices/Helice2.gltf",
  },
  {
    name: "Helice3",
    group: "helices",
    rute: "./model/helices/Helice3.gltf",
  },
];

const camaras = [
  {
    name: "Cam1",
    group: "camaras",
    rute: "./model/cam/Cam1.gltf",
  },
  {
    name: "Cam2",
    group: "camaras",
    rute: "./model/cam/Cam2.gltf",
  },
  {
    name: "Cam3",
    group: "camaras",
    rute: "./model/cam/Cam3.gltf",
  },
];

const animations = {
  motors: {
    target: {
      x: -1.34076,
      y: 0.20531,
      z: 1.23614,
    },
    camera: {
      x: -2.2856,
      y: 2.00913,
      z: 4.92954,
    },
    zoom: 1.2,
  },
  helices: {
    target: {
      x: 1.23608,
      y: 0.37713,
      z: 1.32197,
    },
    camera: {
      x: 2.18092,
      y: 4.07059,
      z: 4.32823,
    },
    zoom: 1,
  },
  cameras: {
    target: {
      x: 0,
      y: -0.48183,
      z: 1.15018,
    },
    camera: {
      x: -2.4574,
      y: -0.22413,
      z: 5.70259,
    },
    zoom: 1.57,
  },
};

const Menu = () => {
  return (
    <div className="MenuContainer">
      <div className="MenuWrapper">
        <div className="MenuOptions">
          <h1 className="MenuOptions">Drone Customization</h1>
          <ul className="MenuOptionsList">
            <li>
              <label htmlFor="motors">Motors</label>
              <select
                className="motors"
                onClick={() => {
                  gsapAnimation(
                    animations.motors.target,
                    animations.motors.camera,
                    animations.motors.zoom
                  );
                }}
                onChange={(e) => {
                  const motor = motors.find(
                    (motor) => motor.name === e.target.value
                  );
                  removeOldModels(motor.rute, motor.group);
                }}
              >
                {motors.map((motor, id) => (
                  <option key={id} value={motor.name}>
                    {motor.name}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="helices">Helices</label>
              <select
                className="Helices"
                onClick={() => {
                  gsapAnimation(
                    animations.helices.target,
                    animations.helices.camera,
                    animations.helices.zoom
                  );
                }}
                onChange={(e) => {
                  const helice = helices.find(
                    (helice) => helice.name === e.target.value
                  );
                  removeOldModels(helice.rute, helice.group);
                }}
              >
                {helices.map((helices, id) => (
                  <option key={id} value={helices.name}>
                    {helices.name}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="camara">Cameras</label>
              <select
                className="Camaras"
                onClick={() => {
                  gsapAnimation(
                    animations.cameras.target,
                    animations.cameras.camera,
                    animations.cameras.zoom
                  );
                }}
                onChange={(e) => {
                  const camara = camaras.find(
                    (camara) => camara.name === e.target.value
                  );
                  removeOldModels(camara.rute, camara.group);
                }}
              >
                {camaras.map((camaras, id) => (
                  <option key={id} value={camaras.name}>
                    {camaras.name}
                  </option>
                ))}
              </select>
            </li>
          </ul>
          <div className="VistaGeneral">
                <button onClick={()=> resetAnimation()}>
                  Main View
                </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
