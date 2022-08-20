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

    scene['Switch camera'] = function () {
        scene.switch_camera()
    };
    gui.add(scene, 'Switch camera');


    let light_folder = gui.addFolder('Light');

    let light_position =  light_folder.addFolder('Position');
    light_position.add(scene.light.position, 0).min(-10).max(10).step(0.25);
    light_position.add(scene.light.position, 1).min(-10).max(10).step(0.25);
    light_position.add(scene.light.position, 2).min(-10).max(10).step(0.25);

    let light_direction =  light_folder.addFolder('Direction');
    light_direction.add(scene.light.direction, 0).min(-10).max(10).step(0.25);
    light_direction.add(scene.light.direction, 1).min(-10).max(10).step(0.25);
    light_direction.add(scene.light.direction, 2).min(-10).max(10).step(0.25);

    let light_color =  light_folder.addFolder('Color');
    light_color.add(scene.light.color, 0).min(0.1).max(1).step(0.05);
    light_color.add(scene.light.color, 1).min(0.1).max(1).step(0.05);
    light_color.add(scene.light.color, 2).min(0.1).max(1).step(0.05);

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
    function mouseUp(){
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

function canvas2DController(){
    let canvas = document.getElementById("canvas2d");
    let context = canvas.getContext("2d");

    const forward = new Path2D()
    forward.rect(25,0,39,39)
    forward.closePath()

    const backward = new Path2D()
    backward.rect(25,60,39,39)
    backward.closePath()

    const left = new Path2D()
    left.rect(0,30,39,39)
    left.closePath()

    const right = new Path2D()
    right.rect(64,30,39,39)
    right.closePath()

    const image = new Image(150, 150);
    image.onload=function (){
        context.drawImage(this,  0, 0, image.width, image.height);
    }
    image.src = './data/controllerImg.jpg';

    function getXY(canvas, event){ //adjust mouse click to canvas coordinates
        const rect = canvas.getBoundingClientRect()
        const y = event.pageY - rect.top
        const x = event.pageX - rect.left

        return {x:x, y:y}
    }

    function touchDown(e){
        const XY = getXY(canvas, e)
        //use the shape data to determine if there is a collision
        if(context.isPointInPath(forward, XY.x, XY.y)) {
            scene.keys["w"]=true;
        }
        if(context.isPointInPath(backward, XY.x, XY.y)) {
            scene.keys["s"]=true;
        }
        if(context.isPointInPath(left, XY.x, XY.y)) {
            scene.keys["a"]=true;
        }
        if(context.isPointInPath(right, XY.x, XY.y)) {
            scene.keys["d"]=true;
        }
    }

    function touchUp(){
        scene.keys["w"]=false;
        scene.keys["a"]=false;
        scene.keys["s"]=false;
        scene.keys["d"]=false;
    }

    canvas.addEventListener('touchstart',touchDown,false);
    canvas.addEventListener('touchend',touchUp,false);
    canvas.onmousedown=touchDown;
    canvas.onmouseup=touchUp;

}