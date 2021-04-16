var container, stats, controls;
var camera, scene, scene2, renderer, light;
var clock = new THREE.Clock();
var mixer, action;
var mixers = [],
    actions = []; //所有的动画数组
var chedao;
var label3DRenderer = null;
var composer, effectFXAA, outlinePass;
var raycaster = new THREE.Raycaster(); //射线
var mouse = new THREE.Vector2();
var a = 0;
init();
animate();

function update() {
    document.dispatchEvent(updateEvent);
}

function init() {

    container = document.createElement('div');
    container.id = "moudle3D"
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(-2500, 100, 300);
    scene = new THREE.Scene();
    scene2 = new THREE.Scene();
    scene.background = new THREE.Color(0xFDF5E6);
    // scene.fog = new THREE.Fog(0xa0a0a0, 400, 1000);
    light = new THREE.HemisphereLight(0xfF5F5F5, 0x444444);
    light.position.set(0, 1000, 0);
    scene.add(light);
    light = new THREE.DirectionalLight(0xFAFAD2);
    light.position.set(0, 1000, 100);
    scene.add(light);

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 8000), new THREE.MeshBasicMaterial({
        color: 0xF5F5F5,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
    var grid = new THREE.GridHelper(20000, 80, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);


    //可操作车刀
    var loader = new THREE.FBXLoader();
    loader.load('models/num01车刀.FBX', function(object) {
        object.position.set(-6000, 120, -500);
        object.scale.set(1, 1, 1);
        object.name = "操作车刀模型";
        scene.add(object);
        var objectclone = object.clone();
        objectclone.name = "展示车刀模型";
        objectclone.position.set(-2400, 70, -50);
        scene.add(objectclone);
    });

    var loader = new THREE.FBXLoader();
    loader.load('models/num02车刀.FBX', function(object) {
        object.position.set(-6000, 120, -500);
        object.scale.set(1, 1, 1);
        object.name = "操作车刀模型2";
        scene.add(object);
    });
    var loader = new THREE.FBXLoader();
    loader.load('models/num03车刀.FBX', function(object) {
        object.position.set(-6000, 120, -500);
        object.scale.set(1, 1, 1);
        object.name = "操作车刀模型3";
        scene.add(object);
    });

    //可操作量角器
    loader.load('models/可操作量角器.FBX', function(object) {
        object.position.set(-6150, 120, -500);
        object.scale.set(1, 1, 1);
        object.name = "操作量角器";
        scene.add(object);
    });


    //演示量角器
    loader.load('models/liangjiaqi(标准3).FBX', function(object) {
        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                // child.receiveShadow = true;
            }
        });
        object.name = "量角器模型";
        object.position.set(-2600, 100, 0);
        object.rotateX(Math.PI / 2);
        scene.add(object);
        var objectclone = object.clone();
        objectclone.rotation.x -= Math.PI / 6;
        objectclone.scale.set(0.9, 0.9, 0.9);
        objectclone.position.set(3650, 20, -50);
        scene.add(objectclone);
    });

    //演示车刀
    loader.load('models/chedaoIntro3.FBX', function(object) {
        object.name = "车刀介绍";
        object.position.set(-280, 50, 50);
        scene.add(object);
    });

    //坐标系介绍
    loader.load('models/chedaoIntro4.FBX', function(object) {
        object.name = "车刀介绍";
        object.position.set(200, 30, 0);
        scene.add(object);
    });

    // 刃倾角
    loader.load('models/renqinjiao04.FBX', function(object) {
        object.name = "刃倾角";
        object.position.set(3100, 30, 0);
        scene.add(object);
    });
    loader.load('models/renqinjiao05.FBX', function(object) {
        object.name = "刃倾角";
        object.position.set(3150, 30, 0);
        scene.add(object);
    });
    loader.load('models/renqinjiao06.FBX', function(object) {
        object.name = "刃倾角";
        object.position.set(3200, 30, 0);
        scene.add(object);
    });



    loader.load('models/前角动画.FBX', function(object) {
        object.rotateX(Math.PI / 2);
        object.position.set(4700, 10, 0);
        mixer = new THREE.AnimationMixer(object);
        action = mixer.clipAction(object.animations[0]);
        mixers[0] = new THREE.AnimationMixer(object);
        actions[0] = mixers[0].clipAction(object.animations[0]);
        scene.add(object);
    });

    loader.load('models/刃倾角动画.FBX', function(object) {
        object.rotateX(Math.PI / 2);
        object.position.set(5500, 10, 0);
        mixers[1] = new THREE.AnimationMixer(object);
        actions[1] = mixers[1].clipAction(object.animations[0]);
        scene.add(object);
    });

    loader.load('models/主偏角动画.FBX', function(object) {
        object.rotateX(Math.PI / 2);
        object.position.set(6300, 10, 0);
        mixers[2] = new THREE.AnimationMixer(object);
        actions[2] = mixers[2].clipAction(object.animations[0]);
        scene.add(object);
    });

    loader.load('models/副偏角动画.FBX', function(object) {
        object.rotateX(Math.PI / 2);
        object.position.set(7100, 10, 0);
        mixers[3] = new THREE.AnimationMixer(object);
        actions[3] = mixers[3].clipAction(object.animations[0]);
        scene.add(object);
    });

    loader.load('models/后角动画.FBX', function(object) {
        object.rotateX(Math.PI / 2);
        object.position.set(7900, 10, 0);
        mixers[4] = new THREE.AnimationMixer(object);
        actions[4] = mixers[4].clipAction(object.animations[0]);
        scene.add(object);
    });

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    label3DRenderer = new THREE.CSS3DRenderer();
    label3DRenderer.setSize(window.innerWidth, window.innerHeight);
    label3DRenderer.domElement.style.position = 'absolute';
    label3DRenderer.domElement.style.top = 0;
    label3DRenderer.domElement.style.zIndex = 4;
    document.body.appendChild(label3DRenderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    // window.addEventListener('click', onMouseMove, false);

    stats = new Stats();
    document.body.appendChild(stats.dom);


    //车刀
    showDetails(new THREE.Vector3(-276, 57, 50), new THREE.Vector3(-250, 80, 30), "夹持部分", "夹持部分", 0.4);
    showDetails(new THREE.Vector3(-304, 46, 83), new THREE.Vector3(-320, 70, 50), "切削部分", "切削部分", 0.4);
    showDetails(new THREE.Vector3(-303, 46, 87), new THREE.Vector3(-270, 55, 80), "前刀面", "前刀面", 0.4);
    showDetails(new THREE.Vector3(-313, 40, 87), new THREE.Vector3(-340, 20, 100), "副后刀面", "副后刀面", 0.4);
    showDetails(new THREE.Vector3(-302, 40, 90), new THREE.Vector3(-270, 22, 100), "主后刀面", "主后刀面", 0.4);
    showDetails(new THREE.Vector3(-305, 45.5, 91.5), new THREE.Vector3(-265, 46, 90), "主切削刃", "主切削刃", 0.4);
    showDetails(new THREE.Vector3(-313, 45.5, 89.5), new THREE.Vector3(-340, 46, 90), "副切削刃", "副切削刃", 0.4);
    showDetails(new THREE.Vector3(-311, 45, 92.5), new THREE.Vector3(-300, 10, 110), "刀尖", "刀尖", 0.4);

    //坐标系
    showDetails(new THREE.Vector3(196, 39, -30), new THREE.Vector3(165, 60, -40), "工件", "工件", 0.4);
    showDetails(new THREE.Vector3(209, 19, 57), new THREE.Vector3(175, 0, 70), "外圆车刀", "外圆车刀", 0.4);
    showDetails(new THREE.Vector3(228, 14, 62), new THREE.Vector3(210, 0, 80), "底平面", "底平面", 0.4);
    showDetails(new THREE.Vector3(244, 25, 48), new THREE.Vector3(270, 5, 40), "基面", "基面P<sub>r</sub>", 0.4);
    showDetails(new THREE.Vector3(253, 18, 12), new THREE.Vector3(285, 30, 0), "主剖面", "主剖面P<sub>0</sub>", 0.4);
    showDetails(new THREE.Vector3(201, 18, -8), new THREE.Vector3(165, 10, -10), "切削平面", "切削平面P<sub>s</sub>", 0.4);
    add3DLabel("正刃倾角", "+&#955;<sub>s</sub>", new THREE.Vector3(3094, 37.5, 12.8), 0.4);
    add3DLabel("负刃倾角", "-&#955;<sub>s</sub>", new THREE.Vector3(3143, 37.5, 12.8), 0.4);
    add3DLabel("零刃倾角", "&#955;<sub>s</sub>=0", new THREE.Vector3(3195, 37.5, 12.8), 0.4);


    add3dPPT1("PPT1", new THREE.Vector3(-1000, 20, 0), 0.8);
    add3dPPT2("PPT2", new THREE.Vector3(-500, 20, 0), 0.8);
    add3dPPT3("PPT3", new THREE.Vector3(0, 20, 0), 0.8);
    add3dPPT5("PPT5", new THREE.Vector3(1000, 20, 0), 0.8);
    add3dPPT6("PPT6", new THREE.Vector3(1500, 20, 0), 0.8);
    add3dPPT7("PPT7", new THREE.Vector3(2000, 20, 0), 0.8);
    add3dPPT8("PPT8", new THREE.Vector3(2500, 20, 0), 0.8);
    add3dPPT9("PPT9", new THREE.Vector3(2930, 20, 0), 0.8);
    add3dPPT10("PPT10", new THREE.Vector3(3430, 20, 0), 0.8);
    add3dPPT11("PPT11", new THREE.Vector3(4000, 20, 0), 0.8);
    add3dPPT12("PPT12", new THREE.Vector3(4500, 20, 0), 0.8);
    add3dPPT13("PPT13", new THREE.Vector3(5300, 20, 0), 0.8);
    add3dPPT14("PPT14", new THREE.Vector3(6100, 20, 0), 0.8);
    add3dPPT15("PPT15", new THREE.Vector3(6900, 20, 0), 0.8);
    add3dPPT16("PPT16", new THREE.Vector3(7700, 20, 0), 0.8);
    add3dPPT17("PPT17", new THREE.Vector3(8500, 20, 0), 0.8);
    add3dPPT18("PPT18", new THREE.Vector3(9300, 20, 0), 0.8);




    addDrag();
    controls = new THREE.OrbitControls(camera, label3DRenderer.domElement);
    controls.target.set(-2500, 100, 0);
    controls.update();




    setTimeout(() => {
        var controls2 = new function() {
            this.rotationSpeed = 0.02;
            this.numberOfObjects = 0;
            this.rotation = scene.getObjectByName("尺体", true).rotation.x;
            this.rotationX = scene.getObjectByName("操作车刀", true).rotation.x;
            this.rotationY = scene.getObjectByName("操作车刀", true).rotation.y;
            this.rotationZ = scene.getObjectByName("操作车刀", true).rotation.z;
            this.positionX = scene.getObjectByName("尺体横移", true).position.x;
            this.positionY = scene.getObjectByName("尺体竖移", true).position.y;
            this.rotationZ2 = scene.getObjectByName("尺体测量", true).rotation.z;
        };

        //创建dat.GUI，传递并设置属性
        var gui = new dat.GUI();

        var api = {
            '型号选择': 0,
        };
        scene.getObjectByName("操作车刀", true).visible = true;
        scene.getObjectByName("操作车刀2", true).visible = false;
        scene.getObjectByName("操作车刀3", true).visible = false;
        var folder = gui.addFolder('外圆车刀型号');
        folder.add(api, '型号选择', {
            '1号车刀': 0,
            '2号车刀': 1,
            '3号车刀': 2
        }).onChange(function() {
            switch (parseInt(api.型号选择)) {
                case 0:
                    scene.getObjectByName("操作车刀", true).rotation.set(0, 0, 0);
                    scene.getObjectByName("操作车刀", true).visible = true;
                    scene.getObjectByName("操作车刀2", true).visible = false;
                    scene.getObjectByName("操作车刀3", true).visible = false;
                    controllerX.onChange(function(value) {
                        scene.getObjectByName("操作车刀", true).rotation.x = value * Math.PI / 180;
                    });
                    controllerY.onChange(function(value) {
                        scene.getObjectByName("操作车刀", true).rotation.y = value * Math.PI / 180;
                    });
                    controllerZ.onChange(function(value) {
                        scene.getObjectByName("操作车刀", true).rotation.z = value * Math.PI / 180;
                    });
                    break;
                case 1:
                    scene.getObjectByName("操作车刀2", true).rotation.set(0, 0, 0);
                    scene.getObjectByName("操作车刀", true).visible = false;
                    scene.getObjectByName("操作车刀2", true).visible = true;
                    scene.getObjectByName("操作车刀3", true).visible = false;
                    controllerX.onChange(function(value) {
                        scene.getObjectByName("操作车刀2", true).rotation.x = value * Math.PI / 180;
                    });
                    controllerY.onChange(function(value) {
                        scene.getObjectByName("操作车刀2", true).rotation.y = value * Math.PI / 180;
                    });
                    controllerZ.onChange(function(value) {
                        scene.getObjectByName("操作车刀3", true).rotation.z = value * Math.PI / 180;
                    });
                    break;
                case 2:
                    scene.getObjectByName("操作车刀3", true).rotation.set(0, 0, 0);
                    scene.getObjectByName("操作车刀", true).visible = false;
                    scene.getObjectByName("操作车刀2", true).visible = false;
                    scene.getObjectByName("操作车刀3", true).visible = true;
                    controllerX.onChange(function(value) {
                        scene.getObjectByName("操作车刀3", true).rotation.x = value * Math.PI / 180;
                    });
                    controllerY.onChange(function(value) {
                        scene.getObjectByName("操作车刀3", true).rotation.y = value * Math.PI / 180;
                    });
                    controllerZ.onChange(function(value) {
                        scene.getObjectByName("操作车刀3", true).rotation.z = value * Math.PI / 180;
                    });
                    break;
                default:
                    break;
            }
        });
        folder.open();

        var controllerX = gui.add(controls2, 'rotationX', -180, 180).name("车刀旋转X");
        var controllerY = gui.add(controls2, 'rotationY', -180, 180).name("车刀旋转Y");
        var controllerZ = gui.add(controls2, 'rotationZ', -180, 180).name("车刀旋转Z");
        var controllerX2 = gui.add(controls2, 'positionX', -20, 90).name("尺体横移X");
        var controllerY2 = gui.add(controls2, 'positionY', -135, -55).name("尺体竖移Y");
        var controllerZ2 = gui.add(controls2, 'rotationZ2', -40, 50).name("基尺旋转");


        controllerX.onChange(function(value) {
            scene.getObjectByName("操作车刀", true).rotation.x = value * Math.PI / 180;
        });
        controllerY.onChange(function(value) {
            scene.getObjectByName("操作车刀", true).rotation.y = value * Math.PI / 180;
        });
        controllerZ.onChange(function(value) {
            scene.getObjectByName("操作车刀", true).rotation.z = value * Math.PI / 180;
        });
        controllerX2.onChange(function(value) {
            scene.getObjectByName("尺体横移", true).position.x = value;
        });
        controllerY2.onChange(function(value) {
            scene.getObjectByName("尺体竖移", true).position.y = value;
        });
        controllerZ2.onChange(function(value) {
            scene.getObjectByName("尺体测量", true).rotation.z = value * Math.PI / 180;
        });

        var s = document.getElementsByClassName('dg ac');
        s[0].style.visibility = "hidden";
    }, 5000);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    label3DRenderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

}

