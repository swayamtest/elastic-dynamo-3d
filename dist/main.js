import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js"
//Note that below we are importing Dat GUI and not THREE Dat GUI
import * as Dat from 'https://cdn.skypack.dev/dat.gui'
//import { Color } from 'three';

// Debug
const gui = new Dat.GUI();

// Loader
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('textures/torusextension.png')

// Canvas
const canvas = document.querySelector('#bg');

// Scene
const scene = new THREE.Scene();
/*const gridHelper = new THREE.GridHelper(32,32);
scene.add(gridHelper)
const fog = new THREE.Fog()
scene.fog.color = new THREE.Color(0xb388e7)*/

// Object/Geometry
const geometry = new THREE.TorusKnotGeometry( 7, 3, 100, 16 );

// Material
const torusKnot = new THREE.MeshStandardMaterial( {color: 0x000000, /*emissive: 0x292206,*/ roughness: 0.426, metalness: 0.642, fog: false, flatShading: false, wireframe: false, normalMap: normalTexture} )

// Mesh
const sphere = new THREE.Mesh(geometry,torusKnot)
scene.add(sphere)

//Mesh & Material GUI
const torusShape = gui.addFolder('Geometry')

torusShape.add(sphere.position, 'x').min(-10).max(10).step(0.01)
torusShape.add(sphere.position, 'y').min(-10).max(10).step(0.01)
torusShape.add(sphere.position, 'z').min(-10).max(10).step(0.01)

const torusColor = {
    color: 0x000000
}

torusShape.addColor(torusColor, 'color')
 .onChange(() => {
     torusKnot.color.set(torusColor.color)
 })

// Lights
const pointLight = new THREE.PointLight(0xeb392d)
/*pointLight.position.x = 1
pointLight.position.y = 3
pointLight.position.z = 15*/
pointLight.position.set(6, 3, 0.62)
pointLight.intensity = 1.7
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x0b71a1)
pointLight2.position.set(-6, -3, -0.37)
pointLight2.intensity = 1.7
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff)
pointLight3.position.set(10, 10, 10)
pointLight3.intensity = 1.7
scene.add(pointLight3);

const ambientLight = new THREE.AmbientLight(0xeeeeee, 1); // soft white light
scene.add(ambientLight);

//Lights GUI
const lightWarm = gui.addFolder('Light/Warm')

lightWarm.add(pointLight.position, 'x').min(-6).max(6).step(0.01)
lightWarm.add(pointLight.position, 'y').min(-5).max(5).step(0.01)
lightWarm.add(pointLight.position, 'z').min(-5).max(5).step(0.01)
lightWarm.add(pointLight, 'intensity').min(0).max(10).step(0.01)

const lightCool = gui.addFolder('Light/Cool')

lightCool.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
lightCool.add(pointLight2.position, 'y').min(-5).max(5).step(0.01)
lightCool.add(pointLight2.position, 'z').min(-5).max(5).step(0.01)
lightCool.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

//Light Helpers
const lightHelper = new THREE.PointLightHelper(pointLight, 0.5)
scene.add(lightHelper)

const lightHelper2 = new THREE.PointLightHelper(pointLight2, 0.5)
scene.add(lightHelper2)

const lightHelper3 = new THREE.PointLightHelper(pointLight3, 0.5)
scene.add(lightHelper3)

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 30
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer( {canvas: canvas, alpha: true} )
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove (event) {
    mouseX = (event.clientX - windowX)
    mouseY= (event.clientY - windowY)
}

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * .003
    targetY = mouseY * .003

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 1 * elapsedTime
    sphere.rotation.z = .5 * elapsedTime
    //sphere.rotation.x = 0 * elapsedTime

    sphere.rotation.x += .3 * (targetY - sphere.rotation.x)
    sphere.rotation.y += .3 * (targetX - sphere.rotation.y)
    sphere.position.z += 3 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
