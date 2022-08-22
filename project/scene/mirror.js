class Mirror{
    constructor(obj, gl) {
        this.programInfo = webglUtils.createProgramInfo(gl, ["envmap-vertex-shader", "envmap-fragment-shader"])
        this.name = obj.name;
        this.obj_source = obj.obj_source;
        this.position = obj.position;
        this.env_path = obj.env_path;

        this.mesh = [];
        this.mesh.sourceMesh = this.obj_source;

        loadMeshFromOBJ(this.mesh).then(async r => {
            this.prepareEnvMap(gl);
        })
    }

    prepareEnvMap(gl){
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        const faceInfos = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: this.env_path+'pos-x.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: this.env_path+'neg-x.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: this.env_path+'pos-y.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url: this.env_path+'neg-y.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: this.env_path+'pos-z.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: this.env_path+'neg-z.jpg',
            },

        ];

        faceInfos.forEach((faceInfo) => {
            const {target, url} = faceInfo;
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
            const image = new Image();
            image.src = url;

            let texture = this.texture;

            image.addEventListener('load', function() {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

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

        const defaultMaterial = {
            // Setting default material properties
            diffuse: [1, 1, 1],
            diffuseMap: create1PixelTexture(gl, [255, 255, 255, 255]),
            ambient: [0, 0, 0],
            specular: [1, 1, 1],
            shininess: 400,
            opacity: 1,
        };

        this.mesh.parts = this.mesh.data.geometries.map(({material, data}) => {
            data.color = { value: [.0, 1, 1, 1] };

            const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
            return {
                material: {
                    defaultMaterial
                },
                bufferInfo,
            };
        });

        this.ready = true;
    }

    render(gl, programInfo, uniforms){
        if (!this.ready) return;    // waiting for async functions to complete


        gl.useProgram(this.programInfo.program);
        webglUtils.setUniforms(this.programInfo, uniforms);     // calls gl.uniform

        let u_world = m4.identity();
        let u_texture = this.texture;

        for (const {bufferInfo, material} of this.mesh.parts) {
            // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
            webglUtils.setBuffersAndAttributes(gl, this.programInfo, bufferInfo);
            // calls gl.uniform
            webglUtils.setUniforms(this.programInfo, {
                u_world,
                u_texture,
                u_lightColor: [1,1,1],
            }, material);
            // calls gl.drawArrays or gl.drawElements
            webglUtils.drawBufferInfo(gl, bufferInfo);
        }
    }


}