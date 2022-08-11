class MeshObj {
    constructor(obj,gl) {
        this.name = obj.name;
        this.obj_source = obj.obj_source;
        this.mtl_source = obj.mtl_source;
        this.position = obj.position;

        this.mesh = []; // This object stores all the mesh information
        this.mesh.sourceMesh = this.obj_source; // .sourceMesh is used in load_mesh.js
        this.mesh.fileMTL = this.mtl_source;
        this.ready = false;

        LoadMesh(gl, this.mesh).then(() => {

            let x = this.position[0]
            let y = this.position[1]
            let z = this.position[2]

            this.mesh.data.geometries.forEach(geom => {
                // Moving the mesh to the initial position.
                for (let i = 0; i < geom.data.position.length; i = i+3) {
                    geom.data.position[i] += (y);
                    geom.data.position[i+1] += (z);
                    geom.data.position[i+2] += (x);
                }
            })

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

    render2(gl, programInfo, projectionMatrix, camera, light){
        if (!this.ready) return;

        const defaultMaterial = {
            diffuse: [1, 1, 1],
            diffuseMap: this.mesh.textures.defaultWhite,
            ambient: [0, 0, 0],
            specular: [1, 1, 1],
            shininess: 400,
            opacity: 1,
        };

        const parts = this.mesh.data.geometries.map(({material, data}) => {
            // Because data is just named arrays like this
            //
            // {
            //   position: [...],
            //   texcoord: [...],
            //   normal: [...],
            // }
            //
            // and because those names match the attributes in our vertex
            // shader we can pass it directly into `createBufferInfoFromArrays`
            // from the article "less code more fun".

            if (data.color) {
                if (data.position.length === data.color.length) {
                    data.color = { numComponents: 3, data: data.color };
                }
            } else {
                // there are no vertex colors so just use constant white
                data.color = { value: [1, 1, 1, 1] };
            }

            // create a buffer for each array by calling
            // gl.createBuffer, gl.bindBuffer, gl.bufferData
            const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
            return {
                material: {
                    ...defaultMaterial,
                    ...this.mesh.materials[material],
                },
                bufferInfo,
            };
        });



        function render(time) {
            time *= 0.001;  // convert to seconds



            const projection = projectionMatrix

            const view = camera.getViewMatrix();

            const sharedUniforms = {
                u_lightDirection: m4.normalize([-1, 3, 5]),
                u_view: view,
                u_projection: projection,
                u_viewWorldPosition: camera.getPosition()
            };


            gl.useProgram(programInfo.program);
            webglUtils.setUniforms(programInfo, sharedUniforms);     // calls gl.uniform

            // compute the world matrix once since all parts
            // are at the same space.
            let u_world = m4.yRotation(time);


            for (const {bufferInfo, material} of parts) {
                // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
                webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                // calls gl.uniform
                webglUtils.setUniforms(programInfo, {
                    u_world,
                }, material);
                // calls gl.drawArrays or gl.drawElements
                webglUtils.drawBufferInfo(gl, bufferInfo);
            }

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

    }

}
