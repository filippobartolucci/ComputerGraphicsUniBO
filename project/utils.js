function degToRad(d) {
    return d * Math.PI / 180;
}

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}

function createXYQuadVertices() {
    let xOffset = 0;
    let yOffset = 0;
    let size = 1;
    return {
        position: {
            numComponents: 2,
            data: [
                xOffset + -1 * size, yOffset + -1 * size,
                xOffset +  1 * size, yOffset + -1 * size,
                xOffset + -1 * size, yOffset +  1 * size,
                xOffset +  1 * size, yOffset +  1 * size,
            ],
        },
        normal: [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ],
        texcoord: [
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ],
        indices: [ 0, 1, 2, 2, 1, 3 ],
    };
}

function add_dat_gui(scene){
    let gui = new dat.gui.GUI({autoPlace: false});

    scene['Toggle skybox'] = function () {
        scene.toggle_skybox()
    };
    gui.add(scene, 'Toggle skybox');

    gui.add(scene,"fov").min(30).max(120).step(30)

    scene['Switch camera'] = function () {
        scene.switch_camera()
    };
    gui.add(scene, 'Switch camera');


    let light_folder = gui.addFolder('Light');

    let light_position =  light_folder.addFolder('Direction');
    light_position.add(scene.light.direction, 0).min(-10).max(10).step(0.25);
    light_position.add(scene.light.direction, 1).min(-10).max(10).step(0.25);
    light_position.add(scene.light.direction, 2).min(-10).max(10).step(0.25);

    let light_color =  light_folder.addFolder('Color');
    light_color.add(scene.light.color, 0).min(0).max(1).step(0.05);
    light_color.add(scene.light.color, 1).min(0).max(1).step(0.05);
    light_color.add(scene.light.color, 2).min(0).max(1).step(0.05);

    document.getElementById("gui").append(gui.domElement)

}

function add_touch_canvas(scene){
    scene.mouse = [];

    function mouseDown(e) {
        scene.mouse.drag = true;
        scene.mouse.old_x = e.pageX;
        scene.mouse.old_y = e.pageY;
        e.preventDefault();
    }
    function mouseUp(s){
        scene.mouse.drag=false;
    }
    function mouseMove(e) {
        if (!scene.mouse.drag){
            return false;
        }
        let dX=-(e.pageX-scene.mouse.old_x)*2*Math.PI/scene.canvas.width;
        scene.camera.pan(-dX * 0.1);
        let dY=-(e.pageY-scene.mouse.old_y)*2*Math.PI/scene.canvas.height;
        scene.camera.tilt(-dY * 0.1);

        scene.mouse.old_x=e.pageX;
        scene.mouse.old_y=e.pageY;
        e.preventDefault();
    }

    scene.canvas.addEventListener('touchstart',mouseDown,false);
    scene.canvas.addEventListener('touchmove',mouseMove,false);
    scene.canvas.addEventListener('touchend',mouseUp,false);
    scene.canvas.addEventListener('touchend',mouseUp,false);
    scene.canvas.addEventListener('mouseout',mouseUp,false);
    scene.canvas.onmousedown=mouseDown;
    scene.canvas.onmouseup=mouseUp;
    scene.canvas.mouseout=mouseUp;
    scene.canvas.onmousemove=mouseMove;
}