//
function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    a++;
    if (mixer) mixer.update(delta);
    if (mixers.length) {
        for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(delta);
        }
    }
    renderer.render(scene, camera);
    label3DRenderer.render(scene2, camera);
    stats.update();
    update();

    //三轴联动
    if (scene.getObjectByName("尺体", true)) {
        scene.getObjectByName("尺体", true).rotation.z = -Math.PI / 6 * Math.cos(2 * a * Math.PI / 180) + Math.PI / 4 - Math.PI / 6;
        scene.getObjectByName("制动头", true).position.y += 0.3 * Math.cos(2 * a * Math.PI / 180);
        scene.getObjectByName("卡块1", true).position.x = 20 * Math.cos(2 * a * Math.PI / 180) + 30;
    }

}




function addDrag() {
    var transformControls = new THREE.TransformControls(camera, label3DRenderer.domElement);
    // transformControls.setMode('rotate') //可以设置“旋转”，“缩放”模式，默认是translate;
    // scene.add(transformControls);
    setTimeout(() => {
        var objects = [];
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name == "操作车刀模型" || scene.children[i].name == "操作车刀模型2" || scene.children[i].name == "操作车刀模型3") {
                objects.push(scene.children[i].children[0]);
            }
        }
        var dragControls = new THREE.DragControls(objects, camera, label3DRenderer.domElement);

        dragControls.addEventListener('hoveron', function(event) {
            // 让变换控件对象和选中的对象绑定
            transformControls.attach(event.object);
        });

        dragControls.addEventListener('dragstart', function(event) {
            controls.enabled = false;
        });
        dragControls.addEventListener('dragend', function(event) {
            controls.enabled = true;
        });
    }, 2000);
}



