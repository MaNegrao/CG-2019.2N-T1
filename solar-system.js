var pointLight, saturnRing, controls, scene, camera, renderer, scene;
var sun, mercury, venus, earth, earthMoon, mars, ceres, jupiter, saturn, uranus, neptune, pluto;
var mercuryOrbit, venusOrbit, earthOrbit, marsOrbit, ceresOrbit, jupiterOrbit, saturnOrbit, uranusOrbit, neptuneOrbit, plutoOrbit;
var planetSegments = 80;


var sunData = constructPlanetData(1, 0.001, 0, "sun", "img/sun.png", 50, planetSegments);
var mercuryData = constructPlanetData(88, 0.01, 70.9, "mercury", "img/mercury.jpg", 3, planetSegments);
var venusData = constructPlanetData(224, 0.01, 108, "venus", "img/venus.jpg", 4.5, planetSegments);
var earthData = constructPlanetData(365, 0.01, 149, "earth", "img/earth.jpg", 5, planetSegments);
var earthMoonData = constructPlanetData(7, 0.007, 7, "earthMoon", "img/earthMoon.jpg", 0.8, planetSegments);
var marsData = constructPlanetData(686, 0.02, 227, "mars", "img/mars.jpg", 3.5, planetSegments);
var ceresData =  constructPlanetData(740, 0.01, 280, "ceres", "img/ceres.jpg", 0.5, planetSegments);
var jupiterData = constructPlanetData(800, 0.02, 378, "jupiter", "img/jupiter.gif", 20, planetSegments);
var saturnData = constructPlanetData(950, 0.02, 510, "saturn", "img/saturn.gif", 15, planetSegments);
var uranusData = constructPlanetData(1100, 0.03, 600, "uranus", "img/uranus.jpg", 10, planetSegments);
var neptuneData = constructPlanetData(1200, 0.03, 680, "neptune", "img/neptune.jpg", 9, planetSegments);
var plutoData = constructPlanetData(1300, 0.01, 850, "pluto", "img/pluto.gif", 2, planetSegments);

var orbitData = {value: 200, runOrbit: true, runRotation: true};
var clock = new THREE.Clock();


function constructPlanetData(myOrbitRate, myRotationRate, myDistanceFromAxis, myName, myTexture, mySize, mySegments) {
    return {
        orbitRate: myOrbitRate
        , rotationRate: myRotationRate
        , distanceFromAxis: myDistanceFromAxis
        , name: myName
        , texture: myTexture
        , size: mySize
        , segments: mySegments
    };
}

