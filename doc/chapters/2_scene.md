# scene.js
Rappresenta la classe principale che si occupa di tutte le operazioni, dalla inizializzazione del canvas e delle mesh al rendering.

Quando viene creato un nuovo oggetto scena vengono eseguite le seguenti operazioni:
* viene preso il WebGL rendering context dal canvas 
* impostazione delle dimensioni della viewport
* compilazione di vertex e fragment shader
* lettura di un **file json** per ottenere la lista delle mesh da mostrare
* per ogni elemento mesh nel file json viene creato un nuovo **mesh_obj** e salvato in una lista
* inizializzazione di **camera**, **keys** (struttura per la gestione dei tasti della tastiera) e **light** (oggetto luce di scena)

L'utilizzo di una classe che contiene tutte le principali variabili da utilizzare
mi ha permesso di ridurre e semplificare il codice da scrivere e poter usare le
stesse variabili da passare alle mesh, senza dover ricalcolare le stesse cose più volte.

Le mesh da visualizzare sono salvate in file json caricati al momento. 
Questo mi ha permesso di creare un sistema più versatile, in quanto posso creare
scene diverse semplicemente creando più file json.

Di seguito viene riportato un esempio di una scena con una mesh:
```json
  "meshes":[
    {
      "name":"mesh_1",
      "obj_source":"./path/mesh.obj",
      "mtl_source":"./path/mesh",
      "position": [0, 0, 0]
    }
  ]
```

Per ogni mesh nella lista vengono scritte le seguenti proprietà:
* **name:** nome della mesh
* **obj_source:** path al file .obj
* **mtl_source:** path al file .mtl
* **position:** posizione della mesh 

## Metodi
### async load_mesh_json(json_path)
Si occupa di leggere, in modo asincrono, un file json contente gli oggetti di scena; per ciascuno oggetto viene poi passato 
a un costruttore di mesh_obj e salvato poi in ```scene.mesh_list ```

### getProjectionMatrix()
Calcola la matrice di proiezione passando utilizzando la funzione perspective della libreria m4.js

### key_controller(){
Funzione che legge gli input da tastiera e chiama le funzioni di movimento della camera a ogni tasto. La funzione
è stata realizzata in modo tale da permettere di fare più movimenti in contemporanea. Viene richiamata ogni volta che 
deve venire disegnato un frame.
   
### switch_camera(){
Passa dalla camera libera a quella animata e viceversa.

### draw()
Funzione separata dalla classe Scene per questioni di scope. Esegue le seguenti operazioni:
* ridimensiona canvas e viewport in base alla grandezza della finestra.
* chiama scene.key_controller()
* calcola la matrice di proiezione e vista.
* per ogni mesh in scene chiama la sua funzione di render passando (scene.gl, scene.program, proj, view, scene.camera, scene.light)
        