function render3DLabel() {
    label3DRenderer = new THREE.CSS3DRenderer();
    label3DRenderer.setSize(window.innerWidth, window.innerHeight);
    label3DRenderer.domElement.style.position = 'absolute';
    label3DRenderer.domElement.style.top = 0;
    label3DRenderer.domElement.style.zIndex = 4;
    document.body.appendChild(label3DRenderer.domElement);
    document.addEventListener("update", function() {
        label3DRenderer.render(scene2, camera);
    });
}

function add3DLabel(ID, content, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = content;
    customDiv.style.marginTop = '-1em';
    customDiv.style = " height:25px; text-align:center;background-color:rgba(0,255,255,0);";
    customDiv.style.color = 'rgb(0,0,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    customLabel.rotateX(-Math.PI / 2);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    scene2.add(customLabel);
    document.addEventListener("update", function() {
        customLabel.rotation.x = camera.rotation.x;
        customLabel.rotation.y = camera.rotation.y;
        customLabel.rotation.z = camera.rotation.z;
    });
}

//细节提示
function showDetails(firstPosition, secondPosition, name, content, scale) {
    add3DLabel(name, content, secondPosition, scale);

    //线
    var material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        firstPosition,
        secondPosition
    );

    var line = new THREE.Line(geometry, material);
    line.name = "提示线";
    scene.add(line);
}



