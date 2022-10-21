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

    const isRender = false;
    let frame = 0;
    let _time = 0;
    const state = {};

    const clock = new THREE.Clock(false);

    const renderer = new THREE.WebGLRenderer(opts);
    container.append(renderer.domElement);

    const scene = new THREE.Scene();

    await loadLights();
    await loadCameras();
    await setupEffects();
    await registerMaterials();
    await registerTexture();
    await loadObjects();
    await registerObjects();
    await registerClip();
    await loadHelper();
    await loadControl();
    await initGUI();

    scene.dispatchEvent({ type:'ready', renderer, scene });
    start();

    // ###################################
    // ### Load & Register Scene #########

    async function loadLights() {  }

    const cameras = [];
    async function loadCameras() { 
        const cam1 = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 0.1, 1000 );
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

    let materials = [];
    async function registerMaterials() {  }

    let textures = [];
    async function registerTexture() {  }

    let gltfModel;
    async function loadObjects() {
        const gltfLoader = new GLTFLoader();

        // TODO: rename `gltfModel` to desire model name, such as `gltfEarth`
        // gltfModel = await new Promise((res, rej) => gltfLoader.load("/to/glb/file.glb", res, undefined, rej));
        // gltfModel.scene.name = "model";
    }

    async function registerObjects() { 
        // scene.add( gltfModel.scene );

        const geometry = new THREE.BoxGeometry( 1, 1, 1, );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    }

    let mixerModel, actionModel;
    async function registerClip() { 
        // TODO: rename `mixerModel` and `actionModel` with your desire
        // TODO: model name, such as `mixerEarth`, `actionEarth`
        // const mesh = gltfModel.scene.children[0];
        // mixerModel = new THREE.AnimationMixer( mesh );
        // const clips = gltfModel.animations;
        // const clip = clips[0];
        // actionModel = mixer.clipAction(clip);
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

        scene.dispatchEvent({ type:'update', renderer, scene });
    }

    function getCamera(){
        return cameras[0];
    }

    function updateCamera(){
        const camera = getCamera();
        camera?.aspect = container.clientWidth / container.clientHeight;
        camera?.updateProjectionMatrix();
    }

    function animate(){
        // TODO: put animation movement here.

        scene.dispatchEvent({ type:'animate', renderer, scene });
    }

    function prerender(){
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.render( scene, camera );

        // * If use EffectComposer instead.
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
        cameras, materials, textures, 
        gltfModel, mixerModel, actionModel
    });

    return renderer;
}