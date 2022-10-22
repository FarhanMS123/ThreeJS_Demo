/**
 * This is a boilerplate for ThreeJS. This boilerplate
 * could be use as ESM Web or NodeJS Build.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
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

    //* It is better to put high scope variables on the top
    //* of corresponding function. Also for Lights, and any 
    //* object could be named by `object.name` so it could
    //* be find by `scene.getChildrenByName`.

    async function loadLights() {
        const light = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light
        scene.add( light );
    }

    const cameras = [];
    async function loadCameras() { 
        cameras.cam1 = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 0.1, 1000 );
        cameras.cam1.position.set(-2.3, 1.6, 2.5);
        cameras.cam1.rotation.set(-0.37, -0.8, -0.26);
    }

    let composer;
    async function setupEffects() {
        // ### Renderer ##
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setPixelRatio(window.devicePixelRatio);

        // ### Postprocessing ##
        // composer = new EffectComposer(renderer);
        // composer.addPass(new RenderPass(scene, camera));
        // composer.addPass(new EffectPass(camera, effects));
    }

    //! To prevent same material to be reinitialize and leading to 
    //! duplicated, the material could be stored in a collector.
    let materials = [];
    async function registerMaterials(){  }

    //! To prevent same texture to be reinitialize and leading to 
    //! duplicated, the texture could be stored in a collector.
    let textures = [];
    async function registerTextures() {  }
    
    let geometries = [];
    async function registerObjects() { 
        const gltfLoader = new GLTFLoader();

        await loadMascot({ gltfLoader });
    }

    // TODO: Load object and registering clip can be done in their own function.
    // TODO: rename `gltfModel` and others to desire model name, such as `gltfEarth`
    let gltfMascot, mixerMascot, actionMascot;
    async function loadMascot({ gltfLoader }) {
        // ### Load Object ##
        gltfMascot = await new Promise((res, rej) => gltfLoader.load("3d/halo.glb", res, undefined, rej));
        gltfMascot.scene.name = "model";
        scene.add( gltfMascot.scene );

        // ### Helper ##
        const helper = new THREE.BoxHelper( gltfMascot.scene, 0xff0000 );
        gltfMascot.scene.add( helper );

        // ### Register Clip ##
        const mesh = gltfMascot.scene.children[0];
        mixerMascot = new THREE.AnimationMixer( mesh );
        const clips = gltfMascot.animations;
        const clip = clips[0];
        actionMascot = mixerMascot.clipAction(clip);
        actionMascot.loop = THREE.LoopRepeat;
        actionMascot.play();
    }

    async function loadHelper() {
        const gridHelper = new THREE.GridHelper( 10, 10 );
        scene.add( gridHelper );
    }

    let trackball;
    async function loadControl() {
        const camera = getCamera({ type: 'current' });
        const canvas = renderer.domElement;
        trackball = new TrackballControls(camera, canvas);

        trackball.rotateSpeed = 1.0;
        trackball.zoomSpeed = 1.2;
        trackball.panSpeed = 0.8;

        trackball.keys = [ 'KeyA', 'KeyS', 'KeyD' ];
    }

    async function initGUI() {  }

    // ###################################
    // ### Load & Register Scene #########

    //! All updating and animating must be done Synchronously.
    //! Async animation could lead to glitch in animation

    function update(){
        updateCamera();
        updateProjectionMatrix();

        trackball.handleResize();
        trackball.update();

        scene.dispatchEvent({ type:'update', renderer, scene });
    }

    // type = default|current|all|ordered|random
    function getCamera({ type='current' }){
        return cameras.cam1;
    }

    function updateCamera(){
        const camera = getCamera({ type: 'all' });
        if(camera){
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        }
    }

    function updateProjectionMatrix() {  }

    function animate(){
        // TODO: put animation movement here.
        // TODO: change animation below
        if(typeof animateCone == 'function') animateCone();

        mixerMascot.update(clock.getDelta());

        scene.dispatchEvent({ type:'animate', renderer, scene });
    }

    function prerender(){
        // TODO: Comment if using EffectComposer
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.render( scene, getCamera({ type: 'default' }) );

        // TODO: Uncoment if using EffectComposer instead.
        // composer.render();
    }

    // ###################################
    // ### Event Listener ################

    // TODO: it is better to put event listener in one place.
    // TODO: use Scene as EventDispacther.

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
    await registerMaterials();
    await registerTextures();
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

    //! Only assign changeable property.
    function reassign(){
        Object.assign(renderer, {
            meta: {
                isRender, frame, _time, getCamera
            }
        });
    }

    //! Static property would always static so there is
    //! no need to reassign them.
    Object.assign(renderer, {
        scene, start, stop, state, composer, reassign,
        cameras, materials, textures, geometries,
        gltfMascot, mixerMascot, actionMascot
    });

    return renderer;
}