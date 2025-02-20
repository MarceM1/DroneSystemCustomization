import { useEffect, useRef } from "react";
import { ContainerScene } from "./Scene.elements";
import { cleanUpScene, initScene, loadGroups, loadModels } from "./Script";

const Scene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    initScene(mountRef);
    loadGroups()
    loadModels('./model/base/Base.gltf', 'base')
    loadModels('./model/helices/Helice1.gltf', 'helices')
    loadModels('./model/motor/Motor1.gltf', 'motor')
    // loadModels('./model/motor/Motor2.gltf', 'motor')
    // loadModels('./model/motor/Motor3.gltf', 'motor')

    loadModels('./model/cam/Cam1.gltf', 'camaras')



    return () => {
      cleanUpScene();
    };
  }, []);

  return (
    <ContainerScene className='SceneContainer' ref={mountRef}></ContainerScene>
  );
};

export default Scene;
