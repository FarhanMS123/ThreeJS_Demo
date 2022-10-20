import * as THREE from "three";
import { GLTFLoader } from 'GLTFLoader';

// opts = options
// ctx = context
// params
// attr = attributes
export default async function Iora(opts){
    const {container} = opts;
    const renderer = new THREE.WebGLRenderer(opts);
    const scene = new THREE.Scene();

    await loadObject();

    container.appendChild(renderer.domElement);

    async function loadObject(){
        const loader = new GLTFLoader();
        const gltf = await (new Promise((res,rej) => loader.load('/3d/halo.glb', res, null, rej)));
        const model = gltf.scene;
    }

    function animate(){
        //
    }

    function initRender(){
        requestAnimationFrame(initRender);
        renderer.setSize( container.clientWidth, container.clientHeight );
        // renderer.render( scene, camera );

        // console.log([container.innerWidth, container.innerHeight]);

        animate();
    }
    initRender()

    return renderer;
}