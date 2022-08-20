class Scene {
    // Scene constructor
    constructor(canvas_id, json_path){
        // Getting WebGL context from canvas
        this.canvas = document.getElementById(canvas_id);
        this.gl = this.canvas.getContext("webgl");
        this.gl.getExtension("OES_standard_derivatives");

        if (!this.gl) { // Check if WebGL is supported
            alert("WebGL not supported!");
            throw new Error("WebGL not supported!");
        }

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.enable(this.gl.DEPTH_TEST);

        let base = webglUtils.createProgramInfo(this.gl, ["base-vertex-shader", "base-fragment-shader"])
        let bump = webglUtils.createProgramInfo(this.gl, ["bump-vertex-shader", "bump-fragment-shader"])

        this.program = base;

        this.mesh_list = []; // Array used to store all the mesh used in the scene
        this.load_mesh_json(json_path).then(() => {});

        this.fov = 60;
        // Creating a camera for this scene
        const position = [10,2,10], target = [0, 2, 0], up = [0, 1, 0];
        this.camera = new Camera(position, target, up);
        this.keys = {};

        // Light used in the scene
        this.light = {ambient: [0.1,0.1,0.1], color : [1.0, 1.0, 1.0], direction : [4,2,-2], position: [4,2,-2]};
        this.prepareSkybox();

    }

    // Function that loads a list of meshes from a json file
    // and then creates all the  mesh objects that will be used.
    async load_mesh_json(json_path){
        const response = await fetch(json_path);
        const json = await response.json();
        json.meshes.forEach(obj => {
            if(obj.mirror){
                this.mesh_list.push(new Mirror(obj, this.gl));
            }else{
                this.mesh_list.push(new MeshObj(obj, this.gl));
            }
        });
    }

    // Compute the projection matrix
    projectionMatrix(){
        let fieldOfViewRadians = degToRad(this.fov);
        let aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        let zmin=0.1;
        return m4.perspective(fieldOfViewRadians, aspect, zmin, 200);
    }

    // Move the camera using keyboard
    key_controller(){
        let step = 0.05;

        if (this.keys["w"]){
            this.camera.dolly(step)
        }
        if (this.keys["s"]){
            this.camera.dolly(-step)
        }
        if (this.keys["a"]){
            this.camera.truck(-step)
        }
        if (this.keys["d"]){
            this.camera.truck(step)
        }
        if (this.keys["q"]){
            this.camera.pedestal(step)
        }
        if (this.keys["e"]){
            this.camera.pedestal(-step)
        }
        if (this.keys["h"]){
            this.camera.cant(-step)
        }
        if (this.keys["k"]){
            this.camera.cant(step)
        }
        if (this.keys["u"]){
            this.camera.pedestal(step)
        }
        if (this.keys["j"]){
            this.camera.pedestal(-step)
        }
        if (this.keys["ArrowUp"]){
            this.camera.tilt(step)
        }
        if (this.keys["ArrowDown"]){
            this.camera.tilt(-step)
        }
        if (this.keys["ArrowLeft"]){
            this.camera.pan(step)
        }
        if (this.keys["ArrowRight"]){
            this.camera.pan(-step)
        }
        if (this.keys["r"]){
            this.camera.align()
        }
    }

    // Change the type of camera, AnimatedCamera or Camera
    switch_camera(){
        if (this.camera instanceof AnimatedCamera){
            const position = [10,2,10], target = [0, 2, 0], up = [0, 1, 0];
            this.camera = new Camera(position, target, up);
        }else{
            this.camera = new AnimatedCamera();
        }
    }

    prepareSkybox(){
        this.skybox = [];
        this.skybox.programInfo = webglUtils.createProgramInfo( this.gl, ["skybox-vertex-shader", "skybox-fragment-shader"]);
        const arrays2 = createXYQuadVertices.apply(null,  Array.prototype.slice.call(arguments, 1));
        this.skybox.quadBufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, arrays2);
        this.skybox.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.skybox.texture);

        const faceInfos = [
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: './data/skybox/pos-x.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: './data/skybox/neg-x.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: './data/skybox/pos-y.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url: './data/skybox/neg-y.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: './data/skybox/pos-z.jpg',
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: './data/skybox/neg-z.jpg',
            },

        ];

        faceInfos.forEach((faceInfo) => {
            const {target, url} = faceInfo;

            const level = 0;
            const internalFormat = this.gl.RGBA;
            const width = 512;
            const height = 512;
            const format = this.gl.RGBA;
            const type = this.gl.UNSIGNED_BYTE;
            this.gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            const image = new Image();
            image.src = url;

            let gl = this.gl;
            let scene = this;

            image.addEventListener('load', function() {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, scene.skybox.texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
        this.skybox.enable = true;
    }

    // Enable/Disable skybox drawing
    toggle_skybox(){
        this.skybox.enable = !this.skybox.enable;
    }

    toggle_program(){
        this.selected_program = this.selected_program+1 % 2

        switch (this.selected_program){

        }
    }


}

// Draw everything in the scene on the canvas.
function draw() {
    // Resizing the canvas to the window size
    resizeCanvasToDisplaySize(scene.gl.canvas);
    scene.gl.viewport(0, 0, scene.gl.canvas.width, scene.gl.canvas.height);

    // Updating the camera position
    scene.key_controller();

    // Getting the projection matrix from the scene,
    // calculated only once
    let proj = scene.projectionMatrix()
    let view = scene.camera.getViewMatrix()

    scene.gl.depthFunc(scene.gl.LESS);

    scene.mesh_list.forEach(m => {
        m.render(scene.gl, scene.program, proj, view, scene.camera, scene.light);
    });

    if (scene.skybox.enable){
        // Removing translation from view matrix
        view[12] = 0;
        view[13] = 0;
        view[14] = 0;
        scene.gl.depthFunc(scene.gl.LEQUAL);
        scene.gl.useProgram(scene.skybox.programInfo.program);

        webglUtils.setBuffersAndAttributes(scene.gl, scene.skybox.programInfo, scene.skybox.quadBufferInfo);
        webglUtils.setUniforms(scene.skybox.programInfo, {
            u_viewDirectionProjectionInverse: m4.inverse(m4.multiply(proj, view)),
            u_skybox: scene.skybox.texture,
            u_lightColor: scene.light.color,
        });
        webglUtils.drawBufferInfo(scene.gl, scene.skybox.quadBufferInfo);
    }

    requestAnimationFrame(draw)
}