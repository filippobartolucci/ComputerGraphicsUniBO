// WebGL App

// Creating a new scene from a file
let scene = new Scene("canvas", "./scene/scene1.json");

// Adding event listener for keyboard
window.addEventListener('keydown', (e) => {scene.keys[e.key] = true;});
window.addEventListener('keyup', (e) => {scene.keys[e.key] = false;});









draw(scene);








// gui.add(obj, 'height').step(5); // Increment amount
//
// // Choose from accepted values
// gui.add(obj, 'type', [ 'one', 'two', 'three' ] );
//
// // Choose from named values
// gui.add(obj, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 } );
//
// var f1 = gui.addFolder('Colors');
// f1.addColor(obj, 'color0');
// f1.addColor(obj, 'color1');
// f1.addColor(obj, 'color2');
// f1.addColor(obj, 'color3');
//
// var f2 = gui.addFolder('Another Folder');
// f2.add(obj, 'noiseStrength');
//
// var f3 = f2.addFolder('Nested Folder');
// f3.add(obj, 'growthSpeed');
//
// obj['Button with a long description'] = function () {
//     console.log('Button with a long description pressed');
// };
// gui.add(obj, 'Button with a long description');