// WebGL App
let scene = new Scene("canvas", "./scene/obj_list.json");
draw(scene)

window.addEventListener('keydown', (e) => {scene.keys[e.key] = true;});
window.addEventListener('keyup', (e) => {scene.keys[e.key] = false;});

