class Scene {
    constructor(canvas_id, program, json_path){
        this.canvas = document.getElementById(canvas_id);
        this.gl = this.canvas.getContext("webgl");
        //gl = this.gl;

        if (!this.gl) {
            alert("WebGL not supported!");
            throw new Error("WebGL not supported!");
        }

        this.gl.viewport(0, 0, $(window).width(), $(window).height());
        this.program = program;
        
        this.mesh_objects = [];
        this.load_mesh_json(json_path).then(r => {console.log(" - mesh object ok")});



        console.log(" - Scene created");
    }

    async load_mesh_json(json_path){
        const response = await fetch(json_path);
        const json = await response.json();
        json.meshes.forEach(obj => {
            this.mesh_objects.push(new MeshObj(obj, this.gl));
        });
    }

    set_program(program){
        this.program = program;

    }

    draw(){
        this.mesh_objects.forEach(m => {
            m.render();
        });
    }
}