function add3DTips14(ID, position, scaleIndex, url) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPage(8)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='nextPage(-7)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:200px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = url;
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 100%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT1(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(1)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(1)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt1.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT2(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(2)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(2)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt2.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT3(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(3)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(3)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt3.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT4(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(4)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(4)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt4.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT5(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(5)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(5)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt5.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT6(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(6)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(6)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt6.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT7(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(7)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(7)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt7.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT8(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(8)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(8)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt8.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT9(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(9)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(9)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt9.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT10(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(10)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(10)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt10.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT11(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(11)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(11)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt11.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT12(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='animatePlay(1)' style='position:absolute;left:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>播放动画</div>" +
        "<div onclick='animatePlay(0)' style='position:absolute;left:65px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>暂停动画</div>" +
        "<div onclick='nextPagePPT(12)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(12)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt12.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT13(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='animatePlay(1)' style='position:absolute;left:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>播放动画</div>" +
        "<div onclick='animatePlay(0)' style='position:absolute;left:65px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>暂停动画</div>" +
        "<div onclick='nextPagePPT(13)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(13)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt13.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT14(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='animatePlay(1)' style='position:absolute;left:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>播放动画</div>" +
        "<div onclick='animatePlay(0)' style='position:absolute;left:65px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>暂停动画</div>" +
        "<div onclick='nextPagePPT(14)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(14)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt14.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT15(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='animatePlay(1)' style='position:absolute;left:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>播放动画</div>" +
        "<div onclick='animatePlay(0)' style='position:absolute;left:65px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>暂停动画</div>" +
        "<div onclick='nextPagePPT(15)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(15)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt15.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT16(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='animatePlay(1)' style='position:absolute;left:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>播放动画</div>" +
        "<div onclick='animatePlay(0)' style='position:absolute;left:65px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>暂停动画</div>" +
        "<div onclick='nextPagePPT(16)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(16)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = ' url(../pictures/ppt/ppt16.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT17(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(17)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(17)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = 'url(../pictures/ppt/ppt17.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}

function add3dPPT18(ID, position, scaleIndex) {
    var customDiv = document.createElement('div');
    customDiv.className = 'label';
    customDiv.setAttribute("name", ID);
    customDiv.innerHTML = "<div onclick='nextPagePPT(18)' style='position:absolute;right:5px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>下一页</div>" +
        "<div onclick='previousPagePPT(18)' style='position:absolute;right:45px;bottom:5px;background-color:#00ced12e;border:1px solid gray;border-radius:2px;font-family:宋体;font-size:10px;color:#000'>上一页</div>";
    customDiv.style.marginTop = '-1em';
    customDiv.style.marginTop = '-1em';
    customDiv.style = "height:230px;width:300px; text-align:center;background-color:rgba(0,255,255,0.3); border:solid 2px #0ff;border-radius: 5px 5px 0 0;";
    customDiv.style.background = 'url(../pictures/ppt/ppt18.png)';
    customDiv.style.backgroundRepeat = 'no-repeat';
    customDiv.style.backgroundSize = '100% 90%';
    customDiv.style.color = 'rgb(255,255,0)';
    customDiv.style.fontSize = '15px';
    var customLabel = new THREE.CSS3DObject(customDiv);
    let s = scaleIndex || 0.05;
    customLabel.scale.set(s, s, s);
    customLabel.position.set(position.x, position.y, position.z);
    customLabel.rotation.x -= Math.PI / 3;
    scene2.add(customLabel);
}




function nextPagePPT(number) {
    switch (number) {
        case 1:
            animateCamera(new THREE.Vector3(-1000, 200, 300), new THREE.Vector3(-1000, 20, 0), new THREE.Vector3(-410, 200, 300), new THREE.Vector3(-410, 20, 0));
            break;
        case 2:
            animateCamera(new THREE.Vector3(-410, 200, 300), new THREE.Vector3(-410, 20, 0), new THREE.Vector3(90, 200, 300), new THREE.Vector3(90, 20, 0));
            break;
        case 3:
            animateCamera(new THREE.Vector3(90, 200, 300), new THREE.Vector3(90, 20, 0), new THREE.Vector3(1000, 200, 300), new THREE.Vector3(1000, 20, 0));
            break;
        case 4:
            animateCamera(new THREE.Vector3(500, 200, 300), new THREE.Vector3(500, 20, 0), new THREE.Vector3(1000, 200, 300), new THREE.Vector3(1000, 20, 0));
            break;
        case 5:
            animateCamera(new THREE.Vector3(1000, 200, 300), new THREE.Vector3(1000, 20, 0), new THREE.Vector3(1500, 200, 300), new THREE.Vector3(1500, 20, 0));
            break;
        case 6:
            animateCamera(new THREE.Vector3(1500, 200, 300), new THREE.Vector3(1500, 20, 0), new THREE.Vector3(2000, 200, 300), new THREE.Vector3(2000, 20, 0));
            break;
        case 7:
            animateCamera(new THREE.Vector3(2000, 200, 300), new THREE.Vector3(2000, 20, 0), new THREE.Vector3(2500, 200, 300), new THREE.Vector3(2500, 20, 0));
            break;
        case 8:
            animateCamera(new THREE.Vector3(2500, 200, 300), new THREE.Vector3(2500, 20, 0), new THREE.Vector3(3000, 200, 300), new THREE.Vector3(3000, 20, 0));
            break;
        case 9:
            animateCamera(new THREE.Vector3(3000, 200, 300), new THREE.Vector3(3000, 20, 0), new THREE.Vector3(3500, 200, 300), new THREE.Vector3(3500, 20, 0));
            break;
        case 10:
            animateCamera(new THREE.Vector3(3500, 200, 300), new THREE.Vector3(3500, 20, 0), new THREE.Vector3(4000, 200, 300), new THREE.Vector3(4000, 20, 0));
            break;
        case 11:
            animateCamera(new THREE.Vector3(4000, 200, 300), new THREE.Vector3(4000, 20, 0), new THREE.Vector3(4600, 250, 400), new THREE.Vector3(4600, 20, 0));
            break;
        case 12:
            animateCamera(new THREE.Vector3(4600, 250, 400), new THREE.Vector3(4600, 20, 0), new THREE.Vector3(5400, 250, 400), new THREE.Vector3(5400, 20, 0));
            break;
        case 13:
            animateCamera(new THREE.Vector3(5400, 250, 400), new THREE.Vector3(5400, 20, 0), new THREE.Vector3(6200, 250, 400), new THREE.Vector3(6200, 20, 0));
            break;
        case 14:
            animateCamera(new THREE.Vector3(6200, 250, 400), new THREE.Vector3(6200, 20, 0), new THREE.Vector3(7000, 250, 400), new THREE.Vector3(7000, 20, 0));
            break;
        case 15:
            animateCamera(new THREE.Vector3(7000, 250, 400), new THREE.Vector3(7000, 20, 0), new THREE.Vector3(7800, 250, 400), new THREE.Vector3(7800, 20, 0));
            break;
        case 16:
            animateCamera(new THREE.Vector3(7800, 250, 400), new THREE.Vector3(7800, 20, 0), new THREE.Vector3(8500, 200, 300), new THREE.Vector3(8500, 20, 0));
            break;
        case 17:
            animateCamera(new THREE.Vector3(8500, 200, 300), new THREE.Vector3(8500, 20, 0), new THREE.Vector3(9300, 200, 300), new THREE.Vector3(9300, 20, 0));
            break;
        default:
            alert("结束了");
    }
    // animateCamera(new THREE.Vector3(-700, 120, 320), new THREE.Vector3(-700, 120, 0), new THREE.Vector3(-300, 120, 320), new THREE.Vector3(-300, 120, 0));
}

function previousPagePPT(number) {
    switch (number) {
        case 1:
            animateCamera(new THREE.Vector3(-1000, 200, 300), new THREE.Vector3(-1000, 20, 0), new THREE.Vector3(-1500, 200, 300), new THREE.Vector3(-1500, 20, 0));
            break;
        case 2:
            animateCamera(new THREE.Vector3(-410, 200, 300), new THREE.Vector3(-410, 20, 0), new THREE.Vector3(-1000, 200, 300), new THREE.Vector3(-1000, 20, 0));
            break;
        case 3:
            animateCamera(new THREE.Vector3(90, 200, 300), new THREE.Vector3(90, 20, 0), new THREE.Vector3(-410, 200, 300), new THREE.Vector3(-410, 20, 0));
            break;
        case 4:
            animateCamera(new THREE.Vector3(500, 200, 300), new THREE.Vector3(500, 20, 0), new THREE.Vector3(90, 200, 300), new THREE.Vector3(90, 20, 0));
            break;
        case 5:
            animateCamera(new THREE.Vector3(1000, 200, 300), new THREE.Vector3(1000, 20, 0), new THREE.Vector3(90, 200, 300), new THREE.Vector3(90, 20, 0));
            break;
        case 6:
            animateCamera(new THREE.Vector3(1500, 200, 300), new THREE.Vector3(1500, 20, 0), new THREE.Vector3(1000, 200, 300), new THREE.Vector3(1000, 20, 0));
            break;
        case 7:
            animateCamera(new THREE.Vector3(2000, 200, 300), new THREE.Vector3(2000, 20, 0), new THREE.Vector3(1500, 200, 300), new THREE.Vector3(1500, 20, 0));
            break;
        case 8:
            animateCamera(new THREE.Vector3(2500, 200, 300), new THREE.Vector3(2500, 20, 0), new THREE.Vector3(2000, 200, 300), new THREE.Vector3(2000, 20, 0));
            break;
        case 9:
            animateCamera(new THREE.Vector3(3000, 200, 300), new THREE.Vector3(3000, 20, 0), new THREE.Vector3(2500, 200, 300), new THREE.Vector3(2500, 20, 0));
            break;
        case 10:
            animateCamera(new THREE.Vector3(3500, 200, 300), new THREE.Vector3(3500, 20, 0), new THREE.Vector3(3000, 200, 300), new THREE.Vector3(3000, 20, 0));
            break;
        case 11:
            animateCamera(new THREE.Vector3(4000, 200, 300), new THREE.Vector3(4000, 20, 0), new THREE.Vector3(3500, 200, 300), new THREE.Vector3(3500, 20, 0));
            break;
        case 12:
            animateCamera(new THREE.Vector3(4600, 250, 400), new THREE.Vector3(4600, 20, 0), new THREE.Vector3(4000, 200, 300), new THREE.Vector3(4000, 20, 0));
            break;
        case 13:
            animateCamera(new THREE.Vector3(5400, 250, 400), new THREE.Vector3(5400, 20, 0), new THREE.Vector3(4600, 250, 400), new THREE.Vector3(4600, 20, 0));
            break;
        case 14:
            animateCamera(new THREE.Vector3(6200, 250, 400), new THREE.Vector3(6200, 20, 0), new THREE.Vector3(5400, 250, 400), new THREE.Vector3(5400, 20, 0));
            break;
        case 15:
            animateCamera(new THREE.Vector3(7000, 250, 400), new THREE.Vector3(7000, 20, 0), new THREE.Vector3(6200, 250, 400), new THREE.Vector3(6200, 20, 0));
            break;
        case 16:
            animateCamera(new THREE.Vector3(7800, 250, 400), new THREE.Vector3(7800, 20, 0), new THREE.Vector3(7000, 250, 400), new THREE.Vector3(7000, 20, 0));
            break;
        case 17:
            animateCamera(new THREE.Vector3(8500, 200, 300), new THREE.Vector3(8500, 20, 0), new THREE.Vector3(7800, 250, 400), new THREE.Vector3(7800, 20, 0));
            break;
        case 18:
            animateCamera(new THREE.Vector3(9300, 200, 300), new THREE.Vector3(9300, 20, 0), new THREE.Vector3(8500, 200, 300), new THREE.Vector3(8500, 20, 0));
            break;
        default:
            alert("结束了");
    }
}


function animatePlay(index) {
    switch (index) {
        case 1:
            action.play();
            for (let i = 0; i < actions.length; i++) {
                actions[i].play();
            }
            break;
        case 0:
            action.stop();
            for (let i = 0; i < actions.length; i++) {
                actions[i].stop();
            }
            break;
        default:
            alert("不存在");
    }
}


function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects) {
        console.log(intersects[0].object.name);
        console.log(intersects[0].point);
        console.log(camera.position);
        console.log(controls.target);
    }

    renderer.render(scene, camera);

}


function animateCamera(oldPosition, oldTarget, newPosition, newTarget) {
    camera.position.set(oldPosition.x, oldPosition.y, oldPosition.z);
    controls.target.set(oldTarget.x, oldTarget.y, oldTarget.z);
    controls.update();
    var tween = new TWEEN.Tween({
        x1: oldPosition.x, // 相机x
        y1: oldPosition.y,
        z1: oldPosition.z,
    });
    tween.to({
        x1: newPosition.x,
        y1: newPosition.y,
        z1: newPosition.z,
    }, 500);
    tween.onUpdate(function(object) {
        camera.position.x = object.x1;
        camera.position.y = object.y1;
        camera.position.z = object.z1;
        controls.enabled = false;
    })
    tween.onComplete(function() {
        controls.target.set(newTarget.x, newTarget.y, newTarget.z);
        controls.update();
        controls.enabled = true;
    })
    tween.start();
    animate();

    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
    }

}