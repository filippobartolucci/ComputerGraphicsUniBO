class MeshObj {
    constructor(obj,gl) {
        this.name = obj.name;
        this.obj_source = obj.obj_source;
        this.mtl_source = obj.mtl_source;
        this.position = obj.position;

        this.mesh = []; // This object stores all the mesh information
        this.mesh.sourceMesh = this.obj_source; // .sourceMesh is used in load_mesh.js
        this.mesh.fileMTL = this.mtl_source
        this.ready = false;

        LoadMesh(gl, this.mesh).then(() => {
            // Moving the mesh to the initial position.
            for (let i = 0; i < this.mesh.positions.length; i = i+3) {
                this.mesh.positions[i] += parseFloat(this.position.x);
                this.mesh.positions[i + 1] += parseFloat(this.position.y);
                this.mesh.positions[i + 2] += parseFloat(this.position.z);
            }


            this.textures = []

            this.mesh.materials.forEach(material => {
                material.parameter.forEach((value,key) =>{
                    if (key.startsWith("map")){
                        let texture = this.textures[value]

                    }
                })

            });

            this.ready = true;
        });
    }
    


    // Function called to draw the mesh on the gl canvas
    render(gl, light, program, camera){
        if (!this.ready) return;

        gl.useProgram(program);

        let positionLocation = gl.getAttribLocation(program, "a_position");
        let normalLocation = gl.getAttribLocation(program, "a_normal");
        let texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
        this.positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.positions), gl.STATIC_DRAW);

        this.normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.normals), gl.STATIC_DRAW);

        this.texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.texcoords), gl.STATIC_DRAW);

        gl.uniform3fv(gl.getUniformLocation(program, "diffuse" ), this.mesh.diffuse );
        gl.uniform3fv(gl.getUniformLocation(program, "ambient" ), this.mesh.ambient);
        gl.uniform3fv(gl.getUniformLocation(program, "specular"), this.mesh.specular );
        gl.uniform3fv(gl.getUniformLocation(program, "emissive"), this.mesh.emissive );
        gl.uniform3fv(gl.getUniformLocation(program, "u_ambientLight" ), light.ambientLight );
        gl.uniform3fv(gl.getUniformLocation(program, "u_colorLight" ), light.colorLight );
        gl.uniform1f(gl.getUniformLocation(program, "shininess"), this.mesh.shininess);
        gl.uniform1f(gl.getUniformLocation(program, "opacity"), this.mesh.opacity);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        const size = 3;          // 3 components per iteration
        const type = gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer

        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(texcoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.vertexAttribPointer(texcoordLocation, size-1, type, normalize, stride, offset);

        let fieldOfViewRadians = degToRad(45);
        let modelXRotationRadians = degToRad(0);
        let modelYRotationRadians = degToRad(0);

        // Compute the projection matrix
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        //  zmin=0.125;
        let zmin=0.1;
        let projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zmin, 200);

        // Make a view matrix from the camera matrix.
        //let viewMatrix = m4.inverse(cameraMatrix);
        let viewMatrix = camera.getViewMatrix();

        let matrixLocation = gl.getUniformLocation(program, "u_world");
        let textureLocation = gl.getUniformLocation(program, "diffuseMap");
        let viewMatrixLocation = gl.getUniformLocation(program, "u_view");
        let projectionMatrixLocation = gl.getUniformLocation(program, "u_projection");
        let lightWorldDirectionLocation = gl.getUniformLocation(program, "u_lightDirection");
        let viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");

        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

        // set the light position
        gl.uniform3fv(lightWorldDirectionLocation, m4.normalize([-1, 3, 5]));

        // set the camera/view position
        gl.uniform3fv(viewWorldPositionLocation, camera.position);

        // Tell the shader to use texture unit 0 for diffuseMap
        gl.uniform1i(textureLocation, 0);

        let then = 0;
        let vertNumber = this.mesh.numVertices;

        drawScene(0);

        // Draw the scene.
        function drawScene(time) {
            // convert to seconds
            time *= 0.001;
            // Subtract the previous time from the current time
            var deltaTime = time - then;
            // Remember the current time for the next frame.
            then = time;

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            //gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            // Animate the rotation
            modelYRotationRadians += -0.5 * deltaTime;
            modelXRotationRadians += -0.5 * deltaTime;


            let matrix = m4.identity();
            matrix = m4.xRotate(matrix, modelXRotationRadians);
            matrix = m4.yRotate(matrix, modelYRotationRadians);

            // Set the matrix.
            gl.uniformMatrix4fv(matrixLocation, false, matrix);

            // Draw the geometry.
            gl.drawArrays(gl.TRIANGLES, 0, vertNumber);

        }


    }
}