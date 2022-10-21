/**
 * This is a boilerplate for ThreeJS. This boilerplate
 * could be use as ESM Web or NodeJS Build.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { EffectComposer, RenderPass, EffectPass } from 'postprocessing';

export default async function Scene1(opts){
    opts = {
        // any default value need to be set
        ...opts,
        // any fixed value wont to be change
    }
    const { container } = opts;

    let isRender = false;
    let frame = 0;
    let _time = 0;
    const state = {};

    const clock = new THREE.Clock(false);

    const renderer = new THREE.WebGLRenderer(opts);
    container.append(renderer.domElement);

    const scene = new THREE.Scene();

    // ###################################
    // ### Load & Register Scene #########

    async function loadLights() {  }

    const cameras = [];
    async function loadCameras() { 
        cameras.cam1 = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 0.1, 1000 );
        cameras.cam1.position.setZ(5);
    }

    let composer;
    async function setupEffects() {
        // Renderer
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setPixelRatio(window.devicePixelRatio);

        // Postprocessing
        // composer = new EffectComposer(renderer);
        // composer.addPass(new RenderPass(scene, camera));
        // composer.addPass(new EffectPass(camera, effects));
    }

    // Registering geometry, material, and texture, and then store
    // them to desired container would be good if they would be use
    // over again by other objects. This also could prevent reconstruct
    // the same object twice or more.
    let geometries = [];
    let materials = [];
    let textures = [];
    async function registerObjects() { 
        const gltfLoader = new GLTFLoader();

        await loadModel({gltfLoader});

        await createCube();
    }

    // TODO: rename `gltfModel` and others to desire model name, such as `gltfEarth`
    let gltfModel, mixerModel, actionModel;
    async function loadModel({ gltfLoader }) {
        // Load Object
        // gltfModel = await new Promise((res, rej) => gltfLoader.load("/to/glb/file.glb", res, undefined, rej));
        // gltfModel.scene.name = "model";
        // scene.add( gltfModel.scene );

        // Register Clip
        // const mesh = gltfModel.scene.children[0];
        // mixerModel = new THREE.AnimationMixer( mesh );
        // const clips = gltfModel.animations;
        // const clip = clips[0];
        // actionModel = mixer.clipAction(clip);
    }

    let cube;
    async function createCube(){
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
    }

    async function loadHelper() {  }

    async function loadControl() {  }

    async function initGUI() {  }

    // ###################################
    // ### Load & Register Scene #########

    // ! All updating and animating must be done Synchronously.
    // ! Async animating could lead to glitch in animation

    function update(){
        updateCamera();
        updateProjectionMatrix();

        scene.dispatchEvent({ type:'update', renderer, scene });
    }

    function getCamera(opts){
        opts = {
            type: 'default',
            ...opts,
        };
        const { type } = opts;

        return cameras.cam1;
    }

    function updateCamera(){
        const camera = getCamera({ type: 'all' });
        if(camera){
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        }
    }

    function updateProjectionMatrix(){  }

    function animate(){
        // TODO: put animation movement here.
        // TODO: change animation below
        cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

        scene.dispatchEvent({ type:'animate', renderer, scene });
    }

    function prerender(){
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.render( scene, getCamera({ type: 'default' }) );

        // If use EffectComposer instead.
        // composer.render();
    }

    // ###################################
    // ### Event Listener ################

    // TODO: it is better to put event listener in one place
    // TODO: use Scene as EventDispacther

    scene.addEventListener('ready', function(event){   });
    scene.addEventListener('start', function(event){   });
    scene.addEventListener('update', function(event){   });
    scene.addEventListener('animate', function(event){   });
    scene.addEventListener('stop', function(event){   });

    // ###################################
    // ### Core Function #################

    await loadLights();
    await loadCameras();
    await setupEffects();
    await registerObjects();
    await loadHelper();
    await loadControl();
    await initGUI();

    scene.dispatchEvent({ type:'ready', renderer, scene });
    start();

    function tick(t=0){
        frame++;
        _time = t;
        reassign();
        if(isRender) requestAnimationFrame(tick);

        update();
        animate();

        prerender();
    }

    function start(){
        isRender = true;
        clock.start();
        tick(_time);
        scene.dispatchEvent({ type:'start', renderer, scene });
    }

    function stop(){
        isRender = false;
        clock.stop();
        scene.dispatchEvent({ type:'stop', renderer, scene });
    }

    // ! Only assign changeable property.
    function reassign(){
        Object.assign(renderer, {
            meta: {
                isRender, frame, _time, getCamera
            }
        });
    }

    Object.assign(renderer, {
        scene, start, stop, state, composer, reassign,
        cameras, materials, textures, geometries,
        gltfModel, mixerModel, actionModel, cube,
    });

    return renderer;
}