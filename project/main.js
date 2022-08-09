// WebGL App
let main_scene = new Scene("canvas", "./scene/obj_list.json");
draw(main_scene)

window.addEventListener('keydown', function (e) {
    main_scene.move_camera(e.key);
}, false);
