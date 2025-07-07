import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, skybox;
let star_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune

//Sun to planet radius - Approximate
let mercury_orbit_radius = 39
let venus_orbit_radius = 72
let earth_orbit_radius = 100
let mars_orbit_radius = 152
let jupiter_orbit_radius = 320
let saturn_orbit_radius = 454
let uranus_orbit_radius = 622
let neptune_orbit_radius = 806

//Relative revolution speeds around the Sun - Approximate
let mercury_revolution_speed = 0.2
let venus_revolution_speed = 0.15
let earth_revolution_speed = 0.1
let mars_revolution_speed = 0.08
let jupiter_revolution_speed = 0.07
let saturn_revolution_speed = 0.06
let uranus_revolution_speed = 0.05
let neptune_revolution_speed = 0.04

//Skybox creation
function createMatrixArray(){
    const skyboxImagePaths = ['../img/skybox/space_ft.png', '../img/skybox/space_bk.png', '../img/skybox/space_up.png', '../img/skybox/space_dn.png', '../img/skybox/space_rt.png', '../img/skybox/space_lf.png']
    const materialArray = skyboxImagePaths.map((image)=>{
        let texture = new THREE.TextureLoader().load(image)
        return new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide})
    })
    return materialArray
}

function setSkyBox(){
    const materialArray = createMatrixArray()
    let skyboxGeo = new THREE.BoxGeometry(5000, 5000, 5000);
    skybox = new THREE.Mesh(skyboxGeo, materialArray)
    scene.add(skybox)
}

function createRing(outerRadius){
    let innerRadius = outerRadius - 0.1
    let thetaSegment = 100
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegment);
    const material = new THREE.MeshBasicMaterial({ color: "grey", side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.rotation.x = Math.PI/2
    return mesh;
}

function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType){
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const loader = new THREE.TextureLoader();
    const planetTexture = loader.load(texture);
    const material = meshType == 'standard'? new THREE.MeshStandardMaterial({ map: planetTexture}): new THREE.MeshBasicMaterial({ map: planetTexture})
    const planet = new THREE.Mesh(geometry, material)
    return planet;
}


function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        85,
        window.innerWidth /window.innerHeight,
        0.1,
        5000
    )

    setSkyBox()

    star_sun = loadPlanetTexture("../img/sun_hd.jpg", 20, 100, 100, 'basic')
    planet_earth = loadPlanetTexture("../img/earth_hd.jpg", 4, 100, 100, 'standard')
    planet_mercury = loadPlanetTexture("../img/mercury_hd.jpg", 2, 100, 100, 'standard')
    planet_venus = loadPlanetTexture("../img/venus_hd.jpg", 3, 100, 100, 'standard')
    planet_mars = loadPlanetTexture("../img/mars_hd.jpg", 3.5, 100, 100, 'standard')
    planet_jupiter = loadPlanetTexture("../img/jupiter_hd.jpg", 10, 100, 100, 'standard')
    planet_saturn = loadPlanetTexture("../img/saturn_hd.jpg", 8, 100, 100, 'standard')
    planet_uranus = loadPlanetTexture("../img/uranus_hd.jpg", 6, 100, 100, 'standard')
    planet_neptune = loadPlanetTexture("../img/neptune_hd.jpg", 5, 100, 100, 'standard')
    
    
    scene.add(star_sun);
    scene.add(planet_mercury);
    scene.add(planet_venus);
    scene.add(planet_earth);
    scene.add(planet_mars);
    scene.add(planet_jupiter);
    scene.add(planet_saturn);
    scene.add(planet_uranus);
    scene.add(planet_neptune);

    const sunLight = new THREE.PointLight(0xffffff, 1, 0);
    sunLight.position.copy(star_sun.position);
    scene.add(sunLight);

    createRing(mercury_orbit_radius)
    createRing(venus_orbit_radius)
    createRing(earth_orbit_radius)
    createRing(mars_orbit_radius)
    createRing(jupiter_orbit_radius)
    createRing(saturn_orbit_radius)
    createRing(uranus_orbit_radius)
    createRing(neptune_orbit_radius)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.id = "c";

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 12;
    controls.maxDistance = 1000;
    camera.position.z=100;

    planet_earth.position.x = star_sun.position.x + earth_orbit_radius
    
}

