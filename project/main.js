// WebGL App

function main(){
    // Creating a new scene from a file
    window["scene"] = new Scene("canvas", "./scene/scene2.json");


    // Adding event listener for keyboard
    window.addEventListener('keydown', (e) => {scene.keys[e.key] = true;});
    window.addEventListener('keyup', (e) => {scene.keys[e.key] = false;});

    $("scene_selector").change(function (){
        console.log("ciaaa")
    })

    add_dat_gui(scene);
    add_touch_canvas(scene);
    draw(scene);
}

main();