function getTube(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ringGeometry = new THREE.TorusGeometry(size, innerDiameter, facets, facets);
    var ringMaterial = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    myRing = new THREE.Mesh(ringGeometry, ringMaterial);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

function getRing(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    var ring1Material = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}


function getMaterial(type, color, myTexture) {
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        map: myTexture === undefined ? null : myTexture
    };

    switch (type) {
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
}

function createVisibleOrbits() {
    var orbitWidth = 0.2;
    mercuryOrbit = getRing(mercuryData.distanceFromAxis + orbitWidth
        , mercuryData.distanceFromAxis - orbitWidth
        , 88
        , 0xffffff
        , "marsOrbit"
        , 0);
        
    venusOrbit = getRing(venusData.distanceFromAxis + orbitWidth
        , venusData.distanceFromAxis - orbitWidth
        , 227
        , 0xffffff
        , "marsOrbit"
        , 0);
    
    earthOrbit = getRing(earthData.distanceFromAxis + orbitWidth
        , earthData.distanceFromAxis - orbitWidth
        , 365
        , 0xffffff
        , "earthOrbit"
        , 0);
    
    marsOrbit = getRing(marsData.distanceFromAxis + orbitWidth
        , marsData.distanceFromAxis - orbitWidth
        , 686
        , 0xffffff
        , "marsOrbit"
        , 0);

    ceresOrbit = getRing(ceresData.distanceFromAxis + orbitWidth
        , ceresData.distanceFromAxis - orbitWidth
        , 740
        , 0xffffff
        , "ceresOrbit"
        , 0);

    jupiterOrbit = getRing(jupiterData.distanceFromAxis + orbitWidth
        , jupiterData.distanceFromAxis - orbitWidth
        , 800
        , 0xffffff
        , "jupiterOrbit"
        , 0);

    saturnOrbit = getRing(saturnData.distanceFromAxis + orbitWidth
        , saturnData.distanceFromAxis - orbitWidth
        , 950
        , 0xffffff
        , "saturnOrbit"
        , 0);

    uranusOrbit = getRing(uranusData.distanceFromAxis + orbitWidth
        , uranusData.distanceFromAxis - orbitWidth
        , 1100
        , 0xffffff
        , "uranusOrbit"
        , 0);

    neptuneOrbit = getRing(neptuneData.distanceFromAxis + orbitWidth
        , neptuneData.distanceFromAxis - orbitWidth
        , 1200
        , 0xffffff
        , "neptuneOrbit"
        , 0);

    plutoOrbit = getRing(plutoData.distanceFromAxis + orbitWidth
        , plutoData.distanceFromAxis - orbitWidth
        , 1300
        , 0xffffff
        , "plutoOrbit"
        , 0);

}
function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

function loadTexturedPlanet(myData, x, y, z, myMaterialType) {
    var myMaterial;
    var passThisTexture;

    if (myData.texture && myData.texture !== "") {
        passThisTexture = new THREE.ImageUtils.loadTexture(myData.texture);
    }
    if (myMaterialType) {
        myMaterial = getMaterial(myMaterialType, "rgb(255, 255, 255 )", passThisTexture);
    } else {
        myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    var myPlanet = getSphere(myMaterial, myData.size, myData.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = myData.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
}

function getPointLight(intensity, color) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

function movePlanet(myPlanet, myData, myTime, stopRotation) {
    if (orbitData.runRotation && !stopRotation) {
        myPlanet.rotation.y += myData.rotationRate;
    }
    if (orbitData.runOrbit) {
        myPlanet.position.x = Math.cos(myTime 
                * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) 
                * myData.distanceFromAxis;
        myPlanet.position.z = Math.sin(myTime 
                * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) 
                * myData.distanceFromAxis;
    }
}

function moveMoon(myMoon, myPlanet, myData, myTime) {
    movePlanet(myMoon, myData, myTime);
    if (orbitData.runOrbit) {
        myMoon.position.x = myMoon.position.x + myPlanet.position.x;
        myMoon.position.z = myMoon.position.z + myPlanet.position.z;
    }
}

function update(renderer, scene, camera, controls) {
    pointLight.position.copy(sun.position);
    controls.update();

    var time = Date.now();

    movePlanet(sun, sunData, time);
    movePlanet(mercury, mercuryData, time);
    movePlanet(venus, venusData, time);
    movePlanet(earth, earthData, time);
    moveMoon(earthMoon, earth, earthMoonData, time);
    movePlanet(mars, marsData, time);
    movePlanet(ceres, ceresData, time);
    movePlanet(jupiter, jupiterData, time);
    movePlanet(saturn, saturnData, time);
    movePlanet(saturnRing, saturnData, time, true);
    movePlanet(uranus, uranusData, time);
    movePlanet(neptune, neptuneData, time);
    movePlanet(pluto, plutoData, time);

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}


function init() {
    // Create the camera that allows us to view into the scene.
    camera = new THREE.PerspectiveCamera(
            45, // field of view
            window.innerWidth / window.innerHeight, // aspect ratio
            1, // near clipping plane
            10000 // far clipping plane
            );
    camera.position.z = 1200;
    camera.position.x = -30;
    camera.position.y = 150;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create the scene that holds all of the visible objects.
    scene = new THREE.Scene();

    // Create the renderer that controls animation.
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach the renderer to the div element.
    document.getElementById('webgl').appendChild(renderer.domElement);

    // Create controls that allows a user to move the scene with a mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var urls = [
        'img/Starscape.png',
        'img/Starscape.png',
        'img/Starscape.png',
        'img/Starscape.png',
        'img/Starscape.png',
        'img/Starscape.png',
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;
    scene.background = reflectionCube;

    // Create light from the sun.
    pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    // Create light that is viewable from all directions.
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    sun = loadTexturedPlanet(sunData, sunData.distanceFromAxis, 0, 0);
    mercury = loadTexturedPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
    venus = loadTexturedPlanet(venusData, venusData.distanceFromAxis, 0, 0);    
    earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    earthMoon = loadTexturedPlanet(earthMoonData, earthMoonData.distanceFromAxis, 0, 0);
    mars = loadTexturedPlanet(marsData, marsData.distanceFromAxis, 0, 0);
    ceres = loadTexturedPlanet(ceresData, ceresData.distanceFromAxis, 0, 0);
    jupiter = loadTexturedPlanet(jupiterData, jupiterData.distanceFromAxis, 0, 0);
    saturn = loadTexturedPlanet(saturnData, saturnData.distanceFromAxis, 0, 0);
    saturnRing = getRing(24, 20, 23, 0xf2e1b3, "saturnRing", saturnData.distanceFromAxis);
    uranus = loadTexturedPlanet(uranusData, uranusData.distanceFromAxis, 0, 0);
    neptune = loadTexturedPlanet(neptuneData, neptuneData.distanceFromAxis, 0, 0);
    pluto = loadTexturedPlanet(plutoData, plutoData.distanceFromAxis, 0, 0);

    createVisibleOrbits();

    // Create the GUI that displays controls.
    var gui = new dat.GUI();
    var folder1 = gui.addFolder('light');
    folder1.add(pointLight, 'intensity', 0, 10);
    var folder2 = gui.addFolder('speed');
    folder2.add(orbitData, 'value', 0, 500);
    folder2.add(orbitData, 'runOrbit', 0, 1);
    folder2.add(orbitData, 'runRotation', 0, 1);

    // Start the animation.
    update(renderer, scene, camera, controls);
}

// Start everything.
init();