function planetRevolver(time, speed, planet, orbitRadius, planetName){
    let orbitSpeedMultiplier = 0.001
    const planetAngle = time * orbitSpeedMultiplier * speed;
    planet.position.x = star_sun.position.x + orbitRadius * Math.cos(planetAngle)
    planet.position.z = star_sun.position.z + orbitRadius * Math.sin(planetAngle)
}

function animate(time){

    const rotationSpeed = 0.005;
    star_sun.rotation.y += rotationSpeed
    planet_mercury.rotation.y += rotationSpeed
    planet_venus.rotation.y -= rotationSpeed
    planet_earth.rotation.y += rotationSpeed
    planet_mars.rotation.y += rotationSpeed
    planet_jupiter.rotation.y += rotationSpeed
    planet_saturn.rotation.y += rotationSpeed
    planet_uranus.rotation.y -= rotationSpeed
    planet_neptune.rotation.y += rotationSpeed
    
    // Revolution
    // const orbitSpeedMultiplier = 0.001;
    // const earthOrbitAngle = time * orbitSpeedMultiplier;
    // planet_earth.position.x = star_sun.position.x + earth_orbit_radius * Math.cos(earthOrbitAngle)
    // planet_earth.position.z = star_sun.position.z + earth_orbit_radius * Math.sin(earthOrbitAngle)

    planetRevolver(time, mercury_revolution_speed, planet_mercury, mercury_orbit_radius, 'mercury')
    planetRevolver(time, venus_revolution_speed, planet_venus, venus_orbit_radius, 'venus')
    planetRevolver(time, earth_revolution_speed, planet_earth, earth_orbit_radius, 'earth')
    planetRevolver(time, mars_revolution_speed, planet_mars, mars_orbit_radius, 'mars')
    planetRevolver(time, jupiter_revolution_speed, planet_jupiter, jupiter_orbit_radius, 'jupiter')
    planetRevolver(time, saturn_revolution_speed, planet_saturn, saturn_orbit_radius, 'saturn')
    planetRevolver(time, uranus_revolution_speed, planet_uranus, uranus_orbit_radius, 'uranus')
    planetRevolver(time, neptune_revolution_speed, planet_neptune, neptune_orbit_radius, 'neptune')

    controls.update();
    requestAnimationFrame(animate)
    renderer.render(scene, camera);

}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('mercury-slider').addEventListener('input', (e) => {
        mercury_revolution_speed = parseFloat(e.target.value);
    });

    document.getElementById('venus-slider').addEventListener('input', (e) => {
        venus_revolution_speed = parseFloat(e.target.value);
    });

    document.getElementById('earth-slider').addEventListener('input', (e) => {
        earth_revolution_speed = parseFloat(e.target.value);
    });

    document.getElementById('mars-slider').addEventListener('input', (e) => {
        mars_revolution_speed = parseFloat(e.target.value);
    });

    document.getElementById('jupiter-slider').addEventListener('input', (e) => {
        jupiter_revolution_speed = parseFloat(e.target.value);
    });

    document.getElementById('saturn-slider').addEventListener('input', (e) => {
        saturn_revolution_speed = parseFloat(e.target.value);
    });

    document.getElementById('uranus-slider').addEventListener('input', (e) => {
        uranus_revolution_speed = parseFloat(e.target.value);
    });

    document.getElementById('neptune-slider').addEventListener('input', (e) => {
        neptune_revolution_speed = parseFloat(e.target.value);
    });
});


init()
animate(0)