import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// opts = options
// ctx = context
// params
// attr = attributes
export default async function Iora(opts){
    const {container} = opts;
    const renderer = new THREE.WebGLRenderer(opts);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, container.clientWidth/container.clientHeight, 0.1, 1000 );
    // camera.position.z = 5;
    camera.position.set(-7, 6.7, 6.6);
    camera.rotation.set(-0.97, -0.57, -0.53);

    await loadObject();
    loadLights();

    renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setPixelRatio(window.devicePixelRatio);


    container.appendChild(renderer.domElement);

    function loadLights(){
        const light = new THREE.AmbientLight( 0xffffff ); // soft white light
        scene.add( light );
    }

    async function loadObject(){
        const loader = new GLTFLoader();
        const gltf = await (new Promise((res,rej) => loader.load('/3d/halo.glb', res, undefined, rej)));
        const model = gltf.scene;

        model.name = "iora";
        // model.scale.set(100, 100, 100);
        // model.rotation.set(92 * Math.PI / 180, 0, 0);
        // model.castShadow = true;
        // model.receiveShadow = false;

        // model.traverse(function(el){
        //     if(typeof el.material == 'object'){
        //         el.material.metalness = 0;
        //         el.material.roughness = 0.5;
        //     }
        // });

        renderer.iora = model;

        scene.add(model);

        // ===================

        // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // const cube = new THREE.Mesh( geometry, material );
        // scene.add( cube );
    }

    function animate(){
        //
    }

    function initRender(){
        requestAnimationFrame(initRender);
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.render( scene, camera );

        // console.log([container.innerWidth, container.innerHeight]);

        animate();
    }
    initRender();

    Object.assign(renderer, {
        scene,
        camera
    });

    return renderer;
}