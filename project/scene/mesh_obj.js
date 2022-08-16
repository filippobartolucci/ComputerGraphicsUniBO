class MeshObj {
    constructor(obj,gl) {
        this.name = obj.name;
        this.obj_source = obj.obj_source;
        this.mtl_source = obj.mtl_source;
        this.position = obj.position;

        this.mesh = []; // This object stores all the mesh information
        this.mesh.sourceMesh = this.obj_source; // .sourceMesh is used in load_mesh.js
        this.mesh.fileMTL = this.mtl_source;

        if (obj.rotate){ // Used for world matrix transform
            this.rotate = obj.rotate;
            this.angle = 0;
        }

        this.ready = false;

        LoadMesh(gl, this.mesh).then(() => {
            this.prepare_mesh(gl)

            this.ready = true;
        });
    }

    prepare_mesh(gl){

        // Moving to the initial position
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

        // Generic material
        const defaultMaterial = {
            diffuse: [1, 1, 1],
            diffuseMap: this.mesh.textures.defaultWhite,
            ambient: [0, 0, 0],
            specular: [1, 1, 1],
            shininess: 400,
            opacity: 1,
        };

        this.mesh.parts = this.mesh.data.geometries.map(({material, data}) => {
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

    }

    render(gl, programInfo, projectionMatrix, camera, light){
        if (!this.ready) return;

        const sharedUniforms = {
            u_lightWorldPosition: light.position,
            u_lightDirection: light.direction,
            u_lightColor: light.color,
            u_view: camera.getViewMatrix(),
            u_projection: projectionMatrix,
            u_viewWorldPosition: camera.getPosition()

        };

        gl.useProgram(programInfo.program);
        webglUtils.setUniforms(programInfo, sharedUniforms);     // calls gl.uniform

        // compute the world matrix
        let u_world = m4.identity()

        if (this.rotate === true){
            u_world = m4.yRotate(u_world, degToRad(this.angle));
            this.angle = this.angle === 360? 0 : this.angle+3;
        }

        for (const {bufferInfo, material} of this.mesh.parts) {
            // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
            webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            // calls gl.uniform
            webglUtils.setUniforms(programInfo, {
                u_world,
            }, material);
            // calls gl.drawArrays or gl.drawElements
            webglUtils.drawBufferInfo(gl, bufferInfo);
        }

    }

}
